"use server";
import { useFetch } from "@/lib/fetch";

export async function addStartup(values: any) {
  const response = await useFetch(`${process.env.SERVER_API}/startup`, {
    method: "POST",
    body: JSON.stringify(values),
  });
  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  return response.json();
}

export async function getAllStartups(userId: number) { // Ensure userId is a number
  const response = await useFetch(`${process.env.SERVER_API}/startup`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }

  const startups = await response.json();

  // Filter startups where ceoId matches the current user's ID
  return startups.filter(
    (startup: { ceoId: number }) => startup.ceoId === userId
  );
}

export async function deleteStartup(id: string) {
  try {
    const response = await useFetch(`${process.env.SERVER_API}/startup/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      let errorMessage = "Failed to delete startup.";
      if (response.status === 404) {
        errorMessage = "Startup not found.";
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

export async function getStartup(id: string) {
  const response = await useFetch(`${process.env.SERVER_API}/startup/${id}`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }

  if (response.status === 404) {
    return {
      error: "Startup not found",
    };
  }
  return response.json();
}

export async function editStartup(id: string, values: any) {
  try {
    const response = await useFetch(`${process.env.SERVER_API}/startup/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to update startup.";
      if (response.status === 404) {
        errorMessage = "Startup not found.";
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

export async function getCFOsForStartup(startupId: number) {
  const response = await useFetch(`${process.env.SERVER_API}/startup/${startupId}/cfo`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
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
