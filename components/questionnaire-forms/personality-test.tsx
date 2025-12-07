"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  User,
  Brain,
  Heart,
  Zap,
  Target,
  Award,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RatingButtons from "@/components/form-components/rating-buttons";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface Question {
  id: number;
  text: string;
  lowLabel: string;
  highLabel: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "is talkative",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 2,
    text: "tends to find fault with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 3,
    text: "does a thorough job",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 4,
    text: "is depressed, blue",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 5,
    text: "is original, comes up with new ideas",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 6,
    text: "is reserved",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 7,
    text: "is helpful and unselfish with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 8,
    text: "can be somewhat careless",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 9,
    text: "is relaxed, handles stress well",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 10,
    text: "is curious about many different things",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 11,
    text: "is full of energy",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 12,
    text: "starts quarrels with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 13,
    text: "is a reliable worker",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 14,
    text: "can be tense",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 15,
    text: "is ingenious, a deep thinker",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 16,
    text: "generates a lot of enthusiasm",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 17,
    text: "has a forgiving nature",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 18,
    text: "tends to be disorganized",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 19,
    text: "worries a lot",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 20,
    text: "has an active imagination",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 21,
    text: "tends to be quiet",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 22,
    text: "is generally trusting",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 23,
    text: "tends to be lazy",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 24,
    text: "is emotionally stable, not easily upset",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 25,
    text: "is inventive",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 26,
    text: "has an assertive personality",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 27,
    text: "can be cold and aloof",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 28,
    text: "perseveres until the task is finished",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 29,
    text: "can be moody",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 30,
    text: "values artistic, aesthetic experiences",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 31,
    text: "is sometimes shy, inhibited",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 32,
    text: "is considerate and kind to almost everyone",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 33,
    text: "does things efficiently",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 34,
    text: "remains calm in tense situations",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 35,
    text: "prefers work that is routine",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 36,
    text: "is outgoing, sociable",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 37,
    text: "is sometimes rude to others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 38,
    text: "makes plans and follows through with them",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 39,
    text: "gets nervous easily",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 40,
    text: "likes to reflect, play with ideas",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 41,
    text: "has few artistic interests",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 42,
    text: "likes to cooperate with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 43,
    text: "is easily distracted",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 44,
    text: "is sophisticated in art, music, or literature",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
];

const allowedAnswers = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
] as const;

const personalitySchema = z.object(
  questions.reduce((acc, question) => {
    acc[question.text] = z.enum(allowedAnswers).optional();
    return acc;
  }, {} as Record<string, z.ZodTypeAny>)
);
type PersonalityFormData = z.infer<typeof personalitySchema>;

interface QuestionPage {
  title: string;
  description: string;
  questions: Question[];
  icon: React.ComponentType<any>;
  color: string;
}

const questionPages: QuestionPage[] = [
  {
    title: "Social & Communication Style",
    description:
      "Questions about how you interact with others and express yourself",
    questions: questions.slice(0, 9),
    icon: Zap,
    color: "orange",
  },
  {
    title: "Work Style & Organization",
    description: "Questions about your approach to tasks and responsibilities",
    questions: questions.slice(9, 18),
    icon: Target,
    color: "blue",
  },
  {
    title: "Emotional Patterns & Stress",
    description:
      "Questions about your emotional responses and stress management",
    questions: questions.slice(18, 27),
    icon: Brain,
    color: "purple",
  },
  {
    title: "Creativity & Openness",
    description: "Questions about your openness to new experiences and ideas",
    questions: questions.slice(27, 36),
    icon: User,
    color: "green",
  },
  {
    title: "Relationships & Cooperation",
    description: "Questions about how you relate to and work with others",
    questions: questions.slice(36, 44),
    icon: Heart,
    color: "pink",
  },
];

function PersonalityTest({ sessionId }: { sessionId: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Memoize defaultValues to prevent recreation on every render
  const defaultValues: PersonalityFormData = useMemo(
    () =>
      questions.reduce((acc, question) => {
        acc[question.text as keyof PersonalityFormData] = undefined;
        return acc;
      }, {} as PersonalityFormData),
    []
  );

  const form = useForm<PersonalityFormData>({
    resolver: zodResolver(personalitySchema),
    defaultValues,
  });

  // Use useRef to track if data has been fetched to prevent multiple calls
  const hasFetchedData = useRef(false);

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Personality Assessment");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  useEffect(() => {
    // Prevent multiple API calls
    if (hasFetchedData.current) return;

    const fetchSavedData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/q/personality-test`
        );
        if (response.status === 404) {
          form.reset(defaultValues);
        } else if (!response.ok) {
          throw new Error("Failed to fetch saved answers");
        } else {
          const savedData: Partial<PersonalityFormData> = await response.json();
          form.reset({ ...defaultValues, ...savedData.answers });
        }
      } catch (error) {
        console.error("Error fetching saved answers:", error);
        form.reset(defaultValues);
      } finally {
        setIsLoading(false);
        hasFetchedData.current = true;
      }
    };
    fetchSavedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // Only depend on sessionId - form and defaultValues are stable

  const onSubmit = async (data: PersonalityFormData) => {
    setIsSubmitting(true);
    try {
      // Filter out undefined values and ensure all values are strings
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;

      const response = await fetch(
        `/api/journey/sessions/${sessionId}/q/personality-test`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: filteredData, score: 0 }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Submission failed: ${errorMessage}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error("Submission error:", error);
      // You might want to show a toast notification here
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    } finally {
      setIsSubmitting(false);
      router.push(`/journey/sessions/${sessionId}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  const { watch, formState } = form;
  const watchedValues = watch();

  const getPageCompletionStatus = useCallback(
    (pageIndex: number) => {
      const pageQuestions = questionPages[pageIndex].questions;
      const answeredInPage = pageQuestions.filter(
        (q) => watchedValues[q.text as keyof PersonalityFormData] !== undefined
      ).length;
      return {
        answered: answeredInPage,
        total: pageQuestions.length,
        isComplete: answeredInPage === pageQuestions.length,
      };
    },
    [watchedValues]
  );

  const canNavigateToPage = useCallback(
    (pageIndex: number) => {
      if (pageIndex <= currentPage) return true;

      for (let i = 0; i < pageIndex; i++) {
        if (!getPageCompletionStatus(i).isComplete) {
          return false;
        }
      }
      return true;
    },
    [currentPage, getPageCompletionStatus]
  );

  const goToPage = useCallback(
    (pageIndex: number) => {
      if (canNavigateToPage(pageIndex)) {
        setCurrentPage(pageIndex);
      }
    },
    [canNavigateToPage]
  );

  const currentPageStatus = getPageCompletionStatus(currentPage);

  const currentPageData = questionPages[currentPage];
  const totalAnswered = Object.keys(watchedValues).filter(
    (key) => watchedValues[key as keyof PersonalityFormData] !== undefined
  ).length;
  const progressPercentage = ((currentPage + 1) / questionPages.length) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">Loading...</p>
          <p className="mt-2 text-xs text-slate-600 sm:text-base">
            Please wait while we prepare your personality test...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 sm:p-6">
      <div className="max-w-5xl mx-auto mb-6 sm:mb-12">
        <JourneyBreadcrumbLayout>
          {/* Header Card */}
          {/* <div className="p-4 mb-6 border shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-3xl sm:p-6 sm:mb-8">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center shadow-lg size-12 sm:size-16 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-2xl">
                  <User className="text-white size-6 sm:size-8" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-xl font-bold sm:text-2xl lg:text-3xl text-slate-800">
                  Big Five Personality Test
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                  Discover your personality across five key dimensions. Rate how
                  much you agree with each statement about yourself.
                </p>
              </div>
            </div>
          </div> */}

          {/* Instructions Card */}
          <div className="p-5 mb-6 border shadow-lg bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 rounded-2xl sm:p-6 border-slate-200/60 backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center rounded-xl shadow-lg size-14 bg-gradient-to-br from-primary-blue-500 to-primary-green-500 shrink-0">
                <BarChart3 className="text-white size-6" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-xl font-bold text-slate-800">
                  Instructions
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Read each statement carefully and select the option that best
                  indicates the extent to which you agree or disagree with the
                  statement. <br /> Note: There are no right or wrong answers,
                  respond honestly.
                </p>
              </div>
            </div>
          </div>

          {/* Compact Page Navigation Dots */}
          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
            {questionPages.map((page, index) => {
              const status = getPageCompletionStatus(index);
              const canNavigate = canNavigateToPage(index);

              return (
                <button
                  key={page.title}
                  type="button"
                  onClick={() => goToPage(index)}
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-xl">
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {currentPageData.questions.map((question) => (
                      <FormField
                        key={question.id}
                        control={form.control}
                        name={question.text as keyof PersonalityFormData}
                        render={({ field }) => (
                          <FormItem>
                            <div className="p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                              <div className="mb-4">
                                <div className="flex gap-2 mb-3">
                                  <span className="text-sm font-bold text-slate-500">
                                    Q{question.id}:
                                  </span>
                                  <FormLabel className="text-base leading-tight text-slate-800">
                                    <span className="font-semibold">
                                      I see myself as someone who{" "}
                                      {question.text}
                                    </span>
                                  </FormLabel>
                                </div>
                              </div>

                              <FormControl>
                                <RatingButtons
                                  value={field.value}
                                  onChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}

                    <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row border-slate-200">
                      <Button
                        type="button"
                        onClick={() => prevPage()}
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
                            formState.isSubmitting ||
                            !currentPageStatus.isComplete
                          }
                          className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
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
                  </div>
                </div>
              </Card>
            </form>
          </Form>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}

export default PersonalityTest;
