"use client";

import { AuthProvider, useAuth } from "../components/auth/auth-provider";
import { AuthScreen } from "../components/auth/auth-screen";
import AdminPanel from "../admin-panel";
import { Loader2 } from "lucide-react";

function AppContent() {
  const { user, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onSuccess={login} />;
  }

  return <AdminPanel />;
}

export default function SyntheticV0PageForDeployment() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
