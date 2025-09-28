"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, ArrowRight, Target, Camera, Loader2 } from "lucide-react";
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
} from "@/lib/schemas/activity-schemas/life-collage-schema";
import { CollageCanvas } from "@/components/activity-components/collage-canvas";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export default function LifeCollage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  const form = useForm<LifeCollageFormData>({
    resolver: zodResolver(lifeCollageSchema),
    defaultValues: {
      presentLifeCollage: [],
      futureLifeCollage: [],
      retirementValues: "",
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
    if (!sessionId) {
      toast.error("Session not found");
      return;
    }

    setIsSubmitting(true);
    try {
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

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast.success("Life collage saved successfully!");

      // Redirect to the session page after successful save
      router.push(`/journey/sessions/${sessionId}`);
    } catch (error) {
      console.error("Error saving life collage:", error);
      toast.error("Failed to save your life collage");
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
    <div className=" bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Header Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center size-12 sm:size-16 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-2xl shadow-lg">
                  <Palette className="size-6 sm:size-8 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                  My Life Collage
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                  Create visual representations of your current life and future
                  aspirations through interactive collages
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Present Life Section */}
              <Card className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Camera className="size-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">
                      My Present Life
                    </CardTitle>
                  </div>
                  <p className="text-sm text-slate-600">
                    Create a collage representing your life right now using
                    images, words, photographs, or drawings
                  </p>
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
                          Drag and drop elements, resize them, and arrange them
                          to tell your current life story
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Future Life Section */}
              <Card className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="size-5 text-green-600" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">
                      My Future Life (3-5 Years)
                    </CardTitle>
                  </div>
                  <p className="text-sm text-slate-600">
                    Visualize your ideal life three to five years from now -
                    your career, relationships, and lifestyle
                  </p>
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

              {/* Submit Button */}
              <div className="flex justify-end pt-2 pb-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-8 py-3 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Progress</span>
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
