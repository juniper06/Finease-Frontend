"use server";

export async function getAllStartups() {
  const response = await fetch(`${process.env.SERVER_API}/startup`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }

  const startups = await response.json();
  return startups; 
}