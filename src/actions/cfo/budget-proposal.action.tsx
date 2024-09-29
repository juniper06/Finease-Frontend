"use server";
import { useFetch } from "@/lib/fetch";

export async function addBudgetProposal(values: any) {
  try {
    const response = await useFetch(
      `${process.env.SERVER_API}/budget-proposal`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to add budget proposal",
      };
    }

    return response.json();
  } catch (error) {
    console.error("Error in addBudgetProposal:", error);
    return {
      error: "An unexpected error occurred",
    };
  }
}

export async function getAllBudgetProposals(userId: string) {
  const response = await useFetch(`${process.env.SERVER_API}/budget-proposal`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }
  const budgetProposals = await response.json();
  return budgetProposals.filter(
    (budgetProposal: { userId: string }) => budgetProposal.userId === userId
  );
}

export async function getBudgetProposal(id: string): Promise<BudgetProposal | { error: string }> {
  const response = await useFetch(`${process.env.SERVER_API}/budget-proposal/${id}`, {
    method: "GET",
  });

  if (response.status === 500) {
    return {
      error: "Something went wrong",
    };
  }

  if (response.status === 404) {
    return {
      error: "Budget Proposal not found",
    };
  }

  const budgetProposal = await response.json();
  return budgetProposal;
}

export async function deleteBudgetProposal(id: string) {
  try {
    const response = await useFetch(
      `${process.env.SERVER_API}/budget-proposal/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      let errorMessage = "Failed to delete Budget Proposal.";
      if (response.status === 404) {
        errorMessage = "Budget Proposal not found.";
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
  ceoComment:  string;
};
