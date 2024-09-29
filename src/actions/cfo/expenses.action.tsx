"use server";

export async function addExpenses(values: any) {
  const response = await fetch(`${process.env.SERVER_API}/expenses`, {
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

export async function getAllExpenses(userId: string) {
  const response = await fetch(`${process.env.SERVER_API}/expenses`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  const expenses = await response.json();
  return expenses.filter(
    (expense: { userId: string }) => expense.userId === userId
  );
}

export async function getExpenses(id: string) {
  const response = await fetch(`${process.env.SERVER_API}/expenses/${id}`, {
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

export async function deleteExpenses(id: string) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/expenses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      let errorMessage = "Failed to delete expenses.";
      if (response.status === 404) {
        errorMessage = "Expenses not found.";
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

export async function editExpenses(id: string, values: any) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/expenses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to update expenses.";
      if (response.status === 404) {
        errorMessage = "expenses not found.";
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

export type Expenses = {
  id: string;
  amouunt: number;
}