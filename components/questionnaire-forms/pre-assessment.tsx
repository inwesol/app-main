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
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Base-line Assessment");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  const form = useForm<PreAssessmentFormData>({
    resolver: zodResolver(preAssessmentSchema),
    defaultValues,
    mode: "onChange",
  });

  // Load existing assessment data from backend on component mount
  useEffect(() => {
    const loadAssessmentData = async () => {
      const qId = "pre-assessment";
      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/q/${qId}`
        );

        if (response.ok) {
          const savedData = await response.json();

          // Only update form if we have actual saved answers
          if (savedData?.answers && Object.keys(savedData.answers).length > 0) {
            // Merge saved data with defaults to ensure all fields are present
            const formData = { ...defaultValues, ...savedData.answers };
            form.reset(formData);
          }
        } else if (response.status === 404) {
          // No data found - use default values
          form.reset(defaultValues);
        } else {
          // Handle other error responses - read response body only once
          let errorMessage = "An error occurred while loading data";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            // If JSON parsing fails, use status text
            errorMessage = response.statusText || errorMessage;
          }
          // console.error("API Error:", errorMessage);
        }
      } catch (error) {
        console.error("Network Error:", error);
        // Reset form to defaults on network error
        form.reset(defaultValues);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessmentData();
  }, [form, sessionId]);

  const getCurrentFieldValue = (): number => {
    const currentFieldName =
      currentQuestionData.text as keyof PreAssessmentFormData;
    const currentValue = form.getValues(currentFieldName);
    return typeof currentValue === "number"
      ? currentValue
      : defaultValues[currentFieldName];
  };

  const handleSubmitAssessment = async (data: PreAssessmentFormData) => {
    const qId = "pre-assessment";
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/q/${qId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setIsCompleted(true);
      } else {
        // Handle error response - read response body only once
        let errorMessage = "Failed to submit assessment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Submission error:", error);
      // You could show a toast notification here with the error message
    } finally {
      setIsSubmitting(false);
      router.push(`/journey/sessions/${sessionId}`);
    }
  };

  const handleDeleteAssessment = async () => {
    const qId = "pre-assessment";
    if (
      !confirm(
        "Are you sure you want to clear your assessment? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/q/${qId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Reset form to default values
        form.reset(defaultValues);
        setCurrentQuestion(0);
        setIsCompleted(false);
      } else {
        // Handle error response - read response body only once
        let errorMessage = "Failed to clear assessment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Delete error:", error);
      // You could show a toast notification here with the error message
    } finally {
      setIsDeleting(false);
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mx-auto mb-4 shadow-lg size-16 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-2xl">
              <CheckCircle className="text-white size-8" />
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
    <div className="min-h-screen p-3 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Header Card */}
          {/* <div className="p-4 mb-6 border shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-3xl sm:p-6 sm:mb-12">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center shadow-lg size-12 sm:size-16 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-2xl">
                  <BarChart3 className="text-white size-6 sm:size-8" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-xl font-bold sm:text-2xl lg:text-3xl text-slate-800">
                  Pre-Coaching Assessment
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                  Answer honestly to help us understand your current state and
                  readiness for coaching.
                </p>
              </div>
            </div>
          </div> */}

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
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-xl">
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
                            <currentQuestionData.icon className="text-white size-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-slate-500">
                                Q{currentQuestion + 1}:
                              </span>
                              <FormLabel className="text-base font-semibold leading-tight text-slate-800">
                                {currentQuestionData.text}
                              </FormLabel>
                            </div>
                            {/* <p className="text-xs text-slate-600">
                            {currentQuestionData.description}
                          </p> */}
                          </div>
                        </div>

                        {/* Slider Input Section */}
                        <FormControl>
                          <div className="p-4 space-y-4 border shadow-sm bg-gradient-to-br from-primary-green-50 to-primary-green-100 rounded-xl border-slate-200">
                            {/* Value Display Above Slider */}
                            <div className="text-center">
                              <div className="inline-block px-4 py-2 rounded-lg shadow-sm bg-white/90 text-primary-blue-600">
                                <div className="text-2xl font-bold">
                                  {getCurrentFieldValue()}/10
                                </div>
                                {/* <div className="text-xs font-medium">
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
                                className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-slate-200 slider"
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
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <div className="text-xs font-medium text-slate-600">
                                  <span className="font-bold">1</span> -{" "}
                                  {currentQuestionData.lowLabel}
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-xs font-medium text-slate-600">
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

                  {/* Clear Assessment Button */}
                  {/* <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      onClick={handleDeleteAssessment}
                      disabled={isDeleting || isSubmitting}
                      variant="outline"
                      className="h-8 px-4 text-xs transition-all duration-200 text-slate-600 hover:text-red-600 border-slate-300 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <>
                          <svg
                            className="mr-2 animate-spin size-3"
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
                          Clearing...
                        </>
                      ) : (
                        "Clear Assessment"
                      )}
                    </Button>
                  </div> */}

                  {/* Navigation Buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row border-slate-200">
                    {/* Previous Button */}
                    <Button
                      type="button"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestion === 0}
                      className="flex items-center justify-center w-full h-10 gap-2 font-medium transition-all duration-200 bg-white border rounded-lg sm:flex-1 border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <ArrowLeft className="transition-transform duration-200 size-4 group-hover:-translate-x-1" />
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
                              className="mr-2 text-white animate-spin size-4"
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
                            <Award className="transition-transform duration-200 size-4 group-hover:rotate-12" />
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
                        <ArrowRight className="transition-transform duration-200 size-4 group-hover:translate-x-1" />
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
