"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Book,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

export default function CareerStory4() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careerStoryOneData, setCareerStoryOneData] =
    useState<CareerStory1Data | null>(null);
  const [careerStoryThreeData, setCareerStoryThreeData] =
    useState<CareerStory3Data | null>(null);
  const [isLoadingReferences, setIsLoadingReferences] = useState(true);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

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

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "My Story-4 Activity");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  // Load existing data and reference data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingReferences(true);
        setReferenceError(null);

        // Load current form data
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

        // Load reference data in parallel
        await Promise.all([
          // Fetch Career Story 1 data
          fetch(`/api/journey/sessions/1/a/career-story-1`)
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => data && setCareerStoryOneData(data))
            .catch((error) =>
              console.error("Error fetching My Story 1 data:", error)
            ),

          // Fetch Career Story 3 data
          fetch(`/api/journey/sessions/4/a/career-story-3`)
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => data && setCareerStoryThreeData(data))
            .catch((error) =>
              console.error("Error fetching My Story 3 data:", error)
            ),
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load existing data");
        setReferenceError("Failed to load reference data");
      } finally {
        setIsLoading(false);
        setIsLoadingReferences(false);
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
        throw new Error(errorData.message || "Failed to save My Story-4");
      }

      console.log("My Story-4 saved successfully");
      setIsSubmitted(true);

      // Redirect to session page after 2 seconds
      setTimeout(() => {
        router.push(`/journey/sessions/${sessionId}`);
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-50 via-cyan-50 to-primary-blue-50 sm:py-8">
        <Card className="max-w-md mx-auto">
          <div className="px-6 py-8 text-center">
            <Loader2 className="mx-auto mb-4 size-8 text-primary-green-600 animate-spin" />
            <h2 className="mb-2 text-xl font-semibold text-slate-700">
              Loading My Story 4
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-50 via-cyan-50 to-primary-blue-50 sm:py-8">
        <Card className="max-w-md mx-auto border-red-200">
          <div className="px-6 py-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600 size-8" />
            <h2 className="mb-2 text-xl font-semibold text-red-700">
              Error Loading Data
            </h2>
            <p className="mb-4 text-red-600">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                window.location.reload();
              }}
              variant="outline"
              className="text-red-700 border-red-200 hover:bg-red-50"
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
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-50 via-cyan-50 to-primary-blue-50 sm:py-8">
        <Card className="max-w-2xl mx-auto shadow-xl bg-gradient-to-r from-primary-green-50 to-emerald-50 border-primary-green-200">
          <div className="px-6 py-12 text-center">
            <div className="mb-6">
              <CheckCircle className="mx-auto mb-4 size-16 text-primary-green-600" />
              <h2 className="mb-2 text-3xl font-bold text-primary-green-800">
                Thank You!
              </h2>
              <p className="text-lg text-primary-green-700">
                Your My Story-4 Activity has been saved successfully.
              </p>
            </div>
            <div className="mb-8 space-y-3 text-sm text-primary-green-600">
              <p>✓ Transition story rewritten with success formula</p>
              <p>✓ Self-advice integrated into your narrative</p>
              <p>✓ Future direction clearly articulated</p>
              <p>✓ Personal growth journey documented</p>
            </div>
            <p className="text-sm text-slate-500">
              Redirecting you back to your session...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Story Transformation Guide */}
          <div className="p-4 mb-4 border bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-lg border-primary-green-200/40">
            <h4 className="flex items-center gap-2 mb-3 text-sm font-semibold text-primary-green-800">
              <RefreshCw className="size-4" />
              Story Transformation Guide
            </h4>
            <div className="space-y-3 text-sm text-emerald-700">
              <div className="p-3 border rounded-md bg-white/60 border-emerald-200/40">
                <p className="mb-1 font-semibold">1. Revisit Your My Story</p>
                <p className="text-slate-600">
                  Revisit the story you wrote in My Story-1, about the changes
                  you&apos;re facing and the decisions you may need to make.
                </p>
              </div>
              <div className="p-3 border rounded-md bg-white/60 border-emerald-200/40">
                <p className="mb-1 font-semibold">
                  2. Reflect on Your Excellence Formula
                </p>
                <p className="text-slate-600">
                  Next, reflect on your excellence formula and the advice you
                  gave yourself in My Story-3 to consider this as direction for
                  yourself.
                </p>
              </div>
              <div className="p-3 border rounded-md bg-white/60 border-emerald-200/40">
                <p className="mb-1 font-semibold">3. Revise Your Essay</p>
                <p className="text-slate-600">
                  Now, using these insights, revise the essay from My Story-1
                  and describe how you plan to navigate this transition and the
                  choices ahead.
                </p>
              </div>
            </div>
          </div>

          {/* Reference Cards */}
          <div className="grid gap-4 mb-6 md:grid-cols-2">
            {/* Career Story 1 Reference */}
            <Sheet>
              <SheetTrigger asChild>
                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-primary-blue-50/50 to-cyan-50/50 border-primary-blue-100/60 hover:border-primary-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary-blue-100">
                        <Book className="size-4 text-primary-blue-600" />
                      </div>
                      <CardTitle className="text-base text-primary-blue-600">
                        My Story-1 Activity Reference
                      </CardTitle>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {isLoadingReferences
                        ? "Loading your My Story-1..."
                        : "Review your transition essay"}
                    </p>
                    <div className="p-3 border bg-gradient-to-r from-primary-blue-100/50 to-cyan-100/50 rounded-lg border-primary-blue-200/40">
                      <h4 className="text-sm font-semibold text-primary-blue-600 mb-1">
                        Transition Essay
                      </h4>
                      <p className="text-xs text-primary-blue-700 line-clamp-2">
                        {careerStoryOneData?.transitionEssay
                          ? `${careerStoryOneData.transitionEssay.substring(
                              0,
                              100
                            )}...`
                          : "Loading your transition essay..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </SheetTrigger>
              <SheetContent className="min-w-[340px] sm:min-w-[600px] overflow-y-scroll bg-gradient-to-r from-primary-blue-100 to-white">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold text-primary-blue-600">
                    My Story-1 Activity
                  </SheetTitle>
                  <SheetDescription>
                    Review your transition essay
                  </SheetDescription>
                </SheetHeader>

                {/* Original Transition Essay */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-sm font-medium text-slate-600">
                      Transition Essay
                    </h4>
                  </div>
                  <div className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-blue-200/60">
                    <h5 className="mb-2 font-semibold text-primary-blue-600">
                      Transition Challenge
                    </h5>
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                      {careerStoryOneData?.transitionEssay ||
                        "No transition essay available"}
                    </p>
                  </div>
                </div>

                {/* Occupations */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-sm font-medium text-slate-600">
                      Occupations You Listed
                    </h4>
                  </div>
                  <div className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-blue-200/60">
                    <h5 className="mb-2 font-semibold text-primary-blue-600">
                      Career Interests
                    </h5>
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                      {careerStoryOneData?.occupations ||
                        "No occupations listed"}
                    </p>
                  </div>
                </div>

                {/* Heroes */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-sm font-medium text-slate-600">
                      Your Role Models
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {careerStoryOneData?.heroes?.map((hero, index) => (
                      <div
                        key={hero.id}
                        className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-blue-200/60"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center rounded-full shadow-md shrink-0 size-6 bg-primary-blue-600">
                            <span className="text-xs font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-primary-blue-600">
                              {hero.title}
                            </h5>
                            <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                              {hero.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favorite Story & Saying */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-sm font-medium text-slate-600">
                      Your Favorite Story & Saying
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-blue-200/60">
                      <h5 className="mb-2 font-semibold text-primary-blue-600">
                        Favorite Story
                      </h5>
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                        {careerStoryOneData?.favoriteStory ||
                          "No favorite story available"}
                      </p>
                    </div>
                    <div className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-blue-200/60">
                      <h5 className="mb-2 font-semibold text-primary-blue-600">
                        Favorite Saying
                      </h5>
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                        {careerStoryOneData?.favoriteSaying ||
                          "No favorite saying available"}
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Career Story 3 Reference */}
            <Sheet>
              <SheetTrigger asChild>
                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-primary-green-50/50 to-emerald-50/50 border-primary-green-100/60 hover:border-primary-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary-green-100">
                        <Sparkles className="size-4 text-primary-green-600" />
                      </div>
                      <CardTitle className="text-base text-primary-green-600">
                        My Story-3 Activity Reference
                      </CardTitle>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {isLoadingReferences
                        ? "Loading your success formula..."
                        : "Review your excellence formula"}
                    </p>
                    <div className="p-3 border bg-gradient-to-r from-primary-green-100/50 to-emerald-100/50 rounded-lg border-primary-green-200/40">
                      <h4 className="text-sm font-semibold text-primary-green-600 mb-1">
                        Excellence Formula
                      </h4>
                      <p className="text-xs text-primary-green-700 line-clamp-2">
                        {careerStoryThreeData?.ableToBeStatement
                          ? `${careerStoryThreeData.ableToBeStatement.substring(
                              0,
                              100
                            )}...`
                          : "Loading your success formula..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </SheetTrigger>
              <SheetContent className="min-w-[340px] sm:min-w-[600px] overflow-y-scroll bg-gradient-to-r from-primary-green-100 to-white">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold text-primary-green-600">
                    My Story-3 Activity
                  </SheetTitle>
                  <SheetDescription>
                    Review your excellence formula
                  </SheetDescription>
                </SheetHeader>

                {/* Excellence Formula */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-sm font-medium text-slate-600">
                      Your Excellence Formula
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-green-200/60">
                      <h5 className="mb-2 font-semibold text-primary-green-600">
                        &quot;I will be most happy and excel when I am able to
                        be...&quot;
                      </h5>
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                        {careerStoryThreeData?.ableToBeStatement ||
                          "No statement available"}
                      </p>
                    </div>
                    <div className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-green-200/60">
                      <h5 className="mb-2 font-semibold text-primary-green-600">
                        &quot;I will be most happy and excel in places where
                        people...&quot;
                      </h5>
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                        {careerStoryThreeData?.placesWhereStatement ||
                          "No statement available"}
                      </p>
                    </div>
                    <div className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-green-200/60">
                      <h5 className="mb-2 font-semibold text-primary-green-600">
                        &quot;I will be most happy and excel so that I
                        can...&quot;
                      </h5>
                      <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                        {careerStoryThreeData?.soThatStatement ||
                          "No statement available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Motto */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-sm font-medium text-slate-600">
                      Your Favorite Saying
                    </h4>
                  </div>
                  <div className="p-4 border shadow-md bg-white/90 rounded-xl border-primary-green-200/60">
                    <h5 className="mb-2 font-semibold text-primary-green-600">
                      Your Best Advice to Yourself
                    </h5>
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                      {careerStoryThreeData?.mottoStatement ||
                        "No motto available"}
                    </p>
                  </div>
                </div>

                {/* Selected Occupations */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-sm font-medium text-slate-600">
                      Occupations You&apos;re Considering
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {careerStoryThreeData?.selectedOccupations?.map(
                      (occupation, index) => (
                        <div
                          key={occupation}
                          className="flex items-center gap-3 p-3 border rounded-lg bg-white/90 border-primary-green-200/50"
                        >
                          <div className="flex items-center justify-center text-xs font-bold text-white rounded-full size-6 bg-primary-green-500">
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

          {/* Main Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="rewrittenStory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-semibold text-slate-700">
                      Rewrite Your Story
                    </FormLabel>
                    <FormControl>
                      <div className="relative p-1.5 space-y-1 border shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-slate-200">
                        <div className="space-y-3">
                          <Textarea
                            {...field}
                            placeholder="Begin rewriting your story here... How will you use your success formula to navigate this transition? What specific steps will you take based on your self-advice? Paint a picture of your successful journey ahead..."
                            rows={12}
                            className="min-h-[200px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 md:text-lg"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2 text-xs border-t text-slate-500 border-slate-200/50">
                          <span className="flex items-center gap-1">
                            <RefreshCw className="size-3" />
                            Take your time to reflect and write thoughtfully
                          </span>
                          <span className="font-medium">
                            {getWordCount(field.value)} words |{" "}
                            {getCharacterCount(field.value)}/2000
                          </span>
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

              {/* Submit Button */}
              <div className="text-center pb-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="relative px-10 py-4 text-lg font-bold text-white transition-all duration-300 shadow-2xl group bg-gradient-to-r from-emerald-500 via-cyan-500 to-primary-blue-500 rounded-2xl hover:from-emerald-600 hover:via-cyan-600 hover:to-primary-blue-600 hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 size-5 animate-spin" />
                  )}
                  <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-r from-emerald-400 via-cyan-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50" />
                  <div className="relative flex items-center gap-3">
                    <span>
                      {isSubmitting
                        ? "Saving Your Story..."
                        : "Save Rewritten Story"}
                    </span>
                    {!isSubmitting && (
                      <ArrowRight className="transition-transform duration-200 size-5 group-hover:translate-x-1" />
                    )}
                  </div>
                </Button>
                {/* <p className="mt-3 text-sm text-slate-500">
                  {isSubmitting
                    ? "Please wait while we save your rewritten story..."
                    : "Your story transformation will be saved securely"}
                </p> */}
              </div>
            </form>
          </Form>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
