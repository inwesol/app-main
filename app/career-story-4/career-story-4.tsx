"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Book,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { QuestionSection } from "@/components/activity-components/question-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextArea } from "@/components/activity-components/text-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Header from "@/components/form-components/header";

// Form validation schema
const careerStory4Schema = z.object({
  rewrittenStory: z
    .string()
    .min(100, "Your rewritten story must be at least 100 characters long")
    .max(2000, "Your rewritten story must be less than 2000 characters")
    .refine(
      (value) => value.trim().split(/\s+/).length >= 50,
      "Your rewritten story should be at least 50 words long"
    ),
});

type CareerStory4FormData = z.infer<typeof careerStory4Schema>;

interface CareerStory4Props {
  sessionId: string;
}

interface CareerStory1Data {
  transitionEssay: string;
  occupations: string;
  heroes: Array<{ id: string; title: string; description: string }>;
  magazines: string;
  magazineWhy: string;
  favoriteStory: string;
  favoriteSaying: string;
}

interface CareerStory3Data {
  ableToBeStatement: string;
  placesWhereStatement: string;
  soThatStatement: string;
  mottoStatement: string;
  selectedOccupations: string[];
}

export const CareerStory4: React.FC<CareerStory4Props> = ({ sessionId }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // mock data career story 1
  const mockCareerStoryOneData: CareerStory1Data = {
    transitionEssay:
      "I am currently facing a transition from college to the professional world. This is an exciting but challenging time as I close the chapter of my academic journey and begin the next phase of my career. I'm seeking guidance on how to identify my true passions and find a career path that aligns with my values and interests.",
    occupations:
      "Software Developer, UX Designer, Product Manager, Teacher, Entrepreneur, Data Scientist, Marketing Specialist",
    heroes: [
      {
        id: "1",
        title: "Maya Angelou",
        description:
          "I admired her courage to speak truth through her writing and her ability to overcome adversity. She taught me that our experiences, even painful ones, can become sources of strength and wisdom.",
      },
      {
        id: "2",
        title: "Steve Jobs",
        description:
          "His innovative thinking and dedication to creating beautiful, functional products inspired me. I loved how he combined technology with artistry and never compromised on his vision.",
      },
      {
        id: "3",
        title: "Wonder Woman",
        description:
          "She represented justice, compassion, and strength. I admired how she fought for what was right while maintaining her kindness and empathy for others.",
      },
    ],
    magazines:
      "National Geographic, Wired, The Atlantic, Netflix documentaries, TED Talks",
    magazineWhy:
      "I'm drawn to content that explores human potential, scientific discoveries, and innovative solutions to global challenges. I love learning about different cultures and emerging technologies.",
    favoriteStory:
      "My favorite book is 'The Alchemist' by Paulo Coelho. It's about a young shepherd who follows his dreams to find treasure, but discovers that the real treasure was the journey itself. I connect with Santiago's courage to pursue his personal legend despite obstacles and uncertainty.",
    favoriteSaying:
      "'The only way to do great work is to love what you do.' - Steve Jobs. This quote reminds me that passion is essential for meaningful work and that I should never settle for something that doesn't ignite my enthusiasm.",
  };

  // mock data career story 3
  const mockCareerStoryThreeData: CareerStory3Data = {
    ableToBeStatement:
      "I will be most happy and successful when I am able to be creative, collaborative, and authentic in my work while making a positive impact on others.",
    placesWhereStatement:
      "I will be most happy and successful in places where people value innovation, support each other's growth, and work together to solve meaningful challenges.",
    soThatStatement:
      "I will be most happy and successful so that I can help others achieve their potential and create technology solutions that make the world more connected and compassionate.",
    mottoStatement:
      "Follow your curiosity, embrace challenges as opportunities to grow, and never forget that the journey of learning and helping others is the real treasure.",
    selectedOccupations: [
      "Software Developer",
      "UX Designer",
      "Product Manager",
      "Teacher",
    ],
  };

  const form = useForm<CareerStory4FormData>({
    resolver: zodResolver(careerStory4Schema),
    defaultValues: {
      rewrittenStory: "",
    },
    mode: "onChange",
  });

  const {
    watch,
    formState: { errors, isValid },
  } = form;
  const watchedStory = watch("rewrittenStory");

  // Load existing data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/career-story-4`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.rewrittenStory) {
            form.setValue("rewrittenStory", data.rewrittenStory);
          }
        } else if (response.status !== 404) {
          setError("Failed to load existing data");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load existing data");
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadData();
    }
  }, [sessionId, form]);

  const getWordCount = (text: string): number => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const getCharacterCount = (text: string): number => {
    return text.length;
  };

  const onSubmit = async (data: CareerStory4FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/career-story-4`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save career story");
      }

      console.log("Career Story 4 saved successfully");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWriteAnotherStory = () => {
    router.push(`/journey/sessions/${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-primary-blue-50 p-4 sm:py-8 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <div className="text-center py-8 px-6">
            <Loader2 className="size-8 text-primary-green-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              Loading Career Story 4
            </h2>
            <p className="text-slate-500">
              Please wait while we load your data...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-primary-blue-50 p-4 sm:py-8 flex items-center justify-center">
        <Card className="max-w-md mx-auto border-red-200">
          <div className="text-center py-8 px-6">
            <AlertCircle className="size-8 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Error Loading Data
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                window.location.reload();
              }}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-primary-blue-50 p-4 sm:py-8 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary-green-50 to-emerald-50 border-primary-green-200 shadow-xl">
          <div className="text-center py-12 px-6">
            <div className="mb-6">
              <CheckCircle className="size-16 text-primary-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-primary-green-800 mb-2">
                Story Rewritten!
              </h2>
              <p className="text-primary-green-700 text-lg">
                Your Career Story 4 has been saved successfully.
              </p>
            </div>
            <div className="space-y-3 text-sm text-primary-green-600 mb-8">
              <p>✓ Transition story rewritten with success formula</p>
              <p>✓ Self-advice integrated into your narrative</p>
              <p>✓ Future direction clearly articulated</p>
              <p>✓ Personal growth journey documented</p>
            </div>
            <Button
              className="bg-primary-green-600 hover:bg-primary-green-700"
              onClick={handleWriteAnotherStory}
            >
              Write Another Story
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green-50 to-primary-blue-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header
          headerIcon={RefreshCw}
          headerText="Career Story Exploration - 4"
          headerDescription="Rewrite your story with your success formula and self-advice"
        />

        {/* Reference Cards */}
        <div className="mb-8 grid md:grid-cols-2 gap-6">
          {/* Career Story 1 Reference */}
          <Card className="bg-gradient-to-br from-primary-blue-50/50 to-cyan-50/50 border-primary-blue-100/60">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary-blue-100 rounded-lg">
                      <Book className="sm:size-5 text-primary-blue-600 size-4" />
                    </div>
                    <CardTitle className="text-primary-blue-600 text-lg sm:text-xl">
                      Career Story 1 Reference
                    </CardTitle>
                  </div>
                  <div>
                    <Sheet>
                      <SheetTrigger>
                        <Info className="text-primary-blue-600 size-4 sm:size-5" />
                      </SheetTrigger>
                      <SheetContent className="min-w-[340px] sm:min-w-[600px] overflow-y-scroll bg-gradient-to-r from-primary-blue-100 to-white">
                        <SheetHeader>
                          <SheetTitle className="text-primary-blue-600 text-xl font-bold">
                            Career Story 1 - Your Original Transition Essay
                          </SheetTitle>
                          <SheetDescription>
                            Review your original transition essay and career
                            aspirations
                          </SheetDescription>
                        </SheetHeader>

                        {/* Original Transition Essay */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Original Transition Essay
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-primary-blue-200/60 shadow-md">
                            <h5 className="text-primary-blue-600 font-semibold mb-2">
                              Transition Challenge
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryOneData.transitionEssay}
                            </p>
                          </div>
                        </div>

                        {/* Occupations */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Occupations You Listed
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-primary-blue-200/60 shadow-md">
                            <h5 className="text-primary-blue-600 font-semibold mb-2">
                              Career Interests
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryOneData.occupations}
                            </p>
                          </div>
                        </div>

                        {/* Heroes */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Heroes & Role Models
                            </h4>
                          </div>
                          <div className="space-y-4">
                            {mockCareerStoryOneData.heroes.map(
                              (hero, index) => (
                                <div
                                  key={hero.id}
                                  className="bg-white/90 rounded-xl p-4 border border-primary-blue-200/60 shadow-md"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="shrink-0 size-6 bg-primary-blue-600 rounded-full flex items-center justify-center shadow-md">
                                      <span className="text-xs font-bold text-white">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-primary-blue-600 font-semibold">
                                        {hero.title}
                                      </h5>
                                      <p className="text-sm text-slate-600 leading-relaxed">
                                        {hero.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Favorite Story & Saying */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Favorite Story & Saying
                            </h4>
                          </div>
                          <div className="space-y-4">
                            <div className="bg-white/90 rounded-xl p-4 border border-primary-blue-200/60 shadow-md">
                              <h5 className="text-primary-blue-600 font-semibold mb-2">
                                Favorite Story
                              </h5>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {mockCareerStoryOneData.favoriteStory}
                              </p>
                            </div>
                            <div className="bg-white/90 rounded-xl p-4 border border-primary-blue-200/60 shadow-md">
                              <h5 className="text-primary-blue-600 font-semibold mb-2">
                                Favorite Saying
                              </h5>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {mockCareerStoryOneData.favoriteSaying}
                              </p>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Review your original transition essay and career aspirations
                    from Career Story 1.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary-blue-100/50 to-cyan-100/50 rounded-xl p-4 border border-primary-blue-200/40">
                <h4 className="font-semibold text-primary-blue-600 mb-2">
                  Original Challenge
                </h4>
                <p className="text-sm text-primary-blue-700 leading-relaxed">
                  Click the info icon to review your original transition essay
                  and the challenges you identified.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Career Story 3 Reference */}
          <Card className="bg-gradient-to-br from-primary-green-50/50 to-emerald-50/50 border-primary-green-100/60">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary-green-100 rounded-lg">
                      <Sparkles className="sm:size-5 text-primary-green-600 size-4" />
                    </div>
                    <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
                      Career Story 3 Reference
                    </CardTitle>
                  </div>
                  <div>
                    <Sheet>
                      <SheetTrigger>
                        <Info className="text-primary-green-600 size-4 sm:size-5" />
                      </SheetTrigger>
                      <SheetContent className="min-w-[340px] sm:min-w-[600px] overflow-y-scroll bg-gradient-to-r from-primary-green-100 to-white">
                        <SheetHeader>
                          <SheetTitle className="text-primary-green-600 text-xl font-bold">
                            Career Story 3 - Your Success Formula & Advice
                          </SheetTitle>
                          <SheetDescription>
                            Review your excellence formula and personal motto
                            from Career Story 3
                          </SheetDescription>
                        </SheetHeader>

                        {/* Excellence Formula */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Excellence Formula
                            </h4>
                          </div>
                          <div className="space-y-4">
                            <div className="bg-white/90 rounded-xl p-4 border border-primary-green-200/60 shadow-md">
                              <h5 className="text-primary-green-600 font-semibold mb-2">
                                &quot;I will be most happy and successful when I
                                am able to be...&quot;
                              </h5>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {mockCareerStoryThreeData.ableToBeStatement}
                              </p>
                            </div>
                            <div className="bg-white/90 rounded-xl p-4 border border-primary-green-200/60 shadow-md">
                              <h5 className="text-primary-green-600 font-semibold mb-2">
                                &quot;I will be most happy and successful in
                                places where people...&quot;
                              </h5>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {mockCareerStoryThreeData.placesWhereStatement}
                              </p>
                            </div>
                            <div className="bg-white/90 rounded-xl p-4 border border-primary-green-200/60 shadow-md">
                              <h5 className="text-primary-green-600 font-semibold mb-2">
                                &quot;I will be most happy and successful so
                                that I can...&quot;
                              </h5>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {mockCareerStoryThreeData.soThatStatement}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Personal Motto */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Personal Career Motto
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-primary-green-200/60 shadow-md">
                            <h5 className="text-primary-green-600 font-semibold mb-2">
                              Your Best Advice to Yourself
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryThreeData.mottoStatement}
                            </p>
                          </div>
                        </div>

                        {/* Selected Occupations */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Occupations You&apos;re Considering
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {mockCareerStoryThreeData.selectedOccupations.map(
                              (occupation, index) => (
                                <div
                                  key={index}
                                  className="bg-white/90 rounded-lg p-3 border border-primary-green-200/50 flex items-center gap-3"
                                >
                                  <div className="size-6 bg-primary-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm font-medium text-slate-700">
                                    {occupation}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Review your success formula and personal motto from Career
                    Story 3.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary-green-100/50 to-emerald-100/50 rounded-xl p-4 border border-primary-green-200/40">
                <h4 className="font-semibold text-primary-green-600 mb-2">
                  Success Formula & Advice
                </h4>
                <p className="text-sm text-primary-green-700 leading-relaxed">
                  Click the info icon to review your excellence formula and
                  personal career motto.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <QuestionSection
              title="Re-Writing My Story"
              subtitle="Look at Career Story 1 and read your essay about the change or transition you must make or the choices you might take. Then, based on your success formula (Career Story 3) and advice to yourself, think about where your story directs you to go next. Now, use your success formula and self-advice to rework the essay you wrote in Activity 1 to tell about how you will make this transition and these choices."
              icon={<RefreshCw className="size-6 text-primary-green-600" />}
              className="shadow-xl"
            >
              <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-6 border border-primary-green-200/40 mb-6">
                <h4 className="font-semibold text-primary-green-800 mb-4 flex items-center gap-2">
                  <RefreshCw className="size-5" />
                  Story Transformation Guide
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-emerald-700">
                  <div className="bg-white/60 rounded-lg p-3 border border-emerald-200/40">
                    <p className="font-semibold mb-2">1. Review Your Past</p>
                    <p className="text-xs text-slate-600">
                      Look at your original transition essay and career
                      aspirations from Story 1
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-emerald-200/40">
                    <p className="font-semibold mb-2">2. Apply Your Formula</p>
                    <p className="text-xs text-slate-600">
                      Use your success formula and self-advice from Story 3 as
                      your guide
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-emerald-200/40">
                    <p className="font-semibold mb-2">3. Rewrite Your Future</p>
                    <p className="text-xs text-slate-600">
                      Create a new narrative that shows how you&apos;ll make
                      this transition successfully
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="rewrittenStory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      Your Rewritten Story *
                    </FormLabel>
                    <FormDescription className="text-slate-600 leading-relaxed">
                      Rewrite your transition story incorporating your success
                      formula and self-advice. Show how you will navigate this
                      change with confidence and purpose. Minimum 50 words,
                      maximum 2000 characters.
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <TextArea
                          {...field}
                          placeholder="Begin rewriting your story here... How will you use your success formula to navigate this transition? What specific steps will you take based on your self-advice? Paint a picture of your successful journey ahead..."
                          rows={12}
                          className={`resize-none ${
                            errors.rewrittenStory
                              ? "border-red-300 focus:border-red-500"
                              : "border-emerald-300/60 focus:border-emerald-500"
                          } bg-white/80 backdrop-blur-sm shadow-sm`}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded">
                          {getWordCount(field.value)} words |{" "}
                          {getCharacterCount(field.value)}/2000
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="flex items-center gap-2">
                      {errors.rewrittenStory && (
                        <AlertCircle className="size-4" />
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </QuestionSection>

            {/* Writing Tips */}
            <div className="bg-gradient-to-r from-cyan-100/50 to-primary-blue-100/50 rounded-xl p-6 border border-cyan-200/60 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-200 rounded-lg">
                  <Sparkles className="size-5 text-cyan-700" />
                </div>
                <h3 className="text-lg font-semibold text-cyan-800">
                  Writing Tips
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="bg-white/60 rounded-lg p-4 border border-cyan-200/40">
                  <h4 className="font-semibold text-cyan-700 mb-3">
                    Include in Your Story:
                  </h4>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="size-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                      How your success formula will guide your decisions
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="size-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                      Specific actions you&apos;ll take based on your
                      self-advice
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="size-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                      How you&apos;ll overcome challenges mentioned in Story 1
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="size-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                      Your vision for success in this transition
                    </li>
                  </ul>
                </div>
                <div className="bg-white/60 rounded-lg p-4 border border-cyan-200/40">
                  <h4 className="font-semibold text-cyan-700 mb-3">
                    Writing Approach:
                  </h4>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="size-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                      Write in first person (&quot;I will...&quot;)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="size-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                      Be specific about your plans and timeline
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="size-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                      Show confidence and determination
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="size-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></div>
                      Connect past insights to future actions
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-primary-blue-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:via-cyan-600 hover:to-primary-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting && (
                  <Loader2 className="size-5 animate-spin mr-2" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <span>
                    {isSubmitting
                      ? "Saving Your Story..."
                      : "Save Rewritten Story"}
                  </span>
                  {!isSubmitting && (
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </div>
              </Button>
              <p className="text-sm text-slate-500 mt-3">
                {isSubmitting
                  ? "Please wait while we save your rewritten story..."
                  : "Your story transformation will be saved securely"}
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CareerStory4;
