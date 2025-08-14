import {
  ChatModelAdapter,
  ThreadAssistantMessagePart,
} from "@assistant-ui/react";
import { Hotel, ToolCall } from "@/types/BITypes";
import notification from "../assets/notification.wav";

export function createModelAdapter(
  url: string,
  token: string,
  organizationId: string,
  hotelIdsToSend: Hotel[]
) {
  const ModelAdapter: ChatModelAdapter = {
    async *run({ messages, abortSignal, context }) {
      const threadId = "123";
      const response = await fetch(`${url}/chatbot/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: messages[messages.length - 1],
          organizationId,
          hotels: hotelIdsToSend,
          threadId,
        }),
        signal: abortSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No body!");
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let text = "";
      let toolCalls = [];
      let images: { type: "image"; image: string }[] = [];
      let buffer = "";
      let notified = false;

      const notificationSound = new Audio(notification);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += value.replace(/\r\n/g, "\n");

        let sep;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);

          let eventType = "message";
          const dataLines: string[] = [];

          for (const line of frame.split("\n")) {
            if (line.startsWith("event:"))
              eventType = line.slice("event:".length).trim();
            else if (line.startsWith("data:"))
              dataLines.push(line.slice("data:".length).trimStart());
          }

          const data = dataLines.join("\n");

          let hasNewContent = false;

          if (eventType == "tool-calls") {
            toolCalls = JSON.parse(data);
          } else if (eventType === "message") {
            text += data;
            hasNewContent = !!data;
          } else if (eventType === "images") {
            const newImages: string[] = JSON.parse(data);
            images = newImages.map((img) => ({
              type: "image",
              image: `data:image/png;base64,${img.replace(/\s+/g, "")}`,
            }));
            hasNewContent = images.length > 0;
          } else if (eventType === "error") {
            console.error("Server error:", JSON.parse(data).message);
            throw new Error(JSON.parse(data).message);
          }
          yield {
            content: [
              { type: "text", text: text },
              ...toolCalls.map((tc: ToolCall) => ({
                type: "tool-call",
                toolCallId: tc.id,
                toolName: tc.name,
                args: tc.args,
                argsText: JSON.stringify(tc.args),
              })),
              ...images,
            ],
          };
          if (hasNewContent && !notified) {
            notificationSound.play().catch((error) => {
              console.error("Failed to play notification sound:", error);
            });
            notified = true;
          }
          toolCalls = [];
        }
      }
    },
  };
  return ModelAdapter;
}
