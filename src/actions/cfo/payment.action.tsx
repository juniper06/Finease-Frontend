"use server";

export async function addPaymentRecord(values: any) {
  const response = await fetch(`${process.env.SERVER_API}/payment`, {
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

export async function getAllPaymentRecords(userId: string) {
  const response = await fetch(`${process.env.SERVER_API}/payment`, {
    method: "GET",
  });
  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  const payments = await response.json();
  return payments.filter(
    (payment: { userId: string }) => payment.userId === userId
  );
}

export async function getPaymentRecord(id: string) {
  const response = await fetch(`${process.env.SERVER_API}/payment/${id}`, {
    method: "GET",
  });
  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  if (response.status === 404) {
    return {
      error: "Payment record not found",
    };
  }
  return response.json();
}

export async function deletePaymentRecord(id: string) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/payment/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      let errorMessage = "Failed to delete payment record.";
      if (response.status === 404) {
        errorMessage = "payment record not found.";
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

export async function editPaymentRecord(id: string, values: any) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/payment/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to update payment record.";
      if (response.status === 404) {
        errorMessage = "Payment record not found.";
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

export type Payment = {
  id: string;
  dateOfPayment: string;
  paymentNumber: string;
  modeOfPayment: string;
  referenceNumber: string;
  totalAmount: number;
};
