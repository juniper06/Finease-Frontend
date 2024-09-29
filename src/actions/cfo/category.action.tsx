"use server";

export async function addCategory(values: any) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/category`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to add category.";
      if (response.status === 404) {
        errorMessage = "category not found.";
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

export async function getAllCategory(userId: string) {
  const response = await fetch(`${process.env.SERVER_API}/category`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  const categories = await response.json();
  return categories.filter(
    (category: { userId: string }) => category.userId === userId
  );
}

export async function getCategory(id: string) {
  const response = await fetch(`${process.env.SERVER_API}/category/${id}`, {
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

export async function deleteCategory(id: string) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/category/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      let errorMessage = "Failed to delete Category.";
      if (response.status === 404) {
        errorMessage = "Category not found.";
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

export type Category = {
  id: string;
  categoryName: string;
};