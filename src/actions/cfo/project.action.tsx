"use server";
import { auth } from "@/lib/auth";

export async function addProject(values: any) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/project`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to add project." };
    }

    return await response.json();
  } catch (error) {
    console.error("Network error in addProject:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getAllProjects(userId: string) {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.SERVER_API}/project/cfo/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );

    if (!response.ok) {
      return { error: `Failed to fetch projects. Status: ${response.status}` };
    }

    const projects = await response.json();
    return projects.map(
      (project: { customer: { firstName: string; lastName: string } }) => ({
        ...project,
        customerName: project.customer
          ? `${project.customer.firstName} ${project.customer.lastName}`
          : "Unknown Customer",
      })
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function getProject(
  id: string
): Promise<Project | { error: string }> {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/project/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Project not found." };
      }
      return { error: "Failed to fetch project." };
    }

    const project = await response.json();
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/project/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete project.";
      if (response.status === 404) {
        errorMessage = "Project not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error deleting project:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function editProject(id: string, values: any) {
  try {
    const session = await auth();
    const response = await fetch(`${process.env.SERVER_API}/project/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update project.";
      if (response.status === 404) {
        errorMessage = "Project not found.";
      }
      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error in editProject:", error);
    return { error: "Network error. Please try again." };
  }
}

export type Project = {
  id: string;
  projectName: string;
  projectCode: string;
  billingMethod: string;
  customerName: string;
  description: string;
  projectUsers: {
    id: number;
    userName: string;
    userEmail: string;
  }[];
  projectResources: {
    id: number;
    resourceCategory: string;
    subCategory: string;
    expense: number;
  }[];
  customerId: string;
};
