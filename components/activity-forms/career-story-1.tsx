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
import { ValuesDialog } from "@/components/values-dialog";

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
    isArrayField: true,
  },
  // {
  //   title: "Hero Descriptions",
  //   text: "Then, for each hero or heroine that you mentioned, describe in 2-4 sentences in the space provided below what you admired about them.",
  //   icon: Heart,
  //   color: "orange",
  //   fieldName: "heroDescriptions",
  //   placeholder:
  //     "For each hero you mentioned above, describe what you admired about them. What qualities did they have that inspired you? What made them special to you?",
  //   rows: 5,
  // },
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
  heroes: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Hero name is required"),
        description: z
          .string()
          .min(10, "Please provide a meaningful description"),
      })
    )
    .min(1, "Please add at least one hero"),
  mediaPreferences: z.string().min(1, "Please share your media preferences"),
  favoriteStory: z.string().min(20, "Please describe your favorite story"),
  favoriteSaying: z
    .string()
    .min(1, "Please share your favorite saying or motto"),
});

type CareerStoryOneData = z.infer<typeof careerStoryOneDataSchema>;

interface Hero {
  id: string;
  title: string;
  description: string;
}

interface HeroesArrayFieldProps {
  value: Hero[];
  onChange: (value: Hero[]) => void;
  placeholder: string;
}

function HeroesArrayField({
  value,
  onChange,
  placeholder,
}: HeroesArrayFieldProps) {
  const addHero = () => {
    const newHero: Hero = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      description: "",
    };
    onChange([...value, newHero]);
  };

  const updateHero = (index: number, field: keyof Hero, newValue: string) => {
    const updatedHeroes = [...value];
    updatedHeroes[index] = { ...updatedHeroes[index], [field]: newValue };
    onChange(updatedHeroes);
  };

  const removeHero = (index: number) => {
    const updatedHeroes = value.filter((_, i) => i !== index);
    onChange(updatedHeroes);
  };

  return (
    <div className="space-y-4">
      {value.map((hero, index) => (
        <div
          key={hero.id}
          className="p-4 border rounded-lg bg-white/80 backdrop-blur-sm border-slate-200"
        >
          <div className="pb-4 space-y-3 sm:pb-4">
            <div>
              <label
                htmlFor={`hero-title-${index}`}
                className="block mb-1 text-xs font-medium text-slate-600"
              >
                Name
              </label>
              <input
                id={`hero-title-${index}`}
                type="text"
                value={hero.title}
                onChange={(e) => updateHero(index, "title", e.target.value)}
                placeholder="Enter hero's name"
                className="w-full px-3 py-2 border rounded-md text-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor={`hero-description-${index}`}
                className="block mb-1 text-xs font-medium text-slate-600"
              >
                Description
              </label>
              <Textarea
                id={`hero-description-${index}`}
                value={hero.description}
                onChange={(e) =>
                  updateHero(index, "description", e.target.value)
                }
                placeholder="What did you admire about this person?"
                rows={5}
                className="resize-y min-h-[150px] md:text-md"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeHero(index)}
              className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 sm:text-sm"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      {value.length < 3 && (
        <Button
          type="button"
          variant="outline"
          onClick={addHero}
          className="w-full border-2 border-dashed border-slate-300 hover:border-primary-blue-400 hover:bg-primary-blue-50"
        >
          + Add Hero {value.length + 1}
        </Button>
      )}

      {value.length === 0 && (
        <div className="py-8 text-center text-slate-500">
          <p className="text-sm">{placeholder}</p>
          <Button
            type="button"
            variant="outline"
            onClick={addHero}
            className="mt-3"
          >
            Add Your First Hero
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CareerStory1() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValuesEnabled, setIsValuesEnabled] = useState(false);
  const [isValuesDialogOpen, setIsValuesDialogOpen] = useState(false);
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "My Story-1 Activity");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  const form = useForm<CareerStoryOneData>({
    resolver: zodResolver(careerStoryOneDataSchema),
    defaultValues: {
      transitionEssay: "",
      occupations: "",
      heroes: [],
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
      const qId = "career-story-1";
      try {
        // Load form data
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/${qId}`
        );
        if (response.ok) {
          const data = await response.json();
          // Ensure heroes is an array
          if (!Array.isArray(data.heroes)) {
            data.heroes = [];
          }
          form.reset(data);
        }

        // Check if values feature is enabled from journey progress
        const journeyResponse = await fetch("/api/journey");
        if (journeyResponse.ok) {
          const journeyData = await journeyResponse.json();
          const enableByCoach = journeyData.enableByCoach as any;
          setIsValuesEnabled(enableByCoach?.["cs-1:values"] === true);
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
    const qId = "career-story-1";
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${qId}`,
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">
            Loading your career story...
          </p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mx-auto mb-4 shadow-lg size-16 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-2xl">
              <CheckCircle className="text-white size-8" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">
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
    // <div className="min-h-screen p-3 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 sm:p-6">
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Header Card */}
          {/* <div className="p-4 mb-6 border shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-3xl sm:p-6 sm:mb-12">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center shadow-lg size-12 sm:size-16 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-2xl">
                  <Book className="text-white size-6 sm:size-8" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-xl font-bold sm:text-2xl lg:text-3xl text-slate-800">
                  Career Story Exploration - 1
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                  Discover your true potential through self-reflection, an
                  inward journey that reveals your values, passions, and
                  purpose.
                </p>
              </div>
            </div>
          </div> */}

          {/* Navigation Header with Values Button */}
          <div className="relative flex flex-col items-center gap-4 mb-4 sm:flex-row">
            {/* Compact Question Navigation Dots - Always Centered */}
            <div className="flex flex-wrap gap-1.5 justify-center flex-1">
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
                      : "bg-white text-slate-500 hover:bg-slate-200"
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

            {/* My Values Button - Positioned Absolutely on Right */}
            {isValuesEnabled && (
              <div className="absolute top-0 right-0">
                <Button
                  onClick={() => setIsValuesDialogOpen(true)}
                  className="px-4 py-1.5 font-medium text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-105"
                >
                  <Star className="mr-1 size-4" />
                  My Values
                </Button>
              </div>
            )}
          </div>

          {/* Main Question Card */}
          <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
            {/* Question Content */}
            <CardContent className="p-6 sm:p-8">
              <Form {...form}>
                <div className="space-y-6">
                  <FormField
                    key={currentFieldName}
                    control={form.control}
                    name={currentFieldName}
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        {/* Question Header with Icon */}
                        {/* <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`size-10 bg-gradient-to-br from-${currentQuestionData.color}-500 to-${currentQuestionData.color}-600 rounded-lg flex items-center justify-center shadow-md`}
                          >
                            <currentQuestionData.icon className="text-white size-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-slate-500">
                                Q{currentQuestion + 1}:
                              </span>
                              <FormLabel className="text-base font-semibold leading-tight text-slate-800">
                                {currentQuestionData.title}
                              </FormLabel>
                            </div>
                          </div>
                        </div> */}

                        {/* Question Text */}
                        <div className="mb-4">
                          <p className="text-lg font-medium leading-relaxed text-slate-700">
                            {currentQuestionData.text}
                          </p>
                        </div>

                        {/* Textarea Input Section */}
                        <FormControl>
                          <div className="relative p-1.5 space-y-1 border shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-slate-200">
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
                              {currentFieldName === "heroes" ? (
                                <HeroesArrayField
                                  value={
                                    Array.isArray(field.value)
                                      ? field.value
                                      : []
                                  }
                                  onChange={field.onChange}
                                  placeholder={currentQuestionData.placeholder}
                                />
                              ) : (
                                <Textarea
                                  key={`textarea-${currentFieldName}`}
                                  {...field}
                                  value={
                                    typeof field.value === "string"
                                      ? field.value
                                      : ""
                                  }
                                  placeholder={currentQuestionData.placeholder}
                                  rows={currentQuestionData.rows}
                                  className="min-h-[200px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 md:text-lg"
                                />
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-2 text-xs border-t text-slate-500 border-slate-200/50">
                              <span className="flex items-center gap-1">
                                <PenTool className="size-3" />
                                Take your time to reflect and write thoughtfully
                              </span>
                              <span className="font-medium">
                                {currentFieldName === "heroes"
                                  ? `${(field.value || []).length} heroes`
                                  : `${field.value?.length || 0} characters`}
                              </span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Navigation Buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row border-slate-200">
                    {/* Previous Button */}
                    <Button
                      type="button"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestion === 0}
                      className="flex items-center justify-center w-full h-10 gap-2 font-medium transition-all duration-200 bg-white border rounded-lg sm:flex-1 border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <ArrowLeft className="transition-transform duration-200 size-4 group-hover:-translate-x-1" />
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
                            Saving...
                          </>
                        ) : (
                          <>
                            Complete Story
                            <Award className="transition-transform duration-200 size-4 group-hover:rotate-12" />
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
                        <ArrowRight className="transition-transform duration-200 size-4 group-hover:translate-x-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </JourneyBreadcrumbLayout>
      </div>

      {/* Values Dialog */}
      <ValuesDialog
        isOpen={isValuesDialogOpen}
        onClose={() => setIsValuesDialogOpen(false)}
        sessionId={sessionId}
        formId="career-story-1"
        onSave={(values) => {
          console.log("Values saved:", values);
        }}
      />
    </div>
  );
}
