import { ThreadMessage } from "@assistant-ui/react";
import type { ChatModelRunResult } from "@assistant-ui/react";
import { Hotel } from "@/types/BITypes";

export async function sendMessage(
  url: string,
  token: string,
  organizationId: string | null,
  hotels: Hotel[],
  selectedHotelIds: number[],
  messages: readonly ThreadMessage[],
  threadId: string,
  signal?: AbortSignal
) {
  let hotelIdsToSend =
    selectedHotelIds.length > 0
      ? selectedHotelIds
      : hotels.map((hotel) => hotel.id);

  const response = await fetch(`${url}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: messages[messages.length - 1],
      organizationId: organizationId,
      hotels: hotelIdsToSend,
      threadId: threadId,
    }),
    signal: signal,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return {
    content: [
      {
        type: "text",
        text: String(data.message),
      },
    ],
  } satisfies ChatModelRunResult;
}
