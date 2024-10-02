"use server";
import { auth } from "@/lib/auth";

export async function addCategory(values: any) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/category`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to add category.";
      if (response.status === 404) {
        errorMessage = "Category not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error in addCategory:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllCategory(userId: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/category`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      return {
        error: `Failed to fetch categories. Status: ${response.status}`,
      };
    }

    const categories = await response.json();
    return categories.filter(
      (category: { userId: string }) => category.userId === userId
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function getCategory(id: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/category/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Category not found." };
      }
      return { error: "Failed to fetch category." };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete category.";
      if (response.status === 404) {
        errorMessage = "Category not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error deleting category:", error);
    return { error: "Network error. Please try again." };
  }
}

export type Category = {
  id: string;
  categoryName: string;
};
