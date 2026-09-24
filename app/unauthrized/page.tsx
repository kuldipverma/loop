import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50 dark:bg-gray-900">
      <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full mb-4">
        <ShieldAlert size={48} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">403 - Access Denied</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        You don't have permission to view this resource. Please switch to an Admin or Analyst account to gain access.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}