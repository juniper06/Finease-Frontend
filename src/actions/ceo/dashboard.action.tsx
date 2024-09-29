"use server";
import { useFetch } from "@/lib/fetch";

export async function getAllPaymentRecords(ceoId: number) {
  try {
    const response = await useFetch(
      `${process.env.SERVER_API}/payment/ceo/${ceoId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payments = await response.json();
    return Array.isArray(payments) ? payments : [];
  } catch (error) {
    console.error("Error fetching payment records:", error);
    return []; // Return an empty array on error
  }
}


export async function getAllExpenses(ceoId: number) {
  try {
    const response = await useFetch(
      `${process.env.SERVER_API}/expenses/ceo/${ceoId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const expenses = await response.json();
    return Array.isArray(expenses) ? expenses : [];
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return []; // Return an empty array on error
  }
}

export async function getAllCustomers(ceoId: number) {
  try {
    const response = await useFetch(
      `${process.env.SERVER_API}/customer/ceo/${ceoId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const customers = await response.json();
    return Array.isArray(customers) ? customers : [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function getAllitems(ceoId: number) {
  try {
    const response = await useFetch(
      `${process.env.SERVER_API}/item/ceo/${ceoId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const items = await response.json();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

export async function getAllProjects(ceoId: number) {
  try {
    const response = await useFetch(
      `${process.env.SERVER_API}/project/ceo/${ceoId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const projects = await response.json();
    return Array.isArray(projects) ? projects : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Return an empty array on error
  }
}
