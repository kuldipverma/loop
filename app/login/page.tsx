'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Login logic yahan aayega (API call etc.)
    console.log('Logging in:', { email, password });

    // Login hone ke baad Dashboard ya Home page par bhejne ke liye:
    router.push('/'); // Agar kisi aur page pe bhejna hai toh '/' ko '/dashboard' kar dein
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Login to your LOOP account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition duration-200 shadow-md cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}