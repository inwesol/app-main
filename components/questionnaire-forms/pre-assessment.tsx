"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  Shield,
  Brain,
  Scale as Balance,
  Heart,
  Zap,
  CheckCircle,
  BarChart3,
  Award,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Header from "@/components/form-components/header";
import ProgressBar from "../form-components/progress-bar";
import PageNavigation from "@/components/form-components/page-navigation";
import PreviousButton from "@/components/form-components/previous-button";
import NextButton from "@/components/form-components/next-button";
import Slider from "@/components/form-components/slider";

// Question Configuration
const questions = [
  {
    title: "Career Goals Clarity",
    text: "How clear are your current career goals?",
    icon: Target,
    color: "primary-blue",
    lowLabel: "Not at all clear",
    highLabel: "Completely clear",
    description:
      "Rate how well-defined and specific your career objectives are",
  },
  {
    title: "Achievement Confidence",
    text: "How confident are you that you will achieve your career goals?",
    icon: TrendingUp,
    color: "primary-green",
    lowLabel: "Not at all confident",
    highLabel: "Extremely confident",
    description:
      "Assess your belief in your ability to reach your career aspirations",
  },
  {
    title: "Obstacle Resilience",
    text: "How confident are you in your ability to overcome obstacles in your career?",
    icon: Shield,
    color: "purple",
    lowLabel: "Not at all confident",
    highLabel: "Extremely confident",
    description: "Rate your resilience and problem-solving confidence",
  },
  {
    title: "Stress Management",
    text: "How would you rate your current level of stress related to work or personal life?",
    icon: Brain,
    color: "orange",
    lowLabel: "Extremely low",
    highLabel: "Extremely high",
    description: "Assess your current stress levels and coping mechanisms",
    reversed: true,
  },
  {
    title: "Self-Awareness",
    text: "How well do you understand your own thought patterns and behaviors?",
    icon: Lightbulb,
    color: "primary-blue",
    lowLabel: "Not at all",
    highLabel: "Completely",
    description: "Rate your level of self-awareness and introspection",
  },
  {
    title: "Work-Life Balance",
    text: "How satisfied are you with your current work-life balance?",
    icon: Balance,
    color: "primary-green",
    lowLabel: "Not at all satisfied",
    highLabel: "Extremely satisfied",
    description:
      "Evaluate how well you balance professional and personal commitments",
  },
  {
    title: "Overall Well-being",
    text: "How satisfied are you with your current job and overall well-being?",
    icon: Heart,
    color: "purple",
    lowLabel: "Not at all satisfied",
    highLabel: "Extremely satisfied",
    description:
      "Rate your overall contentment with work and life satisfaction",
  },
  {
    title: "Change Readiness",
    text: "How ready are you to make changes in your professional or personal life?",
    icon: Zap,
    color: "orange",
    lowLabel: "Not at all ready",
    highLabel: "Completely ready",
    description: "Assess your motivation and readiness for transformation",
  },
];

const preAssessmentSchema = z.object({
  "How clear are your current career goals?": z.number().min(1).max(10),
  "How confident are you that you will achieve your career goals?": z
    .number()
    .min(1)
    .max(10),
  "How confident are you in your ability to overcome obstacles in your career?":
    z.number().min(1).max(10),
  "How would you rate your current level of stress related to work or personal life?":
    z.number().min(1).max(10),
  "How well do you understand your own thought patterns and behaviors?": z
    .number()
    .min(1)
    .max(10),
  "How satisfied are you with your current work-life balance?": z
    .number()
    .min(1)
    .max(10),
  "How satisfied are you with your current job and overall well-being?": z
    .number()
    .min(1)
    .max(10),
  "How ready are you to make changes in your professional or personal life?": z
    .number()
    .min(1)
    .max(10),
});

type PreAssessmentFormData = z.infer<typeof preAssessmentSchema>;

const defaultValues: PreAssessmentFormData = {
  "How clear are your current career goals?": 5,
  "How confident are you that you will achieve your career goals?": 5,
  "How confident are you in your ability to overcome obstacles in your career?": 5,
  "How would you rate your current level of stress related to work or personal life?": 5,
  "How well do you understand your own thought patterns and behaviors?": 5,
  "How satisfied are you with your current work-life balance?": 5,
  "How satisfied are you with your current job and overall well-being?": 5,
  "How ready are you to make changes in your professional or personal life?": 5,
};

export function PreAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<PreAssessmentFormData>({
    resolver: zodResolver(preAssessmentSchema),
    defaultValues,
  });

  // Fixed onSubmit function and data fetching
  const onSubmit = async (data: PreAssessmentFormData) => {
    console.log("Assessment Results:", data);
    setIsLoading(true);
    try {
      const sessionId = 1;
      const url = `/api/journey/sessions/${sessionId}/q/pre-assessment`; // Fixed: Added backticks for template literal

      // Wrap the data in the format the backend expects
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: data }), // ← Wrap in 'answers' object
      });

      if (response.ok) {
        setIsCompleted(true);
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to submit assessment: ${response.status}`); // Fixed: Added backticks for template literal
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // fetching data on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/journey/sessions/1/q/pre-assessment");
        if (res.ok) {
          const savedData = await res.json();
          console.log("Fetched data:", savedData);

          // The backend returns the raw answers object, not wrapped
          if (savedData && typeof savedData === "object") {
            // Merge with defaults to ensure all fields are present
            const formData = { ...defaultValues, ...savedData };
            form.reset(formData);
          } else {
            form.reset(defaultValues);
          }
        } else if (res.status === 404) {
          // No previous data found, use defaults
          console.log("No previous assessment found, using defaults");
          form.reset(defaultValues);
        } else {
          console.error("Fetch error:", res.status, await res.text());
          form.reset(defaultValues);
        }
      } catch (error) {
        console.error("Failed to fetch assessment data:", error);
        form.reset(defaultValues);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [form]);

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getValueText = (value: number, question: (typeof questions)[0]) => {
    if (question.reversed) {
      if (value <= 3) return "High Stress";
      if (value <= 6) return "Moderate";
      return "Low Stress";
    } else {
      if (value <= 3) return "Low";
      if (value <= 6) return "Moderate";
      return "High";
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="size-16 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <CheckCircle className="size-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Assessment Complete!
            </h2>
            <p className="text-slate-600">
              Thank you for completing the pre-coaching assessment.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header
          headerIcon={BarChart3}
          headerText="Pre-Coaching Assessment"
          headerDescription="This assessment will help us understand your current state and readiness for coaching. Please answer honestly based on how you feel right now."
        />

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <ProgressBar progressPercentage={progressPercentage} />
        </div>

        {/* Question Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8">
          {questions.map((_, index) => (
            <PageNavigation
              key={index}
              index={index}
              currentPage={currentQuestion}
              setCurrentPage={setCurrentQuestion}
            />
          ))}
        </div>

        <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
          {/* Page header */}
          <CardHeader className="bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-t-2xl p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div
                className={`size-14 bg-gradient-to-br from-${currentQuestionData.color}-500 to-${currentQuestionData.color}-600 rounded-2xl flex items-center justify-center shadow-lg`} // Fixed: Added backticks for template literal
              >
                <currentQuestionData.icon className="size-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                  {currentQuestionData.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {currentQuestionData.description}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="sm:p-6 p-4">
            <div className="space-y-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name={
                      currentQuestionData.text as keyof PreAssessmentFormData
                    }
                    render={({ field }) => (
                      <FormItem className="space-y-6">
                        <div className="flex gap-2 mb-2">
                          <span className="text-base sm:text-lg font-bold text-slate-500">
                            Q{currentQuestion + 1}
                          </span>
                          <FormLabel className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
                            {currentQuestionData.text}
                          </FormLabel>
                        </div>

                        <FormControl>
                          <div className="space-y-6 sm:p-6 p-4 bg-gradient-to-br from-primary-green-50 to-primary-green-100 rounded-2xl border-2 border-slate-200 shadow-md">
                            {/* Custom Slider */}
                            <div className="relative">
                              <input
                                type="range"
                                min="1"
                                max="10"
                                {...field}
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(to right, #3b82f6 0%, #10b981 ${
                                    ((field.value - 1) / 9) * 100
                                  }%, #e2e8f0 ${
                                    ((field.value - 1) / 9) * 100
                                  }%, #e2e8f0 100%)`,
                                }}
                              />
                            </div>

                            <div className="flex justify-between items-center gap-2">
                              <div className="text-center">
                                <div className="font-semibold text-slate-600 text-sm">
                                  {currentQuestionData.lowLabel}
                                </div>
                                <div className="text-slate-500 text-xs">
                                  (1)
                                </div>
                              </div>

                              <div className="text-center sm:px-6 sm:py-3 px-3 py-1 rounded-xl bg-white/80 shadow-md text-primary-blue-600">
                                <div className="font-bold text-xl sm:text-3xl">
                                  {field.value}/10
                                </div>
                                <div className="font-semibold text-sm">
                                  {getValueText(
                                    field.value,
                                    currentQuestionData
                                  )}
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="font-semibold text-slate-600 text-sm">
                                  {currentQuestionData.highLabel}
                                </div>
                                <div className="text-slate-500 text-xs">
                                  (10)
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                    <Button
                      type="button"
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                      className="w-full sm:flex-1 h-12 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200 flex items-center justify-center gap-2 bg-white"
                    >
                      <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform duration-200" />
                      Previous Page
                    </Button>

                    {currentQuestion === questions.length - 1 ? (
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin size-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Complete Assessment
                            <Award className="size-5 group-hover:rotate-12 transition-transform duration-200" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextQuestion}
                        className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                      >
                        Next Page
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}