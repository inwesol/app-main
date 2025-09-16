"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  Activity,
  Loader2,
  Target,
  Heart,
  User,
  MessageCircle,
  CheckCircle,
  Sparkles,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Session Report Types
export interface FormReport {
  title: string;
  description: string;
  status: string;
  topics: string[];
}

export interface EmailReportRequest {
  sessionName: string | undefined;
  sessionId: number | string;
  dateCompleted: string;
  schedulerSummary?: string;
  forms: FormReport[] | undefined;
  // activities: string[];
  additionalNotes?: string;
}

export interface EmailReportResponse {
  success: boolean;
  message: string;
  error?: string;
}
interface SessionForm {
  id: string;
  title: string;
  description: string;
  status: string;
  icon: string;
  route: string;
  topics: string[];
  difficulty: string;
}
interface SessionData {
  id: number;
  title: string;
  description: string;
  icon: string;
  forms: SessionForm[];
  status: string;
  topics: string[];
  learningObjectives: string[];
}
interface RiasecResults {
  selectedAnswers: string[];
  categoryCounts: {
    realistic?: number;
    investigative?: number;
    artistic?: number;
    social?: number;
    enterprsing?: number;
    conventional?: number;
  };
  interestCode?: string;
}
interface PersonalityTestResults {
  score: string;
  answers: {
    [key: string]: string;
  };
  subscaleScores: {
    extraversion: number;
    agreeableness: number;
    conscientiousness: number;
    neuroticism: number;
    openness: number;
  };
}
interface PsychologicalWellbeingTestResults {
  score: string;
  answers: {
    [key: string]: string;
  };
  subscaleScores: {
    autonomy: number;
    environmentalMastery: number;
    personalGrowth: number;
    positiveRelations: number;
    purposeInLife: number;
    selfAcceptance: number;
  };
}
interface PersonalityTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}
const MaxScoresPersonalityTest: PersonalityTraits = {
  extraversion: 40,
  agreeableness: 45,
  conscientiousness: 45,
  neuroticism: 40,
  openness: 50,
};
const ProgressBar = ({
  label,
  score,
  maxScore = 100,
  color = "primary-blue",
}: // usedBy
{
  label: string;
  score: number;
  maxScore?: number;
  color?: "primary-blue" | "primary-green";
  // usedBy
}) => {
  const percentage = (score / maxScore) * 100;
  const colorClass =
    color === "primary-green"
      ? "from-primary-green-500 to-primary-green-600"
      : "from-primary-blue-500 to-primary-blue-600";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize">
          {label}
        </span>
        <span className="text-xs sm:text-sm font-bold text-gray-900">
          {Math.round(score)}/{maxScore}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Circular Gauge Component
const CircularGauge = ({
  score,
  maxScore = 100,
  label = "Overall Score",
}: {
  score: number;
  maxScore?: number;
  label?: string;
}) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <svg width="120" height="120" className="-rotate-90">
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="rgb(229 231 235)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(score)}%
            </div>
            {/* <div className="text-xs text-gray-500">/{maxScore}</div> */}
          </div>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};
export default function SessionReport({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [riasecResults, setRiasecResults] = useState<null | RiasecResults>(
    null
  );
  const [personalityTestResults, setPersonalityTestResults] =
    useState<null | PersonalityTestResults>(null);
  const [
    psychologicalWellbeingTestResults,
    setPsychologicalWellebingTestResults,
  ] = useState<null | PsychologicalWellbeingTestResults>(null);
  const [showWellbeingAnswers, setShowWellbeingAnswers] = useState(false);
  const [showPersonalityTestAnswers, setShowPersonalityTestAnswers] =
    useState(false);
  const [showRiasecTestAnswers, setShowRiasecTestAnswers] = useState(false);

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
    fetchSessionData();
  }, []);

  useEffect(() => {
    const fetchQuestionnairesData = async () => {
      setLoading(true);
      try {
        const [riasecRes, personalityTestRes] = await Promise.all([
          fetch(`/api/journey/sessions/2/q/riasec-test`),
          fetch(`/api/journey/sessions/2/q/personality-test`),
        ]);
        if (riasecRes.ok) {
          const data = await riasecRes.json();
          setRiasecResults(data);
        } else {
          setRiasecResults(null);
        }

        if (personalityTestRes.ok) {
          const data = await personalityTestRes.json();
          setPersonalityTestResults(data);
        } else {
          setPersonalityTestResults(null);
        }
      } catch {
        setRiasecResults(null);
        setPersonalityTestResults(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchPsychologicalWellbeingResults = async () => {
      try {
        const psychologicalWellbeingRes = await fetch(
          `/api/journey/sessions/3/q/psychological-wellbeing`
        );

        if (psychologicalWellbeingRes.ok) {
          const data = await psychologicalWellbeingRes.json();
          setPsychologicalWellebingTestResults(data);
        } else {
          setPsychologicalWellebingTestResults(null);
        }
      } catch {
        setPsychologicalWellebingTestResults(null);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId === "2") {
      fetchQuestionnairesData();
    }
    if (sessionId === "3") {
      fetchPsychologicalWellbeingResults();
    }
  }, []);

  // console.log("riasecResults: ", riasecResults);
  // console.log("personalityTestResults: ", personalityTestResults);
  // console.log(
  //   "psychologicalWellbeingTestResults: ",
  //   psychologicalWellbeingTestResults
  // );
  // console.log(sessionData);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-primary-green-50 via-white to-primary-primary-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">
            Generating Report...
          </p>
        </div>
      </div>
    );
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSendEmail = async () => {
    setIsEmailLoading(true);

    try {
      const requestData: EmailReportRequest = {
        sessionName: sessionData?.title,
        sessionId: sessionId,
        // userEmail,
        dateCompleted: formatDate(new Date().toISOString()),
        schedulerSummary: `The scheduler in our psychological well-being application is
                designed to help users build consistent and structured mental
                health routines. It allows users to plan and manage daily
                activities such as meditation, journaling, therapy sessions, and
                medication reminders, all in one place. With features like
                recurring event setup, smart notifications, and mood-based
                suggestions, the scheduler ensures that users stay engaged with
                their wellness journey. It also integrates with progress
                tracking tools to provide insights into habits and emotional
                trends over time. This helps promote accountability,
                self-awareness, and long-term improvement in mental health.`,
        forms: sessionData?.forms,
        // activities,
        additionalNotes: "notes from coach",
      };

      const response = await fetch(
        `/api/journey/sessions/${sessionId}/session-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data: EmailReportResponse = await response.json();

      if (response.ok && data.success) {
        toast.success("📩 Report sent to your registered email!", {
          style: { background: "#ecfdf5", color: "#00b24b" },
        });
        router.push("/journey/");
      } else {
        toast.error(data.error || "Failed to send report.");
      }
    } catch (error) {
      toast.error("Network error or server issue.");
      console.error(error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green-50/30 via-white to-primary-blue-50/30">
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        {/* Session Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-blue-600 via-primary-blue-500 to-primary-green-600 p-4 sm:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between sm:mb-6 mb-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                      {sessionData?.title}
                    </h1>
                    <p className="text-primary-blue-100 text-base sm:text-lg mt-1">
                      Session #{sessionId} Assessment Report
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 border border-white/30">
                <CheckCircle className="size-4 text-primary-green-300" />
                <span className="text-sm font-semibold">Completed</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-primary-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span className="text-sm">
                  {formatDate(new Date().toISOString())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-primary-blue-50 p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-blue-100 rounded-lg">
                <Clock className="size-6 text-primary-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Schedule Summary
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Your structured wellness journey
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-gray-700 leading-relaxed sm:text-base text-sm">
              The scheduler in our psychological well-being application is
              designed to help users build consistent and structured mental
              health routines. It allows users to plan and manage daily
              activities such as meditation, journaling, therapy sessions, and
              medication reminders, all in one place. With features like
              recurring event setup, smart notifications, and mood-based
              suggestions, the scheduler ensures that users stay engaged with
              their wellness journey.
            </p>
          </div>
        </div>

        {/* Completed Forms */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-primary-green-50 to-emerald-50 p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-green-100 rounded-lg">
                <Activity className="size-6 text-primary-green-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Completed Assessments
                </h2>
                <p className="text-gray-600 text-xs sm:text-base">
                  Successfully completed evaluations
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {sessionData?.forms
                .filter((form) => form.status === "completed")
                .map((form, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-green-50 to-emerald-50 
                             border border-primary-green-200 rounded-xl hover:shadow-md transition-all duration-200
                             hover:from-primary-green-100 hover:to-emerald-100"
                  >
                    <div className="p-2 bg-primary-green-500 rounded-full">
                      <CheckCircle2 className="size-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-green-800">
                        {form.title}
                      </h3>
                      <p className="text-sm text-primary-green-600">
                        {form.description}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-primary-green-500 text-white text-xs font-medium rounded-full">
                      ✓ Complete
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Assessment Results */}

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 sm:mb-2 mb-1">
              Assessment Results
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Your comprehensive psychological evaluation
            </p>
          </div>
          {riasecResults && personalityTestResults && (
            <>
              {/* RIASEC Results */}
              {riasecResults && (
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 text-white p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <Target className="size-7" />
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold">
                          RIASEC Career Assessment
                        </h3>
                        <p className="text-sm sm:text-base text-primary-blue-100">
                          Discover your career interests and aptitudes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Interest Code */}
                    <div className="text-center">
                      <h4 className="tetx-base sm:text-lg font-semibold text-gray-900 mb-4">
                        Your Interest Code
                      </h4>
                      <div className="flex justify-center gap-3">
                        {riasecResults.interestCode
                          ?.split("")
                          .map((char, i) => (
                            <div
                              key={i}
                              className="size-10 sm:size-16 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 
                                   text-white rounded-full flex items-center justify-center 
                                   tetx-xl sm:text-2xl font-bold shadow-lg"
                            >
                              {char}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Category Scores */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Interest Categories
                      </h4>
                      <div className="grid gap-4">
                        {Object.entries(riasecResults.categoryCounts).map(
                          ([category, score]) => (
                            <ProgressBar
                              key={category}
                              label={category}
                              score={score || 0}
                              maxScore={7}
                              color="primary-blue"
                            />
                          )
                        )}
                      </div>
                    </div>

                    {/* User's Question Answers */}
                    <div className="col-span-full">
                      <button
                        onClick={() =>
                          setShowRiasecTestAnswers(!showRiasecTestAnswers)
                        }
                        className="flex items-center justify-between w-full p-4 bg-purple-50 hover:bg-purple-100 
                               rounded-lg border border-purple-200 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Eye className="size-5 text-purple-600" />
                          <span className="text-sm sm:text-base font-semibold text-purple-800">
                            View Your Responses{" "}
                            <span className="hidden sm:inline-block">
                              ({riasecResults.selectedAnswers.length} questions)
                            </span>
                          </span>
                        </div>
                        {showRiasecTestAnswers ? (
                          <ChevronUp className="size-5 text-purple-600" />
                        ) : (
                          <ChevronDown className="size-5 text-purple-600" />
                        )}
                      </button>

                      {showRiasecTestAnswers && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-800 mb-3">
                            Your Selected Statements:
                          </h5>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {riasecResults.selectedAnswers.map(
                              (statement, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-primary-blue-50/90 rounded-md border border-primary-blue-400 hover:bg-primary-blue-100/90 hover:border-primary-blue-500
                                       transition-colors duration-200"
                                >
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-800">
                                      <span className="font-semibold">
                                        Statment {index + 1}:
                                      </span>{" "}
                                      {statement}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Personality Test Results */}
              {personalityTestResults && (
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-primary-green-500 to-emerald-600 text-white p-6">
                    <div className="flex items-center gap-3">
                      <User className="size-7" />
                      <div>
                        <h3 className="text-xl font-bold">
                          Personality Assessment
                        </h3>
                        <p className="text-primary-green-100">
                          Big Five personality traits analysis
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col gap-4">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Trait Scores */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Personality Traits
                        </h4>
                        <div className="space-y-4">
                          {Object.entries(
                            personalityTestResults.subscaleScores
                          ).map(([trait, score]) => (
                            <ProgressBar
                              key={trait}
                              label={trait}
                              score={score}
                              maxScore={MaxScoresPersonalityTest[trait] || 100}
                              color="primary-green"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Overall Score */}
                      <div className="flex justify-center items-center">
                        <CircularGauge
                          score={Number.parseInt(personalityTestResults.score)}
                          maxScore={100}
                          label="Overall Personality Score"
                        />
                      </div>
                    </div>

                    {/* User's Question Answers */}
                    <div className="col-span-full">
                      <button
                        onClick={() =>
                          setShowPersonalityTestAnswers(
                            !showPersonalityTestAnswers
                          )
                        }
                        className="flex items-center justify-between w-full p-4 bg-purple-50 hover:bg-purple-100 
                               rounded-lg border border-purple-200 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Eye className="size-5 text-purple-600" />
                          <span className="text-sm sm:text-base font-semibold text-purple-800">
                            View Your Responses{" "}
                            <span className="hidden sm:inline-block">
                              (
                              {
                                Object.keys(personalityTestResults.answers)
                                  .length
                              }{" "}
                              questions)
                            </span>
                          </span>
                        </div>
                        {showWellbeingAnswers ? (
                          <ChevronUp className="size-5 text-purple-600" />
                        ) : (
                          <ChevronDown className="size-5 text-purple-600" />
                        )}
                      </button>

                      {showPersonalityTestAnswers && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-800 mb-3">
                            Your Question Responses:
                          </h5>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {Object.entries(personalityTestResults.answers).map(
                              ([question, answer], index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-white rounded-md border border-gray-200 hover:border-purple-300 
                                       transition-colors duration-200"
                                >
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-800">
                                      Q{index + 1}: {question}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-500">
                                        Your answer:
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          answer.includes("Strongly Agree")
                                            ? "bg-green-100 text-green-800"
                                            : answer.includes("Agree")
                                            ? "bg-primary-blue-100 text-primary-blue-800"
                                            : answer.includes("Neutral")
                                            ? "bg-gray-100 text-gray-800"
                                            : answer.includes("Disagree")
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {answer}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {/* Psychological Wellbeing Results */}
          {psychologicalWellbeingTestResults && (
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <Heart className="size-5 sm:size-7" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">
                      Psychological Wellbeing
                    </h3>
                    <p className="text-sm sm:text-base text-purple-100">
                      Six dimensions of psychological wellness
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex flex-col gap-4">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Wellbeing Dimensions */}
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                      Wellbeing Dimensions
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(
                        psychologicalWellbeingTestResults.subscaleScores
                      ).map(([dimension, score]) => (
                        <ProgressBar
                          key={dimension}
                          label={dimension.replace(/([A-Z])/g, " $1").trim()}
                          score={score}
                          maxScore={49}
                          color="primary-blue"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Overall Wellbeing Score */}
                  <div className="flex justify-center items-center">
                    <CircularGauge
                      score={Number.parseInt(
                        psychologicalWellbeingTestResults.score
                      )}
                      maxScore={100}
                      label="Overall Wellbeing Score"
                    />
                  </div>
                </div>

                {/* User's Question Answers */}
                <div className="col-span-full">
                  <button
                    onClick={() =>
                      setShowWellbeingAnswers(!showWellbeingAnswers)
                    }
                    className="flex items-center justify-between w-full sm:p-4 p-2 bg-purple-50 hover:bg-purple-100 
                               rounded-lg border border-purple-200 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Eye className="size-5 text-purple-600" />
                      <span className="text-sm sm:text-base font-semibold text-purple-800">
                        View Your Responses{" "}
                        <span className="hidden sm:inline-block">
                          (
                          {
                            Object.keys(
                              psychologicalWellbeingTestResults.answers
                            ).length
                          }{" "}
                          questions)
                        </span>
                      </span>
                    </div>
                    {showWellbeingAnswers ? (
                      <ChevronUp className="size-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="size-5 text-purple-600" />
                    )}
                  </button>

                  {showWellbeingAnswers && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-800 mb-3">
                        Your Question Responses:
                      </h5>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {Object.entries(
                          psychologicalWellbeingTestResults.answers
                        ).map(([question, answer], index) => (
                          <div
                            key={index}
                            className="p-4 bg-white rounded-md border border-gray-200 hover:border-purple-300 
                                       transition-colors duration-200"
                          >
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-800">
                                Q{index + 1}: {question}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  Your answer:
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    answer.includes("Strongly Agree")
                                      ? "bg-primary-green-100 text-primary-green-800"
                                      : answer.includes("A Little Agree")
                                      ? "bg-primary-blue-50 text-primary-blue-700"
                                      : answer.includes("Agree") &&
                                        !answer.includes("A Little Agree")
                                      ? "bg-primary-blue-100 text-primary-blue-800"
                                      : answer.includes("Neutral")
                                      ? "bg-primary-blue-50 text-primary-blue-700"
                                      : answer.includes("A Little Disagree")
                                      ? "bg-gray-100 text-gray-800"
                                      : answer.includes("Disagree") &&
                                        !answer.includes("A Little Disagree")
                                      ? "bg-orange-50 text-orange-700"
                                      : answer.includes("Strongly Disagree")
                                      ? "bg-red-100 text-red-800"
                                      : ""
                                  }
                                  }`}
                                >
                                  {answer}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-orange-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-4 mb-2 sm:mb-3 ">
              <div className="p-2 bg-orange-100 rounded-lg mt-1">
                <MessageCircle className="size-6 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 ">
                Coach's Notes
              </h3>
            </div>
            <div className="flex-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-l-4 border-orange-400">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                  &ldquo;Excellent progress on your assessment journey! Your
                  results show strong self-awareness and thoughtful responses
                  across all evaluations. Continue building on these insights
                  for your personal and professional development.&rdquo;
                </p>
                <div className="mt-3 text-sm text-orange-600 font-medium">
                  — Your Wellness Coach
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email CTA */}
        <div className="bg-gradient-to-r from-primary-blue-600 via-purple-600 to-primary-green-600 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-black/20 p-5 sm:p-8 text-center">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="size-6 sm:size-8 text-white" />
                </div>
              </div>

              <div className="text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  Get Your Complete Report
                </h3>
                <p className="text-sm sm:text-base text-primary-blue-100 max-w-md mx-auto">
                  Receive a professionally formatted PDF copy of your assessment
                  results and recommendations directly in your inbox.
                </p>
              </div>

              <Button
                onClick={handleSendEmail}
                disabled={isEmailLoading}
                className="inline-flex items-center gap-3 bg-white text-gray-900 p-4 sm:p-6 
                         rounded-full font-semibold sm:text-lg shadow-lg hover:shadow-xl hover:bg-white
                         transition-all duration-200 hover:scale-105 disabled:opacity-70 
                         disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
              >
                {isEmailLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Sending Your Report...
                  </>
                ) : (
                  <>
                    <Mail className="size-5" />
                    Send Report to My Email
                  </>
                )}
              </Button>

              <p className="text-xs text-primary-blue-200">
                Free delivery • Professional formatting • Instant access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
