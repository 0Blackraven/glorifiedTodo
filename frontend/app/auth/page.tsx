"use client";
import { useState } from "react";
import type { AuthMode } from "@/types";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { ListTodo } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F3] p-6">
      {/* Decorative gradient blob */}
      <div
        className="fixed top-[-10rem] left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,164,97,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl shadow-[#E8864A]/5 border border-[#E7E5E4] relative z-10 overflow-hidden">
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5A461] to-[#E8864A] flex items-center justify-center mb-4">
            <ListTodo size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#1C1917]">Glorified Todo</h1>
          <p className="text-sm text-[#A8A29E] mt-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="px-8">
          <div className="flex bg-[#F5F5F4] rounded-xl p-1 mb-6">
            {(["login", "register"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-200 cursor-pointer ${
                  mode === m
                    ? "bg-white text-[#1C1917] shadow-sm"
                    : "text-[#A8A29E] hover:text-[#78716C]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
