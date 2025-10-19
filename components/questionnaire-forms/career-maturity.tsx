"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Target,
  HelpCircle,
  Users,
  Brain,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  Compass,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";

const ResponseSchema = z.enum(["agree", "disagree"]);

export type AnswerChoice = "agree" | "disagree";
export type Category = "Concern" | "Curiosity" | "Confidence" | "Consultation";

const CareerAssessmentFormSchema = z.object({
  q1: ResponseSchema.optional(),
  q2: ResponseSchema.optional(),
  q3: ResponseSchema.optional(),
  q4: ResponseSchema.optional(),
  q5: ResponseSchema.optional(),
  q6: ResponseSchema.optional(),
  q7: ResponseSchema.optional(),
  q8: ResponseSchema.optional(),
  q9: ResponseSchema.optional(),
  q10: ResponseSchema.optional(),
  q11: ResponseSchema.optional(),
  q12: ResponseSchema.optional(),
  q13: ResponseSchema.optional(),
  q14: ResponseSchema.optional(),
  q15: ResponseSchema.optional(),
  q16: ResponseSchema.optional(),
  q17: ResponseSchema.optional(),
  q18: ResponseSchema.optional(),
  q19: ResponseSchema.optional(),
  q20: ResponseSchema.optional(),
  q21: ResponseSchema.optional(),
  q22: ResponseSchema.optional(),
  q23: ResponseSchema.optional(),
  q24: ResponseSchema.optional(),
});

type FormData = z.infer<typeof CareerAssessmentFormSchema>;

const questions = [
  {
    id: "q1",
    statement:
      "There is no point in deciding on a job when the future is so uncertain.",
    category: "Future Planning",
    icon: Target,
    color: "primary-blue",
  },
  {
    id: "q2",
    statement: "I know very little about the requirements of jobs.",
    category: "Job Knowledge",
    icon: BookOpen,
    color: "primary-green",
  },
  {
    id: "q3",
    statement:
      "I have so many interests that it is hard to choose just one occupation.",
    category: "Decision Making",
    icon: Brain,
    color: "purple",
  },
  {
    id: "q4",
    statement: "Choosing a job is something that you do on your own.",
    category: "Independence",
    icon: Users,
    color: "orange",
  },
  {
    id: "q5",
    statement:
      "I can't seem to become very concerned about my future occupation.",
    category: "Motivation",
    icon: Target,
    color: "primary-blue",
  },
  {
    id: "q6",
    statement:
      "I don't know how to go about getting into the kind of work I want to do.",
    category: "Planning Process",
    icon: Compass,
    color: "primary-green",
  },
  {
    id: "q7",
    statement:
      "Everyone seems to tell me something different; as a result I don't know what kind of work to choose.",
    category: "External Influence",
    icon: HelpCircle,
    color: "purple",
  },
  {
    id: "q8",
    statement:
      "If you have doubts about what you want to do, ask your parents or friends for advice.",
    category: "Seeking Support",
    icon: Users,
    color: "orange",
  },
  {
    id: "q9",
    statement: "I seldom think about the job that I want to enter.",
    category: "Career Reflection",
    icon: Brain,
    color: "primary-blue",
  },
  {
    id: "q10",
    statement:
      "I am having difficulty in preparing myself for the work that I want to do.",
    category: "Preparation",
    icon: BookOpen,
    color: "primary-green",
  },
  {
    id: "q11",
    statement: "I keep changing my occupational choice.",
    category: "Decision Stability",
    icon: Target,
    color: "purple",
  },
  {
    id: "q12",
    statement:
      "When it comes to choosing a career, I will ask other people to help me.",
    category: "Collaborative Decision",
    icon: Users,
    color: "orange",
  },
  {
    id: "q13",
    statement:
      "I'm not going to worry about choosing an occupation until I am out of school.",
    category: "Timing",
    icon: Compass,
    color: "primary-blue",
  },
  {
    id: "q14",
    statement: "I don't know what courses I should take in school.",
    category: "Academic Planning",
    icon: BookOpen,
    color: "primary-green",
  },
  {
    id: "q15",
    statement:
      "I often daydream about what I want to be, but I really have not chosen an occupation yet.",
    category: "Decision Action",
    icon: Brain,
    color: "purple",
  },
  {
    id: "q16",
    statement:
      "I will choose my career without paying attention to the feelings of other people.",
    category: "Independence",
    icon: Target,
    color: "orange",
  },
  {
    id: "q17",
    statement:
      "As far as choosing an occupation is concerned, something will come along sooner or later.",
    category: "Passive Approach",
    icon: Compass,
    color: "primary-blue",
  },
  {
    id: "q18",
    statement: "I don't know whether my occupational plans are realistic.",
    category: "Reality Testing",
    icon: HelpCircle,
    color: "primary-green",
  },
  {
    id: "q19",
    statement:
      "There are so many things to consider in choosing an occupation, it is hard to make a decision.",
    category: "Complexity",
    icon: Brain,
    color: "purple",
  },
  {
    id: "q20",
    statement:
      "It is important to consult close friends and get their ideas before making an occupational choice.",
    category: "Social Input",
    icon: Users,
    color: "orange",
  },
  {
    id: "q21",
    statement: "I really can't find any work that has much appeal to me.",
    category: "Interest Level",
    icon: Target,
    color: "primary-blue",
  },
  {
    id: "q22",
    statement:
      "I keep wondering how I can reconcile the kind of person I am with the kind of person I want to be in my occupation.",
    category: "Identity Integration",
    icon: Brain,
    color: "primary-green",
  },
  {
    id: "q23",
    statement:
      "I can't understand how some people can be so certain about what they want to do.",
    category: "Certainty",
    icon: HelpCircle,
    color: "purple",
  },
  {
    id: "q24",
    statement:
      "In making career choices, one should pay attention to the thoughts and feelings of family members.",
    category: "Family Influence",
    icon: Users,
    color: "orange",
  },
];

export const answerKey: Record<number, AnswerChoice> = {
  1: "disagree",
  5: "disagree",
  9: "disagree",
  13: "disagree",
  17: "disagree",
  21: "disagree", // Concern
  2: "disagree",
  6: "disagree",
  10: "disagree",
  14: "disagree",
  18: "disagree",
  22: "disagree", // Curiosity
  3: "disagree",
  7: "disagree",
  11: "disagree",
  15: "disagree",
  19: "disagree",
  23: "disagree", // Confidence
  4: "disagree",
  8: "agree",
  12: "agree",
  16: "disagree",
  20: "agree",
  24: "agree", // Consultation
};

export const categoryMap: Record<Category, number[]> = {
  Concern: [1, 5, 9, 13, 17, 21],
  Curiosity: [2, 6, 10, 14, 18, 22],
  Confidence: [3, 7, 11, 15, 19, 23],
  Consultation: [4, 8, 12, 16, 20, 24],
};

export const categoryDescriptions: Record<Category, string> = {
  Concern: `Concern refers to an individual's awareness of the importance of career planning and their orientation toward the future. It reflects how much an individual thinks about, prepares for, and feels responsible for their career development.`,
  Curiosity: `Curiosity refers to how an individual seeks information about themselves and the world of work. It involves exploring career options and reflecting on personal interests and values.`,
  Confidence: `Confidence refers to an individual's belief in their ability to make and implement career decisions successfully. It reflects persistence in planning and executing career plans.`,
  Consultation: `Consultation refers to the willingness to seek and utilize advice from others during the career decision-making process. It reflects openness to external input and collaborative decision-making.`,
};

const questionPages = [
  {
    // title: "Career Planning & Future Orientation",
    title: "Section 1",
    description:
      "Questions about your approach to career planning and future thinking",
    questions: questions.slice(0, 6), // Questions 1-6
    icon: Target,
    color: "primary-blue",
  },
  {
    // title: "Decision Making & Support Systems",
    title: "Section 2",
    description: "Questions about how you make decisions and seek support",
    questions: questions.slice(6, 12), // Questions 7-12
    icon: Users,
    color: "primary-green",
  },
  {
    // title: "Self-Awareness & Preparation",
    title: "Section 3",
    description: "Questions about self-understanding and career preparation",
    questions: questions.slice(12, 18), // Questions 13-18
    icon: Brain,
    color: "purple",
  },
  {
    // title: "Decision Complexity & Social Influence",
    title: "Section 4",
    description: "Questions about decision complexity and external influences",
    questions: questions.slice(18, 24), // Questions 19-24
    icon: HelpCircle,
    color: "orange",
  },
];

const defaultValues: FormData = {
  q1: undefined,
  q2: undefined,
  q3: undefined,
  q4: undefined,
  q5: undefined,
  q6: undefined,
  q7: undefined,
  q8: undefined,
  q9: undefined,
  q10: undefined,
  q11: undefined,
  q12: undefined,
  q13: undefined,
  q14: undefined,
  q15: undefined,
  q16: undefined,
  q17: undefined,
  q18: undefined,
  q19: undefined,
  q20: undefined,
  q21: undefined,
  q22: undefined,
  q23: undefined,
  q24: undefined,
};

export function CareerMaturity({ sessionId }: { sessionId: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Career Maturity Assessment-1");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  const form = useForm<FormData>({
    resolver: zodResolver(CareerAssessmentFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { watch, reset, control, formState } = form;
  const watchedValues = watch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const nextPage = useCallback(
    (event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (currentPage < questionPages.length - 1) {
        setCurrentPage(currentPage + 1);
      }
    },
    [currentPage]
  );

  const prevPage = useCallback(
    (event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    },
    [currentPage]
  );

  const getPageCompletionStatus = useCallback(
    (pageIndex: number) => {
      const pageQuestions = questionPages[pageIndex].questions;
      const answeredInPage = pageQuestions.filter(
        (q) => watchedValues[q.id as keyof FormData] !== undefined
      ).length;
      return {
        answered: answeredInPage,
        total: pageQuestions.length,
        isComplete: answeredInPage === pageQuestions.length,
      };
    },
    [watchedValues]
  );

  const goToPage = useCallback(
    (pageIndex: number, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const currentPageStatus = getPageCompletionStatus(currentPage);
      if (pageIndex <= currentPage || currentPageStatus.isComplete) {
        setCurrentPage(pageIndex);
      }
    },
    [currentPage, getPageCompletionStatus]
  );

  useEffect(() => {
    async function fetchData() {
      const qId = "career-maturity";
      setIsLoading(true);
      try {
        const res = await fetch(`/api/journey/sessions/${sessionId}/q/${qId}`);
        if (res.ok) {
          const savedAnswers = await res.json();
          if (
            savedAnswers &&
            typeof savedAnswers === "object" &&
            !Array.isArray(savedAnswers)
          ) {
            const mergedData = {
              ...defaultValues,
              ...savedAnswers,
            };
            reset(mergedData);
          } else {
            reset(defaultValues);
          }
        }
      } catch (error) {
        console.error("Failed to load saved answers:", error);
        reset(defaultValues);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const qId = "career-maturity";
      const url = `/api/journey/sessions/${sessionId}/q/${qId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsCompleted(true);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      router.push(`/journey/sessions/${sessionId}`);
    }
  };
  const currentPageStatus = getPageCompletionStatus(currentPage);

  const canNavigateToPage = (pageIndex: number) => {
    if (pageIndex <= currentPage) return true;

    for (let i = 0; i < pageIndex; i++) {
      if (!getPageCompletionStatus(i).isComplete) {
        return false;
      }
    }
    return true;
  };

  const currentPageData = questionPages[currentPage];
  const totalAnswered = Object.keys(watchedValues).filter(
    (key) => watchedValues[key as keyof FormData] !== undefined
  ).length;
  const progressPercentage = (totalAnswered / questions.length) * 100;

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
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-green-50 sm:py-8">
        <Card className="max-w-lg mx-auto border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center sm:p-12">
            <div className="relative inline-flex items-center justify-center mb-6 shadow-lg size-20 sm:size-24 bg-gradient-to-r from-primary-green-500 to-primary-green-600 rounded-3xl sm:mb-8">
              <CheckCircle className="text-white size-10 sm:size-12" />
              <div className="absolute flex items-center justify-center rounded-full shadow-md -top-2 -right-2 size-6 sm:size-8 bg-primary-blue-500">
                <Sparkles className="text-white size-3 sm:size-4" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-transparent sm:text-4xl bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text sm:mb-6">
              Thank You!
            </h2>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Your career maturity form has been submitted successfully.
              We&apos;ll review your information and be in touch soon to begin
              your transformative coaching journey.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 sm:p-6">
      <div className="max-w-4xl mx-auto mb-6 sm:mb-12">
        <JourneyBreadcrumbLayout>
          {/* Header Card */}
          {/* <div className="p-4 mb-6 border shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-3xl sm:p-6 sm:mb-8">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center shadow-lg size-12 sm:size-16 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-2xl">
                  <Compass className="text-white size-6 sm:size-8" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-xl font-bold sm:text-2xl lg:text-3xl text-slate-800">
                  Career Maturity Assessment
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                  This assessment explores your attitudes and approaches toward
                  career decision-making. Read each statement carefully and
                  select whether you agree or disagree with it.
                </p>
              </div>
            </div>
          </div> */}

          {/* Compact Page Navigation Dots */}
          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
            {questionPages.map((page, index) => {
              const status = getPageCompletionStatus(index);
              const canNavigate = canNavigateToPage(index);

              return (
                <button
                  key={page.title}
                  type="button"
                  onClick={(e) => goToPage(index, e)}
                  disabled={!canNavigate}
                  className={`
                  size-10 rounded-md font-bold text-xs transition-all duration-300 hover:scale-105 flex justify-center items-center
                  ${
                    index === currentPage
                      ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                      : status.isComplete
                      ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                      : status.answered > 0 && canNavigate
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : canNavigate
                      ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      : "bg-slate-50 text-slate-300 cursor-not-allowed"
                  }
                `}
                >
                  {status.isComplete ? (
                    <CheckCircle className="size-4" />
                  ) : (
                    index + 1
                  )}
                </button>
              );
            })}
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              // Prevent any accidental submissions
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              <div className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-xl">
                <div className="p-4 sm:p-6">
                  <div className="space-y-6">
                    {/* Page Header with Icon */}
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`size-10 bg-gradient-to-br from-${currentPageData.color}-500 to-${currentPageData.color}-600 rounded-lg flex items-center justify-center shadow-md`}
                      >
                        <currentPageData.icon className="text-white size-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-slate-800">
                          {currentPageData.title}
                        </h3>
                        {/* <p className="text-xs text-slate-600">
                        {currentPageData.description}
                      </p> */}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {currentPageData.questions.map((question) => {
                        const questionNumber =
                          questions.findIndex((q) => q.id === question.id) + 1;

                        return (
                          <div
                            key={question.id}
                            className="p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex gap-2 mb-3">
                                  <span className="text-sm font-bold text-slate-500">
                                    Q{questionNumber}:
                                  </span>
                                  <h4 className="text-base font-semibold leading-tight text-slate-800">
                                    {question.statement}
                                  </h4>
                                </div>

                                <Controller
                                  control={control}
                                  name={question.id as keyof FormData}
                                  render={({ field, fieldState }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="flex flex-col justify-end gap-2 sm:flex-row">
                                          <Button
                                            type="button"
                                            disabled={formState.isSubmitting}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();

                                              field.onChange("agree");
                                            }}
                                            className={`
                                            rounded-lg font-medium transition-all duration-300 border-2 flex items-center justify-center gap-2 py-2 px-6 text-sm
                                            ${
                                              field.value === "agree"
                                                ? "bg-primary-green-500 text-white border-primary-green-500 shadow-md scale-[1.02]"
                                                : "bg-white text-slate-700 border-slate-300 hover:bg-primary-green-50 hover:border-primary-green-300"
                                            }
                                          `}
                                          >
                                            <CheckCircle className="size-4" />
                                            Agree
                                          </Button>

                                          <Button
                                            type="button"
                                            disabled={formState.isSubmitting}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();

                                              field.onChange("disagree");
                                            }}
                                            className={`
                                            rounded-lg font-medium transition-all duration-300 border-2 flex items-center justify-center gap-2 py-2 px-6 text-sm
                                            ${
                                              field.value === "disagree"
                                                ? "bg-primary-green-500 text-white border-primary-green-500 shadow-md scale-[1.02]"
                                                : "bg-white text-slate-700 border-slate-300 hover:bg-primary-green-50 hover:border-primary-green-300"
                                            }
                                          `}
                                          >
                                            <CheckCircle className="size-4" />
                                            Disagree
                                          </Button>
                                        </div>
                                      </FormControl>
                                      <FormMessage>
                                        {fieldState.error?.message}
                                      </FormMessage>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row border-slate-200">
                <Button
                  type="button"
                  onClick={(e) => prevPage(e)}
                  disabled={currentPage === 0}
                  className="flex items-center justify-center w-full h-10 gap-2 font-medium transition-all duration-200 bg-white border rounded-lg sm:flex-1 border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ArrowLeft className="transition-transform duration-200 size-4 group-hover:-translate-x-1" />
                  Previous
                </Button>

                {currentPage === questionPages.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={
                      formState.isSubmitting || !currentPageStatus.isComplete
                    }
                    className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                  >
                    {formState.isSubmitting ? (
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
                    onClick={(e) => nextPage(e)}
                    disabled={!currentPageStatus.isComplete}
                    className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                  >
                    Next
                    <ArrowRight className="transition-transform duration-200 size-4 group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
