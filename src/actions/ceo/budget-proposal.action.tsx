"use server";

export async function getAllBudgetProposals(ceoId: number) {
  try {
    const response = await fetch(
      `${process.env.SERVER_API}/budget-proposal/ceo/${ceoId}`,
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
    return [];
  }
}

export async function editBudgetProposalStatus(id: string, status: string, ceoComment: string) {
  try {
    const response = await fetch(
      `${process.env.SERVER_API}/budget-proposal/${id}/status`,
      {
        method: "PATCH",
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
      return {
        error: errorMessage,
      };
    }

    const updatedProposal = await response.json();
    return {
      success: true,
      data: updatedProposal,
    };
  } catch (error) {
    console.error("Network error:", error);
    return {
      error: "Network error. Please try again.",
    };
  }
}
