"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Palette,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Calendar,
  Heart,
  Target,
  Camera,
  Scissors,
  Loader2,
} from "lucide-react";
import { QuestionSection } from "@/components/activity-components/question-section";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  lifeCollageSchema,
  type LifeCollageFormData,
} from "@/lib/schemas/activity-schemas/life-collage-schema";
import { CollageCanvas } from "@/components/activity-components/collage-canvas";
import Header from "@/components/form-components/header";
import { useParams } from "next/navigation";

export const LifeCollage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LifeCollageFormData>({
    resolver: zodResolver(lifeCollageSchema),
    defaultValues: {
      presentLifeCollage: [],
      futureLifeCollage: [],
      retirementValues: "",
    },
  });

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
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-primary-blue-50 to-blue-50 relative flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary-blue-600" />
          <span className="text-primary-blue-600 font-medium">
            Loading your collage...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-primary-blue-50 to-blue-50 relative ">
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <Header
          headerIcon={Palette}
          headerText="My Life Collage"
          headerDescription="Create visual representations of your current life and future
            aspirations through interactive collages"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Present Life Section */}
            <Card className="mb-6 bg-blue-50/80 border-primary-blue-200/60 shadow-xl">
              <CardHeader>
                <div>
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary-blue-100 rounded-lg">
                      <Camera className="sm:size-5 text-primary-blue-600 size-4" />
                    </div>
                    <CardTitle className="text-primary-blue-600 text-lg sm:text-xl">
                      Present Life
                    </CardTitle>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                      Create a collage that represents your life as it is right
                      now. Use images, words, photographs, drawings, colored
                      paper, or even bits of fabric from newspapers, magazines,
                      or personal collections
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-primary-blue-100/50 to-primary-blue-100/50 rounded-xl p-6 border border-primary-blue-200/40">
                    <div className="flex items-center gap-3 mb-4">
                      <Scissors className="size-5 text-primary-blue-700" />
                      <h4 className="font-semibold text-primary-blue-800">
                        Current Life Visualization
                      </h4>
                    </div>
                    <p className="text-primary-blue-700 mb-4 leading-relaxed">
                      Focus on capturing what feels most significant to you in
                      your current life – your routines, emotions,
                      relationships, and environment. This is your story as it
                      exists today.
                    </p>

                    <FormField
                      control={form.control}
                      name="presentLifeCollage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CollageCanvas
                              elements={field.value}
                              onElementsChange={field.onChange}
                              title="My Present Life"
                              className="mt-4"
                              sessionId={sessionId}
                            />
                          </FormControl>
                          <FormDescription>
                            Drag and drop elements, resize them, and arrange
                            them to tell your current life story
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Future Life Section */}
            <QuestionSection
              title="Future Life (After Three Years)"
              subtitle="Create a collage that visualizes your ideal life three or five years from now. Think about where you want to be, the people you want around you, your career, and the lifestyle you aspire to have."
              icon={<Target className="size-6 text-primary-green-600" />}
              className="bg-gradient-to-br from-primary-green-50/80 to-primary-green-50/80 border-primary-green-200/60 shadow-xl"
            >
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-green-100/50 rounded-xl p-6 border border-primary-green-200/40">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="size-5 text-primary-green-700" />
                    <h4 className="font-semibold text-primary-green-800">
                      Future Life Vision
                    </h4>
                  </div>
                  <p className="text-primary-green-700 mb-4 leading-relaxed">
                    Gather images, words, photographs, drawings, or materials
                    like colored paper and fabric from newspapers, magazines, or
                    other sources. Let your imagination guide you toward your
                    ideal future.
                  </p>

                  <FormField
                    control={form.control}
                    name="futureLifeCollage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CollageCanvas
                            elements={field.value}
                            onElementsChange={field.onChange}
                            title="My Future Life (3-5 Years)"
                            className="mt-4"
                            sessionId={sessionId}
                          />
                        </FormControl>
                        <FormDescription>
                          Visualize your aspirations, goals, and the life you
                          want to create
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Retirement Values Question */}
                <div className="bg-gradient-to-r from-amber-100/50 to-yellow-100/50 rounded-xl p-6 border border-amber-200/40">
                  <FormField
                    control={form.control}
                    name="retirementValues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                          <Heart className="size-5 text-amber-600" />
                          What personal values would you speak about at your
                          retirement party?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Reflect on the core values and principles that will define your life's work and legacy. What would you want people to remember about how you lived and what you stood for?"
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Think about the values that will guide your journey
                          from present to future
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </QuestionSection>

            {/* Submit Section */}
            <Card className="bg-gradient-to-r from-primary-green-50/80 to-primary-blue-50/80 border-primary-green-200/60 shadow-xl">
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="size-16 mx-auto bg-gradient-to-r from-primary-green-500 to-primary-blue-500 rounded-full flex items-center justify-center mb-4">
                    <Palette className="size-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-green-800 mb-3">
                    Complete Your Life Collage Journey
                  </h3>
                  <p className="text-primary-green-700 max-w-2xl mx-auto leading-relaxed">
                    Your visual story is a powerful tool for self-reflection and
                    goal setting. Save your collages to track your journey and
                    revisit your vision over time.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-10 py-6 bg-gradient-to-r from-primary-green-500 to-primary-blue-500 text-white rounded-2xl font-bold text-lg hover:from-primary-green-600 hover:to-primary-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-green-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save Progress</span>
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </div>
                </Button>

                <p className="text-sm text-slate-500 mt-4">
                  Your collages and reflections will be saved for future
                  reference and inspiration
                </p>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};
