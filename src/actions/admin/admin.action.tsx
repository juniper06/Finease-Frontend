"use server";
import { useFetch } from "@/lib/fetch";

// Fetch pending CEO requests
export async function getPendingCEOs() {
  const response = await useFetch(`${process.env.SERVER_API}/admin/requests`, {
    method: "GET",
  });
  if (!response.ok) {
    return {
      error: "Failed to fetch pending CEO requests",
    };
  }
  return response.json();
}

// Approve a CEO request
export async function approveUser(id: number) {
  try {
    const response = await useFetch(`${process.env.SERVER_API}/admin/approve/${id}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      let errorMessage = "Failed to approve user.";
      if (response.status === 404) {
        errorMessage = "User not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    return {
      error: "Network error. Please try again.",
    };
  }
}

// Reject a CEO request
export async function rejectUser(id: number) {
  try {
    const response = await useFetch(`${process.env.SERVER_API}/admin/reject/${id}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      let errorMessage = "Failed to reject user.";
      if (response.status === 404) {
        errorMessage = "User not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    return {
      error: "Network error. Please try again.",
    };
  }
}
