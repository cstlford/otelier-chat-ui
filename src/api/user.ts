import { UserState } from "@/types/BITypes";

export async function getUserContext(url: string, token: string) {
  const response = await fetch(`${url}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: UserState = await response.json();
  return data;
}
