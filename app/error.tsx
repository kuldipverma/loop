"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full mb-4">
        <AlertOctagon size={48} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
      >
        <RotateCcw size={18} />
        Try Again
      </button>
    </div>
  );
}