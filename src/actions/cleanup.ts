import { TicketStatus } from "@prisma/client";

import { db } from "@/core/prisma";

/**
 * Cleanup abandoned tickets that were not paid for within 30 minutes
 */
export async function cleanupAbandonedTickets() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  try {
    // Delete tickets and their associated payments that are still pending
    // and were created more than 30 minutes ago
    const result = await db.ticket.deleteMany({
      where: {
        status: TicketStatus.PENDING,
        created_at: {
          lt: thirtyMinutesAgo,
        },
      },
    });

    return { deletedCount: result.count };
  } catch (error) {
    console.error("Error cleaning up abandoned tickets:", error);
    throw new Error("Failed to cleanup abandoned tickets");
  }
}
