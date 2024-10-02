"use server";
import { auth } from "@/lib/auth";

export async function addBudgetProposal(values: any) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/budget-proposal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to add budget proposal",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error in addBudgetProposal:", error);
    return {
      error: "An unexpected error occurred",
    };
  }
}

export async function getAllBudgetProposals(userId: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/budget-proposal`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      return {
        error: `Failed to fetch budget proposals. Status: ${response.status}`,
      };
    }

    const budgetProposals = await response.json();
    return budgetProposals.filter(
      (budgetProposal: { userId: string }) => budgetProposal.userId === userId
    );
  } catch (error) {
    console.error("Error fetching budget proposals:", error);
    return {
      error: "An unexpected error occurred",
    };
  }
}

export async function getBudgetProposal(
  id: string
): Promise<BudgetProposal | { error: string }> {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.SERVER_API}/budget-proposal/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Budget Proposal not found" };
      }
      return { error: "Failed to fetch budget proposal" };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching budget proposal:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function deleteBudgetProposal(id: string) {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.SERVER_API}/budget-proposal/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to delete Budget Proposal.";
      if (response.status === 404) {
        errorMessage = "Budget Proposal not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting budget proposal:", error);
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
