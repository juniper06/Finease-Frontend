"use server";

import { auth } from "@/lib/auth";

export async function getAllBudgetProposals(ceoId: number) {
  try {
    const session = await auth(); 
    const response = await fetch(
      `${process.env.SERVER_API}/budget-proposal/ceo/${ceoId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to fetch budget proposals. Status: ${response.status}` };
    }

    const proposals = await response.json();

    return Array.isArray(proposals) ? proposals : { error: "Unexpected response format" };
  } catch (error) {
    console.error("Error fetching budget proposals:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function editBudgetProposalStatus(
  id: string,
  status: string,
  ceoComment: string
) {
  try {
    const session = await auth(); 
    const response = await fetch(
      `${process.env.SERVER_API}/budget-proposal/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, ceoComment }),
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to update budget proposal status.";
      if (response.status === 404) {
        errorMessage = "Budget proposal not found.";
      } else if (response.status === 400) {
        errorMessage = "Invalid status provided.";
      } else {
        errorMessage = "Something went wrong.";
      }
      return { error: errorMessage };
    }

    const updatedProposal = await response.json();
    return { success: true, data: updatedProposal };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

export type BudgetProposal = {
  id: string;
  proposalTitle: string;
  proposalNumber: string;
  totalBudget: number;
  budgetPeriod: string;
  startDate: string;
  endDate: string;
  status: string;
  budgetBreakdown: {
    proposalCategory: string;
    allocatedAmount: number;
    description: string;
  }[];
  justification: string;
  strategy: string;
  potentialRisk: string;
  alternative: string;
  ceoComment: string;
};
