import { ChatMessage } from "../context/ChatContext";
import type { Hotel } from "../context/HotelContext";
import { normalizeError } from "../lib/errors";

function dispatchEvent(
  onEvent: ((eventType: string, data: any) => void) | undefined,
  eventType: string,
  data: any
) {
  if (onEvent) onEvent(eventType, data);
}

export async function stream(
  url: string,
  message: ChatMessage,
  selectedHotels: Hotel[],
  organizationId: number,
  application: {
    name: string;
    description: string;
  },
  threadId: string | undefined,
  jwt: string,
  signal?: AbortSignal,
  onEvent?: (eventType: string, data: any) => void
) {
  const response = await fetch(`${url}/chatbot/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      message,
      selectedHotels,
      organizationId,
      threadId,
      application,
    }),
    signal,
  });

  if (!response.ok) {
    const err = normalizeError(
      { message: "SSE request failed", status: response.status },
      { source: "sse" }
    );
    dispatchEvent(onEvent, "error", err);
    throw err;
  }

  if (!response.body) {
    const err = normalizeError("No response body", { source: "sse" });
    dispatchEvent(onEvent, "error", err);
    throw err;
  }

  dispatchEvent(onEvent, "open", null);

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  let buffer = "";
  let lastEventId: string | undefined;
  let lastActivityTs = Date.now();

  const HEARTBEAT_INTERVAL_MS = 30000;

  const abortHandler = () => {
    dispatchEvent(onEvent, "abort", null);
    try {
      reader.cancel();
    } catch {}
  };

  try {
    if (signal) signal.addEventListener("abort", abortHandler, { once: true });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      lastActivityTs = Date.now();

      buffer += value.replace(/\r\n/g, "\n");

      let sepIdx: number;

      while ((sepIdx = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sepIdx);
        buffer = buffer.slice(sepIdx + 2);

        let eventType = "message";
        const dataLines: string[] = [];

        for (const rawLine of frame.split("\n")) {
          const line = rawLine.trimEnd();
          if (!line) {
            continue;
          }
          if (line.startsWith(":")) {
            dispatchEvent(onEvent, "heartbeat", line.slice(1).trim());
            continue;
          }

          const colonIndex = line.indexOf(":");
          const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
          const valuePart =
            colonIndex === -1
              ? ""
              : line.slice(colonIndex + 1).replace(/^\s/, "");

          switch (field) {
            case "event":
              eventType = valuePart || "message";
              break;
            case "data":
              dataLines.push(valuePart);
              break;
            case "id":
              lastEventId = valuePart;
              break;
            case "retry":
              dispatchEvent(onEvent, "retry", valuePart);
              break;
            default:
              break;
          }
        }

        const data = dataLines.join("\n");
        if (eventType) {
          dispatchEvent(onEvent, eventType, data);
        }
      }

      // Passive heartbeat watchdog: if no activity beyond threshold, notify
      if (Date.now() - lastActivityTs > HEARTBEAT_INTERVAL_MS * 2) {
        dispatchEvent(onEvent, "idle", null);
        lastActivityTs = Date.now();
      }
    }
  } catch (err: any) {
    if (err?.name === "AbortError") {
      // Already handled via abort event
      return;
    }
    const normalized = normalizeError(err, { source: "sse" });
    dispatchEvent(onEvent, "error", normalized);
    throw normalized;
  } finally {
    try {
      await reader.cancel();
    } catch {}
    if (signal) signal.removeEventListener("abort", abortHandler);
    // Lifecycle: close
    dispatchEvent(onEvent, "close", lastEventId ?? null);
  }
}
