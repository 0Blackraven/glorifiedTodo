"use client";
import { useState } from "react";
import type { AuthMode } from "@/types";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div
        className="fixed top-[-10rem] left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)",
        }}
      />

      <Card className="w-full max-w-[420px] shadow-2xl relative z-10 border-muted">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-primary/10 border border-primary/20 mb-4">
            <span className="text-2xl">✦</span>
          </div>
          <CardTitle className="text-2xl font-bold">Glorified Todo</CardTitle>
          <CardDescription className="text-sm mt-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex bg-muted/50 rounded-lg p-1 mb-6 border">
            {(["login", "register"] as AuthMode[]).map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode(m)}
                className="flex-1 capitalize"
              >
                {m}
              </Button>
            ))}
          </div>

          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>
      </Card>
    </div>
  );
}
