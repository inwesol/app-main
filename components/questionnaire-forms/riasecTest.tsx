"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Wrench,
  Microscope,
  Palette,
  Heart,
  Briefcase,
  FileText,
  Award,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface Question {
  id: number;
  text: string;
  category:
    | "realistic"
    | "investigative"
    | "artistic"
    | "social"
    | "enterprising"
    | "conventional";
}

const questions: Question[] = [
  { id: 1, text: "I like to work on cars", category: "realistic" },
  { id: 2, text: "I like to do puzzles", category: "investigative" },
  {
    id: 3,
    text: "I am good at working independently",
    category: "investigative",
  },
  { id: 4, text: "I like to work in teams", category: "social" },
  {
    id: 5,
    text: "I am an ambitious person, I set goals for myself",
    category: "enterprising",
  },
  {
    id: 6,
    text: "I like to organize things (files, desks/offices)",
    category: "conventional",
  },
  { id: 7, text: "I like to build things", category: "realistic" },
  { id: 8, text: "I like to read about art and music", category: "artistic" },
  {
    id: 9,
    text: "I like to have clear instructions to follow",
    category: "conventional",
  },
  {
    id: 10,
    text: "I like to try to influence or persuade people",
    category: "enterprising",
  },
  { id: 11, text: "I like to do experiments", category: "investigative" },
  { id: 12, text: "I like to teach or train people", category: "social" },
  {
    id: 13,
    text: "I like trying to help people solve their problems",
    category: "social",
  },
  { id: 14, text: "I like to take care of animals", category: "realistic" },
  {
    id: 15,
    text: "I wouldn't mind working 8 hours per day in an office",
    category: "conventional",
  },
  { id: 16, text: "I like selling things", category: "enterprising" },
  { id: 17, text: "I enjoy creative writing", category: "artistic" },
  { id: 18, text: "I enjoy science", category: "investigative" },
  {
    id: 19,
    text: "I am quick to take on new responsibilities",
    category: "enterprising",
  },
  { id: 20, text: "I am interested in healing people", category: "social" },
  {
    id: 21,
    text: "I enjoy trying to figure out how things work",
    category: "investigative",
  },
  {
    id: 22,
    text: "I like putting things together or assembling things",
    category: "realistic",
  },
  { id: 23, text: "I am a creative person", category: "artistic" },
  { id: 24, text: "I pay attention to details", category: "conventional" },
  { id: 25, text: "I like to do filing or typing", category: "conventional" },
  {
    id: 26,
    text: "I like to analyze things (problems/situations)",
    category: "investigative",
  },
  { id: 27, text: "I like to play instruments or sing", category: "artistic" },
  { id: 28, text: "I enjoy learning about other cultures", category: "social" },
  {
    id: 29,
    text: "I would like to start my own business",
    category: "enterprising",
  },
  { id: 30, text: "I like to cook", category: "realistic" },
  { id: 31, text: "I like acting in plays", category: "artistic" },
  { id: 32, text: "I am a practical person", category: "realistic" },
  {
    id: 33,
    text: "I like working with numbers or charts",
    category: "conventional",
  },
  {
    id: 34,
    text: "I like to get into discussions about issues",
    category: "social",
  },
  {
    id: 35,
    text: "I am good at keeping records of my work",
    category: "conventional",
  },
  { id: 36, text: "I like to lead", category: "enterprising" },
  { id: 37, text: "I like working outdoors", category: "realistic" },
  {
    id: 38,
    text: "I would like to work in an office",
    category: "conventional",
  },
  { id: 39, text: "I'm good at math", category: "investigative" },
  { id: 40, text: "I like helping people", category: "social" },
  { id: 41, text: "I like to draw", category: "artistic" },
  { id: 42, text: "I like to give speeches", category: "enterprising" },
];

const questionPages = [
  {
    title: "Section 1",
    description: "Questions about hands-on work and analytical thinking",
    questions: questions.slice(0, 14), // Questions 1-14
    icon: Wrench,
    color: "primary-blue",
  },
  {
    title: "Section 2",
    description: "Questions about creative expression and helping others",
    questions: questions.slice(14, 28), // Questions 15-28
    icon: Palette,
    color: "primary-green",
  },
  {
    title: "Section 3",
    description: "Questions about leadership, business, and systematic work",
    questions: questions.slice(28, 42), // Questions 29-42
    icon: Briefcase,
    color: "purple",
  },
];

const formSchema = z.object({
  selectedAnswers: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

export default function RiasecTest({ sessionId }: { sessionId: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedAnswers: [],
    },
  });

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Interest Assessment");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  useEffect(() => {
    async function fetchSavedAnswers() {
      const qId = "riasec-test";
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/q/${qId}`
        );

        if (response.status === 404) {
          // No saved answers found: reset to default empty array, hide results
          form.reset({ selectedAnswers: [] });
          setShowResults(false);
        } else if (!response.ok) {
          // Other error status
          throw new Error("Failed to fetch saved answers");
        } else {
          // Response OK
          const savedData: { selectedAnswers: string[] } =
            await response.json();

          if (
            savedData &&
            Array.isArray(savedData.selectedAnswers) &&
            savedData.selectedAnswers.length > 0
          ) {
            form.reset({ selectedAnswers: savedData.selectedAnswers });
            setShowResults(true);
          } else {
            // Saved answers empty or missing -> reset and hide results
            form.reset({ selectedAnswers: [] });
            setShowResults(false);
          }
        }
      } catch (error) {
        console.error("Error loading saved answers:", error);

        // On error, also reset form and hide results (optional)
        form.reset({ selectedAnswers: [] });
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedAnswers();
  }, [form, sessionId]);

  const watchedAnswers = form.watch("selectedAnswers");
  const totalSelected = watchedAnswers.length;

  const handleClearAll = () => {
    form.setValue("selectedAnswers", []);
    setShowResults(false);
  };

  // Navigation functions
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
      const answeredInPage = pageQuestions.filter((q) =>
        watchedAnswers.includes(q.text)
      ).length;
      return {
        answered: answeredInPage,
        total: pageQuestions.length,
        isComplete: answeredInPage === pageQuestions.length,
      };
    },
    [watchedAnswers]
  );

  const goToPage = useCallback(
    (pageIndex: number, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // All navigation is enabled - users can freely move between sections
      setCurrentPage(pageIndex);
    },
    []
  );

  const canNavigateToPage = (pageIndex: number) => {
    // All navigation is enabled - users can freely move between sections
    return true;
  };

  const onSubmit = async (data: FormData) => {
    const qId = "riasec-test";
    setIsSubmitting(true);
    try {
      // Send to backend
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/q/${qId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Submission failed");
      setShowResults(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      router.push(`/journey/sessions/${sessionId}`);
    }
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const currentPageData = questionPages[currentPage];
  const currentPageStatus = getPageCompletionStatus(currentPage);

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

  const categoryInfo = {
    realistic: {
      name: "Realistic",
      description: "Hands-on, practical work with tools, machines, or nature",
      icon: Wrench,
    },
    investigative: {
      name: "Investigative",
      description: "Scientific, analytical, and research-oriented work",
      icon: Microscope,
    },
    artistic: {
      name: "Artistic",
      description: "Creative, expressive, and aesthetic work",
      icon: Palette,
    },
    social: {
      name: "Social",
      description: "Helping, teaching, and working with people",
      icon: Heart,
    },
    enterprising: {
      name: "Enterprising",
      description: "Leadership, persuasion, and business-oriented work",
      icon: Briefcase,
    },
    conventional: {
      name: "Conventional",
      description: "Organized, detail-oriented, and systematic work",
      icon: FileText,
    },
  };

  return (
    <div className="p-3  sm:p-6">
      <div className="max-w-6xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Header Card - Matching pre-assessment style */}
          {/* <div className="p-4 mb-6 border shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-3xl sm:p-6 sm:mb-12">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center shadow-lg size-12 sm:size-16 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-2xl">
                  <BarChart3 className="text-white size-6 sm:size-8" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-xl font-bold sm:text-2xl lg:text-3xl text-slate-800">
                  RIASEC Career Interest Assessment
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                  Discover your career personality and explore potential career
                  paths that align with your interests and strengths.
                </p>
              </div>
            </div>
          </div> */}

          {/* Instructions Card */}
          {/* <div className="p-4 mb-6 border shadow-sm bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-2xl sm:p-6 border-slate-200/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center rounded-lg shadow-md size-10 bg-gradient-to-r from-primary-blue-500 to-primary-green-500">
                <BarChart3 className="text-white size-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Instructions</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-sm font-bold text-white rounded-full size-6 bg-primary-blue-500 shrink-0">
                  1
                </div>
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">Read</span> each statement
                  carefully
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-sm font-bold text-white rounded-full size-6 bg-primary-blue-500 shrink-0">
                  2
                </div>
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">Click</span> to select what
                  resonates
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-sm font-bold text-white rounded-full size-6 bg-primary-blue-500 shrink-0">
                  3
                </div>
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">Be honest</span> about your
                  interests
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-sm font-bold text-white rounded-full size-6 bg-primary-blue-500 shrink-0">
                  4
                </div>
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">View results</span> and
                  explore careers
                </p>
              </div>
            </div>
          </div> */}

          {/* Page Navigation Dots with Reset Button */}
          <div className="relative flex items-center justify-center mb-4">
            {/* Page Navigation Dots - Absolutely centered */}
            <div className="flex flex-wrap gap-1.5">
              {questionPages.map((page, index) => {
                const status = getPageCompletionStatus(index);

                return (
                  <button
                    key={page.title}
                    type="button"
                    onClick={(e) => goToPage(index, e)}
                    className={`
                    size-10 rounded-md font-bold text-xs transition-all duration-300 hover:scale-105 flex justify-center items-center
                    ${
                      index === currentPage
                        ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                        : status.isComplete
                        ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                        : status.answered > 0
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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

            {/* Reset Button - Absolutely positioned to the right */}
            <Button
              type="button"
              variant="outline"
              onClick={handleClearAll}
              className="absolute right-0 px-4 py-2 text-sm transition-all duration-200 rounded-lg hover:scale-105"
              aria-label="Clear all selections"
            >
              <RotateCcw className="mr-2 size-4" />
              Reset All
            </Button>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
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

                    {/* Questions Grid - 3 columns */}
                    <div className="grid gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                      {currentPageData.questions.map((question) => {
                        const selectedAnswers = form.watch("selectedAnswers");
                        const isSelected = selectedAnswers.includes(
                          question.text
                        );
                        const CategoryIcon =
                          categoryInfo[question.category].icon;

                        const handleToggle = () => {
                          const currentValue = selectedAnswers;
                          if (isSelected) {
                            form.setValue(
                              "selectedAnswers",
                              currentValue.filter(
                                (answer: string) => answer !== question.text
                              )
                            );
                          } else {
                            form.setValue("selectedAnswers", [
                              ...currentValue,
                              question.text,
                            ]);
                          }
                        };

                        return (
                          <div
                            key={question.id}
                            className={`group relative overflow-hidden rounded-lg shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.01] hover:shadow-md border ${
                              isSelected
                                ? "border-primary-blue-300 bg-primary-blue-50/50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                            onClick={handleToggle}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleToggle();
                              }
                            }}
                          >
                            <div className="relative flex items-start p-3 space-x-3">
                              <div
                                className={`shrink-0 size-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                  isSelected
                                    ? "bg-primary-blue-500 text-white shadow-md"
                                    : "bg-slate-100 group-hover:bg-slate-200 text-slate-600"
                                }`}
                              >
                                <CategoryIcon className="size-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs sm:text-sm font-medium transition-colors duration-200 leading-relaxed ${
                                    isSelected
                                      ? "text-slate-800"
                                      : "text-slate-700 group-hover:text-slate-900"
                                  }`}
                                >
                                  {question.text}
                                </p>
                              </div>

                              <div className="shrink-0 mt-0.5">
                                {isSelected ? (
                                  <CheckCircle2 className="size-3 text-primary-green-500" />
                                ) : (
                                  <Circle className="size-3 text-slate-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
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
                    disabled={isSubmitting || watchedAnswers.length === 0}
                    className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 sm:size-5 animate-spin" />
                        Processing...
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
                    className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2"
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
