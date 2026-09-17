import { signupAction } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form action={signupAction} className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Workspace & Account</h2>
        <input name="workspaceName" placeholder="Workspace Name (e.g. Acme Inc)" required className="w-full border p-2 rounded text-black" />
        <input name="name" placeholder="Your Name" required className="w-full border p-2 rounded text-black" />
        <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded text-black" />
        <input name="password" type="password" placeholder="Password" required className="w-full border p-2 rounded text-black" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}