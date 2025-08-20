"use client";
import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Target,
  Rocket,
  ArrowRight,
  Zap,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/form-components/header";
import { useRouter } from "next/navigation";
import { SESSION_TEMPLATES } from "@/lib/constants";

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
  const router = useRouter();

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
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Header
          headerIcon={Trophy}
          headerText="Your Career Journey"
          headerDescription="Navigate through personalized sessions to unlock your career potential"
        />

        {/* progress dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* progress journey */}
          <Card className="p-4 bg-primary-green-50 border border-primary-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary-green-500 rounded-lg p-2 shrink-0">
                <BarChart3 className="size-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-primary-green-800 text-sm">
                  Progress
                </h3>
                <p className="text-primary-green-600 text-xs">Journey</p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-primary-green-700 mb-1">
                <span>Overall</span>
                <span className="font-bold">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              <Progress
                value={getProgressPercentage()}
                className="h-2 bg-primary-green-100"
              />
            </div>
            <p className="text-xs text-primary-green-600">
              {userProgress.completedSessions.length} of {sessions.length}{" "}
              sessions
            </p>
          </Card>

          {/*score points  */}
          <Card className="p-4 bg-primary-blue-50 to-primary-green-50/80 border border-primary-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary-blue-500 rounded-lg p-2 shrink-0">
                <Zap className="size-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-primary-blue-800 text-sm">
                  Score
                </h3>
                <p className="text-primary-blue-600 text-xs">Points</p>
              </div>
            </div>
            <div className="text-xl font-bold text-primary-blue-700 mb-1">
              {userProgress.totalScore}/900
            </div>
            <p className="text-xs text-primary-blue-600">Total earned</p>
          </Card>

          {/* current session */}
          <Card className="p-4 bg-primary-green-50 border border-primary-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary-green-500 rounded-lg p-2 shrink-0">
                <Target className="size-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-primary-green-800 text-sm">
                  Current
                </h3>
                <p className="text-primary-green-600 text-xs">Session</p>
              </div>
            </div>
            <div className="text-xl font-bold text-primary-green-700 mb-1">
              #{userProgress.currentSession}
            </div>
            <p className="text-xs text-primary-green-600">Active now</p>
          </Card>

          <Card className="p-4 bg-primary-blue-50 to-primary-green-50/80 border border-primary-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary-blue-500 rounded-lg p-2 shrink-0">
                <Calendar className="size-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-primary-blue-800 text-sm">
                  Last Active
                </h3>
                <p className="text-primary-blue-600 text-xs">Date</p>
              </div>
            </div>
            <div className="text-sm font-semibold text-primary-blue-700 mb-1">
              {new Date(userProgress.lastActiveDate).toLocaleDateString()}
            </div>
            <p className="text-xs text-primary-blue-600">Recent activity</p>
          </Card>
        </div>

        {/* journey timeline */}
        <div className="relative">
          {/* Timeline Line - Hidden on mobile, visible on larger screens */}
          <div className="absolute left-6 inset-y-0 w-0.5 bg-gradient-to-b from-primary-green-300 via-primary-blue-300 to-slate-300 rounded-full"></div>

          <div className="space-y-4">
            {sessions.map((session, index) => {
              const IconComponent = LucideIcons[session.icon];
              const isLocked = session.status === "locked";
              const isCurrent = session.status === "current";
              const isCompleted = session.status === "completed";

              return (
                <div key={session.id} className="relative">
                  {/* Mobile Layout */}

                  {/* Desktop Layout */}
                  <div className="flex items-start gap-6 group">
                    {/* Desktop Step Circle */}
                    <div
                      className={`relative z-10 flex items-center justify-center size-12 rounded-xl border-2 transition-all duration-300 shadow-lg shrink-0 ${
                        isCompleted
                          ? "bg-primary-green-500  border-primary-green-400 shadow-primary-green-200/50"
                          : isCurrent
                          ? "bg-primary-blue-500 border-primary-blue-400 shadow-primary-blue-200/50"
                          : "bg-white border-slate-300 shadow-slate-200/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="size-6 text-white" />
                      ) : isCurrent ? (
                        <IconComponent className="size-6 text-white" />
                      ) : (
                        <IconComponent
                          className={`size-6 ${
                            isLocked ? "text-slate-400" : "text-slate-600"
                          }`}
                        />
                      )}

                      {/* Pulse for current session */}
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-xl border-2 border-primary-blue-400 animate-ping opacity-50"></div>
                      )}
                    </div>

                    {/* Desktop Session Card */}
                    <div className="flex-1 min-w-0">
                      <Card
                        className={`relative overflow-hidden border transition-all duration-300 cursor-pointer ${
                          isLocked
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:shadow-md hover:scale-[1.01]"
                        } ${
                          isCompleted
                            ? "bg-primary-green-50/80 border-primary-green-200/50 shadow-sm"
                            : isCurrent
                            ? "bg-primary-blue-50/80 border-primary-blue-200/50 shadow-sm ring-1 ring-primary-blue-200/50"
                            : "bg-white/80 border-slate-200/50"
                        }`}
                        onClick={() => handleSessionClick(session.id)}
                      >
                        <div className="p-3 sm:p-6">
                          <div className="flex flex-col sm:items-start sm:justify-between gap-4 md:flex-row">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div
                                  className={`rounded-lg size-8 flex items-center justify-center text-sm font-bold ${
                                    isCompleted
                                      ? "bg-primary-green-100 text-primary-green-700"
                                      : isCurrent
                                      ? "bg-primary-blue-100 text-primary-blue-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {session.id}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {isCompleted && (
                                    <Badge className="bg-primary-green-100 text-primary-green-700 border-primary-green-300 text-xs px-2 py-0.5 hover:bg-primary-green-50">
                                      ✓ Completed
                                    </Badge>
                                  )}
                                  {isCurrent && (
                                    <Badge className="bg-primary-blue-100 text-primary-blue-700 border-primary-blue-300 text-xs px-2 py-0.5">
                                      ▶ Current
                                    </Badge>
                                  )}
                                  {isLocked && (
                                    <Badge className="bg-slate-100 text-slate-500 border-slate-300 text-xs px-2 py-0.5">
                                      🔒 Locked
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <h3
                                className={`text-lg font-bold mb-2 ${
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
                                className={`text-sm mb-3 leading-relaxed ${
                                  isLocked ? "text-slate-500" : "text-slate-600"
                                }`}
                              >
                                {session.description}
                              </p>

                              {/* Desktop Topics */}
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {session.topics
                                  .slice(0, 3)
                                  .map((topic, topicIndex) => (
                                    <span
                                      key={topicIndex}
                                      className={`px-2 py-1 rounded-md text-xs font-medium ${
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
                                {session.topics.length > 3 && (
                                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-500">
                                    +{session.topics.length - 3} more
                                  </span>
                                )}
                              </div>

                              {/* Desktop Session Stats */}
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <div
                                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                                    isLocked
                                      ? "bg-slate-100 text-slate-500"
                                      : "bg-white text-slate-600 border border-slate-200"
                                  }`}
                                >
                                  {/* <Clock className="size-3" /> */}
                                  {/* <span>{session.duration}</span> */}
                                </div>

                                {isCompleted && session.score && (
                                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-green-100 text-primary-green-700 border border-primary-green-200">
                                    <Star className="size-3 fill-current" />
                                    <span className="font-semibold">
                                      {/* {session.score}/100 */}
                                    </span>
                                  </div>
                                )}

                                {isCompleted && session.completedAt && (
                                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                    <Calendar className="size-3" />
                                    {/* <span>
                                      {new Date(
                                        session.completedAt
                                      ).toLocaleDateString()}
                                    </span> */}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Desktop Action Button */}
                            {!isLocked && (
                              <Button
                                size="sm"
                                className={`shrink-0 px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                                  isCompleted
                                    ? "bg-gradient-to-r from-primary-green-500 to-primary-blue-500 hover:from-primary-green-600 hover:to-primary-blue-600"
                                    : "bg-primary-blue-500  hover:bg-primary-blue-600"
                                } text-white border-0 shadow-sm hover:shadow-md`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSessionClick(session.id);
                                }}
                              >
                                <span className="flex items-center gap-1.5">
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

        {/* Responsive Motivational Footer */}
        {/* <Card className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-primary-green-50/80 via-primary-blue-50/80 to-slate-50/80 border border-slate-200/50 shadow-sm">
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
        </Card> */}
      </div>
    </div>
  );
};
