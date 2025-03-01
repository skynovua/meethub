import { redirect } from "next/navigation";

import { auth } from "@/core/auth";

export default async function Profile() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-4">Welcome, {session.user.name}</p>
    </div>
  );
}
