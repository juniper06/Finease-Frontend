"use server";

export async function addUser(values: any) {
  const response = await fetch(`${process.env.SERVER_API}/user/create`, {
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

export async function getByAuth() {
  const response = await fetch(`${process.env.SERVER_API}/user/get-by-auth`);
  return response.json();
}

export async function getUserData() {
  const result = await getByAuth();
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data;
}

export async function getAllUser(userId: string): Promise<User[]> {
  try {
    const response = await fetch(`${process.env.SERVER_API}/user`, {
      method: "GET",
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
  try {
    const response = await fetch(`${process.env.SERVER_API}/user/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to update user.";
      if (response.status === 404) {
        errorMessage = "user not found.";
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
  try {
    const response = await fetch(`${process.env.SERVER_API}/user/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      let errorMessage = "Failed to delete user.";
      if (response.status === 404) {
        errorMessage = "user not found.";
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
