import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import SignInForm from "@/components/sign-in-form";
import { authOptions } from "@/core/next-auth.config";

export default async function SignIn() {
  const user = await getServerSession(authOptions);

  if (user) {
    redirect("/");
  }

  return (
    <div className="bg-background flex min-h-[calc(100vh-68px)] items-center justify-center">
      <SignInForm />
    </div>
  );
}
