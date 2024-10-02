"use server";
import { auth } from "@/lib/auth";

export async function addPaymentRecord(values: any) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/payment`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to add payment record." };
    }

    return await response.json();
  } catch (error) {
    console.error("Network error in addPaymentRecord:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllPaymentRecords(userId: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/payment`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
      },
    });

    if (!response.ok) {
      return { error: `Failed to fetch payment records. Status: ${response.status}` };
    }

    const payments = await response.json();
    return payments.filter(
      (payment: { userId: string }) => payment.userId === userId
    );
  } catch (error) {
    console.error("Error fetching payment records:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function getPaymentRecord(id: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/payment/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Payment record not found." };
      }
      return { error: "Failed to fetch payment record." };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching payment record:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function deletePaymentRecord(id: string) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/payment/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete payment record.";
      if (response.status === 404) {
        errorMessage = "Payment record not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error deleting payment record:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function editPaymentRecord(id: string, values: any) {
  try {
    const session = await auth(); 
    const response = await fetch(`${process.env.SERVER_API}/payment/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${session?.user.token}`, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update payment record.";
      if (response.status === 404) {
        errorMessage = "Payment record not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error in editPaymentRecord:", error);
    return { error: "Network error. Please try again." };
  }
}

export type Payment = {
  id: string;
  dateOfPayment: string;
  paymentNumber: string;
  modeOfPayment: string;
  referenceNumber: string;
  totalAmount: number;
};
