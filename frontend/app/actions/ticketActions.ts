"use server";

import { revalidatePath } from "next/cache";
import { createReply, updateTicket, createTicket as apiCreateTicket } from "@/lib/api/tickets";
import { Attachment, Ticket } from "@/types";

/**
 * Server Action: Submit a reply to a ticket.
 * Revalidates the dynamic ticket route and main tickets page.
 */
export async function addReplyAction(
  ticketId: string,
  content: string,
  attachments: Attachment[] = [],
  isInternal: boolean = false
) {
  if (!content || content.trim() === "") {
    return { success: false, error: "Reply content cannot be empty." };
  }

  try {
    const reply = await createReply(ticketId, content.trim(), attachments, isInternal);
    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");
    revalidatePath("/");
    return { success: true, data: reply };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to post reply.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Update ticket status.
 */
export async function updateTicketStatusAction(
  ticketId: string,
  status: Ticket["status"]
) {
  try {
    const updated = await updateTicket(ticketId, { status });
    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update status.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Update ticket priority.
 */
export async function updateTicketPriorityAction(
  ticketId: string,
  priority: Ticket["priority"]
) {
  try {
    const updated = await updateTicket(ticketId, { priority });
    revalidatePath(`/tickets/${ticketId}`);
    revalidatePath("/tickets");
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update priority.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Create a new support ticket from FormData.
 */
export async function createTicketAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = (formData.get("priority") as Ticket["priority"]) || "MEDIUM";
  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const customerCompany = formData.get("customerCompany") as string;

  if (!title || !description) {
    return { success: false, error: "Title and description are required." };
  }

  try {
    const newTicket = await apiCreateTicket({
      title: title.trim(),
      description: description.trim(),
      status: "OPEN",
      priority,
      customerName: customerName ? customerName.trim() : "Guest User",
      customerEmail: customerEmail ? customerEmail.trim() : "customer@example.com",
      customerCompany: customerCompany ? customerCompany.trim() : "Client Company",
      tags: ["general"],
      agentName: "Agent Alex",
      agentId: "usr-agent-01",
    });

    revalidatePath("/tickets");
    revalidatePath("/");
    return { success: true, data: newTicket };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create ticket.";
    return { success: false, error: errorMessage };
  }
}
