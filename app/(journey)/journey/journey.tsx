"use client";
import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  CheckCircle,
  Trophy,
  ArrowRight,
  BarChart3,
  Rocket,
  Download,
  Eye,
  FileText,
  Mail,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Header from "@/components/form-components/header";
import { useRouter } from "next/navigation";
import { SESSION_TEMPLATES } from "@/lib/constants";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { useSidebar } from "@/components/ui/sidebar";
import { SimpleViewDialog } from "@/components/simple-view-dialog";

interface UserProgress {
  userId: string;
  currentSession: number;
  completedSessions: number[];
  totalScore: number;
  lastActiveDate: string;
}

export const JourneyPage: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [sessions, setSessions] = useState(SESSION_TEMPLATES);
  const [loading, setLoading] = useState(true);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const router = useRouter();
  const { isMobile } = useSidebar();

  useEffect(() => {
    console.log("in journey");
    const fetchUserProgress = async () => {
      const res = await fetch("/api/journey", { method: "GET" });
      console.log(res);
      if (!res.ok) {
        setUserProgress(null);
        setLoading(false);
        return;
      }
      const data: UserProgress = await res.json();
      setUserProgress(data);

      // Build sessions with updated status
      const updatedSessions = SESSION_TEMPLATES.map((session) => {
        if (data.completedSessions.includes(session.id)) {
          return { ...session, status: "completed" as const };
        } else if (session.id === data.currentSession) {
          return { ...session, status: "current" as const };
        } else {
          return { ...session, status: "locked" as const };
        }
      });
      setSessions(updatedSessions);
      setLoading(false);
    };
    fetchUserProgress();
  }, []);

  if (loading || userProgress === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading journey details...</p>
        </div>
      </div>
    );
  }

  const handleSessionClick = (sessionId: number) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session?.status === "locked") {
      return;
    }

    console.log(`Opening session ${sessionId}`);
    router.push(`journey/sessions/${sessionId}`);
  };

  const getProgressPercentage = () => {
    return (userProgress.completedSessions.length / sessions.length) * 100;
  };

  return (
    <div className="p-2">
      {isMobile ? <SidebarToggle /> : <div />}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Header
          headerIcon={Trophy}
          headerText="Your Career Journey"
          headerDescription="Navigate through personalized sessions to unlock your career potential"
        />

        {/* progress dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          {/* progress journey */}
          <Card className="p-4 bg-white border-primary-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary-green-500 rounded-lg p-2 shrink-0">
                <BarChart3 className="size-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-primary-green-800 text-sm">
                  Journey Progress
                </h3>
                <p className="text-xs text-primary-green-700">
                  Get snippet of your Journey Status
                </p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-primary-green-700 mb-1">
                <span>Status</span>
                <span className="font-bold">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              <Progress
                value={getProgressPercentage()}
                className="h-2 bg-primary-green-100"
              />
              <div className="flex items-center justify-between text-xs text-primary-green-700 mt-1 pt-1">
                <span className="">
                  Active Session #{userProgress.currentSession + 1}
                </span>
                <span className="">
                  Latest activity on{" "}
                  {new Date(userProgress.lastActiveDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
          {/* revise your journey */}
          <Card className="p-4 bg-white border-primary-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary-green-500 rounded-lg p-2 shrink-0">
                <FileText className="size-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-primary-green-800 text-sm">
                  Journey Insights
                </h3>
                <p className="text-xs text-primary-green-700">
                  Download and view your journey insights
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Download Section */}
              <Dialog
                open={isDownloadDialogOpen}
                onOpenChange={setIsDownloadDialogOpen}
              >
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-3 bg-primary-green-50/50 rounded-lg border border-primary-green-200/30 cursor-pointer hover:bg-primary-green-100/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <Download className="size-4 text-primary-green-600" />
                      <span className="text-sm font-medium text-primary-green-800">
                        Download Section
                      </span>
                    </div>
                    <ArrowRight className="size-4 text-primary-green-600" />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-lg font-semibold text-slate-800">
                      Download Important Insights
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    <Button
                      disabled
                      className="w-full justify-start gap-3 p-4 h-auto bg-slate-100 text-slate-500 border-slate-200"
                    >
                      <FileText className="size-5" />
                      <div className="text-left">
                        <div className="font-medium">Self Analysis Report</div>
                        <div className="text-xs text-slate-400">
                          Comprehensive self-assessment
                        </div>
                      </div>
                    </Button>
                    <Button
                      disabled
                      className="w-full justify-start gap-3 p-4 h-auto bg-slate-100 text-slate-500 border-slate-200"
                    >
                      <Mail className="size-5" />
                      <div className="text-left">
                        <div className="font-medium">Letter from Future</div>
                        <div className="text-xs text-slate-400">
                          Your future self&apos;s perspective
                        </div>
                      </div>
                    </Button>
                    <Button
                      disabled
                      className="w-full justify-start gap-3 p-4 h-auto bg-slate-100 text-slate-500 border-slate-200"
                    >
                      <ImageIcon className="size-5" />
                      <div className="text-left">
                        <div className="font-medium">Final Story Board</div>
                        <div className="text-xs text-slate-400">
                          Visual journey representation
                        </div>
                      </div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* View Section */}
              <button
                type="button"
                className="flex items-center justify-between p-3 bg-primary-blue-50/50 rounded-lg border border-primary-blue-200/30 cursor-pointer hover:bg-primary-blue-100/50 transition-colors duration-200 w-full"
                onClick={() => {
                  setIsViewDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-primary-blue-600" />
                  <span className="text-sm font-medium text-primary-blue-800">
                    View Section
                  </span>
                </div>
                <ArrowRight className="size-4 text-primary-blue-600" />
              </button>
            </div>
          </Card>
        </div>

        {/* journey timeline */}
        <div className="relative mb-6 pb-6">
          {/* Timeline Line */}
          <div className="absolute left-5 inset-y-0 w-0.5 bg-gradient-to-b from-primary-green-300 via-primary-blue-300 to-slate-300 rounded-full" />

          <div className="space-y-2">
            {sessions.map((session, index) => {
              const IconComponent = (LucideIcons as any)[session.icon];
              const isLocked = session.status === "locked";
              const isCurrent = session.status === "current";
              const isCompleted = session.status === "completed";

              return (
                <div key={session.id} className="relative">
                  <div className="flex items-start gap-4 group">
                    {/* Step Circle */}
                    <div
                      className={`relative z-10 flex items-center justify-center size-10 rounded-lg border-2 transition-all duration-300 shadow-md shrink-0 ${
                        isCompleted
                          ? "bg-primary-green-500 border-primary-green-400 shadow-primary-green-200/50"
                          : isCurrent
                          ? "bg-primary-blue-500 border-primary-blue-400 shadow-primary-blue-200/50"
                          : "bg-white border-slate-300 shadow-slate-200/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="size-5 text-white" />
                      ) : isCurrent ? (
                        <IconComponent className="size-5 text-white" />
                      ) : (
                        <IconComponent
                          className={`size-5 ${
                            isLocked ? "text-slate-400" : "text-slate-600"
                          }`}
                        />
                      )}

                      {/* Pulse for current session */}
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-lg border-2 border-primary-blue-400 animate-ping opacity-50" />
                      )}
                    </div>

                    {/* Session Card */}
                    <div className="flex-1 min-w-0">
                      <Card
                        className={`relative overflow-hidden border transition-all duration-300 cursor-pointer ${
                          isLocked
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:shadow-md hover:scale-[1.01]"
                        } ${
                          isCompleted
                            ? "bg-white border-primary-green-200/50 shadow-sm"
                            : isCurrent
                            ? "bg-primary-blue-50/80 border-primary-blue-200/50 shadow-sm ring-1 ring-primary-blue-200/50"
                            : "bg-white/80 border-slate-200/50"
                        }`}
                        onClick={() => handleSessionClick(session.id)}
                      >
                        <div className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <div
                                  className={`rounded-md px-2 py-1 flex items-center justify-center text-xs font-bold ${
                                    isCompleted
                                      ? "bg-primary-green-500 text-white"
                                      : isCurrent
                                      ? "bg-primary-blue-500 text-white"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  Session {session.id + 1}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {isCompleted && (
                                    <Badge className="bg-primary-green-100 text-primary-green-700 border-primary-green-300 text-xs px-1.5 py-0.5">
                                      ✓ Completed
                                    </Badge>
                                  )}
                                  {isCurrent && (
                                    <Badge className="bg-primary-blue-100 text-primary-blue-700 border-primary-blue-300 text-xs px-1.5 py-0.5">
                                      ▶ Current
                                    </Badge>
                                  )}
                                  {isLocked && (
                                    <Badge className="bg-slate-100 text-slate-500 border-slate-300 text-xs px-1.5 py-0.5">
                                      🔒 Locked
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <h3
                                className={`text-base font-bold mb-1.5 ${
                                  isCompleted
                                    ? "text-primary-green-800"
                                    : isCurrent
                                    ? "text-primary-blue-800"
                                    : "text-slate-700"
                                }`}
                              >
                                {session.title}
                              </h3>

                              <p
                                className={`text-sm mb-2 leading-relaxed line-clamp-2 ${
                                  isLocked ? "text-slate-500" : "text-slate-600"
                                }`}
                              >
                                {session.description}
                              </p>

                              {/* Topics */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {session.topics.slice(0, 5).map((topic) => (
                                  <span
                                    key={topic}
                                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                      isCompleted
                                        ? "bg-primary-green-100 text-primary-green-700"
                                        : isCurrent
                                        ? "bg-primary-blue-100 text-primary-blue-700"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {topic}
                                  </span>
                                ))}
                                {session.topics.length > 5 && (
                                  <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                                    +{session.topics.length - 5}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Button */}
                            {!isLocked && (
                              <Button
                                size="sm"
                                className={`shrink-0 px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                                  isCompleted
                                    ? "bg-gradient-to-r from-primary-green-500 to-primary-blue-500 hover:from-primary-green-600 hover:to-primary-blue-600"
                                    : "bg-primary-blue-500 hover:bg-primary-blue-600"
                                } text-white border-0 shadow-sm hover:shadow-md`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSessionClick(session.id);
                                }}
                              >
                                <span className="flex items-center gap-1">
                                  {isCompleted
                                    ? "Review"
                                    : isCurrent
                                    ? "Continue"
                                    : "Start"}
                                  <ArrowRight className="size-3" />
                                </span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Responsive Footer for check-in session book */}
        <Card className="my-8 p-4 sm:p-6 bg-gradient-to-r from-primary-green-50/80 via-primary-blue-50/80 to-slate-50/80 border border-slate-200/50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="hidden sm:block bg-gradient-to-r from-primary-green-500 to-primary-blue-500 rounded-xl p-3 shadow-sm shrink-0">
              <Rocket className="size-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                Keep Moving Forward! 🚀
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                You&apos;re making great progress on your career journey!
                {userProgress.currentSession < 9
                  ? ` Complete Session ${userProgress.currentSession} to unlock the next step.`
                  : " You're almost at the finish line!"}
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-green-600 to-primary-blue-600 bg-clip-text text-transparent">
                {Math.round(getProgressPercentage())}%
              </div>
              <p className="text-slate-600 text-xs font-medium">Complete</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Simple View Dialog */}
      <SimpleViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </div>
  );
};
