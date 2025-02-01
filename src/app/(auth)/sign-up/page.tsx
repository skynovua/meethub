import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import SignUpForm from "@/components/sign-up-form";

export default async function SignUp() {
  const user = await getServerSession();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignUpForm />
    </div>
  );
}
