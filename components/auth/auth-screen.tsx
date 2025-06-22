"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface AuthScreenProps {
  onSuccess: (user: any, token: string) => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {mode === "login" ? (
          <LoginForm onSuccess={onSuccess} onToggleMode={toggleMode} />
        ) : (
          <RegisterForm onSuccess={onSuccess} onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  );
}
