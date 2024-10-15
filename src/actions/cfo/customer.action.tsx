"use server";
import { auth } from "@/lib/auth";

export async function addCustomer(values: any) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/customer`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to add customer.";
      if (response.status === 404) {
        errorMessage = "Customer not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error in addCustomer:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllCustomers(userId: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/customer/cfo/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
      },
    });

    if (!response.ok) {
      return { error: `Failed to fetch customers. Status: ${response.status}` };
    }

    const customers = await response.json();
    return customers; 
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { error: "An unexpected error occurred." };
  }
}


export async function getCustomer(id: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/customer/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Customer not found." };
      }
      return { error: "Failed to fetch customer." };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching customer:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/customer/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete customer.";
      if (response.status === 404) {
        errorMessage = "Customer not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error deleting customer:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function editCustomer(id: string, values: any) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/customer/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update customer.";
      if (response.status === 404) {
        errorMessage = "Customer not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error in editCustomer:", error);
    return { error: "Network error. Please try again." };
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
};
