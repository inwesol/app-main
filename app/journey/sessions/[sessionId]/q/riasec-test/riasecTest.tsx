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
  Info,
  Clock,
  CheckSquare,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Header from "@/components/form-components/header";
import * as z from "zod";

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

export default function RiasecTest() {
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedAnswers: [],
    },
  });

  useEffect(() => {
    async function fetchSavedAnswers() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/journey/sessions/2/q/riasec-test");

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
  }, [form]);

  const watchedAnswers = form.watch("selectedAnswers");
  const totalSelected = watchedAnswers.length;

  const handleClearAll = () => {
    form.setValue("selectedAnswers", []);
    setShowResults(false);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Selected answers:", data.selectedAnswers);
      // Send to backend
      const response = await fetch("/api/journey/sessions/2/q/riasec-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Submission failed");
      setShowResults(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Header
          headerIcon={BarChart3}
          headerText="RIASEC Career Interest Assessment"
          headerDescription="Discover your career personality and explore potential career paths that align with your interests and strengths."
        />

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Info className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                What is RIASEC?
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              RIASEC is a career assessment model that categorizes interests
              into six personality types:
              <span className="font-semibold">
                {" "}
                Realistic, Investigative, Artistic, Social, Enterprising, and
                Conventional.
              </span>
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                How to Take It
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Read each statement carefully and{" "}
              <span className="font-semibold">
                select the ones that describe you
              </span>
              . There are no right or wrong answers - choose based on your
              genuine interests and preferences.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Time & Results
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Takes about <span className="font-semibold">5-10 minutes</span> to
              complete. Your results will show your strongest interest areas and
              suggest compatible career paths.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-slate-200 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Instructions</h3>
            </div>
            <div className="flex-1">
              <div className="grid sm:grid-cols-2 gap-4 text-slate-700">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Read each statement</span>{" "}
                      carefully and think about whether it describes your
                      interests or preferences.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Click to select</span>{" "}
                      statements that resonate with you. You can select as many
                      or as few as you like.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Be honest</span> - choose
                      based on what you genuinely enjoy, not what you think you
                      should like.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      4
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">View your results</span>{" "}
                      to see your interest profile and explore career
                      suggestions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">
                  {totalSelected} of {questions.length} statements selected
                </span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm rounded-lg hover:scale-105"
                  aria-label="Clear all selections"
                >
                  <RotateCcw className="size-4" />
                  Reset All
                </Button>
              </div>
            </div>

            <div className="grid gap-4 mb-6 sm:mb-8 lg:grid-cols-2">
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
                    className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl border-2 ${
                      isSelected
                        ? "border-primary-blue-300"
                        : "border-slate-200"
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
                    <div className="relative p-4 sm:p-6 flex items-center space-x-4 bg-white">
                      <div
                        className={`shrink-0 size-12 sm:size-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                          isSelected
                            ? "bg-primary-blue-500 text-white"
                            : "bg-slate-100 group-hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        <CategoryIcon className="size-5 sm:size-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm sm:text-base font-semibold transition-colors duration-300 leading-relaxed ${
                            isSelected
                              ? "text-slate-800"
                              : "text-slate-700 group-hover:text-slate-900"
                          }`}
                        >
                          {question.text}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <CheckCircle2 className="size-4 sm:size-5 text-primary-green-500" />
                        ) : (
                          <Circle className="size-4 sm:size-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-6 border-t border-slate-200 mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 sm:px-10 sm:py-6 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 sm:size-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Award className="size-5 sm:size-6" />
                    Complete Assessment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center text-slate-600 bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mt-6 sm:mt-8">
          <p className="text-sm sm:text-base leading-relaxed">
            The RIASEC model was developed by psychologist John Holland to help
            people understand their career interests and find suitable work
            environments that match their personality.
          </p>
        </div>
      </div>
    </div>
  );
}
