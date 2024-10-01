"use server";
import { auth } from "@/lib/auth";

export async function getAllPaymentRecords(ceoId: number) {
  try {
    const session = await auth(); 
    const response = await fetch(
      `${process.env.SERVER_API}/payment/ceo/${ceoId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to fetch payment records. Status: ${response.status}` };
    }

    const payments = await response.json();
    return Array.isArray(payments) ? payments : [];
  } catch (error) {
    console.error("Error fetching payment records:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllExpenses(ceoId: number) {
  try {
    const session = await auth(); 
    const response = await fetch(
      `${process.env.SERVER_API}/expenses/ceo/${ceoId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to fetch expenses. Status: ${response.status}` };
    }

    const expenses = await response.json();
    return Array.isArray(expenses) ? expenses : [];
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllCustomers(ceoId: number) {
  try {
    const session = await auth(); 
    const response = await fetch(
      `${process.env.SERVER_API}/customer/ceo/${ceoId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to fetch customers. Status: ${response.status}` };
    }

    const customers = await response.json();
    return Array.isArray(customers) ? customers : [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllItems(ceoId: number) {
  try {
    const session = await auth(); 
    const response = await fetch(
      `${process.env.SERVER_API}/item/ceo/${ceoId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to fetch items. Status: ${response.status}` };
    }

    const items = await response.json();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Error fetching items:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllProjects(ceoId: number) {
  try {
    const session = await auth(); 
    const response = await fetch(
      `${process.env.SERVER_API}/project/ceo/${ceoId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to fetch projects. Status: ${response.status}` };
    }

    const projects = await response.json();
    return Array.isArray(projects) ? projects : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { error: "Network error. Please try again." };
  }
}
