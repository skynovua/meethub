import { SignInForm } from "@/components/sign-in-form";

export default async function SignIn() {
  return (
    <div className="bg-background flex min-h-[calc(100vh-68px)] items-center justify-center">
      <SignInForm />
    </div>
  );
}
