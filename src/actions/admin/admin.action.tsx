"use server";
import { auth } from "@/lib/auth";

// Fetch pending CEO requests
export async function getPendingCEOs() {
  const session = await auth(); 
  const response = await fetch(`${process.env.SERVER_API}/admin/requests`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
      "Content-Type": "application/json",
    },
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
  const session = await auth(); 

  const response = await fetch(
    `${process.env.SERVER_API}/admin/approve/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    let errorMessage = "Failed to approve user.";
    if (response.status === 404) {
      errorMessage = "User not found.";
    }
    return { error: errorMessage };
  }

  return { success: true };
}

// Reject a CEO request
export async function rejectUser(id: number) {
  const session = await auth(); 

  const response = await fetch(`${process.env.SERVER_API}/admin/reject/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to reject user.";
    if (response.status === 404) {
      errorMessage = "User not found.";
    }
    return { error: errorMessage };
  }

  return { success: true };
}
