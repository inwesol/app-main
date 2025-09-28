"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import {
  ArrowRight,
  ArrowLeft,
  Book,
  PenTool,
  Star,
  Users,
  Heart,
  Tv,
  Quote,
  CheckCircle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const questions = [
  {
    title: "Current Transition",
    text: "You are probably using this workbook because you are facing some change or transition in your life, maybe from high school to college, from college to work, or from job to job. To bridge transitions, or end one chapter and begin the next, and clarify choices, people look within themselves to their own life story for guidance. Below, write a brief essay about the transition you are now facing.",
    icon: PenTool,
    color: "primary-green",
    fieldName: "transitionEssay",
    placeholder:
      "Write about the transition you are currently facing. What chapter are you closing? What new chapter are you beginning? What guidance are you seeking?",
    rows: 6,
  },
  {
    title: "Career Aspirations",
    text: "Now, list all of the occupations you have thought about doing. List the occupations or jobs you are thinking about doing now and those occupations or jobs you have ever thought about doing in the past. You might have several, just one or two, or none at all.",
    icon: Users,
    color: "primary-blue",
    fieldName: "occupations",
    placeholder:
      "List all occupations you've ever considered, both past and present. Include any job or career that has sparked your interest at any point in your life.",
    rows: 4,
  },
  {
    title: "Childhood Heroes",
    text: "Who did you admire when you were growing up? Who were your heroes or heroines (role models)? List three people, other than your mom and dad, who you admired when you were a child of about six, seven, or eight years old. These can be real people you know or don't know personally, make-believe people like superheroes and cartoon characters, or anybody else you can think of.",
    icon: Star,
    color: "purple",
    fieldName: "heroes",
    placeholder:
      "List three people you admired as a child (ages 6-8). These can be real people, fictional characters, celebrities, teachers, neighbors, or anyone else you looked up to.",
    rows: 4,
  },
  {
    title: "Hero Descriptions",
    text: "Then, for each hero or heroine that you mentioned, describe in 2-4 sentences in the space provided below what you admired about them.",
    icon: Heart,
    color: "orange",
    fieldName: "heroDescriptions",
    placeholder:
      "For each hero you mentioned above, describe what you admired about them. What qualities did they have that inspired you? What made them special to you?",
    rows: 5,
  },
  {
    title: "Media Preferences",
    text: "Do you read any magazines or watch any web series/television shows regularly? Which ones? What do you like about these magazines/web series/television shows?",
    icon: Tv,
    color: "primary-green",
    fieldName: "mediaPreferences",
    placeholder:
      "List any magazines, web series, or TV shows you regularly read or watch. What do you like about them? What draws you to these particular forms of media?",
    rows: 4,
  },
  {
    title: "Favorite Story",
    text: "What is your current favourite story? Think of a book that you read a lot or may have read over and over again. Tell the story of the book. What is the book about? Describe your favourite character in the story. If you don't have a favourite book, what is your favourite movie? Think of a movie that you watch a lot or have seen over and over again. Then, tell the story of the movie.",
    icon: Book,
    color: "primary-blue",
    fieldName: "favoriteStory",
    placeholder:
      "Describe your favorite book or movie. What is the story about? Who is your favorite character and why? What makes this story special to you?",
    rows: 6,
  },
  {
    title: "Favorite Saying",
    text: "What is your favourite saying? Think about a motto you live by or a saying that you have heard and really like. Maybe you've seen some words on a car bumper sticker or have a poster or plaque in your room or house that has words to live by. You might even have more than one saying or motto that you can list here. If you can't think of a saying, you might even create your own and write it down here.",
    icon: Quote,
    color: "purple",
    fieldName: "favoriteSaying",
    placeholder:
      "Share your favorite saying, motto, or words to live by. This could be something you've heard, read, or even created yourself. What does it mean to you?",
    rows: 4,
  },
];

const careerStoryOneDataSchema = z.object({
  transitionEssay: z
    .string()
    .min(20, "Please write at least 20 characters about your transition"),
  occupations: z.string().min(1, "Please list at least one occupation"),
  heroes: z.string().min(1, "Please list at least one hero"),
  heroDescriptions: z
    .string()
    .min(10, "Please describe what you admired about your heroes"),
  mediaPreferences: z.string().min(1, "Please share your media preferences"),
  favoriteStory: z.string().min(20, "Please describe your favorite story"),
  favoriteSaying: z
    .string()
    .min(1, "Please share your favorite saying or motto"),
});

type CareerStoryOneData = z.infer<typeof careerStoryOneDataSchema>;

export default function CareerStory1() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Career Story 1");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  const form = useForm<CareerStoryOneData>({
    resolver: zodResolver(careerStoryOneDataSchema),
    defaultValues: {
      transitionEssay: "",
      occupations: "",
      heroes: "",
      heroDescriptions: "",
      mediaPreferences: "",
      favoriteStory: "",
      favoriteSaying: "",
    },
    mode: "onChange",
  });

  // Load existing data on component mount
  useEffect(() => {
    if (!sessionId) return;

    const loadData = async () => {
      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/career-story-1`
        );
        if (response.ok) {
          const data = await response.json();
          // Convert old heroes array format to new string format if needed
          if (data.heroes && Array.isArray(data.heroes)) {
            data.heroes = data.heroes.map((hero: any) => hero.title).join(", ");
          }
          form.reset(data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionId, form]);

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

  const handleSubmitAssessment = async (data: CareerStoryOneData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/career-story-1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setIsCompleted(true);
      } else {
        throw new Error("Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSubmitting(false);
      router.push(`/journey/sessions/${sessionId}`);
    }
  };

  // Current question data and progress calculation
  const currentQuestionData = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const currentFieldName =
    currentQuestionData.fieldName as keyof CareerStoryOneData;

  // Loading state UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-sm sm:text-base">
            Loading your career story...
          </p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-6">
            <div className="size-16 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <CheckCircle className="size-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Career Story Complete!
            </h2>
            <p className="text-slate-600">
              Thank you for sharing your career story with us.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main assessment form UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Header Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center size-12 sm:size-16 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-2xl shadow-lg">
                  <Book className="size-6 sm:size-8 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                  Career Story Exploration - 1
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                  Discover your true potential through self-reflection, an
                  inward journey that reveals your values, passions, and
                  purpose.
                </p>
              </div>
            </div>
          </div>

          {/* Compact Question Navigation Dots */}
          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
            {questions.map((question, index) => (
              <Button
                key={question.title}
                onClick={() => setCurrentQuestion(index)}
                className={`
                size-8 rounded-md font-bold text-xs transition-all duration-300 hover:scale-105 flex justify-center items-center
                ${
                  index === currentQuestion
                    ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                    : index < currentQuestion
                    ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }
              `}
              >
                {index < currentQuestion ? (
                  <CheckCircle className="size-4" />
                ) : (
                  index + 1
                )}
              </Button>
            ))}
          </div>

          {/* Main Question Card */}
          <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
            {/* Question Content */}
            <CardContent className="p-6 sm:p-8">
              <Form {...form}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name={currentFieldName}
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        {/* Question Header with Icon */}
                        {/* <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`size-10 bg-gradient-to-br from-${currentQuestionData.color}-500 to-${currentQuestionData.color}-600 rounded-lg flex items-center justify-center shadow-md`}
                          >
                            <currentQuestionData.icon className="size-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex gap-2 items-center mb-1">
                              <span className="text-sm font-bold text-slate-500">
                                Q{currentQuestion + 1}:
                              </span>
                              <FormLabel className="text-base font-semibold text-slate-800 leading-tight">
                                {currentQuestionData.title}
                              </FormLabel>
                            </div>
                          </div>
                        </div> */}

                        {/* Question Text */}
                        <div className="mb-4">
                          <p className="text-slate-700 text-lg font-medium leading-relaxed">
                            {currentQuestionData.text}
                          </p>
                        </div>

                        {/* Textarea Input Section */}
                        <FormControl>
                          <div className="relative space-y-1 p-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-sm">
                            {/* Subtle gradient border effect */}
                            {/* <div className="absolute inset-0 bg-gradient-to-r from-primary-blue-500/5 via-primary-green-500/5 to-primary-blue-500/5 rounded-2xl -z-10" /> */}

                            <div className="space-y-3">
                              {/* <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <PenTool className="size-3" />
                                  Take your time to reflect and write
                                  thoughtfully
                                </span>
                              </div> */}
                              <Textarea
                                {...field}
                                placeholder={currentQuestionData.placeholder}
                                rows={currentQuestionData.rows}
                                className="min-h-[200px] resize-y border-slate-300 focus:border-primary-blue-500 focus:ring-2 focus:ring-primary-blue-500/20 rounded-lg transition-all duration-200 bg-white/80 backdrop-blur-sm"
                              />
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-200/50">
                              <span className="flex items-center gap-1">
                                <PenTool className="size-3" />
                                Take your time to reflect and write thoughtfully
                              </span>
                              <span className="font-medium">
                                {field.value?.length || 0} characters
                              </span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                    {/* Previous Button */}
                    <Button
                      type="button"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestion === 0}
                      className="w-full sm:flex-1 h-10 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-200 flex items-center justify-center gap-2 bg-white"
                    >
                      <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-200" />
                      Previous
                    </Button>

                    {/* Next/Submit Button */}
                    {currentQuestion === questions.length - 1 ? (
                      <Button
                        type="button"
                        onClick={form.handleSubmit(handleSubmitAssessment)}
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin size-4 mr-2 text-white"
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
                            Saving...
                          </>
                        ) : (
                          <>
                            Complete Story
                            <Award className="size-4 group-hover:rotate-12 transition-transform duration-200" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={goToNextQuestion}
                        className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2"
                      >
                        Next
                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
