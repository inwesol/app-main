"use client";
import React, { useEffect, useState } from "react";
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
  BarChart3,
  Award,
  Loader2,
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

const formSchema = z.object({
  selectedAnswers: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

export default function RiasecTest({ sessionId }: { sessionId: string }) {
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
    <div className="p-3 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 sm:p-6">
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
          <div className="p-4 mb-6 border shadow-sm bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-2xl sm:p-6 border-slate-200/60">
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
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Reset Button Only */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm transition-all duration-200 rounded-lg hover:scale-105"
                  aria-label="Clear all selections"
                >
                  <RotateCcw className="mr-2 size-4" />
                  Reset All
                </Button>
              </div>

              {/* Questions Grid - 3 columns */}
              <div className="grid gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                {questions.map((question) => {
                  const selectedAnswers = form.watch("selectedAnswers");
                  const isSelected = selectedAnswers.includes(question.text);
                  const CategoryIcon = categoryInfo[question.category].icon;

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

              {/* Submit Button */}
              <div className="flex justify-center pt-4 border-t border-slate-200/60">
                <Button
                  type="submit"
                  disabled={isSubmitting || watchedAnswers.length === 0}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 sm:size-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Award className="size-4 sm:size-5" />
                      Complete Assessment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Muted footer text without div wrapper */}
          <p className="mt-6 text-xs italic font-light text-center text-slate-500">
            The RIASEC model was developed by psychologist John Holland to help
            people understand their career interests and find suitable work
            environments.
          </p>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
