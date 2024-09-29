"use server";

export async function addInvoice(values: any) {
  const response = await fetch(`${process.env.SERVER_API}/invoice`, {
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

export async function getAllInvoices(userId: string) {
  const response = await fetch(`${process.env.SERVER_API}/invoice`, {
    method: "GET",
  });
  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  const invoices = await response.json();
  return invoices.filter(
    (invoice: { userId: string }) => invoice.userId === userId
  );
}

export async function getInvoice(id: string) {
  const response = await fetch(`${process.env.SERVER_API}/invoice/${id}`, {
    method: "GET",
  });
  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  if (response.status === 404) {
    return {
      error: "Invoice not found",
    };
  }
  return response.json();
}

export async function deleteInvoice(id: string) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/invoice/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      let errorMessage = "Failed to delete invoice.";
      if (response.status === 404) {
        errorMessage = "invoice not found.";
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

export async function editInvoice(id: string, values: any) {
  try {
    const response = await fetch(`${process.env.SERVER_API}/invoice/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      let errorMessage = "Failed to update invoice.";
      if (response.status === 404) {
        errorMessage = "invoice not found.";
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

export async function getInvoicesByCustomerId(customerId: string) {
  const response = await fetch(
    `${process.env.SERVER_API}/invoice/customer/${customerId}`,
    {
      method: "GET",
    }
  );
  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  if (response.status === 404) {
    return {
      error: "Invoices not found",
    };
  }
  return response.json();
}

export type Invoice = {
  id: string;
  dueDate: string;
  invoiceNumber: string;
  total: number;
  balanceDue: number;
  status: string;
}