import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404: Page Not Found",
  description: "Page not found",
};

const NotFoundPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-8 text-center">
        <h1 className="text-primary mb-4 text-8xl font-bold opacity-80">404</h1>
        <h2 className="mb-6 text-2xl font-medium text-gray-800 dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="mb-10 max-w-md leading-relaxed text-gray-600 dark:text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <Link href="/" passHref>
          <Button
            size="lg"
            className="px-8 py-6 font-medium transition-transform hover:-translate-y-1"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
