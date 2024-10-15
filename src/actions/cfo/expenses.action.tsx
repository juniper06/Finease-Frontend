"use server";
import { auth } from "@/lib/auth";
import { ok } from "assert";
import { error } from "console";
import { headers } from "next/headers";
import { env } from "process";
import { json } from "stream/consumers";
import { map } from "zod";

export async function addExpenses(values: any) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/expenses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to add expenses." };
    }

    return await response.json();
  } catch (error) {
    console.error("Network error in addExpenses:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllExpenses(userId: string) {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.SERVER_API}/expenses/cfo/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to fetch expenses. Status: ${response.status}` };
    }

    const expenses = await response.json();

    // Ensure category is returned with expense data
    return expenses.map((expense: any) => ({
      ...expense,
      categoryName: expense.category?.categoryName || "Unknown Category", // Make sure category is being returned
    }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function getExpenses(id: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/expenses/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Expense not found." };
      }
      return { error: "Failed to fetch expense." };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching expense:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function deleteExpenses(id: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete expense.";
      if (response.status === 404) {
        errorMessage = "Expense not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error deleting expense:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function editExpenses(id: string, values: any) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/expenses/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update expense.";
      if (response.status === 404) {
        errorMessage = "Expense not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error in editExpenses:", error);
    return { error: "Network error. Please try again." };
  }
}

export type Expenses = {
  id: string;
  amount: number;
  categoryName: any;
};
