import { ChatModelAdapter } from "@assistant-ui/react";
import { ToolCall } from "@/types/BITypes";

export function createModelAdapter(
  url: string,
  token: string,
  organizationId: string,
  hotelIdsToSend: number[]
) {
  const ModelAdapter: ChatModelAdapter = {
    async *run({ messages, abortSignal }) {
      const threadId = "123";
      const response = await fetch(`${url}/chat/stream`, {
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";
      let toolCalls = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder
          .decode(value, { stream: true })
          .replace(/\r\n/g, "\n");

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          if (!event.trim()) continue;

          const lines = event.split("\n");
          let eventType = "";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7);
            } else if (line.startsWith("data: ")) {
              if (data) data += "\n";
              data += line.slice(6);
            }
          }

          if (eventType && data) {
            if (eventType === "message") {
              const unescapedData = data.replace(/\\n/g, "\n");
              text += unescapedData;
              console.log("Accumulated text:", JSON.stringify(text));
            } else if (eventType === "tool_calls") {
              try {
                toolCalls = JSON.parse(data);
                console.log("Tool calls:", toolCalls);
              } catch (e) {
                console.error("Error parsing tool_calls data:", e);
              }
            } else if (eventType === "done") {
              console.log("Stream done");
            } else if (eventType === "error") {
              console.error("Stream error:", data);
            }
          }

          yield {
            content: [
              ...(text ? [{ type: "text" as const, text: text }] : []),
              ...toolCalls.map((tc: ToolCall) => ({
                type: "tool-call",
                toolCallId: tc.id,
                toolName: tc.name,
                args: tc.args,
                argsText: JSON.stringify(tc.args),
              })),
            ],
          };
        }
      }
    },
  };
  return ModelAdapter;
}

// export function createModelAdapter(
//   url: string,
//   token: string,
//   organizationId: string,
//   hotelIdsToSend: number[]
// ) {
//   const ModelAdapter: ChatModelAdapter = {
//     async *run({ messages, abortSignal }) {
//       const threadId = "123";

//       const response = await fetch(`${url}/chat/stream`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           message: messages[messages.length - 1],
//           organizationId,
//           hotels: hotelIdsToSend,
//           threadId,
//         }),
//         signal: abortSignal,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       if (!response.body) {
//         throw new Error("No body!");
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let buffer = "";
//       let text = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         buffer += decoder
//           .decode(value, { stream: true })
//           .replace(/\r\n/g, "\n");

//         const events = buffer.split("\n\n");
//         buffer = events.pop() || "";

//         for (const event of events) {
//           if (!event.trim()) continue;

//           console.log("Complete SSE event:", JSON.stringify(event));

//           const lines = event.split("\n");
//           let eventType = "";
//           let data = "";

//           for (const line of lines) {
//             if (line.startsWith("event: ")) {
//               eventType = line.slice(7);
//             } else if (line.startsWith("data: ")) {
//               if (data) data += "\n";
//               data += line.slice(6);
//             }
//           }
//           console.log(
//             "Parsed eventType:",
//             eventType,
//             "Raw data:",
//             JSON.stringify(data)
//           );

//           if (eventType && data) {
//             if (eventType === "message") {
//               const unescapedData = data.replace(/\\n/g, "\n");
//               text += unescapedData;
//               console.log("Accumulated text:", JSON.stringify(text));
//               yield {
//                 content: [{ type: "text", text }],
//               };
//             } else if (eventType === "tool_calls") {
//               try {
//                 const toolCalls = JSON.parse(data);
//                 console.log("Tool calls:", toolCalls);
//                 yield {
//                   content: [
//                     ...toolCalls.map((tc: ToolCall) => ({
//                       type: "tool-call",
//                       toolCallId: tc.id,
//                       toolName: tc.name,
//                       args: tc.args,
//                       argsText: JSON.stringify(tc.args),
//                     })),
//                   ],
//                 };
//               } catch (e) {
//                 console.error("Error parsing tool_calls data:", e);
//               }
//             } else if (eventType === "done") {
//               console.log("Stream done");
//             } else if (eventType === "error") {
//               console.error("Stream error:", data);
//             }
//           }
//         }
//       }
//     },
//   };
//   return ModelAdapter;
// }
