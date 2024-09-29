import { auth } from "@/lib/auth";

export async function useFetch(url: string, init?: RequestInit | undefined) {
  const session = await auth();
  if (!session) {
    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...init,
    });
  }
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${session.user.token}`,
      "Content-Type": "application/json",
    },
    ...init,
  });
}
