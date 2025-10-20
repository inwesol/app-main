"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle,
  Sparkles,
  Award,
} from "lucide-react";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import {
  postCoachingSdqSchema,
  sdqScoringConfig,
  impactScoringConfig,
} from "@/lib/form-validation-schemas/questionnaire-schemas/post-coaching-sdq-schema";

type FormData = z.infer<typeof postCoachingSdqSchema>;

interface Question {
  id: number | string;
  text: string;
  category: string;
  responseValues?: string[];
  conditional?: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    text: "I try to be nice to other people. I care about their feelings",
    category: "prosocial",
  },
  {
    id: 2,
    text: "I am restless, I cannot stay still for long",
    category: "hyperactivity",
  },
  {
    id: 3,
    text: "I get a lot of headaches, stomach-aches or sickness",
    category: "emotional",
  },
  {
    id: 4,
    text: "I usually share with others, for example CD’s, games, food",
    category: "prosocial",
  },
  {
    id: 5,
    text: "I get very angry and often lose my temper",
    category: "conduct",
  },
  {
    id: 6,
    text: "I would rather be alone than with people of my age",
    category: "peer",
  },
  { id: 7, text: "I usually do as I am told", category: "conduct" },
  {
    id: 8,
    text: "I worry a lot",
    category: "emotional",
  },
  {
    id: 9,
    text: "I am helpful if someone is hurt, upset or feeling ill",
    category: "prosocial",
  },
  {
    id: 10,
    text: "I am constantly fidgeting or squirming",
    category: "hyperactivity",
  },
  {
    id: 11,
    text: "I have one good friend or more",
    category: "peer",
  },
  {
    id: 12,
    text: "I fight a lot. I can make other people do what I want",
    category: "conduct",
  },
  {
    id: 13,
    text: "I am often unhappy, depressed or tearful",
    category: "emotional",
  },
  { id: 14, text: "Other people my age generally like me", category: "peer" },
  {
    id: 15,
    text: "I am easily distracted, I find it difficult to concentrate",
    category: "hyperactivity",
  },
  {
    id: 16,
    text: "I am nervous in new situations. I easily lose confidence",
    category: "emotional",
  },
  { id: 17, text: "I am kind to younger children", category: "prosocial" },
  {
    id: 18,
    text: "I am often accused of lying or cheating",
    category: "conduct",
  },
  {
    id: 19,
    text: "Other children or young people pick on me or bully me",
    category: "peer",
  },
  {
    id: 20,
    text: "I often offer to help others (parents, teachers, children)",
    category: "prosocial",
  },
  {
    id: 21,
    text: "I think before I do things",
    category: "hyperactivity",
  },
  {
    id: 22,
    text: "I take things that are not mine from home, school or elsewhere",
    category: "conduct",
  },
  {
    id: 23,
    text: "I get along better with adults than with people my own age",
    category: "peer",
  },
  {
    id: 24,
    text: "I have many fears, I am easily scared",
    category: "emotional",
  },
  {
    id: 25,
    text: "I finish the work I'm doing. My attention is good",
    category: "hyperactivity",
  },
];

// Impact assessment questions
const impactQuestions = [
  {
    id: 26,
    text: "Overall, do you think that you have difficulties in any of the following areas: emotions, concentration, behavior or being able to get on with other people?",
    category: "impact",
    responseValues: [
      "No",
      "Yes - minor difficulties",
      "Yes - definite difficulties",
      "Yes - severe difficulties",
    ],
  },
  {
    id: "26a",
    text: "How long have these difficulties been present?",
    category: "impact",
    responseValues: [
      "Less than a month",
      "1 - 5 months",
      "6-12 months",
      "Over a year",
    ],
    conditional: true,
  },
  {
    id: "26b",
    text: "Do the difficulties upset or distress you?",
    category: "impact",
    responseValues: [
      "Not at all",
      "Only a little",
      "A medium amount",
      "A great deal",
    ],
    conditional: true,
  },
  {
    id: "26c",
    text: "Do the difficulties interfere with your everyday life in the HOME LIFE?",
    category: "impact",
    responseValues: [
      "Not at all",
      "Only a little",
      "A medium amount",
      "A great deal",
    ],
    conditional: true,
  },
  {
    id: "26d",
    text: "Do the difficulties interfere with your everyday life in the FRIENDSHIPS?",
    category: "impact",
    responseValues: [
      "Not at all",
      "Only a little",
      "A medium amount",
      "A great deal",
    ],
    conditional: true,
  },
  {
    id: "26e",
    text: "Do the difficulties interfere with your everyday life in the CLASSROOM LEARNING?",
    category: "impact",
    responseValues: [
      "Not at all",
      "Only a little",
      "A medium amount",
      "A great deal",
    ],
    conditional: true,
  },
  {
    id: "26f",
    text: "Do the difficulties interfere with your everyday life in the LEISURE ACTIVITIES?",
    category: "impact",
    responseValues: [
      "Not at all",
      "Only a little",
      "A medium amount",
      "A great deal",
    ],
    conditional: true,
  },
  {
    id: "26g",
    text: "Do the difficulties make it harder for those around you (family, friends, teachers, etc.)?",
    category: "impact",
    responseValues: [
      "Not at all",
      "Only a little",
      "A medium amount",
      "A great deal",
    ],
    conditional: true,
  },
];

// Main sections configuration
const mainSections = [
  {
    id: "sdq-assessment",
    title: "Section 1: Strengths & Difficulties Assessment",
    description:
      "Questions about your emotional well-being, behavior, and relationships",
    questionPages: [
      {
        title: "Emotional Symptoms",
        description: "Questions about your emotional well-being and feelings",
        questions: questions.slice(0, 5), // Questions 1-5
        icon: Brain,
        color: "primary-blue",
      },
      {
        title: "Conduct Problems",
        description: "Questions about your behavior and conduct",
        questions: questions.slice(5, 10), // Questions 6-10
        icon: CheckCircle,
        color: "primary-green",
      },
      {
        title: "Hyperactivity & Inattention",
        description: "Questions about your focus and activity levels",
        questions: questions.slice(10, 15), // Questions 11-15
        icon: Brain,
        color: "purple",
      },
      {
        title: "Peer Problems",
        description: "Questions about your relationships with others",
        questions: questions.slice(15, 20), // Questions 16-20
        icon: CheckCircle,
        color: "orange",
      },
      {
        title: "Prosocial Behavior",
        description: "Questions about your helpful and caring behavior",
        questions: questions.slice(20, 25), // Questions 21-25
        icon: Brain,
        color: "primary-green",
      },
    ],
  },
  {
    id: "impact-assessment",
    title: "Section 2: Impact Assessment",
    description: "Questions about how difficulties affect your daily life",
    questionPages: [
      {
        title: "Impact Questions",
        description:
          "Questions about the impact of difficulties on your daily life",
        questions: impactQuestions,
        icon: CheckCircle,
        color: "primary-blue",
      },
    ],
  },
];

// Flattened questionPages for backward compatibility
const questionPages = mainSections.flatMap((section) => section.questionPages);

const allowedAnswers = ["Not True", "Somewhat True", "Certainly True"] as const;

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
  q25: undefined,
  // Impact assessment questions
  q26: undefined,
  q26a: undefined,
  q26b: undefined,
  q26c: undefined,
  q26d: undefined,
  q26e: undefined,
  q26f: undefined,
  q26g: undefined,
};

export default function PostCoachingSDQ({ sessionId }: { sessionId: string }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(
      sessionId,
      "Strengths & Difficulties Assessment-2"
    );
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  const form = useForm<FormData>({
    resolver: zodResolver(postCoachingSdqSchema),
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

      const currentSectionData = mainSections[currentSection];
      const isLastPageInSection =
        currentPage === currentSectionData.questionPages.length - 1;

      if (isLastPageInSection) {
        // Move to next section
        if (currentSection < mainSections.length - 1) {
          setCurrentSection(currentSection + 1);
          setCurrentPage(0);
        }
      } else {
        // Move to next page in current section
        setCurrentPage(currentPage + 1);
      }
    },
    [currentSection, currentPage]
  );

  const prevPage = useCallback(
    (event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else if (currentSection > 0) {
        // Move to previous section's last page
        const prevSection = mainSections[currentSection - 1];
        setCurrentSection(currentSection - 1);
        setCurrentPage(prevSection.questionPages.length - 1);
      }
    },
    [currentSection, currentPage]
  );

  const getPageCompletionStatus = useCallback(
    (sectionIndex: number, pageIndex: number) => {
      const sectionData = mainSections[sectionIndex];
      const pageQuestions = sectionData.questionPages[pageIndex].questions;

      if (sectionIndex === 1) {
        // For Section 2 (Impact Assessment), only Q26 is required
        // If Q26 is "No", then the page is complete
        // If Q26 is not "No", then all questions are required
        const q26Answer = watchedValues.q26;
        if (q26Answer === "No") {
          return {
            answered: 1,
            total: 1,
            isComplete: true,
          };
        } else if (q26Answer && (q26Answer as string) !== "No") {
          // All questions are required when Q26 is not "No"
          const answeredInPage = pageQuestions.filter((q) => {
            const fieldName = `q${q.id}` as keyof FormData;
            return watchedValues[fieldName] !== undefined;
          }).length;
          return {
            answered: answeredInPage,
            total: pageQuestions.length,
            isComplete: answeredInPage === pageQuestions.length,
          };
        } else {
          // Q26 not answered yet
          const answeredInPage = pageQuestions.filter((q) => {
            const fieldName = `q${q.id}` as keyof FormData;
            return watchedValues[fieldName] !== undefined;
          }).length;
          return {
            answered: answeredInPage,
            total: pageQuestions.length,
            isComplete: false,
          };
        }
      } else {
        // For Section 1, all questions are required
        const answeredInPage = pageQuestions.filter((q) => {
          const fieldName = `q${q.id}` as keyof FormData;
          return watchedValues[fieldName] !== undefined;
        }).length;
        return {
          answered: answeredInPage,
          total: pageQuestions.length,
          isComplete: answeredInPage === pageQuestions.length,
        };
      }
    },
    [watchedValues]
  );

  const getSectionCompletionStatus = useCallback(
    (sectionIndex: number) => {
      const sectionData = mainSections[sectionIndex];

      if (sectionIndex === 1) {
        // For Section 2 (Impact Assessment), only Q26 is required
        // If Q26 is "No", then the section is complete
        // If Q26 is not "No", then all questions are required
        const q26Answer = watchedValues.q26;
        if (q26Answer === "No") {
          return {
            answered: 1,
            total: 1,
            isComplete: true,
          };
        } else if (q26Answer && (q26Answer as string) !== "No") {
          // All questions are required when Q26 is not "No"
          let totalAnswered = 0;
          let totalQuestions = 0;

          sectionData.questionPages.forEach((page) => {
            page.questions.forEach((q) => {
              totalQuestions++;
              const fieldName = `q${q.id}` as keyof FormData;
              if (watchedValues[fieldName] !== undefined) {
                totalAnswered++;
              }
            });
          });

          return {
            answered: totalAnswered,
            total: totalQuestions,
            isComplete: totalAnswered === totalQuestions,
          };
        } else {
          // Q26 not answered yet
          return {
            answered: 0,
            total: 1,
            isComplete: false,
          };
        }
      } else {
        // For Section 1, all questions are required
        let totalAnswered = 0;
        let totalQuestions = 0;

        sectionData.questionPages.forEach((page) => {
          page.questions.forEach((q) => {
            totalQuestions++;
            const fieldName = `q${q.id}` as keyof FormData;
            if (watchedValues[fieldName] !== undefined) {
              totalAnswered++;
            }
          });
        });

        return {
          answered: totalAnswered,
          total: totalQuestions,
          isComplete: totalAnswered === totalQuestions,
        };
      }
    },
    [watchedValues]
  );

  const goToSection = useCallback(
    (sectionIndex: number, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Only allow navigation to next section if current section is complete
      if (
        sectionIndex <= currentSection ||
        getSectionCompletionStatus(currentSection).isComplete
      ) {
        setCurrentSection(sectionIndex);
        setCurrentPage(0);
      }
    },
    [currentSection, getSectionCompletionStatus]
  );

  const goToPage = useCallback(
    (pageIndex: number, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const currentPageStatus = getPageCompletionStatus(
        currentSection,
        currentPage
      );
      if (pageIndex <= currentPage || currentPageStatus.isComplete) {
        setCurrentPage(pageIndex);
      }
    },
    [currentSection, currentPage, getPageCompletionStatus]
  );

  useEffect(() => {
    async function fetchData() {
      const qId = "post-coaching-strength-difficulty";
      setIsLoading(true);
      try {
        const res = await fetch(`/api/journey/sessions/${sessionId}/q/${qId}`);
        if (res.ok) {
          const savedData = await res.json();
          console.log("Fetched post-coaching SDQ data:", savedData);
          if (
            savedData &&
            typeof savedData === "object" &&
            !Array.isArray(savedData) &&
            savedData.answers
          ) {
            const mergedData = {
              ...defaultValues,
              ...savedData.answers,
            };
            console.log("Merged data for post-coaching form:", mergedData);
            // Use setTimeout to ensure form is fully initialized before reset
            setTimeout(() => {
              reset(mergedData);
            }, 100);
          } else {
            console.log(
              "No valid answers found for post-coaching, using default values"
            );
            reset(defaultValues);
          }
        } else if (res.status === 404) {
          console.log(
            "No post-coaching data found (404), using default values"
          );
          reset(defaultValues);
        } else {
          console.log(
            "Failed to fetch post-coaching data, status:",
            res.status
          );
          reset(defaultValues);
        }
      } catch (error) {
        console.error("Failed to load saved answers:", error);
        reset(defaultValues);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [reset, sessionId]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Calculate SDQ scores
      const scores = calculateSdqScores(data);

      const qId = "post-coaching-strength-difficulty";
      const url = `/api/journey/sessions/${sessionId}/q/${qId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: data,
          score: scores.totalScore,
          subscaleScores: scores.subscaleScores,
        }),
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

  const calculateImpactScore = (data: FormData) => {
    if (data.q26 === "No" || !data.q26) return 0;

    const impactQuestions = ["q26b", "q26c", "q26d", "q26e", "q26f"];
    return impactQuestions.reduce((score, questionId) => {
      const answer = data[questionId as keyof FormData];
      if (
        answer &&
        typeof answer === "string" &&
        answer in impactScoringConfig.impactResponseValues
      ) {
        return (
          score +
          impactScoringConfig.impactResponseValues[
            answer as keyof typeof impactScoringConfig.impactResponseValues
          ]
        );
      }
      return score;
    }, 0);
  };

  const calculateSdqScores = (data: FormData) => {
    const subscaleScores: Record<string, number> = {
      emotionalSymptoms: 0,
      conductProblems: 0,
      hyperactivityInattention: 0,
      peerProblems: 0,
      prosocialBehavior: 0,
    };

    let totalScore = 0;

    // Calculate subscale scores
    Object.entries(sdqScoringConfig.subscales).forEach(
      ([subscale, questionIds]) => {
        let subscaleScore = 0;
        questionIds.forEach((questionId) => {
          const answer = data[`q${questionId}` as keyof FormData];
          if (answer) {
            let score =
              sdqScoringConfig.responseValues[
                answer as keyof typeof sdqScoringConfig.responseValues
              ] || 0;

            // Apply reverse scoring for certain questions
            if (
              sdqScoringConfig.reverseScoredQuestions.includes(
                questionId as any
              )
            ) {
              score = 2 - score; // Reverse: 0->2, 1->1, 2->0
            }

            subscaleScore += score;

            // Don't add prosocialBehavior subscale to total score
            if (subscale !== "prosocialBehavior") {
              totalScore += score;
            }
          }
        });
        subscaleScores[subscale] = subscaleScore;
      }
    );

    // Only add impact score if Q26 is not "No"
    if (data.q26 && data.q26 !== "No") {
      const impactScore = calculateImpactScore(data);
      subscaleScores.impactScore = impactScore;
    }
    // Note: impactScore is not added to totalScore (similar to prosocialBehavior)

    return {
      totalScore,
      subscaleScores,
    };
  };

  const currentPageStatus = getPageCompletionStatus(
    currentSection,
    currentPage
  );
  const currentSectionData = mainSections[currentSection];
  const currentPageData = currentSectionData.questionPages[currentPage];
  const isLastPageInSection =
    currentPage === currentSectionData.questionPages.length - 1;
  const isLastSection = currentSection === mainSections.length - 1;
  const isFirstSection = currentSection === 0;
  const isFirstPage = currentPage === 0;

  const canNavigateToPage = (pageIndex: number) => {
    if (pageIndex <= currentPage) return true;

    for (let i = 0; i < pageIndex; i++) {
      if (!getPageCompletionStatus(currentSection, i).isComplete) {
        return false;
      }
    }
    return true;
  };

  const canNavigateToSection = (sectionIndex: number) => {
    if (sectionIndex <= currentSection) return true;

    for (let i = 0; i < sectionIndex; i++) {
      if (!getSectionCompletionStatus(i).isComplete) {
        return false;
      }
    }
    return true;
  };

  const totalAnswered = Object.keys(watchedValues).filter(
    (key) => watchedValues[key as keyof FormData] !== undefined
  ).length;
  const totalQuestions = questions.length + impactQuestions.length;
  const progressPercentage = (totalAnswered / totalQuestions) * 100;

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
              Your post-coaching SDQ assessment has been submitted successfully.
              We&apos;ll review your information and be in touch soon to
              continue your transformative coaching journey.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto mb-6 sm:mb-12">
        <JourneyBreadcrumbLayout>
          {/* Section Navigation */}
          <div className="flex gap-3 justify-center mb-6">
            {mainSections.map((section, sectionIndex) => {
              const sectionStatus = getSectionCompletionStatus(sectionIndex);
              const canNavigate = canNavigateToSection(sectionIndex);
              const isActive = sectionIndex === currentSection;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={(e) => goToSection(sectionIndex, e)}
                  disabled={!canNavigate}
                  className={`
                    px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2
                    ${
                      isActive
                        ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                        : sectionStatus.isComplete
                        ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                        : canNavigate
                        ? "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                        : "bg-slate-50 text-slate-400 cursor-not-allowed"
                    }
                  `}
                >
                  {sectionStatus.isComplete && !isActive && (
                    <CheckCircle className="size-4" />
                  )}
                  {section.title}
                </button>
              );
            })}
          </div>

          {/* Page Navigation Dots - Only show for Section 1 */}
          {currentSection === 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
              {currentSectionData.questionPages.map((page, pageIndex) => {
                const status = getPageCompletionStatus(
                  currentSection,
                  pageIndex
                );
                const canNavigate = canNavigateToPage(pageIndex);
                const isActive = pageIndex === currentPage;

                return (
                  <button
                    key={page.title}
                    type="button"
                    onClick={(e) => goToPage(pageIndex, e)}
                    disabled={!canNavigate}
                    className={`
                    size-10 rounded-md font-bold text-xs transition-all duration-300 hover:scale-105 flex justify-center items-center
                    ${
                      isActive
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
                      pageIndex + 1
                    )}
                  </button>
                );
              })}
            </div>
          )}

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
                    <div className="space-y-4">
                      {currentPageData.questions.map(
                        (question, questionIndex) => {
                          const questionNumber =
                            currentSection === 1
                              ? questionIndex + 1
                              : question.id;
                          const fieldName = `q${question.id}` as keyof FormData;
                          const isConditional = question.conditional || false;
                          const shouldShow =
                            !isConditional ||
                            (isConditional &&
                              watchedValues.q26 &&
                              watchedValues.q26 !== "No");

                          if (!shouldShow) return null;

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
                                      {question.text}
                                    </h4>
                                  </div>

                                  <Controller
                                    control={control}
                                    name={fieldName}
                                    render={({ field, fieldState }) => (
                                      <FormItem>
                                        <FormControl>
                                          <div className="flex flex-col gap-2 sm:flex-row">
                                            {(
                                              question.responseValues ||
                                              allowedAnswers
                                            ).map((answer: string) => (
                                              <Button
                                                key={answer}
                                                type="button"
                                                disabled={
                                                  formState.isSubmitting
                                                }
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  field.onChange(answer);
                                                }}
                                                className={`
                                                  rounded-lg font-medium transition-all duration-300 border-2 flex items-center justify-center gap-2 py-2 px-6 text-sm flex-1
                                                  ${
                                                    field.value === answer
                                                      ? "bg-primary-green-500 text-white border-primary-green-500 shadow-md scale-[1.02]"
                                                      : "bg-white text-slate-700 border-slate-300 hover:bg-primary-green-50 hover:border-primary-green-300"
                                                  }
                                                `}
                                              >
                                                <CheckCircle className="size-4" />
                                                {answer}
                                              </Button>
                                            ))}
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
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row border-slate-200">
                <Button
                  type="button"
                  onClick={(e) => prevPage(e)}
                  disabled={isFirstSection && isFirstPage}
                  className="flex items-center justify-center w-full h-10 gap-2 font-medium transition-all duration-200 bg-white border rounded-lg sm:flex-1 border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ArrowLeft className="transition-transform duration-200 size-4 group-hover:-translate-x-1" />
                  Previous
                </Button>

                {isLastSection && isLastPageInSection ? (
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
                    {isLastPageInSection ? "Next Section" : "Next"}
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
