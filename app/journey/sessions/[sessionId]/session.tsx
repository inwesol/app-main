"use client";
import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Star,
  Target,
  Lock,
  Calendar,
  BarChart3,
  ChevronRight,
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
  status: "completed" | "in-progress" | "not-started";
  completedAt?: string;
  score?: number;
  icon: string;
  route: string;
  topics: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface SessionDetailData {
  id: number;
  title: string;
  description: string;
  totalDuration: string;
  icon: string;
  status: "completed" | "current" | "locked";
  completedAt?: string;
  overallScore?: number;
  topics: string[];
  forms: FormData[];
  learningObjectives: string[];
  prerequisites?: string[];
}

export const SessionDetail: React.FC = () => {
  const params = useParams();
  const sessionId = Number(params.sessionId);

  const [sessionData, setSessionData] = useState<SessionDetailData | null>(
    null
  );

  console.log("sessionData:", sessionData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/journey/sessions/${sessionId}`);

        if (res.ok) {
          const data = await res.json();
          setSessionData(data);
          console.log("Data:", data);
        } else {
          setSessionData(null);
        }
      } catch {
        setSessionData(null);
      } finally {
        setLoading(false);
      }
    };
    if (!Number.isNaN(sessionId)) {
      fetchSessionData();
    }
  }, [sessionId]);

  const handleFormClick = (formId: string) => {
    router.push(`/journey/sessions/${sessionId}/q/${formId}`);
  };

  const handleBackToJourney = () => {
    console.log("Back to journey");
    router.push("/journey");
  };

  const getFormProgress = () => {
    if (!sessionData) return 0;
    const completedForms = sessionData.forms.filter(
      (form) => form.status === "completed"
    ).length;
    return (completedForms / sessionData.forms.length) * 100;
  };

  const getOverallScore = () => {
    if (!sessionData) return 0;
    const completedForms = sessionData.forms.filter(
      (form) => form.status === "completed" && form.score
    );
    if (completedForms.length === 0) return 0;
    const totalScore = completedForms.reduce(
      (sum, form) => sum + (form.score || 0),
      0
    );
    return Math.round(totalScore / completedForms.length);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-primary-green-100 text-primary-green-700 border-primary-green-200";
      case "intermediate":
        return "bg-primary-blue-100 text-primary-blue-700 border-primary-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
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
            onClick={handleBackToJourney}
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

  const IconComponent = LucideIcons[sessionData.icon];
  console.log(IconComponent);
  const isCurrent = sessionData.status === "current";
  const isCompleted = sessionData.status === "completed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
      <div className="max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToJourney}
            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 sm:p-3"
            size="sm"
          >
            <ArrowLeft className="size-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back to Journey</span>
          </Button>
        </div>

        {/* Session Header */}
        <div className="mb-6 sm:mb-8">
          <div
            className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border shadow-lg ${
              isCompleted
                ? "bg-gradient-to-r from-primary-green-50 to-emerald-50 border-primary-green-200"
                : isCurrent
                ? "bg-gradient-to-r from-primary-blue-50 to-cyan-50 border-primary-blue-200"
                : "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div
                className={`hidden sm:block p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shrink-0 ${
                  isCompleted
                    ? "bg-gradient-to-r from-primary-green-500 to-emerald-500"
                    : isCurrent
                    ? "bg-gradient-to-r from-primary-blue-500 to-cyan-500"
                    : "bg-gradient-to-r from-slate-400 to-gray-400"
                }`}
              >
                <IconComponent className="size-6 sm:size-8 text-white" />
              </div>

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

                <p className="text-sm sm:text-base lg:text-lg mb-4 text-slate-700 leading-relaxed">
                  {sessionData.description}
                </p>

                {/* Session Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white/60 rounded-lg p-2.5 sm:p-3 border border-white/40">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <Clock className="size-3 sm:size-4 text-slate-600" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700">
                        Duration
                      </span>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-800">
                      {sessionData.totalDuration}
                    </p>
                  </div>

                  <div className="bg-white/60 rounded-lg p-2.5 sm:p-3 border border-white/40">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <FileText className="size-3 sm:size-4 text-slate-600" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700">
                        Forms
                      </span>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-800">
                      {sessionData.forms.length}
                    </p>
                  </div>

                  <div className="bg-white/60 rounded-lg p-2.5 sm:p-3 border border-white/40">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <BarChart3 className="size-3 sm:size-4 text-slate-600" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700">
                        Progress
                      </span>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-800">
                      {Math.round(getFormProgress())}%
                    </p>
                  </div>

                  {isCompleted && (
                    <div className="bg-white/60 rounded-lg p-2.5 sm:p-3 border border-white/40 ">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <Star className="size-3 sm:size-4 text-slate-600" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Score
                        </span>
                      </div>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-800">
                        {getOverallScore()}/100
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        {sessionData.prerequisites && sessionData.prerequisites.length > 0 && (
          <Card className="mb-6 sm:mb-8 bg-amber-50 border-amber-200">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-amber-800 flex items-center gap-2 text-base sm:text-lg">
                <Lock className="size-4 sm:size-5" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {sessionData.prerequisites.map((prerequisite, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-amber-700 text-sm sm:text-base"
                  >
                    <div className="size-2 bg-amber-500 rounded-full mt-1.5 sm:mt-2 shrink-0"></div>
                    <span className="leading-relaxed">{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Learning Objectives */}
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

        {/* Forms Grid */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <FileText className="size-5 sm:size-6 text-primary-green-600" />
            Session Forms
          </h2>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {sessionData.forms.map((form, index) => {
              const FormIcon = LucideIcons[form.icon];
              console.log(FormIcon);
              const isFormCompleted = form.status === "completed";
              console.log("isFormCompleted:", isFormCompleted);
              const isFormInProgress = form.status === "in-progress";
              const isFormNotStarted = form.status === "not-started";

              return (
                <Card
                  key={form.id}
                  className={`relative overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-lg active:scale-[0.98] sm:hover:scale-[1.02] ${
                    isFormCompleted
                      ? "bg-gradient-to-br from-primary-green-50 to-emerald-50 border-primary-green-200 shadow-md"
                      : isFormInProgress
                      ? "bg-gradient-to-br from-primary-blue-50 to-cyan-50 border-primary-blue-200 shadow-md ring-2 ring-primary-blue-200/50"
                      : "bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-primary-blue-300"
                  }`}
                  onClick={() => handleFormClick(form.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div
                          className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-md shrink-0 ${
                            isFormCompleted
                              ? "bg-gradient-to-r from-primary-green-500 to-emerald-500"
                              : isFormInProgress
                              ? "bg-gradient-to-r from-primary-blue-500 to-cyan-500"
                              : "bg-gradient-to-r from-primary-blue-400 to-cyan-400"
                          }`}
                        >
                          {isFormCompleted ? (
                            <CheckCircle className="size-5 sm:size-6 text-white" />
                          ) : (
                            <FormIcon className="size-5 sm:size-6 text-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 mb-2">
                            <h3
                              className={`text-base sm:text-lg font-bold leading-tight ${
                                isFormCompleted
                                  ? "text-primary-green-800"
                                  : isFormInProgress
                                  ? "text-primary-blue-800"
                                  : "text-slate-700"
                              }`}
                            >
                              {form.title}
                            </h3>

                            <Badge
                              className={`text-xs w-fit ${getDifficultyColor(
                                form.difficulty
                              )}`}
                            >
                              {form.difficulty}
                            </Badge>
                          </div>

                          <p className="text-xs sm:text-sm mb-3 leading-relaxed text-slate-600">
                            {form.description}
                          </p>

                          {/* Form Topics */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {form.topics
                              .slice(0, window.innerWidth < 640 ? 2 : 3)
                              .map((topic, topicIndex) => (
                                <span
                                  key={topicIndex}
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    isFormCompleted
                                      ? "bg-primary-green-100 text-primary-green-700"
                                      : isFormInProgress
                                      ? "bg-primary-blue-100 text-primary-blue-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {topic}
                                </span>
                              ))}
                            {form.topics.length >
                              (window.innerWidth < 640 ? 2 : 3) && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-500">
                                +
                                {form.topics.length -
                                  (window.innerWidth < 640 ? 2 : 3)}
                              </span>
                            )}
                          </div>

                          {/* Form Stats */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white text-slate-600 border border-slate-200">
                              <Clock className="size-3" />
                              <span>{form.estimatedTime}</span>
                            </div>

                            {isFormCompleted && form.score && (
                              <div className="flex items-center gap-1 px-2 py-1 rounded bg-primary-green-100 text-primary-green-700 border border-primary-green-200">
                                <Star className="size-3 fill-current" />
                                <span className="font-semibold">
                                  {form.score}/100
                                </span>
                              </div>
                            )}

                            {isFormCompleted && form.completedAt && (
                              <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                <Calendar className="size-3" />
                                <span className="hidden sm:inline">
                                  {new Date(
                                    form.completedAt
                                  ).toLocaleDateString()}
                                </span>
                                <span className="sm:hidden">
                                  {new Date(
                                    form.completedAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        {isFormCompleted && (
                          <Badge className="bg-primary-green-100 text-primary-green-700 border-primary-green-300 text-xs">
                            ✓ Done
                          </Badge>
                        )}
                        {isFormInProgress && (
                          <Badge className="bg-primary-blue-100 text-primary-blue-700 border-primary-blue-300 text-xs">
                            ▶ Active
                          </Badge>
                        )}
                        {isFormNotStarted && (
                          <Badge className="bg-slate-100 text-slate-600 border-slate-300 text-xs">
                            Start
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Button
                      className={`w-full text-xs sm:text-sm font-semibold transition-all duration-300 h-9 sm:h-10 ${
                        isFormCompleted
                          ? "bg-gradient-to-r from-primary-green-500 to-emerald-500 hover:from-primary-green-600 hover:to-emerald-600"
                          : "bg-gradient-to-r from-primary-blue-500 to-cyan-500 hover:from-primary-blue-600 hover:to-cyan-600"
                      } text-white border-0 shadow-sm hover:shadow-md active:scale-[0.98]`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFormClick(form.id);
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="truncate">
                          {isFormCompleted
                            ? "Review Form"
                            : isFormInProgress
                            ? "Continue Form"
                            : "Start Form"}
                        </span>
                        <ChevronRight className="size-3 sm:size-4 shrink-0" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Session Progress */}
        <Card className="bg-gradient-to-r from-primary-green-50/80 via-primary-blue-50/80 to-slate-50/80 border border-slate-200/50 shadow-sm">
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
                  {
                    sessionData.forms.filter((f) => f.status === "completed")
                      .length
                  }{" "}
                  of {sessionData.forms.length} forms completed
                </p>
              </div>
              {isCompleted && (
                <div className="text-center sm:text-right shrink-0 w-full sm:w-auto">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-green-600 to-primary-blue-600 bg-clip-text text-transparent">
                    {getOverallScore()}/100
                  </div>
                  <p className="text-slate-600 text-xs font-medium">
                    Overall Score
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionDetail;
