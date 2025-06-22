"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

export function UserHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback className="bg-blue-500 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900">{user.username}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
