import { NextResponse } from "next/server";

import { cleanupAbandonedTickets } from "@/actions/cleanup";
import { auth } from "@/core/auth";

export async function POST() {
  try {
    const session = await auth();

    // Only allow authenticated users
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await cleanupAbandonedTickets();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in cleanup endpoint:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
