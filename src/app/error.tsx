"use client";

import Button from "@/ui/buttons/Button";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black-800 text-white text-center">
      <div className="p-8 bg-black-700 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-orange-600">Oops, something went wrong!</h1>
        <p className="mt-4 text-gray-400">
          We encountered an error while loading the page. Please try again or return to the homepage.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <Button onClick={reset} className="rounded-lg px-6 py-3">
            Retry
          </Button>

          <Link
            href="/"
            className="px-6 py-3 bg-black-400 text-white font-semibold rounded-lg hover:bg-black-500 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Error details: <span className="text-orange-700">{error.message}</span>
      </p>
    </div>
  );
}
