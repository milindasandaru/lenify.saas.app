"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-gray-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-prose text-gray-600">
        Sorry, we couldn’t find the page you’re looking for. It may have been moved or deleted.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
