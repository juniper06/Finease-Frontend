"use server";
import { auth } from "@/lib/auth";
import { log } from "console";
import { headers } from "next/headers";
import { env } from "process";
import { json } from "stream/consumers";

export async function addUser(values: any) {
  const session = await auth();
  const response = await fetch(`${process.env.SERVER_API}/user/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${session?.user.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    if (response.status === 500) {
      return {
        error: "Something went wrong",
      };
    }
    // Handle other error statuses if needed
    return {
      error: `Error: ${response.status}`,
    };
  }

  return response.json();
}

export async function getByAuth() {
  const session = await auth();
  console.log("Session data:", session);  // Check session data
  const token = session?.user.token;
  console.log("Token:", token);  // Log the token
  if (!token) {
    throw new Error("No token found in session.");
  }

  const response = await fetch(`${process.env.SERVER_API}/users/current`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  console.log("Backend response:", result); // Log the response for debugging
  return result;
}

export async function getUserData() {
  const result = await getByAuth();
  console.log(result)
  if (!result) {
    throw new Error(result);
  }
  return result;
}

export async function getAllUser(userId: string): Promise<User[]> {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.SERVER_API}/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const { data } = await response.json();
    return data as User[];
  } catch (error) {
    console.error("Error fetching users:");
    throw error;
  }
}

export async function editUser(id: string, values: any) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.SERVER_API}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update user.";
      if (response.status === 404) {
        errorMessage = "User not found.";
      } else {
        errorMessage = "Something went wrong.";
      }
      return {
        error: errorMessage,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Network error. Please try again.",
    };
  }
}

export async function deleteUser(id: string) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.SERVER_API}/user/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete user.";
      if (response.status === 404) {
        errorMessage = "User not found.";
      } else {
        errorMessage = "Something went wrong.";
      }
      return {
        error: errorMessage,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Network error. Please try again.",
    };
  }
}

export type User = {
  startupId: string;
  id: string;
  ceoId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};
