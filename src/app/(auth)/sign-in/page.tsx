import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import SignInForm from "@/components/sign-in-form";

export default async function SignIn() {
  const user = await getServerSession();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignInForm />
    </div>
  );
}
