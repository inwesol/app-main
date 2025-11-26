"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Target,
  Camera,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  lifeCollageSchema,
  type LifeCollageFormData,
} from "@/lib/form-validation-schemas/activity-schemas/life-collage-schema";
import { CollageCanvas } from "@/components/activity-components/collage-canvas";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { ProsConsDialog } from "@/components/pros-cons-dialog";

export default function LifeCollage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<"present" | "future">(
    "present"
  );
  const [isProsConsEnabled, setIsProsConsEnabled] = useState(false);
  const [isProsConsDialogOpen, setIsProsConsDialogOpen] = useState(false);
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  const form = useForm<LifeCollageFormData>({
    resolver: zodResolver(lifeCollageSchema),
    defaultValues: {
      presentLifeCollage: [],
      futureLifeCollage: [],
    },
  });

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "My Life Collage");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      if (!sessionId) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/my-life-collage`
        );
        if (response.ok) {
          const data = await response.json();
          form.reset(data);
        }

        // Check if pros & cons feature is enabled from journey progress
        const journeyResponse = await fetch("/api/journey");
        if (journeyResponse.ok) {
          const journeyData = await journeyResponse.json();
          const enableByCoach = journeyData.enableByCoach as any;
          setIsProsConsEnabled(enableByCoach?.["mlc:pnc"] === true);
        }
      } catch (error) {
        console.error("Failed to load life collage data:", error);
        toast.error("Failed to load your previous data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionId, form]);

  const onSubmit = async (data: LifeCollageFormData) => {
    console.log("Form submission started with data:", data);

    if (!sessionId) {
      toast.error("Session not found");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(
        "Sending POST request to:",
        `/api/journey/sessions/${sessionId}/a/my-life-collage`
      );

      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/my-life-collage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`Failed to save: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Response data:", result);

      toast.success("Life collage saved successfully!");

      // Redirect to the session page after successful save
      router.push(`/journey/sessions/${sessionId}`);
    } catch (error) {
      console.error("Error saving life collage:", error);
      toast.error(
        `Failed to save your life collage: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg">
          <Loader2 className="size-5 animate-spin text-blue-600" />
          <span className="text-slate-700 font-medium">
            Loading your collage...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <JourneyBreadcrumbLayout>
          {/* Navigation Header */}
          <div className="mb-6">
            <div className="relative flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-200/60">
              {/* Navigation Tabs - Centered */}
              <div className="flex items-center gap-1 bg-slate-100/80 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setActiveSection("present")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === "present"
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-800 hover:bg-white/60"
                  }`}
                >
                  <Camera className="size-4" />
                  <span className="text-sm font-medium">My Present Life</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("future")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === "future"
                      ? "bg-green-500 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-800 hover:bg-white/60"
                  }`}
                >
                  <Target className="size-4" />
                  <span className="text-sm font-medium">My Future Life</span>
                </button>
              </div>

              {/* My Pros & Cons Button - Positioned absolutely on the right */}
              {isProsConsEnabled && (
                <Button
                  onClick={() => setIsProsConsDialogOpen(true)}
                  className="absolute right-4 px-5 py-2.5 font-medium text-white transition-all duration-300 rounded-xl shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-105"
                >
                  <ThumbsUp className="mr-1.5 size-4" />
                  <ThumbsDown className="mr-1.5 size-4" />
                  <span className="text-sm font-medium">My Pros & Cons</span>
                </Button>
              )}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Present Life Section */}
              {activeSection === "present" && (
                <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Camera className="size-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg text-slate-800">
                        My Present Life
                      </CardTitle>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="mb-2">
                        Create a collage that represents your life as it is
                        right now. <br /> Use images, words, photographs,
                        drawings, colored paper, or even bits of fabric from
                        newspapers, magazines, or personal collections. <br />{" "}
                        Focus on capturing what feels most significant to you in
                        your current life, such as:
                      </p>
                      <ul className="list-disc list-inside">
                        <li>Your routines</li>
                        <li>Your emotions</li>
                        <li>Your relationships</li>
                        <li>Your environment</li>
                      </ul>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <FormField
                      control={form.control}
                      name="presentLifeCollage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CollageCanvas
                              elements={field.value}
                              onElementsChange={field.onChange}
                              title=""
                              className="mt-2"
                              sessionId={sessionId}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 mt-2">
                            Drag and drop elements, resize them, and arrange
                            them to tell your current life story
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Future Life Section */}
              {activeSection === "future" && (
                <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="size-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg text-slate-800">
                        My Future Life (3-5 Years)
                      </CardTitle>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="mb-2">
                        Create a collage that visualizes your ideal life three
                        or five years from now. <br /> Gather images, words,
                        photographs, drawings, or materials like colored paper
                        and fabric from newspapers, magazines, or other sources.
                        <br /> Think about:
                      </p>
                      <ul className="list-disc list-inside">
                        <li>Where do you want to be?</li>
                        <li>The people you want around you</li>
                        <li>Your career</li>
                        <li>The lifestyle you aspire to have</li>
                      </ul>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <FormField
                      control={form.control}
                      name="futureLifeCollage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CollageCanvas
                              elements={field.value}
                              onElementsChange={field.onChange}
                              title=""
                              className="mt-2"
                              sessionId={sessionId}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 mt-2">
                            Visualize your aspirations, goals, and the life you
                            want to create
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-3 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setActiveSection(
                      activeSection === "present" ? "future" : "present"
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border-slate-200"
                >
                  {activeSection === "present" ? (
                    <>
                      <ChevronRight className="size-4" />
                      <span>Next: Future Life</span>
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="size-4" />
                      <span>Previous: Present Life</span>
                    </>
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-6 py-2 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Progress</span>
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </JourneyBreadcrumbLayout>
      </div>

      {/* Pros & Cons Dialog */}
      <ProsConsDialog
        isOpen={isProsConsDialogOpen}
        onClose={() => setIsProsConsDialogOpen(false)}
        sessionId={sessionId}
        formId="my-life-collage"
        onSave={(data) => {
          console.log("Pros & Cons saved:", data);
        }}
      />
    </div>
  );
}
