"use server";
import { auth } from "@/lib/auth";

export async function getAllStartups() {
  const session = await auth();
  const response = await fetch(`${process.env.SERVER_API}/startups/guest`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 500) {
      return {
        error: "Something went wrong",
      };
    }
    return {
      error: `Error: ${response.status}`,
    };
  }

  return response.json(); // The backend will already filter startups by CEO
}
