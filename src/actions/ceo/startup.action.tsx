"use server";
import { auth } from "@/lib/auth";


export async function addStartup(values: any) {
  const session = await auth();
  const response = await fetch(`${process.env.SERVER_API}/startup`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
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
    return {
      error: `Error: ${response.status}`,
    };
  }

  return response.json();
}

export async function getAllStartups() {
  const session = await auth();
  const response = await fetch(`${process.env.SERVER_API}/startups`, {
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

export async function deleteStartup(id: string) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.SERVER_API}/startup/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete startup.";
      if (response.status === 404) {
        errorMessage = "Startup not found.";
      } else {
        errorMessage = "Something went wrong.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    return { error: "Network error. Please try again." };
  }
}

export async function getStartup(id: string) {
  const session = await auth();
  const response = await fetch(`${process.env.SERVER_API}/startups/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 500) {
      return { error: "Something went wrong" };
    }
    if (response.status === 404) {
      return { error: "Startup not found" };
    }
    return { error: `Error: ${response.status}` };
  }

  return response.json();
}

export async function editStartup(id: string, values: any) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.SERVER_API}/startup/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update startup.";
      if (response.status === 404) {
        errorMessage = "Startup not found.";
      } else {
        errorMessage = "Something went wrong.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    return { error: "Network error. Please try again." };
  }
}

export async function getCFOsForStartup(startupId: number) {
  const session = await auth();
  const response = await fetch(
    `${process.env.SERVER_API}/startup/${startupId}/cfo`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 500) {
      return { error: "Something went wrong" };
    }
    return { error: `Error: ${response.status}` };
  }

  return response.json();
}

export type Startup = {
  [x: string]: any;
  id: number; // Changed from string to number
  startupName: string;
  startupDescription: string;
  startupType: string;
  phoneNumber: string;
  contactEmail: string;
  location: string;
  startupCode: string;
  ceoId: number; // Added ceoId
};
