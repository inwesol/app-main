"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Brain,
  Target,
  Award,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Lightbulb,
  Users,
  Compass,
  Smile,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/form-components/header";
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
import RatingButtonsPsychological from "@/components/form-components/rating-buttons-pshychological";

interface Question {
  id: number;
  text: string;
  lowLabel: string;
  highLabel: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "I am not afraid to voice my opinions, even when they are in opposition to the opinions of most people",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 2,
    text: "For me, life has been a continuous process of learning, changing, and growth",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 3,
    text: "In general, I feel I am in charge of the situation in which I live",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 4,
    text: "People would describe me as a giving person, willing to share my time with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 5,
    text: "I am not interested in activities that will expand my horizons",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 6,
    text: "I enjoy making plans for the future and working to make them a reality",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 7,
    text: "Most people see me as loving and affectionate",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 8,
    text: "In many ways I feel disappointed about my achievements in life",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 9,
    text: "I live life one day at a time and do not really think about the future",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 10,
    text: "I tend to worry about what other people think of me",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 11,
    text: "When I look at the story of my life, I am pleased with how things have turned out",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 12,
    text: "I have difficulty arranging my life in a way that is satisfying to me",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 13,
    text: "My decisions are not usually influenced by what everyone else is doing",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 14,
    text: "I gave up trying to make big improvements or changes in my life a long time ago",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 15,
    text: "The demands of everyday life often get me down",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 16,
    text: "I have not experienced many warm and trusting relationships with others",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 17,
    text: "I think it is important to have new experiences that challenge how you think about yourself and the world",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 18,
    text: "Maintaining close relationships has been difficult and frustrating for me",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 19,
    text: "My attitude about myself is probably not as positive as most people feel about themselves",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 20,
    text: "I have a sense of direction and purpose in life",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 21,
    text: "I judge myself by what I think is important, not by the values of what others think is important",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 22,
    text: "In general, I feel confident and positive about myself",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 23,
    text: "I have been able to build a living environment and a lifestyle for myself that is much to my liking",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 24,
    text: "I tend to be influenced by people with strong opinions",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 25,
    text: "I do not enjoy being in new situations that require me to change my old familiar ways of doing things",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 26,
    text: "I do not fit very well with the people and the community around me",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 27,
    text: "I know that I can trust my friends, and they know they can trust me",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 28,
    text: "When I think about it, I have not really improved much as a person over the years",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 29,
    text: "Some people wander aimlessly through life, but I am not one of them",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 30,
    text: "I often feel lonely because I have few close friends with whom to share my concerns",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 31,
    text: "When I compare myself to friends and acquaintances, it makes me feel good about who I am",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 32,
    text: "I do not have a good sense of what it is I am trying to accomplish in life",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 33,
    text: "I sometimes feel as if I have done all there is to do in life",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 34,
    text: "I feel like many of the people I know have gotten more out of life than I have",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 35,
    text: "I have confidence in my opinions, even if they are contrary to the general consensus",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 36,
    text: "I am quite good at managing the many responsibilities of my daily life",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 37,
    text: "I have the sense that I have developed a lot as a person over time",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 38,
    text: "I enjoy personal and mutual conversations with family members and friends",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 39,
    text: "My daily activities often seem trivial and unimportant to me",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 40,
    text: "I like most parts of my personality",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 41,
    text: "It is difficult for me to voice my own opinions on controversial matters",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
  {
    id: 42,
    text: "I often feel overwhelmed by my responsibilities",
    lowLabel: "Strongly Disagree",
    highLabel: "Strongly Agree",
  },
];

const allowedAnswers = [
  "Strongly Disagree",
  "Somewhat Disagree",
  "A Little Disagree",
  "Neutral",
  "A Little Agree",
  "Somewhat Agree",
  "Strongly Agree",
] as const;

const psychologicalWellbeingSchema = z.object(
  questions.reduce((acc, question) => {
    acc[question.text] = z.enum(allowedAnswers).optional();
    return acc;
  }, {} as Record<string, z.ZodTypeAny>)
);
type PsychologicalWellbeingFormData = z.infer<
  typeof psychologicalWellbeingSchema
>;
interface QuestionPage {
  title: string;
  description: string;
  questions: Question[];
  icon: React.ComponentType<any>;
  color: string;
}
const questionPages: QuestionPage[] = [
  {
    title: "Self-Direction & Independence",
    description: "Questions about your autonomy and self-determination",
    questions: questions.slice(0, 7),
    icon: Shield,
    color: "primary-blue",
  },
  {
    title: "Life Management & Control",
    description:
      "Questions about managing your environment and responsibilities",
    questions: questions.slice(7, 14),
    icon: Target,
    color: "primary-green",
  },
  {
    title: "Growth & Development",
    description: "Questions about personal growth and openness to experiences",
    questions: questions.slice(14, 21),
    icon: Lightbulb,
    color: "primary-blue",
  },
  {
    title: "Relationships & Connection",
    description: "Questions about your relationships and social connections",
    questions: questions.slice(21, 28),
    icon: Users,
    color: "primary-green",
  },
  {
    title: "Purpose & Self-Worth",
    description: "Questions about life purpose and self-acceptance",
    questions: questions.slice(28, 35),
    icon: Compass,
    color: "primary-blue",
  },
  {
    title: "Personal Reflection",
    description: "Final questions about your overall well-being",
    questions: questions.slice(35, 42),
    icon: Smile,
    color: "primary-green",
  },
];

function PsychologicalWellbeing() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: PsychologicalWellbeingFormData = questions.reduce(
    (acc, question) => {
      acc[question.text as keyof PsychologicalWellbeingFormData] = undefined;
      return acc;
    },
    {} as PsychologicalWellbeingFormData
  );

  const form = useForm<PsychologicalWellbeingFormData>({
    resolver: zodResolver(psychologicalWellbeingSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchSavedData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "/api/journey/sessions/3/q/psychological-wellbeing"
        );
        if (response.status === 404) {
          form.reset(defaultValues);
        } else if (!response.ok) {
          throw new Error("Failed to fetch saved answers");
        } else {
          const savedData: Partial<PsychologicalWellbeingFormData> =
            await response.json();
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

  const onSubmit = async (data: PsychologicalWellbeingFormData) => {
    console.log("psychologicalwellbeing data:", data);
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "/api/journey/sessions/3/q/psychological-wellbeing",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: data, score: 0 }),
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      alert("Psychological Wellbeing submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit psychological wellbeing. Please try again.");
    } finally {
      setIsSubmitting(false);
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
      const answeredInPage = pageQuestions.filter((q) => {
        const fieldValue =
          watchedValues[q.text as keyof PsychologicalWellbeingFormData];
        return (
          fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
        );
      }).length;
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

  // Fixed totalAnswered calculation to match the working PersonalityTest component
  const totalAnswered = questions.filter((question) => {
    const fieldValue =
      watchedValues[question.text as keyof PsychologicalWellbeingFormData];
    return fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
  }).length;

  const progressPercentage = ((currentPage + 1) / questionPages.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Loading...</p>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            Please wait while we prepare your psychological wellbeing test...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header
          headerIcon={Brain}
          headerText="Psychological Well-being Assessment"
          headerDescription="Explore your psychological well-being across six key dimensions.
            Rate how much you agree with each statement about yourself."
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
                      name={
                        question.text as keyof PsychologicalWellbeingFormData
                      }
                      render={({ field }) => (
                        <FormItem>
                          <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                            <div className="mb-6">
                              <div className="flex gap-2 mb-4">
                                <span className="text-base sm:text-lg font-bold text-slate-500">
                                  Q{question.id}
                                </span>
                                <FormLabel className="text-base sm:text-lg text-slate-800 leading-relaxed">
                                  <span className="font-semibold">
                                    &quot;{question.text}&quot;
                                  </span>
                                </FormLabel>
                              </div>
                            </div>

                            <FormControl>
                              <RatingButtonsPsychological
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

export default PsychologicalWellbeing;
