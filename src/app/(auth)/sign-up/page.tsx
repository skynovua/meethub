import { SignUpForm } from "@/components/sign-up-form";

export default async function SignUp() {
  return (
    <div className="bg-background flex min-h-[calc(100vh-68px)] items-center justify-center">
      <SignUpForm />
    </div>
  );
}
