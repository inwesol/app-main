"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  HelpCircle,
  Users,
  Brain,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Award,
  BookOpen,
  Compass,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Header from "@/components/form-components/header";
import ProgressBar from "@/components/form-components/progress-bar";

const ResponseSchema = z.enum(["agree", "disagree"]);

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

// question Configuration
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

// group questions into logical pages
const questionPages = [
  {
    title: "Career Planning & Future Orientation",
    description:
      "Questions about your approach to career planning and future thinking",
    questions: questions.slice(0, 6), // Questions 1-6
    icon: Target,
    color: "primary-blue",
  },
  {
    title: "Decision Making & Support Systems",
    description: "Questions about how you make decisions and seek support",
    questions: questions.slice(6, 12), // Questions 7-12
    icon: Users,
    color: "primary-green",
  },
  {
    title: "Self-Awareness & Preparation",
    description: "Questions about self-understanding and career preparation",
    questions: questions.slice(12, 18), // Questions 13-18
    icon: Brain,
    color: "purple",
  },
  {
    title: "Decision Complexity & Social Influence",
    description: "Questions about decision complexity and external influences",
    questions: questions.slice(18, 24), // Questions 19-24
    icon: HelpCircle,
    color: "orange",
  },
];

export function CareerMaturity() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(CareerAssessmentFormSchema),
    defaultValues: {},
  });

  const { watch, setValue, reset } = form;
  const watchedValues = watch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < questionPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    const currentPageStatus = getPageCompletionStatus(currentPage);
    if (pageIndex <= currentPage || currentPageStatus.isComplete) {
      setCurrentPage(pageIndex);
    }
  };

  // form data to question-answer format for submission
  const convertToQuestionAnswerFormat = (data: FormData) => {
    const result: Record<string, string> = {};

    Object.entries(data).forEach(([questionId, answer]) => {
      if (answer) {
        const question = questions.find((q) => q.id === questionId);
        if (question) {
          result[question.statement] = answer;
        }
      }
    });

    return result;
  };

  // prefill form on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const res = await fetch("/api/journey/sessions/1/q/career-maturity");
      if (res.ok) {
        const savedAnswers = await res.json();
        reset(savedAnswers);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [reset]);

  // form submit
  const onSubmit = async (data: FormData) => {
    console.log("submitted");
    // setIsLoading(true);
    // const sessionId = 1;
    // const url = `/api/journey/sessions/${sessionId}/q/career-maturity`;
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    // if (response.ok) {
    //   setIsCompleted(true);
    // } else {
    //   alert("Failed to submit. Please try again.");
    // }
    // setIsLoading(false);
  };

  const getPageCompletionStatus = (pageIndex: number) => {
    const pageQuestions = questionPages[pageIndex].questions;
    const answeredInPage = pageQuestions.filter(
      (q) => watchedValues[q.id as keyof FormData] !== undefined
    ).length;
    return {
      answered: answeredInPage,
      total: pageQuestions.length,
      isComplete: answeredInPage === pageQuestions.length,
    };
  };

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
  // const currentPageStatus = getPageCompletionStatus(currentPage);
  const totalAnswered = Object.keys(watchedValues).filter(
    (key) => watchedValues[key as keyof FormData] !== undefined
  ).length;
  const progressPercentage = (totalAnswered / questions.length) * 100;

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 sm:py-8 flex items-center justify-center">
        <Card className="max-w-lg mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="relative inline-flex items-center justify-center size-20 sm:size-24 bg-gradient-to-r from-primary-green-500 to-primary-green-600 rounded-3xl mb-6 sm:mb-8 shadow-lg">
              <CheckCircle className="size-10 sm:size-12 text-white" />
              <div className="absolute -top-2 -right-2 size-6 sm:size-8 bg-primary-blue-500 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="size-3 sm:size-4 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text text-transparent mb-4 sm:mb-6">
              Thank You!
            </h2>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Header
          headerIcon={Compass}
          headerText="Career Maturity"
          headerDescription="This assessment explores your attitudes and approaches toward career
            decision-making. Read each statement carefully and select whether
            you agree or disagree with it."
        />

        {/* Progress Bar */}
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
          {/* <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(totalAnswered / questions.length) * 100}%` }}
            />
          </div> */}
          <ProgressBar progressPercentage={progressPercentage} />
        </div>

        {/* Page Navigation */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {questionPages.map((page, index) => {
            const status = getPageCompletionStatus(index);
            const canNavigate = canNavigateToPage(index);

            return (
              <button
                key={index}
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
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0">
              {/* Header for each page */}
              <div className="bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-t-2xl p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`size-10 sm:size-12 bg-gradient-to-br from-${currentPageData.color}-500 to-${currentPageData.color}-600 rounded-xl sm:2xl flex items-center justify-center shadow-lg`}
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
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-8">
                  {/* Questions for current page */}
                  <div className="space-y-6">
                    {currentPageData.questions.map((question) => {
                      const questionNumber =
                        questions.findIndex((q) => q.id === question.id) + 1;

                      return (
                        <div
                          key={question.id}
                          className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex gap-2 mb-2">
                                <span className="text-base sm:text-lg font-bold text-slate-500">
                                  Q{questionNumber}
                                </span>
                                <h4 className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed mb-4">
                                  &quot;{question.statement}&quot;
                                </h4>
                              </div>

                              <FormField
                                control={form.control}
                                name={question.id as keyof FormData}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                        <Button
                                          type="button"
                                          onClick={() => {
                                            setValue(
                                              question.id as keyof FormData,
                                              "agree"
                                            );
                                          }}
                                          className={`
                                            rounded-full font-semibold transition-all duration-300 border-2 flex items-center justify-center gap-2 sm:py-2 sm:px-8 py-1
                                            ${
                                              field.value === "agree"
                                                ? "bg-primary-green-500 text-white border-primary-green-500 shadow-lg scale-[1.02]"
                                                : "bg-white text-slate-700 border-slate-300 hover:bg-primary-green-50 hover:border-primary-green-300"
                                            }
                                          `}
                                        >
                                          <CheckCircle className="size-5" />
                                          Agree
                                        </Button>

                                        <Button
                                          type="button"
                                          onClick={() => {
                                            setValue(
                                              question.id as keyof FormData,
                                              "disagree"
                                            );
                                          }}
                                          className={`
                                            rounded-full font-semibold transition-all duration-300 border-2 flex items-center justify-center gap-2 sm:py-2 sm:px-8 py-1
                                            ${
                                              field.value === "disagree"
                                                ? "bg-primary-green-500 text-white border-primary-green-500 shadow-lg scale-[1.02]"
                                                : "bg-white text-slate-700 border-slate-300 hover:bg-primary-green-50 hover:border-primary-green-300"
                                            }
                                          `}
                                        >
                                          <CheckCircle className="size-5" />
                                          Disagree
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
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
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="w-full sm:flex-1 h-12 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200 flex items-center justify-center gap-2 bg-white"
              >
                <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform duration-200" />
                Previous Page
              </Button>

              {currentPage === questionPages.length - 1 ? (
                <Button
                  type="submit"
                  // onClick={() => onSubmit}
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
                  onClick={nextPage}
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
    </div>
  );
}
