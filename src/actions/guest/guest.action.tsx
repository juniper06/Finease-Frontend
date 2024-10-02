"use server";
import { auth } from "@/lib/auth";

export async function getAllStartups() {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/startup`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        error: `Failed to fetch startups. Status: ${response.status}`,
      };
    }

    const startups = await response.json();
    return startups;
  } catch (error) {
    console.error("Error fetching startups:", error);
    return { error: "Network error. Please try again." };
  }
}
