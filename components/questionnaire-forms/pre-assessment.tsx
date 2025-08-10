"use client";

import { useEffect, useState } from "react";
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
import ProgressBar from "@/components/form-components/progress-bar";
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

export function PreAssessment({ sessionId }: { sessionId: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
      alert("Failed to submit assessment. Please try again.");
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

  // Main assessment form UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="size-16 bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <BarChart3 className="size-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Pre-Coaching Assessment
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            This assessment will help us understand your current state and
            readiness for coaching. Please answer honestly based on how you feel
            right now.
          </p>
        </div>

        {/* Progress Bar Section */}
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
        {/* Question Navigation Dots */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8">
          {questions.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`
                size-10 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex justify-center items-center
                ${
                  index === currentQuestion
                    ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-lg"
                    : index < currentQuestion
                    ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }
              `}
            >
              {index < currentQuestion ? (
                <CheckCircle className="size-5" />
              ) : (
                index + 1
              )}
            </Button>
          ))}
        </div>

        {/* Main Question Card */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
          {/* Question Header */}
          <CardHeader className="bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-t-2xl p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div
                className={`size-14 bg-gradient-to-br from-${currentQuestionData.color}-500 to-${currentQuestionData.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}
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

          {/* Question Content */}
          <CardContent className="sm:p-6 p-4">
            <Form {...form}>
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name={currentFieldName}
                  render={({ field }) => (
                    <FormItem className="space-y-6">
                      {/* Question Text */}
                      <div className="flex gap-2 mb-2">
                        <span className="text-base sm:text-lg font-bold text-slate-500">
                          Q{currentQuestion + 1}
                        </span>
                        <FormLabel className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
                          {currentQuestionData.text}
                        </FormLabel>
                      </div>

                      {/* Slider Input Section */}
                      <FormControl>
                        <div className="space-y-6 sm:p-6 p-4 bg-gradient-to-br from-primary-green-50 to-primary-green-100 rounded-2xl border-2 border-slate-200 shadow-md">
                          {/* Custom Slider */}
                          <div className="relative">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={getCurrentFieldValue()}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
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

                          {/* Slider Labels and Value Display */}
                          <div className="flex justify-between items-center gap-2">
                            <div className="text-center">
                              <div className="font-semibold text-slate-600 text-sm">
                                {currentQuestionData.lowLabel}
                              </div>
                              <div className="text-slate-500 text-xs">(1)</div>
                            </div>

                            <div className="text-center sm:px-6 sm:py-3 px-3 py-1 rounded-xl bg-white/80 shadow-md text-primary-blue-600">
                              <div className="font-bold text-xl sm:text-3xl">
                                {getCurrentFieldValue()}/10
                              </div>
                              <div className="font-semibold text-sm">
                                {getValueText(
                                  getCurrentFieldValue(),
                                  currentQuestionData
                                )}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="font-semibold text-slate-600 text-sm">
                                {currentQuestionData.highLabel}
                              </div>
                              <div className="text-slate-500 text-xs">(10)</div>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                  {/* Previous Button */}
                  <Button
                    type="button"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="w-full sm:flex-1 h-12 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200 flex items-center justify-center gap-2 bg-white"
                  >
                    <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    Previous Page
                  </Button>

                  {/* Next/Submit Button */}
                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      type="button"
                      onClick={form.handleSubmit(handleSubmitAssessment)}
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                    >
                      {isSubmitting ? (
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
                      onClick={goToNextQuestion}
                      className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2"
                    >
                      Next Page
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
