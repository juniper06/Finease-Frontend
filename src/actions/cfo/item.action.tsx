"use server";
import { auth } from "@/lib/auth";

export async function addItem(values: any) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/item`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to add item." };
    }

    return await response.json();
  } catch (error) {
    console.error("Network error in addItem:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllItems(userId: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/item`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      return { error: `Failed to fetch items. Status: ${response.status}` };
    }

    const items = await response.json();
    return items.filter((item: { userId: string }) => item.userId === userId);
  } catch (error) {
    console.error("Error fetching items:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function getItem(id: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/item/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Item not found." };
      }
      return { error: "Failed to fetch item." };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching item:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function deleteItem(id: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/item/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete item.";
      if (response.status === 404) {
        errorMessage = "Item not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error deleting item:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function editItem(id: string, values: any) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/item/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update item.";
      if (response.status === 404) {
        errorMessage = "Item not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error in editItem:", error);
    return { error: "Network error. Please try again." };
  }
}

export type Item = {
  id: string;
  name: string;
  price: number;
};
