"use server";
import { auth } from "@/lib/auth";

export async function addInvoice(values: any) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/invoice`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to add invoice." };
    }

    return await response.json();
  } catch (error) {
    console.error("Network error in addInvoice:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllInvoices(userId: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/invoice`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      return { error: `Failed to fetch invoices. Status: ${response.status}` };
    }

    const invoices = await response.json();
    return invoices.filter(
      (invoice: { userId: string }) => invoice.userId === userId
    );
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function getInvoice(id: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/invoice/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Invoice not found." };
      }
      return { error: "Failed to fetch invoice." };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/invoice/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete invoice.";
      if (response.status === 404) {
        errorMessage = "Invoice not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error deleting invoice:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function editInvoice(id: string, values: any) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/invoice/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update invoice.";
      if (response.status === 404) {
        errorMessage = "Invoice not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error in editInvoice:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getInvoicesByCustomerId(customerId: string) {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.SERVER_API}/invoice/customer/${customerId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Invoices not found." };
      }
      return { error: "Failed to fetch invoices." };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching invoices by customer:", error);
    return { error: "Network error. Please try again." };
  }
}

export type Invoice = {
  id: string;
  dueDate: string;
  invoiceNumber: string;
  total: number;
  balanceDue: number;
  status: string;
};
