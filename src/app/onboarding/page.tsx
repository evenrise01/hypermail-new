// app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import LinkAccountButton from "@/components/link-account-button";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header with logo */}
      <header className="p-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Image src="/HM_square.png" width={32} height={32} alt="logo" />
          Hypermail
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Onboarding Card */}
          <div className="mb-6">
              <h1 className="mb-2 text-2xl font-bold items-center text-green-400 flex justify-center">One more step</h1>
              {/* <p className="text-gray-400">
                Add an email account to continue to Hypermail
              </p> */}
            </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
            {/* Link Account */}
            <LinkAccountButton />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Need help?{" "}
              <Link href="/help" className="text-green-400 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Hypermail. All rights reserved.</p>
      </footer>
    </div>
  );
}
