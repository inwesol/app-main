"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/form-components/header";
import RatingButtons from "@/components/form-components/rating-buttons";
import ProgressBar from "@/components/form-components/progress-bar";
import { Card, CardHeader } from "@/components/ui/card";
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

interface Question {
  id: number;
  text: string;
  lowLabel: string;
  highLabel: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Is talkative",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 2,
    text: "Tends to find fault with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 3,
    text: "Does a thorough job",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 4,
    text: "Is depressed, blue",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 5,
    text: "Is original, comes up with new ideas",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 6,
    text: "Is reserved",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 7,
    text: "Is helpful and unselfish with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 8,
    text: "Can be somewhat careless",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 9,
    text: "Is relaxed, handles stress well",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 10,
    text: "Is curious about many different things",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 11,
    text: "Is full of energy",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 12,
    text: "Starts quarrels with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 13,
    text: "Is a reliable worker",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 14,
    text: "Can be tense",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 15,
    text: "Is ingenious, a deep thinker",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 16,
    text: "Generates a lot of enthusiasm",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 17,
    text: "Has a forgiving nature",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 18,
    text: "Tends to be disorganized",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 19,
    text: "Worries a lot",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 20,
    text: "Has an active imagination",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 21,
    text: "Tends to be quiet",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 22,
    text: "Is generally trusting",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 23,
    text: "Tends to be lazy",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 24,
    text: "Is emotionally stable, not easily upset",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 25,
    text: "Is inventive",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 26,
    text: "Has an assertive personality",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 27,
    text: "Can be cold and aloof",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 28,
    text: "Perseveres until the task is finished",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 29,
    text: "Can be moody",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 30,
    text: "Values artistic, aesthetic experiences",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 31,
    text: "Is sometimes shy, inhibited",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 32,
    text: "Is considerate and kind to almost everyone",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 33,
    text: "Does things efficiently",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 34,
    text: "Remains calm in tense situations",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 35,
    text: "Prefers work that is routine",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 36,
    text: "Is outgoing, sociable",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 37,
    text: "Is sometimes rude to others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 38,
    text: "Makes plans and follows through with them",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 39,
    text: "Gets nervous easily",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 40,
    text: "Likes to reflect, play with ideas",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 41,
    text: "Has few artistic interests",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 42,
    text: "Likes to cooperate with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 43,
    text: "Is easily distracted",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 44,
    text: "Is sophisticated in art, music, or literature",
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

  const defaultValues: PersonalityFormData = questions.reduce(
    (acc, question) => {
      acc[question.text as keyof PersonalityFormData] = undefined;
      return acc;
    },
    {} as PersonalityFormData
  );

  const form = useForm<PersonalityFormData>({
    resolver: zodResolver(personalitySchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchSavedData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "/api/journey/sessions/2/q/personality-test"
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
      }
    };
    fetchSavedData();
  }, [form]);

  const onSubmit = async (data: PersonalityFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "/api/journey/sessions/2/q/personality-test",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: data, score: 0 }),
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
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
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Loading...</p>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            Please wait while we prepare your personality test...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Header
          headerIcon={User}
          headerText="Big Five Personality Test"
          headerDescription="Discover your personality across five key dimensions. Rate how much
            you agree with each statement about yourself."
        />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">
              Page {currentPage + 1} of {questionPages.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {totalAnswered} of {questions.length} answered •{" "}
              {Math.round((totalAnswered / questions.length) * 100)}% Complete
            </span>
          </div>
          <ProgressBar progressPercentage={progressPercentage} />
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {questionPages.map((page, index) => {
            const status = getPageCompletionStatus(index);
            const canNavigate = canNavigateToPage(index);

            return (
              <button
                key={index}
                type="button"
                onClick={() => goToPage(index)}
                disabled={!canNavigate}
                className={`
                  p-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2 size-8 justify-center sm:size-10
                  ${
                    index === currentPage
                      ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-lg"
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
                  <CheckCircle className="sm:size-5 size-4" />
                ) : (
                  index + 1
                )}
              </button>
            );
          })}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-2xl p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`size-10 sm:size-12 bg-gradient-to-br from-${currentPageData.color}-500 to-${currentPageData.color}-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <currentPageData.icon className="size-5 sm:size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                      {currentPageData.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm">
                      {currentPageData.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <div className="p-4 sm:p-6">
                <div className="space-y-6">
                  {currentPageData.questions.map((question) => (
                    <FormField
                      key={question.id}
                      control={form.control}
                      name={question.text as keyof PersonalityFormData}
                      render={({ field }) => (
                        <FormItem>
                          <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                            <div className="mb-6">
                              <div className="flex gap-2 mb-4">
                                <span className="text-base sm:text-lg font-bold text-slate-500">
                                  Q{question.id}
                                </span>
                                <FormLabel className="text-base sm:text-lg text-slate-800 leading-relaxed">
                                  I see myself as someone who...
                                  <span className="font-semibold">
                                    &quot;{question.text}&quot;
                                  </span>
                                </FormLabel>
                              </div>
                            </div>

                            <FormControl>
                              <RatingButtons
                                value={field.value}
                                onChange={field.onChange}
                                lowLabel={question.lowLabel}
                                highLabel={question.highLabel}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                    <Button
                      type="button"
                      onClick={() => prevPage()}
                      disabled={currentPage === 0}
                      className="w-full sm:flex-1 h-12 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200 flex items-center justify-center gap-2 bg-white"
                    >
                      <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform duration-200" />
                      Previous Page
                    </Button>

                    {currentPage === questionPages.length - 1 ? (
                      <Button
                        type="submit"
                        disabled={
                          formState.isSubmitting ||
                          !currentPageStatus.isComplete
                        }
                        className="w-full sm:flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-5 animate-spin" />
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
                        onClick={(e) => nextPage(e)}
                        disabled={!currentPageStatus.isComplete}
                        className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                      >
                        Next Page
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default PersonalityTest;
