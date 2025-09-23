"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
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
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";

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
    lowLabel: "Extremely high",
    highLabel: "Extremely low",
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

export function PreAssessment({ sessionId }: { sessionId: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Pre-Assessment");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  const form = useForm<PreAssessmentFormData>({
    resolver: zodResolver(preAssessmentSchema),
    defaultValues,
    mode: "onChange",
  });

  // Load existing assessment data from backend on component mount
  useEffect(() => {
    const loadAssessmentData = async () => {
      try {
        const response = await fetch(
          "/api/journey/sessions/1/q/pre-assessment"
        );

        if (response.ok) {
          const savedData = await response.json();

          // Only update form if we have actual saved answers
          if (savedData?.answers && Object.keys(savedData.answers).length > 0) {
            // Merge saved data with defaults to ensure all fields are present
            const formData = { ...defaultValues, ...savedData.answers };
            form.reset(formData);
          }
        }
      } catch (error) {
        console.error("Failed to load assessment data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessmentData();
  }, [form]);

  const getCurrentFieldValue = (): number => {
    const currentFieldName =
      currentQuestionData.text as keyof PreAssessmentFormData;
    const currentValue = form.getValues(currentFieldName);
    return typeof currentValue === "number"
      ? currentValue
      : defaultValues[currentFieldName];
  };

  const handleSubmitAssessment = async (data: PreAssessmentFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/journey/sessions/1/q/pre-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsCompleted(true);
      } else {
        throw new Error("Failed to submit assessment");
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      router.push(`/journey/sessions/${sessionId}`);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
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

  // Current question data and progress calculation
  const currentQuestionData = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const currentFieldName =
    currentQuestionData.text as keyof PreAssessmentFormData;

  // Loading state UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4" />
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

  // Main assessment form UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-3 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Header Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center size-12 sm:size-16 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-2xl shadow-lg">
                  <BarChart3 className="size-6 sm:size-8 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                  Pre-Coaching Assessment
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                  Answer honestly to help us understand your current state and
                  readiness for coaching.
                </p>
              </div>
            </div>
          </div>

          {/* Compact Question Navigation Dots */}
          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
            {questions.map((question, index) => (
              <Button
                key={question.title}
                onClick={() => setCurrentQuestion(index)}
                className={`
                size-8 rounded-md font-bold text-xs transition-all duration-300 hover:scale-105 flex justify-center items-center
                ${
                  index === currentQuestion
                    ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                    : index < currentQuestion
                    ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }
              `}
              >
                {index < currentQuestion ? (
                  <CheckCircle className="size-4" />
                ) : (
                  index + 1
                )}
              </Button>
            ))}
          </div>

          {/* Main Question Card */}
          <Card className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border-0">
            {/* Question Content */}
            <CardContent className="p-4 sm:p-6">
              <Form {...form}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name={currentFieldName}
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        {/* Question Header with Icon */}
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`size-10 bg-gradient-to-br from-${currentQuestionData.color}-500 to-${currentQuestionData.color}-600 rounded-lg flex items-center justify-center shadow-md`}
                          >
                            <currentQuestionData.icon className="size-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex gap-2 items-center mb-1">
                              <span className="text-sm font-bold text-slate-500">
                                Q{currentQuestion + 1}:
                              </span>
                              <FormLabel className="text-base font-semibold text-slate-800 leading-tight">
                                {currentQuestionData.text}
                              </FormLabel>
                            </div>
                            {/* <p className="text-slate-600 text-xs">
                            {currentQuestionData.description}
                          </p> */}
                          </div>
                        </div>

                        {/* Slider Input Section */}
                        <FormControl>
                          <div className="space-y-4 p-4 bg-gradient-to-br from-primary-green-50 to-primary-green-100 rounded-xl border border-slate-200 shadow-sm">
                            {/* Value Display Above Slider */}
                            <div className="text-center">
                              <div className="inline-block px-4 py-2 rounded-lg bg-white/90 shadow-sm text-primary-blue-600">
                                <div className="font-bold text-2xl">
                                  {getCurrentFieldValue()}/10
                                </div>
                                {/* <div className="font-medium text-xs">
                                {getValueText(
                                  getCurrentFieldValue(),
                                  currentQuestionData
                                )}
                              </div> */}
                              </div>
                            </div>

                            {/* Custom Slider */}
                            <div className="relative">
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={getCurrentFieldValue()}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseInt(e.target.value)
                                  )
                                }
                                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(to right, #3b82f6 0%, #10b981 ${
                                    ((getCurrentFieldValue() - 1) / 9) * 100
                                  }%, #e2e8f0 ${
                                    ((getCurrentFieldValue() - 1) / 9) * 100
                                  }%, #e2e8f0 100%)`,
                                }}
                              />
                            </div>

                            {/* Slider Labels at Both Ends */}
                            <div className="flex justify-between items-center">
                              <div className="text-center">
                                <div className="font-medium text-slate-600 text-xs">
                                  <span className="font-bold">1</span> -{" "}
                                  {currentQuestionData.lowLabel}
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="font-medium text-slate-600 text-xs">
                                  <span className="font-bold">10</span> -{" "}
                                  {currentQuestionData.highLabel}
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                    {/* Previous Button */}
                    <Button
                      type="button"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestion === 0}
                      className="w-full sm:flex-1 h-10 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200 flex items-center justify-center gap-2 bg-white"
                    >
                      <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-200" />
                      Previous
                    </Button>

                    {/* Next/Submit Button */}
                    {currentQuestion === questions.length - 1 ? (
                      <Button
                        type="button"
                        onClick={form.handleSubmit(handleSubmitAssessment)}
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin size-4 mr-2 text-white"
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
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Complete Assessment
                            <Award className="size-4 group-hover:rotate-12 transition-transform duration-200" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={goToNextQuestion}
                        className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2"
                      >
                        Next
                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
