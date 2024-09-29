"use server";

export async function addCustomer(values: any) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/customer`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to add customer.";
      if (response.status === 404) {
        errorMessage = "customer not found.";
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

export async function getAllCustomers(userId: string) {
  const response = await fetch(`${process.env.SERVER_API}/customer`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  const customers = await response.json();
  return customers.filter(
    (customer: { userId: string }) => customer.userId === userId
  );
}

export async function getCustomer(id: string) {
  const response = await fetch(`${process.env.SERVER_API}/customer/${id}`, {
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

export async function deleteCustomer(id: string) {
  try {
    const response = await fetch(
      `${process.env.SERVER_API}/customer/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      let errorMessage = "Failed to delete customer.";
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

export async function editCustomer(id: string, values: any) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/customer/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to update customer.";
      if (response.status === 404) {
        errorMessage = "Customer not found.";
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

export type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  companyName: string;
  phoneNumber: number;
  country: string;
  state: string;
  zipCode: number;
  city: string;
}