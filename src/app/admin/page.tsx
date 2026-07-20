"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api-base";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@westbalconsulting.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(apiUrl("/api/admin/auth"))
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace("/admin/dashboard");
      });
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(apiUrl("/api/admin/auth"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!res.ok) {
      setError("Email ose fjalëkalimi i gabuar.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <form onSubmit={onSubmit} className="card-luxury w-full max-w-md p-8">
        <h1 className="heading-lg text-2xl">Admin · Westbal</h1>
        <p className="mt-2 text-sm text-[#64748B]">Menaxhoni përmbajtjen e faqes pa prekur kodin.</p>
        <label className="mt-6 block text-sm font-medium">Email</label>
        <input
          className="mt-2 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="mt-4 block text-sm font-medium">Fjalëkalimi</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary mt-6 w-full">
          Hyr
        </button>
      </form>
    </div>
  );
}
