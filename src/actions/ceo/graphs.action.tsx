"use server";
import { useFetch } from "@/lib/fetch";

export async function getAllExpenses(startupId: number) {
  const response = await useFetch(`${process.env.SERVER_API}/expenses/startup/${startupId}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }
  
  return await response.json();
}

export async function getAllCustomers(startupId: number) {
  const response = await useFetch(`${process.env.SERVER_API}/customer/startup/${startupId}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Customers');
  }
  
  return await response.json();
}

export async function getAllItems(startupId: number) {
  const response = await useFetch(`${process.env.SERVER_API}/item/startup/${startupId}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Items');
  }
  
  return await response.json();
}

export async function getAllPaymentRecords(startupId: number) {
  const response = await useFetch(`${process.env.SERVER_API}/payment/startup/${startupId}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Payments');
  }
  
  return await response.json();
}

export async function getAllProjectRecords(startupId: number) {
  const response = await useFetch(`${process.env.SERVER_API}/project/startup/${startupId}`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Payments');
  }
  
  return await response.json();
}