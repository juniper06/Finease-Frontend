"use server";
import { auth } from "@/lib/auth";

export async function getAllExpenses(startupId: number) {
  const session = await auth(); 
  const response = await fetch(
    `${process.env.SERVER_API}/expenses/startup/${startupId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return { error: "Failed to fetch expenses" };
  }

  return await response.json();
}

export async function getAllCustomers(startupId: number) {
  const session = await auth(); 
  const response = await fetch(
    `${process.env.SERVER_API}/customer/startup/${startupId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return { error: "Failed to fetch customers" };
  }

  return await response.json();
}

export async function getAllItems(startupId: number) {
  const session = await auth(); 
  const response = await fetch(
    `${process.env.SERVER_API}/item/startup/${startupId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return { error: "Failed to fetch items" };
  }

  return await response.json();
}

export async function getAllPaymentRecords(startupId: number) {
  const session = await auth(); 
  const response = await fetch(
    `${process.env.SERVER_API}/payment/startup/${startupId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return { error: "Failed to fetch payment records" };
  }

  return await response.json();
}

export async function getAllProjectRecords(startupId: number) {
  const session = await auth(); 
  const response = await fetch(
    `${process.env.SERVER_API}/project/startup/${startupId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return { error: "Failed to fetch project records" };
  }

  return await response.json();
}
