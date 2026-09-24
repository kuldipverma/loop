import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50 dark:bg-gray-900">
      <div className="p-4 bg-red-100 rounded-full dark:bg-red-900/30 text-red-600 mb-4">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        The page or workspace you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}