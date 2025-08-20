import { NewThreadResponse } from "../types";
import { normalizeError } from "../lib/errors";

export default async function newThread(
  url: string,
  jwt: string
): Promise<NewThreadResponse> {
  try {
    const response = await fetch(`${url}/chatbot/new-thread`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw normalizeError(
        { message: text || "Failed to create thread", status: response.status },
        { source: "api" }
      );
    }
    const data = await response.json();

    return {
      threadId: data.thread_id,
    };
  } catch (err) {
    throw normalizeError(err, { source: "api" });
  }
}
