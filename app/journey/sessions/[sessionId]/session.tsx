"use client";
import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Target,
  BarChart3,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter } from "next/navigation";

interface FormData {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  status: "completed" | "not-completed";
  completedAt?: string;
  score?: number;
  icon: string;
  route: string;
  topics: string[];
  prerequisites?: string[];
  // difficulty: "beginner" | "intermediate" | "advanced";
}

interface SessionDetailData {
  id: number;
  title: string;
  description: string;
  totalDuration: string;
  icon: string;
  status: "completed" | "current" | "locked";
  completedAt?: string;
  topics: string[];
  forms: FormData[];
  learningObjectives: string[];
  prerequisites?: string[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export function SessionDetail() {
  const params = useParams();
  const sessionId = Number(params.sessionId);
  const [sessionData, setSessionData] = useState<SessionDetailData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/journey/sessions/${sessionId}`);

        if (res.ok) {
          const data = await res.json();
          console.log("API Response:", data);
          console.log("Forms array:", data.forms);
          setSessionData(data);
        } else {
          setSessionData(null);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
        setSessionData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionData();
  }, [sessionId]);

  console.log("session data: ", sessionData);

  const handleFormClick = (formRoute: string) => {
    console.log("formRoute: ", formRoute);
    router.push(formRoute);
  };

  const handleBreadcrumbClick = (href: string) => {
    console.log("Navigate to: ", href);
    router.push(href);
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/" },
      { label: "Career Journey", href: "/journey" },
    ];

    if (sessionData) {
      breadcrumbs.push({
        label: `Session ${sessionData.id}: ${sessionData.title}`,
        isActive: true,
      });
    }

    return breadcrumbs;
  };

  const getFormProgress = () => {
    if (!sessionData || !sessionData.forms || sessionData.forms.length === 0) {
      return 0;
    }
    const completedForms = sessionData.forms.filter(
      (form) => form.status === "completed"
    ).length;
    return (completedForms / sessionData.forms.length) * 100;
  };

  const BreadcrumbNavigation = () => {
    const breadcrumbs = getBreadcrumbs();

    return (
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
        <div className="bg-white rounded-lg border border-slate-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
          <ol className="flex items-center space-x-1 sm:space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index === 0 && (
                  <Home className="size-4 text-slate-500 mr-1 sm:mr-2" />
                )}

                {crumb.isActive ? (
                  <span className="text-sm sm:text-base font-semibold text-primary-blue-700 truncate max-w-[120px] sm:max-w-none">
                    {crumb.label}
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      crumb.href && handleBreadcrumbClick(crumb.href)
                    }
                    className="text-sm sm:text-base text-slate-600 hover:text-primary-blue-700 transition-colors duration-200 font-medium truncate max-w-[100px] sm:max-w-none"
                  >
                    {crumb.label}
                  </button>
                )}

                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="size-4 text-slate-400 mx-1 sm:mx-2 shrink-0" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">
            Loading session details...
          </p>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto p-6 sm:p-8 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
            Session Not Found
          </h2>
          <p className="text-slate-600 mb-4 text-sm sm:text-base">
            The requested session could not be found.
          </p>
          <Button
            onClick={() => handleBreadcrumbClick("/journey")}
            className="bg-primary-blue-600 hover:bg-primary-blue-700 w-full sm:w-auto"
            size="sm"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Journey
          </Button>
        </Card>
      </div>
    );
  }

  // Additional check for forms array
  if (!sessionData.forms) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto p-6 sm:p-8 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
            Session Data Incomplete
          </h2>
          <p className="text-slate-600 mb-4 text-sm sm:text-base">
            This session doesn&apos;t have any forms configured.
          </p>
          <Button
            onClick={() => handleBreadcrumbClick("/journey")}
            className="bg-primary-blue-600 hover:bg-primary-blue-700 w-full sm:w-auto"
            size="sm"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Journey
          </Button>
        </Card>
      </div>
    );
  }

  const checkFormStatus = (form: FormData, allForms: FormData[]) => {
    if (!form.prerequisites || form.prerequisites.length === 0) {
      return true;
    }

    // Check if all prerequisite forms are completed
    return form.prerequisites.every((prereqId) => {
      const prereqForm = allForms.find((f) => f.id === prereqId);
      console.log("for each form status: ", prereqForm?.status === "completed");
      console.log("asdf", prereqForm?.status);
      return prereqForm?.status === "completed";
    });
  };

  const IconComponent = (LucideIcons as any)[sessionData.icon] || FileText; // Fallback icon
  console.log(IconComponent);
  const isCurrent = sessionData.status === "current";
  const isCompleted = sessionData.status === "completed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
      <div className="max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />

        <div className="bg-white sm:rounded-xl rounded-lg p-4 sm:p-6 shadow-md border border-slate-200">
          {/* Session Header */}
          <div className="mb-6 sm:mb-8">
            <div
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border shadow-lg ${
                isCompleted
                  ? "bg-gradient-to-r from-primary-green-50 to-emerald-50 border-primary-green-200"
                  : "bg-gradient-to-r from-primary-blue-50 to-cyan-50 border-primary-blue-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex-1 w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                    <h1
                      className={`text-xl sm:text-2xl lg:text-3xl font-bold leading-tight ${
                        isCompleted
                          ? "text-primary-green-800"
                          : isCurrent
                          ? "text-primary-blue-800"
                          : "text-slate-700"
                      }`}
                    >
                      Session {sessionData.id}: {sessionData.title}
                    </h1>

                    <div className="flex gap-2">
                      {isCompleted && (
                        <Badge className="bg-primary-green-100 text-primary-green-700 border-primary-green-300 text-xs">
                          ✓ Completed
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge className="bg-primary-blue-100 text-primary-blue-700 border-primary-blue-300 text-xs">
                          ▶ Current
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">
                    {sessionData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          {sessionData.learningObjectives &&
            sessionData.learningObjectives.length > 0 && (
              <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-primary-blue-50/50 to-cyan-50/50 border-primary-blue-200/50">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-primary-blue-800 flex items-center gap-2 text-base sm:text-lg">
                    <Target className="size-4 sm:size-5" />
                    Learning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 sm:space-y-4">
                    {sessionData.learningObjectives.map((objective, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-primary-blue-700"
                      >
                        <div className="size-5 sm:size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                          {index + 1}
                        </div>
                        <span className="leading-relaxed text-sm sm:text-base">
                          {objective}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {/* Session Progress */}
          <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-primary-green-50/80 via-primary-blue-50/80 to-slate-50/80 border border-slate-200/50 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="bg-gradient-to-r from-primary-green-500 to-primary-blue-500 rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-sm shrink-0 hidden sm:block">
                  <BarChart3 className="size-5 sm:size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2">
                    Session Progress
                  </h3>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 mb-1">
                      <span>Forms Completed</span>
                      <span className="font-semibold">
                        {Math.round(getFormProgress())}%
                      </span>
                    </div>
                    <Progress
                      value={getFormProgress()}
                      className="h-2 bg-slate-200"
                    />
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {sessionData?.forms?.filter((f) => f.status === "completed")
                      ?.length || 0}{" "}
                    of {sessionData?.forms?.length || 0} forms completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forms Grid */}
          <div className="my-6 sm:my-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <FileText className="size-5 sm:size-6 text-primary-green-600" />
              Session Forms
            </h2>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {sessionData.forms && sessionData.forms.length > 0 ? (
                sessionData.forms.map((form) => {
                  const FormIcon = (LucideIcons as any)[form.icon] || FileText; // Fallback icon
                  const isFormCompleted = form.status === "completed";
                  const isFormUnlocked = checkFormStatus(
                    form,
                    sessionData.forms
                  );

                  const cardStyles = isFormCompleted
                    ? "bg-gradient-to-br from-primary-green-50 to-emerald-50 border-primary-green-200"
                    : isFormUnlocked
                    ? "bg-gradient-to-br from-primary-blue-50 to-cyan-50 border-primary-blue-200"
                    : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 opacity-70";

                  const iconBg = isFormCompleted
                    ? "bg-gradient-to-r from-primary-green-500 to-emerald-500"
                    : isFormUnlocked
                    ? "bg-gradient-to-r from-primary-blue-500 to-cyan-500"
                    : "bg-gray-300";

                  return (
                    <Card
                      key={form.id}
                      className={`relative overflow-hidden flex flex-col border shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg justify-between ${cardStyles} ${
                        isFormUnlocked ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                      onClick={() =>
                        isFormUnlocked && handleFormClick(form.route)
                      }
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          {/* Icon */}
                          <div
                            className={`p-3 rounded-lg shadow-md shrink-0 ${iconBg}`}
                          >
                            {isFormCompleted ? (
                              <CheckCircle className="size-6 text-white" />
                            ) : (
                              <FormIcon className="size-6 text-white" />
                            )}
                          </div>

                          {/* Title & Description */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`text-lg font-bold truncate ${
                                isFormCompleted
                                  ? "text-primary-green-800"
                                  : isFormUnlocked
                                  ? "text-primary-blue-800"
                                  : "text-gray-500"
                              }`}
                            >
                              {form.title}
                            </h3>
                            <p
                              className={`text-sm mt-1 ${
                                isFormUnlocked
                                  ? "text-slate-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {form.description}
                            </p>

                            {/* Topics */}
                            {form.topics && form.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {form.topics
                                  .slice(
                                    0,
                                    typeof window !== "undefined" &&
                                      window.innerWidth < 640
                                      ? 2
                                      : 3
                                  )
                                  .map((topic, idx) => (
                                    <span
                                      key={idx}
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        isFormCompleted
                                          ? "bg-primary-green-100 text-primary-green-700"
                                          : isFormUnlocked
                                          ? "bg-primary-blue-100 text-primary-blue-700"
                                          : "bg-gray-200 text-gray-500"
                                      }`}
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                {form.topics.length >
                                  (typeof window !== "undefined" &&
                                  window.innerWidth < 640
                                    ? 2
                                    : 3) && (
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-500">
                                    +
                                    {form.topics.length -
                                      (typeof window !== "undefined" &&
                                      window.innerWidth < 640
                                        ? 2
                                        : 3)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Status Badge */}
                          <Badge
                            className={`text-xs ${
                              isFormCompleted
                                ? "bg-primary-green-100 text-primary-green-700  hover:bg-primary-green-50 border-primary-green-300"
                                : isFormUnlocked
                                ? "bg-primary-blue-100 text-primary-blue-700 border-primary-blue-300 hover:bg-primary-blue-50"
                                : "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-50"
                            }`}
                          >
                            {isFormCompleted
                              ? "✓ Done"
                              : isFormUnlocked
                              ? "🚀 Start"
                              : "🔒 Locked"}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <Button
                          disabled={!isFormUnlocked}
                          className={`w-full text-sm font-semibold transition-all duration-300 h-10 ${
                            isFormCompleted
                              ? "bg-gradient-to-r from-primary-green-500 to-emerald-500 hover:from-primary-green-600 hover:to-emerald-600"
                              : isFormUnlocked
                              ? "bg-gradient-to-r from-primary-blue-500 to-cyan-500 hover:from-primary-blue-600 hover:to-cyan-600"
                              : "bg-gray-300 text-gray-500"
                          } text-white border-0 shadow-sm hover:shadow-md active:scale-[0.98]`}
                          onClick={(e) => {
                            e.stopPropagation();
                            isFormUnlocked && handleFormClick(form.route);
                          }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span className="truncate">
                              {isFormCompleted
                                ? "Review Form"
                                : isFormUnlocked
                                ? "Start"
                                : "Locked"}
                            </span>
                            <ChevronRight className="size-4 shrink-0" />
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-500">
                    No forms available for this session.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetail;
