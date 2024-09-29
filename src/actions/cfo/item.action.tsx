"use server";
import { useFetch } from "@/lib/fetch";

export async function addItem(values: any) {
  const response = await useFetch(`${process.env.SERVER_API}/item`, {
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

export async function getAllitems(userId: string) {
  const response = await useFetch(`${process.env.SERVER_API}/item`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  const items = await response.json();
  return items.filter((item: { userId: string }) => item.userId === userId);
}

export async function deleteItem(id: string) {
  try {
    const response = await useFetch(`${process.env.SERVER_API}/item/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      let errorMessage = "Failed to delete item.";
      if (response.status === 404) {
        errorMessage = "Item not found.";
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

export async function getItem(id: string) {
  const response = await useFetch(`${process.env.SERVER_API}/item/${id}`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }

  if (response.status === 404) {
    return {
      error: "Item not found",
    };
  }
  return response.json();
}

export async function editItem(id: string, values: any) {
  try {
    const response = await useFetch(`${process.env.SERVER_API}/item/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to update item.";
      if (response.status === 404) {
        errorMessage = "Item not found.";
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

export type Item = {
  id: string;
  name: string;
  price: number;
}