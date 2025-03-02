import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/core/auth";

export default async function Profile() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="my-4">Welcome, {session.user.name}</p>
      <Button asChild variant={"outline"}>
        <Link href="/">Back</Link>
      </Button>
    </div>
  );
}
