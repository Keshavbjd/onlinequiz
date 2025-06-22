"use client";

import { useState } from "react";
import { AdminSidebar } from "./components/admin-sidebar";
import { QuestionForm } from "./components/question-form";
import { QuizPlayer } from "./components/quiz-player";
import { UserHeader } from "./components/user-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, FileQuestion, TrendingUp } from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("add-questions");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600">Welcome to MyIQ Admin Panel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Questions
                  </CardTitle>
                  <FileQuestion className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +20% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">856</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Quizzes Taken
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,456</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">
                    +2% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "add-questions":
        return <QuestionForm />;

      case "take-quiz":
        return <QuizPlayer />;

      case "manage-quizzes":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Quizzes
              </h2>
              <p className="text-gray-600">
                View and manage all quiz categories
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">
                  Quiz management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "view-results":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">View Results</h2>
              <p className="text-gray-600">
                Analyze quiz performance and statistics
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">
                  Results analytics interface coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <UserHeader />
        <div className="flex-1 p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
