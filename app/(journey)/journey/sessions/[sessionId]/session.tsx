"use client";
import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  ChevronRight,
  Home,
  MessageCircle,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      { label: "Coaching", href: "/journey" },
    ];

    if (sessionData) {
      breadcrumbs.push({
        label: `Session ${sessionData.id + 1}: ${sessionData.title}`,
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
        <div className="px-3 py-2 bg-white border rounded-lg shadow-sm border-slate-200 sm:px-4 sm:py-3">
          <ol className="flex items-center space-x-1 sm:space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center">
                {index === 0 && (
                  <Home className="mr-1 size-4 text-slate-500 sm:mr-2" />
                )}

                {crumb.isActive ? (
                  <span className="text-sm sm:text-base font-semibold text-primary-blue-700 truncate max-w-[120px] sm:max-w-none">
                    {crumb.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      crumb.href && handleBreadcrumbClick(crumb.href)
                    }
                    className="text-sm sm:text-base text-slate-600 hover:text-primary-blue-700 transition-colors duration-200 font-medium truncate max-w-[100px] sm:max-w-none"
                  >
                    {crumb.label}
                  </button>
                )}

                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="mx-1 size-4 text-slate-400 sm:mx-2 shrink-0" />
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">
            Loading session details...
          </p>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <Card className="max-w-md p-6 mx-auto text-center sm:p-8">
          <h2 className="mb-2 text-lg font-bold sm:text-xl text-slate-800">
            Session Not Found
          </h2>
          <p className="mb-4 text-sm text-slate-600 sm:text-base">
            The requested session could not be found.
          </p>
          <Button
            onClick={() => handleBreadcrumbClick("/journey")}
            className="w-full bg-primary-blue-600 hover:bg-primary-blue-700 sm:w-auto"
            size="sm"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Journey
          </Button>
        </Card>
      </div>
    );
  }

  // Additional check for forms array
  if (!sessionData.forms) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <Card className="max-w-md p-6 mx-auto text-center sm:p-8">
          <h2 className="mb-2 text-lg font-bold sm:text-xl text-slate-800">
            Session Data Incomplete
          </h2>
          <p className="mb-4 text-sm text-slate-600 sm:text-base">
            This session doesn&apos;t have any forms configured.
          </p>
          <Button
            onClick={() => handleBreadcrumbClick("/journey")}
            className="w-full bg-primary-blue-600 hover:bg-primary-blue-700 sm:w-auto"
            size="sm"
          >
            <ArrowLeft className="mr-2 size-4" />
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

  // Filter forms into sections based on session
  const discussionFormIds = ["schedule-call", "feedback", "session-report"];
  const postSessionFormIds = [
    "post-coaching",
    "post-career-maturity",
    "post-psychological-wellbeing",
    "post-strength-difficulty",
  ];

  let activityForms: FormData[];
  let discussionForms: FormData[];
  let postSessionForms: FormData[];

  if (sessionId === 8) {
    // Session 8: 3 sections
    activityForms =
      sessionData?.forms?.filter(
        (form) =>
          !discussionFormIds.includes(form.id) &&
          !postSessionFormIds.includes(form.id)
      ) || [];
    discussionForms =
      sessionData?.forms?.filter((form) =>
        discussionFormIds.includes(form.id)
      ) || [];
    postSessionForms =
      sessionData?.forms?.filter((form) =>
        postSessionFormIds.includes(form.id)
      ) || [];
  } else {
    // Other sessions: 2 sections
    activityForms =
      sessionData?.forms?.filter(
        (form) => !discussionFormIds.includes(form.id)
      ) || [];
    discussionForms =
      sessionData?.forms?.filter((form) =>
        discussionFormIds.includes(form.id)
      ) || [];
    postSessionForms = [];
  }

  // Reusable form card component
  const FormCard = ({ form }: { form: FormData }) => {
    const FormIcon = (LucideIcons as any)[form.icon] || FileText;
    const isFormCompleted = form.status === "completed";
    const isFormUnlocked = checkFormStatus(form, sessionData?.forms || []);

    const cardStyles = isFormCompleted
      ? "bg-gradient-to-br from-primary-green-50 via-emerald-50 to-green-100 border-primary-green-300 hover:shadow-xl"
      : isFormUnlocked
      ? "bg-gradient-to-br from-primary-blue-50 via-cyan-50 to-blue-100 border-primary-blue-300 hover:shadow-xl"
      : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border-gray-300 opacity-75";

    const iconBg = isFormCompleted
      ? "bg-gradient-to-br from-primary-green-500 to-emerald-600 shadow-lg"
      : isFormUnlocked
      ? "bg-gradient-to-br from-primary-blue-500 to-cyan-600 shadow-lg"
      : "bg-gradient-to-br from-gray-400 to-gray-500";

    return (
      <Card
        key={form.id}
        className={`group relative overflow-hidden flex flex-col border-2 shadow-lg transition-all duration-300 rounded-xl ${cardStyles} ${
          isFormUnlocked
            ? "cursor-pointer hover:scale-[1.02]"
            : "cursor-not-allowed"
        }`}
        onClick={() => isFormUnlocked && handleFormClick(form.route)}
      >
        {/* Decorative top border */}
        <div
          className={`h-1 w-full ${
            isFormCompleted
              ? "bg-gradient-to-r from-primary-green-500 to-emerald-500"
              : isFormUnlocked
              ? "bg-gradient-to-r from-primary-blue-500 to-cyan-500"
              : "bg-gray-400"
          }`}
        />

        <CardHeader className="px-3 pt-3 pb-2">
          <div className="flex items-start gap-3">
            {/* Compact Icon */}
            <div
              className={`p-2 rounded-lg shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconBg}`}
            >
              {isFormCompleted ? (
                <CheckCircle className="text-white size-4" />
              ) : (
                <FormIcon className="text-white size-4" />
              )}
            </div>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-bold leading-tight mb-1 ${
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
                    className={`text-xs leading-relaxed ${
                      isFormUnlocked ? "text-slate-600" : "text-gray-400"
                    }`}
                  >
                    {form.description}
                  </p>
                </div>

                {/* Compact Status Badge */}
                <Badge
                  className={`text-xs font-medium px-2 py-1 shrink-0 ${
                    isFormCompleted
                      ? "bg-primary-green-100 text-primary-green-800 border-primary-green-300 hover:bg-inherit"
                      : isFormUnlocked
                      ? "bg-primary-blue-100 text-primary-blue-800 border-primary-blue-300 hover:bg-inherit"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                  }`}
                >
                  {isFormCompleted ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="size-3" />
                      Done
                    </span>
                  ) : isFormUnlocked ? (
                    <span className="flex items-center gap-1">
                      <div className="size-1.5 rounded-full bg-primary-blue-500 animate-pulse" />
                      Start
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <div className="size-1.5 rounded-full bg-yellow-500" />
                      Locked
                    </span>
                  )}
                </Badge>
              </div>

              {/* Estimated Time */}
              {form.estimatedTime && (
                <div className="mt-2 flex items-center gap-1.5">
                  <div
                    className={`size-1.5 rounded-full ${
                      isFormUnlocked ? "bg-primary-blue-400" : "bg-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isFormUnlocked ? "text-slate-600" : "text-gray-400"
                    }`}
                  >
                    {form.estimatedTime}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 px-3 pt-0 pb-3">
          {/* Topics (if available) */}
          {form.topics && form.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {form.topics.slice(0, 2).map((topic) => (
                <span
                  key={topic}
                  className={`px-1.5 py-0.5 rounded text-xs ${
                    isFormCompleted
                      ? "bg-primary-green-200 text-primary-green-800"
                      : isFormUnlocked
                      ? "bg-primary-blue-200 text-primary-blue-800"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {topic}
                </span>
              ))}
              {form.topics.length > 2 && (
                <span className="px-1.5 py-0.5 rounded text-xs bg-slate-200 text-slate-600">
                  +{form.topics.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Action Button - Always bottom right */}
          <div className="flex justify-end mt-auto">
            <Button
              disabled={!isFormUnlocked}
              className={`text-xs font-semibold transition-all duration-300 h-7 px-3 ${
                isFormCompleted
                  ? "bg-gradient-to-r from-primary-green-500 to-emerald-500 hover:from-primary-green-600 hover:to-emerald-600"
                  : isFormUnlocked
                  ? "bg-gradient-to-r from-primary-blue-500 to-cyan-500 hover:from-primary-blue-600 hover:to-cyan-600"
                  : "bg-gray-300 text-gray-500"
              } text-white border-0 active:scale-[0.98]`}
              onClick={(e) => {
                e.stopPropagation();
                isFormUnlocked && handleFormClick(form.route);
              }}
            >
              <span className="flex items-center gap-1">
                <span>
                  {isFormCompleted
                    ? "Review"
                    : isFormUnlocked
                    ? "Start"
                    : "Locked"}
                </span>
                <ChevronRight className="size-3 shrink-0" />
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const IconComponent = (LucideIcons as any)[sessionData.icon] || FileText; // Fallback icon
  console.log(IconComponent);
  const isCurrent = sessionData.status === "current";
  const isCompleted = sessionData.status === "completed";

  return (
    <div className="relative">
      <div className="max-w-6xl p-3 mx-auto sm:p-4 lg:px-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />

        <div className="p-3 bg-white border rounded-lg shadow-md sm:rounded-xl sm:p-4 border-slate-200">
          {/* Session Header */}
          <div className="mb-6">
            <div
              className={`relative overflow-hidden rounded-2xl p-6 border-2 shadow-xl transition-all duration-300 ${
                isCompleted
                  ? "bg-gradient-to-br from-primary-green-50 via-emerald-50 to-green-100 border-primary-green-300"
                  : "bg-gradient-to-br from-primary-blue-50 via-cyan-50 to-blue-100 border-primary-blue-300"
              }`}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 translate-x-16 -translate-y-16 rounded-full size-32 bg-gradient-to-br from-white to-transparent" />
                <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 rounded-full size-24 bg-gradient-to-tr from-white to-transparent" />
              </div>

              <div className="relative">
                {/* Header content with improved spacing */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  {/* Session info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        {/* Session number with enhanced styling */}
                        <div
                          className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                            isCompleted
                              ? "bg-primary-green-200 text-primary-green-800"
                              : "bg-primary-blue-200 text-primary-blue-800"
                          }`}
                        >
                          Session {sessionData.id + 1}
                        </div>

                        <h1
                          className={`text-xl sm:text-2xl lg:text-3xl font-bold leading-tight ${
                            isCompleted
                              ? "text-primary-green-800"
                              : isCurrent
                              ? "text-primary-blue-800"
                              : "text-slate-700"
                          }`}
                        >
                          {sessionData.title}
                        </h1>
                      </div>

                      {/* Status badges with improved styling */}
                      <div className="flex gap-2">
                        {isCompleted && (
                          <Badge className="bg-primary-green-100 text-primary-green-800 border-primary-green-300 text-sm px-3 py-1.5 font-semibold shadow-sm">
                            <CheckCircle className="mr-1 size-4" />
                            Completed
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge className="bg-primary-blue-100 text-primary-blue-800 border-primary-blue-300 text-sm px-3 py-1.5 font-semibold shadow-sm">
                            <div className="mr-1 rounded-full size-4 bg-primary-blue-500 animate-pulse" />
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description with better typography */}
                    <p className="max-w-4xl text-base leading-relaxed sm:text-lg text-slate-700">
                      {sessionData.description}
                    </p>
                  </div>

                  {/* Session icon (if available) */}
                  {sessionData.icon && (
                    <div
                      className={`p-4 rounded-xl shadow-lg ${
                        isCompleted
                          ? "bg-gradient-to-br from-primary-green-400 to-emerald-500"
                          : "bg-gradient-to-br from-primary-blue-400 to-cyan-500"
                      }`}
                    >
                      <IconComponent className="text-white size-8" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          {activityForms.length > 0 && (
            <div className="my-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary-green-100 to-emerald-100">
                  <FileText className="size-5 text-primary-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Assessments & Activities
                  </h2>
                  <p className="text-sm text-slate-600">
                    Complete the below section to continue your journey
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {activityForms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            </div>
          )}

          {/* Discussion Section */}
          {discussionForms.length > 0 && (
            <div className="my-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary-blue-100 to-cyan-100">
                  <MessageCircle className="size-5 text-primary-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Next Steps
                  </h2>
                  <p className="text-sm text-slate-600">
                    Book a one-on-one session, give feedback and receive your
                    session summaries
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {discussionForms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            </div>
          )}

          {/* Post Session Activity Section - Only for session 8 */}
          {sessionId === 8 && postSessionForms.length > 0 && (
            <div className="my-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-violet-100">
                  <Activity className="size-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Post Session Activity
                  </h2>
                  <p className="text-sm text-slate-600">
                    Complete these assessments to track your progress and growth
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {postSessionForms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            </div>
          )}

          {/* No forms message */}
          {(!sessionData.forms || sessionData.forms.length === 0) && (
            <div className="py-8 my-4 text-center sm:my-5">
              <p className="text-slate-500">
                No forms available for this session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionDetail;
