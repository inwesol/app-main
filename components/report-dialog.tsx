"use client";

import { useState, useEffect } from "react";
import {
  X,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
  User,
  Wrench,
  Microscope,
  Palette,
  Heart,
  Briefcase,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// RIASEC category mapping with icons and colors
const RIASEC_CATEGORIES = {
  R: {
    name: "Realistic",
    description: "Hands-on, practical work with tools, machines, or nature",
    icon: Wrench,
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    iconBg: "bg-blue-500",
  },
  I: {
    name: "Investigative",
    description: "Scientific, analytical, and research-oriented work",
    icon: Microscope,
    color: "green",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    iconBg: "bg-green-500",
  },
  A: {
    name: "Artistic",
    description: "Creative, expressive, and aesthetic work",
    icon: Palette,
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    iconBg: "bg-purple-500",
  },
  S: {
    name: "Social",
    description: "Helping, teaching, and working with people",
    icon: Heart,
    color: "pink",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-700",
    iconBg: "bg-pink-500",
  },
  E: {
    name: "Enterprising",
    description: "Leadership, persuasion, and business-oriented work",
    icon: Briefcase,
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
    iconBg: "bg-orange-500",
  },
  C: {
    name: "Conventional",
    description: "Organized, detail-oriented, and systematic work",
    icon: FileText,
    color: "gray",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
    iconBg: "bg-gray-500",
  },
};

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReportData {
  userId: string;
  currentSession: number;
  completedSessions: number[];
  totalScore: number;
  lastActiveDate: string;
  sessionProgress: Array<{
    id: number;
    title: string;
    status: "completed" | "current" | "locked";
    score?: number;
    completedDate?: string;
  }>;
  overallInsights: {
    strengths: string[];
    values: string[];
    areasForImprovement: string[];
    nextSteps: string[];
  };
  riasecData?: {
    interestCode: string;
    categoryCounts: Record<string, number>;
    topCategories: Array<{
      code: string;
      name: string;
      description: string;
      count: number;
      percentage: number;
      color: string;
    }>;
  };
}

export function ReportDialog({ isOpen, onClose }: ReportDialogProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personalityData, setPersonalityData] = useState<{
    score: string;
    subscaleScores: Record<string, number>;
    answers: Record<string, string>;
  } | null>(null);
  const [careerMaturityPre, setCareerMaturityPre] = useState<{
    insights?: { score?: Record<string, number> };
  } | null>(null);
  const [careerMaturityPost, setCareerMaturityPost] = useState<{
    insights?: { score?: Record<string, number> };
  } | null>(null);
  const [wellbeingPre, setWellbeingPre] = useState<{
    score: string;
    subscaleScores: Record<string, number>;
    answers: Record<string, string>;
  } | null>(null);
  const [wellbeingPost, setWellbeingPost] = useState<{
    score: string;
    subscaleScores: Record<string, number>;
    answers: Record<string, string>;
  } | null>(null);
  const [sdqPre, setSdqPre] = useState<{
    score: number;
    subscaleScores: Record<string, number>;
    answers: Record<string, string>;
  } | null>(null);
  const [sdqPost, setSdqPost] = useState<{
    score: number;
    subscaleScores: Record<string, number>;
    answers: Record<string, string>;
  } | null>(null);
  const [preInterventionAnswers, setPreInterventionAnswers] = useState<Record<
    string,
    number
  > | null>(null);
  const [postInterventionAnswers, setPostInterventionAnswers] = useState<Record<
    string,
    number | string
  > | null>(null);

  // Pre-assessment question texts to map compact keys (q1..qN) → human-readable labels
  const preAssessmentQuestionTexts: string[] = [
    "How clear are your current career goals?",
    "How confident are you that you will achieve your career goals?",
    "How confident are you in your ability to overcome obstacles in your career?",
    "How would you rate your current level of stress related to work or personal life?",
    "How well do you understand your own thought patterns and behaviors?",
    "How satisfied are you with your current work-life balance?",
    "How satisfied are you with your current job and overall well-being?",
    "How ready are you to make changes in your professional or personal life?",
  ];

  function getPreQuestionLabelFromKey(key: string): string {
    if (key.startsWith("q")) {
      const idx = Number.parseInt(key.slice(1), 10) - 1;
      if (!Number.isNaN(idx) && preAssessmentQuestionTexts[idx]) {
        return preAssessmentQuestionTexts[idx];
      }
    }
    return key; // fallback if already descriptive
  }

  function getCorrespondingPostKeyFromPreKey(key: string): string | null {
    if (key.startsWith("q")) return key;
    const idx = preAssessmentQuestionTexts.findIndex((t) => t === key);
    return idx >= 0 ? `q${idx + 1}` : null;
  }

  function toTitleCaseLabel(key: string): string {
    const withSpaces = key
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
    return withSpaces
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ")
      .trim();
  }

  // Personality subscale maximum question counts for percentage conversion
  const personalitySubscaleMax: Record<string, number> = {
    extraversion: 8,
    agreeableness: 9,
    conscientiousness: 9,
    neuroticism: 8,
    openness: 10,
  };

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      const [
        reportRes,
        personalityRes,
        preCMRes,
        postCMRes,
        wpreRes,
        wpostRes,
        sdqPreRes,
        sdqPostRes,
        preInterventionRes,
        postInterventionRes,
      ] = await Promise.all([
        fetch("/api/journey/report"),
        // Personality assessment currently lives under session 2
        fetch("/api/journey/sessions/2/q/personality-test"),
        // Career maturity pre & post
        fetch("/api/journey/sessions/1/a/career-maturity/insights"),
        fetch("/api/journey/sessions/8/a/post-career-maturity/insights"),
        // Psychological wellbeing pre & post
        fetch("/api/journey/sessions/1/q/psychological-wellbeing"),
        fetch("/api/journey/sessions/8/q/post-psychological-wellbeing"),
        // SDQ pre & post
        fetch("/api/journey/sessions/1/q/pre-coaching-strength-difficulty"),
        fetch("/api/journey/sessions/8/q/post-coaching-strength-difficulty"),
        // Pre/Post intervention answers
        fetch("/api/journey/sessions/1/q/pre-assessment"),
        fetch("/api/journey/sessions/8/q/post-coaching"),
      ]);

      if (reportRes.ok) {
        const data = await reportRes.json();
        setReportData(data);
      }
      if (personalityRes.ok) {
        const pdata = await personalityRes.json();
        setPersonalityData(pdata);
      } else {
        setPersonalityData(null);
      }
      if (preCMRes.ok) {
        const pre = await preCMRes.json();
        setCareerMaturityPre(pre);
      } else {
        setCareerMaturityPre(null);
      }
      if (postCMRes.ok) {
        const post = await postCMRes.json();
        setCareerMaturityPost(post);
      } else {
        setCareerMaturityPost(null);
      }
      if (sdqPreRes.ok) {
        const data = await sdqPreRes.json();
        setSdqPre(data);
      } else {
        setSdqPre(null);
      }
      if (sdqPostRes.ok) {
        const data = await sdqPostRes.json();
        setSdqPost(data);
      } else {
        setSdqPost(null);
      }
      if (preInterventionRes.ok) {
        const data = await preInterventionRes.json();
        setPreInterventionAnswers(data?.answers || null);
      } else {
        setPreInterventionAnswers(null);
      }
      if (postInterventionRes.ok) {
        const data = await postInterventionRes.json();
        setPostInterventionAnswers(data?.answers || null);
      } else {
        setPostInterventionAnswers(null);
      }
      if (wpreRes.ok) {
        const data = await wpreRes.json();
        setWellbeingPre(data);
      } else {
        setWellbeingPre(null);
      }
      if (wpostRes.ok) {
        const data = await wpostRes.json();
        setWellbeingPost(data);
      } else {
        setWellbeingPost(null);
      }
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadReportData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getProgressPercentage = () => {
    if (!reportData) return 0;
    return (reportData.completedSessions.length / 9) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary-green-100 text-primary-green-700 border-primary-green-300";
      case "current":
        return "bg-primary-blue-100 text-primary-blue-700 border-primary-blue-300";
      default:
        return "bg-slate-100 text-slate-500 border-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="size-3" />;
      case "current":
        return <Clock className="size-3" />;
      default:
        return <Clock className="size-3" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-primary-green-50 to-primary-blue-50 rounded-t-lg mb-4">
          <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
            <CardTitle className="text-xl font-semibold text-slate-800">
              Your Journey Report
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-0 size-8 hover:bg-slate-100"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>
        </div>
        <CardContent className="space-y-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">
              <div className="animate-spin rounded-full size-8 border-b-2 border-primary-blue-600 mx-auto mb-4" />
              <p>Generating your report...</p>
            </div>
          ) : reportData ? (
            <>
              {/* RIASEC Interest Profile */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Award className="size-5 text-indigo-600" />
                  Career Interest Profile
                </h3>

                {reportData.riasecData ? (
                  <>
                    {/* Top Categories Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {reportData.riasecData.topCategories.map(
                        (category, index) => {
                          const categoryInfo =
                            RIASEC_CATEGORIES[
                              category.code as keyof typeof RIASEC_CATEGORIES
                            ];
                          const IconComponent = categoryInfo.icon;

                          return (
                            <Card
                              key={category.code}
                              className={`p-4 ${categoryInfo.bgColor} ${categoryInfo.borderColor} border transition-all duration-200 hover:shadow-md`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div
                                  className={`p-2 rounded-lg ${categoryInfo.iconBg} text-white`}
                                >
                                  <IconComponent className="size-4" />
                                </div>
                                <div>
                                  <h4
                                    className={`font-semibold ${categoryInfo.textColor}`}
                                  >
                                    {category.name}
                                  </h4>
                                </div>
                              </div>

                              <p className="text-sm text-slate-600 mb-3">
                                {category.description}
                              </p>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-600">
                                    Percentage
                                  </span>
                                  <span
                                    className={`font-medium ${categoryInfo.textColor}`}
                                  >
                                    {category.percentage}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${categoryInfo.iconBg}`}
                                    style={{ width: `${category.percentage}%` }}
                                  />
                                </div>
                              </div>
                            </Card>
                          );
                        }
                      )}
                    </div>
                  </>
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="text-center">
                      <Award className="size-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-600 mb-2">
                        Interest Assessment Not Completed
                      </h4>
                      <p className="text-sm text-slate-500 mb-4">
                        Complete the RIASEC interest assessment to discover your
                        career interest profile and get personalized insights.
                      </p>
                      <Button
                        variant="outline"
                        className="text-slate-600 border-slate-300 hover:bg-slate-100"
                        onClick={() => {
                          // You can add navigation to the assessment here
                          console.log("Navigate to RIASEC assessment");
                        }}
                      >
                        Take Assessment
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              {/* Personality Assessment */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="size-5 text-emerald-600" />
                  Personality Assessment
                </h3>

                {personalityData ? (
                  <Card className="p-6 bg-gradient-to-r from-emerald-50 to-emerald-60 border-emerald-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                      {/* Left: Subscale percentages */}
                      <div>
                        {/* <h4 className="text-sm font-semibold text-slate-800 mb-4">
                          Subscale Scores
                        </h4> */}
                        <div className="space-y-3">
                          {Object.entries(personalityData.subscaleScores).map(
                            ([trait, rawScore]) => {
                              const maxItems =
                                personalitySubscaleMax[trait] || 10;
                              // const pct = Math.max(
                              //   0,
                              //   Math.min(100, (rawScore / maxItems) * 100)
                              // );
                              const pct = Math.round(rawScore);
                              return (
                                <div key={trait}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-700 capitalize">
                                      {trait}
                                    </span>
                                    <span className="text-slate-900 font-semibold">
                                      {pct}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Right: Overall percentage */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="inline-flex items-center justify-center size-24 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-3xl font-bold rounded-full shadow-lg mb-2">
                          {Math.round(Number.parseFloat(personalityData.score))}
                          %
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 mb-3">
                          Overall Personality Score
                        </h4>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="text-center">
                      <User className="size-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-600 mb-2">
                        Personality Assessment Not Completed
                      </h4>
                      <p className="text-sm text-slate-500 mb-4">
                        Complete the personality assessment to view
                        your overall and subscale scores.
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Career Maturity: Before vs After */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="size-5 text-blue-600" />
                  Career Maturity Progress
                </h3>

                {careerMaturityPre?.insights?.score &&
                careerMaturityPost?.insights?.score ? (
                  <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-60 border-blue-200">
                    {/* <h4 className="text-sm font-semibold text-slate-800 mb-4">
                      Scale Changes (Before vs After)
                    </h4> */}
                    <div className="space-y-2">
                      {Object.keys(
                        careerMaturityPre?.insights?.score ||
                          careerMaturityPost?.insights?.score ||
                          {}
                      ).map((scale) => {
                        const before =
                          careerMaturityPre?.insights?.score?.[scale] ?? 0;
                        const after =
                          careerMaturityPost?.insights?.score?.[scale] ?? 0;
                        const delta = Number.parseFloat(
                          (after - before).toFixed(2)
                        );
                        const deltaPositive = delta >= 0;

                        return (
                          <div
                            key={scale}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white/80"
                          >
                            {/* Scale name */}
                            <div className="min-w-32 text-slate-800 font-medium">
                              {scale}
                            </div>

                            {/* Before / After chips */}
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                Before: {Math.round(before)}%
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary-blue-50 text-primary-blue-800 border border-primary-blue-200">
                                After: {Math.round(after)}%
                              </span>
                            </div>

                            {/* Delta chip */}
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                  deltaPositive
                                    ? "bg-primary-green-100 text-primary-green-800 border-primary-green-200"
                                    : "bg-orange-100 text-orange-800 border-orange-200"
                                }`}
                              >
                                {deltaPositive ? "+" : ""}
                                {delta}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="text-center">
                      <BarChart3 className="size-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-600 mb-2">
                        Career Maturity Assessments Not Completed
                      </h4>
                      <p className="text-sm text-slate-500">
                        Complete both Career Maturity Assessment-1 and Career Maturity Assessment-2
                        to view your career maturity progress.
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Psychological Wellbeing: Before vs After */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Heart className="size-5 text-pink-600" />
                  Psychological Wellbeing Progress
                </h3>

                {wellbeingPre && wellbeingPost ? (
                  <Card className="p-6 bg-gradient-to-r from-pink-50 to-pink-60 border-pink-200">
                    {/* <div className="p-4 rounded-lg border border-pink-200 bg-white/80"> */}
                    {/* <h4 className="text-sm font-semibold text-slate-800 mb-3">
                      Subscale Changes
                    </h4> */}
                    <div className="space-y-2">
                      {Array.from(
                        new Set([
                          ...Object.keys(wellbeingPre?.subscaleScores || {}),
                          ...Object.keys(wellbeingPost?.subscaleScores || {}),
                        ])
                      ).map((dim) => {
                        const before = wellbeingPre?.subscaleScores?.[dim] ?? 0;
                        const after = wellbeingPost?.subscaleScores?.[dim] ?? 0;
                        const maxRaw = 49;
                        const beforePct = Math.round(
                          Math.max(0, Math.min(100, (before / maxRaw) * 100))
                        );
                        const afterPct = Math.round(
                          Math.max(0, Math.min(100, (after / maxRaw) * 100))
                        );
                        const delta = Number.parseFloat(
                          (afterPct - beforePct).toFixed(2)
                        );
                        const deltaPositive = delta >= 0;

                        return (
                          <div
                            key={dim}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white/80"
                          >
                            <div className="w-64 text-slate-800 font-medium">
                              {toTitleCaseLabel(dim)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center w-24 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 text-center">
                                Before: {beforePct}%
                              </span>
                              <span className="inline-flex items-center justify-center w-24 px-2 py-1 rounded-full text-xs font-semibold bg-primary-blue-50 text-primary-blue-800 border border-primary-blue-200 text-center">
                                After: {afterPct}%
                              </span>
                            </div>
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                  deltaPositive
                                    ? "bg-primary-green-100 text-primary-green-800 border-primary-green-200"
                                    : "bg-orange-100 text-orange-800 border-orange-200"
                                }`}
                              >
                                {deltaPositive ? "+" : ""}
                                {delta}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall moved below subscales */}
                    <div className="mt-4 pt-4 border-t border-pink-200">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white/80">
                        <div className="w-64 text-slate-800 font-medium">
                          Overall Wellbeing Score
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-24 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 text-center">
                            Before:{" "}
                            {wellbeingPre
                              ? Math.round(
                                  Number.parseFloat(wellbeingPre.score)
                                )
                              : "—"}
                            %
                          </span>
                          <span className="inline-flex items-center justify-center w-24 px-2 py-1 rounded-full text-xs font-semibold bg-primary-blue-50 text-primary-blue-800 border border-primary-blue-200 text-center">
                            After:{" "}
                            {wellbeingPost
                              ? Math.round(
                                  Number.parseFloat(wellbeingPost.score)
                                )
                              : "—"}
                            %
                          </span>
                        </div>
                        {(() => {
                          const b = wellbeingPre
                            ? Number.parseFloat(wellbeingPre.score)
                            : 0;
                          const a = wellbeingPost
                            ? Number.parseFloat(wellbeingPost.score)
                            : 0;
                          const d = Number.parseFloat((a - b).toFixed(2));
                          const pos = d >= 0;
                          return (
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                  pos
                                    ? "bg-primary-green-100 text-primary-green-800 border-primary-green-200"
                                    : "bg-orange-100 text-orange-800 border-orange-200"
                                }`}
                              >
                                {pos ? "+" : ""}
                                {d}%
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    {/* </div> */}
                  </Card>
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="text-center">
                      <Heart className="size-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-600 mb-2">
                        Psychological Wellbeing Assessments Not Completed
                      </h4>
                      <p className="text-sm text-slate-500">
                        Complete both Psychological Wellbeing Assessment-1 and Psychological Wellbeing Assessment-2 to view
                        your psychological wellbeing progress.
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Strengths & Difficulties Questionnaire (SDQ): Before vs After */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Award className="size-5 text-amber-600" />
                  Strengths & Difficulties Progress
                </h3>

                {sdqPre && sdqPost ? (
                  <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
                    <div className="space-y-2">
                      {Array.from(
                        new Set([
                          ...Object.keys(sdqPre?.subscaleScores || {}),
                          ...Object.keys(sdqPost?.subscaleScores || {}),
                        ])
                      ).map((dim) => {
                        const before = sdqPre?.subscaleScores?.[dim] ?? 0;
                        const after = sdqPost?.subscaleScores?.[dim] ?? 0;
                        const maxRaw = 10;
                        const beforePct = Math.round(
                          Math.max(0, Math.min(100, (before / maxRaw) * 100))
                        );
                        const afterPct = Math.round(
                          Math.max(0, Math.min(100, (after / maxRaw) * 100))
                        );
                        const delta = Number.parseFloat(
                          (afterPct - beforePct).toFixed(2)
                        );
                        const deltaPositive = delta >= 0;

                        return (
                          <div
                            key={dim}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white/80"
                          >
                            <div className="w-64 text-slate-800 font-medium">
                              {toTitleCaseLabel(dim)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center w-24 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 text-center">
                                Before: {beforePct}%
                              </span>
                              <span className="inline-flex items-center justify-center w-24 px-2 py-1 rounded-full text-xs font-semibold bg-primary-blue-50 text-primary-blue-800 border border-primary-blue-200 text-center">
                                After: {afterPct}%
                              </span>
                            </div>
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                  deltaPositive
                                    ? "bg-primary-green-100 text-primary-green-800 border-primary-green-200"
                                    : "bg-orange-100 text-orange-800 border-orange-200"
                                }`}
                              >
                                {deltaPositive ? "+" : ""}
                                {delta}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall moved below subscales */}
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white/80">
                        <div className="w-64 text-slate-800 font-medium">
                          Overall SDQ Score
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-24 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 text-center">
                            Before:{" "}
                            {sdqPre
                              ? Math.round(
                                  Math.min((sdqPre.score / 40) * 100, 100)
                                )
                              : "—"}
                            %
                          </span>
                          <span className="inline-flex items-center justify-center w-24 px-2 py-1 rounded-full text-xs font-semibold bg-primary-blue-50 text-primary-blue-800 border border-primary-blue-200 text-center">
                            After:{" "}
                            {sdqPost
                              ? Math.round(
                                  Math.min((sdqPost.score / 40) * 100, 100)
                                )
                              : "—"}
                            %
                          </span>
                        </div>
                        {(() => {
                          const b = sdqPre
                            ? Math.min((sdqPre.score / 40) * 100, 100)
                            : 0;
                          const a = sdqPost
                            ? Math.min((sdqPost.score / 40) * 100, 100)
                            : 0;
                          const d = Number.parseFloat((a - b).toFixed(2));
                          const pos = d >= 0;
                          return (
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                  pos
                                    ? "bg-primary-green-100 text-primary-green-800 border-primary-green-200"
                                    : "bg-orange-100 text-orange-800 border-orange-200"
                                }`}
                              >
                                {pos ? "+" : ""}
                                {d}%
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="text-center">
                      <Award className="size-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-600 mb-2">
                        Strengths & Difficulties Assessments Not Completed
                      </h4>
                      <p className="text-sm text-slate-500">
                        Complete both Strengths & Difficulties Assessment-1 and Strengths & Difficulties Assessment-2 to view
                        your strengths & difficulties progress.
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Before vs After Intervention (First 8 Questions) */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="size-5 text-slate-700" />
                  Before vs After Intervention
                </h3>

                {preInterventionAnswers && postInterventionAnswers ? (
                  <Card className="p-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-600 border-b">
                          <th className="py-2 pr-4">Question</th>
                          <th className="py-2 pr-4">Before</th>
                          <th className="py-2">After</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(preInterventionAnswers)
                          .slice(0, 8)
                          .map(([key, beforeVal]) => {
                            const question = getPreQuestionLabelFromKey(key);
                            const postKey =
                              getCorrespondingPostKeyFromPreKey(key) || key;
                            const afterVal = postInterventionAnswers?.[postKey];
                            return (
                              <tr key={key} className="border-b last:border-0">
                                <td className="py-2 pr-4 text-slate-800">
                                  {question}
                                </td>
                                <td className="py-2 pr-4 font-medium">
                                  {beforeVal}
                                </td>
                                <td className="py-2 font-medium">
                                  {typeof afterVal === "number" ||
                                  typeof afterVal === "string"
                                    ? afterVal
                                    : "—"}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </Card>
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="text-center">
                      <FileText className="size-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-600 mb-2">
                        Intervention Comparison Not Available
                      </h4>
                      <p className="text-sm text-slate-500">
                        Complete both Base-line Assessment and Finish-line Assessment to view
                        your intervention progress.
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Key Insights */}
              {/* <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="size-5 text-purple-600" />
                  Key Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Target className="size-4 text-purple-600" />
                      Your Strengths
                    </h4>
                    {reportData.overallInsights.strengths.length > 0 ? (
                      <div className="space-y-2">
                        {reportData.overallInsights.strengths.map(
                          (strength) => (
                            <div
                              key={`strength-${strength}`}
                              className="flex items-center gap-2 p-2 bg-white/50 rounded-md"
                            >
                              <div className="size-2 bg-purple-500 rounded-full" />
                              <span className="text-sm text-slate-700">
                                {strength}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        Complete more sessions to discover your strengths
                      </p>
                    )}
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <User className="size-4 text-green-600" />
                      Your Values
                    </h4>
                    {reportData.overallInsights.values.length > 0 ? (
                      <div className="space-y-2">
                        {reportData.overallInsights.values.map((value) => (
                          <div
                            key={`value-${value}`}
                            className="flex items-center gap-2 p-2 bg-white/50 rounded-md"
                          >
                            <div className="size-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-slate-700">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        Complete more sessions to identify your values
                      </p>
                    )}
                  </Card>
                </div>
              </div> */}

              {/* Download Actions */}
              {/* <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                <Button className="flex-1 bg-primary-green-600 hover:bg-primary-green-700 text-white">
                  <Download className="size-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="size-4 mr-2" />
                  Export as Word
                </Button>
              </div> */}
            </>
          ) : (
            <div className="py-8 text-center text-slate-500">
              <p>Report not available yet. Please visit after sometime.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
