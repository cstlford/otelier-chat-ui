import { normalizeError } from "../lib/errors";

export async function getUser(
  url: string,
  organizationId: number,
  jwt: string
) {
  try {
    const response = await fetch(`${url}/api/user/${organizationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw normalizeError(
        { message: text || "Failed to fetch user", status: response.status },
        { source: "api" }
      );
    }
    return response.json();
  } catch (err) {
    throw normalizeError(err, { source: "api" });
  }
}
