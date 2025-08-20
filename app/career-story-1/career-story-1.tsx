"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { QuestionSection } from "@/components/activity-components/question-section";
import { TextArea } from "@/components/activity-components/text-area";
import Header from "@/components/form-components/header";
import {
  AlertCircle,
  ArrowRight,
  Book,
  BookOpen,
  Heart,
  PenTool,
  Star,
  Tv,
  Users,
} from "lucide-react";
import { BulletPointList } from "@/components/activity-components/bulletpoint-list";
import { InputField } from "@/components/activity-components/input-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";

interface HeroItem {
  id: string;
  title: string;
  description: string;
}

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
});

type CareerStoryOneData = z.infer<typeof careerStoryOneDataSchema>;

function CareerStory1() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CareerStoryOneData>({
    resolver: zodResolver(careerStoryOneDataSchema),
    defaultValues: {
      transitionEssay: "",
      occupations: "",
      heroes: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "heroes",
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

  const addHero = () => {
    const newHero: HeroItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    append(newHero);
  };

  const updateHero = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const currentHero = fields[index];
    update(index, {
      ...currentHero,
      [field]: value,
    });
  };

  const deleteHero = (index: number) => {
    remove(index);
  };

  async function onSubmit(values: CareerStoryOneData) {
    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/career-story-1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      const result = await response.json();
      console.log("Progress saved:", result);

      // Redirect to the session page after successful save
      router.push(`/journey/sessions/${sessionId}`);
    } catch (error) {
      console.error("Error saving progress:", error);
      // You might want to show an error message here
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 to-primary-green-50 p-4 sm:py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-green-600 mx-auto mb-4"></div>
          <p className="text-primary-green-600">Loading your career story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 to-primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <Header
          headerIcon={Book}
          headerText="Career Story Exploration - 1"
          headerDescription="Discover your true potential through self-reflection, an inward journey that reveals your values, passions, and purpose, guiding you toward a more meaningful path."
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* transition Essay */}
            <FormField
              control={form.control}
              name="transitionEssay"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Card className="mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60">
                      <CardHeader>
                        <div>
                          <div className="flex gap-3 items-center">
                            <div className="p-2 bg-primary-green-100 rounded-lg">
                              <PenTool className="sm:size-5 text-primary-green-600 size-4" />
                            </div>
                            <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
                              Your Current Transition
                            </CardTitle>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 leading-relaxed mt-2">
                              You are probably using this workbook because you
                              are facing some change or transition in your life,
                              maybe from high school to college, from college to
                              work, or from job to job. To bridge transitions,
                              or end one chapter and begin the next, and clarify
                              choices, people look within themselves to their
                              own life story for guidance. Below, write a brief
                              essay about the transition you are now facing.
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
                          <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                            Reflection Prompt
                          </h4>
                          <p className="text-sm text-primary-green-700 leading-relaxed">
                            Write a brief essay about the transition you are now
                            facing. What chapter are you closing? What new
                            chapter are you beginning? What guidance are you
                            seeking?
                          </p>
                        </div>
                        <Textarea
                          {...field}
                          placeholder="Write about the transition you are currently facing. What chapter are you closing? What new chapter are you beginning? What guidance are you seeking?"
                          rows={6}
                        />
                      </CardContent>
                    </Card>
                  </FormControl>
                  <FormMessage className="flex items-center gap-2" />
                </FormItem>
              )}
            />

            {/* occupations */}
            <FormField
              control={form.control}
              name="occupations"
              render={({ field }) => (
                <FormItem>
                  <Card className="mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60">
                    <CardHeader>
                      <div>
                        <div className="flex gap-3 items-center">
                          <div className="p-2 bg-primary-green-100 rounded-lg">
                            <Users className="sm:size-5 text-primary-green-600 size-4" />
                          </div>
                          <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
                            Career Aspirations
                          </CardTitle>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 leading-relaxed mt-2">
                            Now, list all of the occupations you have thought
                            about doing. List the occupations or jobs you are
                            thinking about doing now and those occupations or
                            jobs you have ever thought about doing in the past.
                            You might have several, just one or two, or none at
                            all.
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
                        <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                          Career Exploration
                        </h4>
                        <p className="text-sm text-primary-green-700 leading-relaxed">
                          Include any job or career that has sparked your
                          interest at any point in your life. You might have
                          several, just one or two, or none at all - all
                          responses are valid.
                        </p>
                      </div>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="List all occupations you've ever considered, both past and present. Include any job or career that has sparked your interest at any point in your life."
                          rows={4}
                        />
                      </FormControl>
                    </CardContent>
                  </Card>
                  <FormMessage className="flex items-center gap-2" />
                </FormItem>
              )}
            />

            {/* heroes Section */}
            <Card className="mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60">
              <CardHeader>
                <div>
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary-green-100 rounded-lg">
                      <Star className="sm:size-5 text-primary-green-600 size-4" />
                    </div>
                    <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
                      Childhood Heroes & Role Models
                    </CardTitle>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                      Who did you admire when you were growing up? List three
                      people, other than your mom and dad, who you admired when
                      you were a child of about six, seven, or eight years old.
                      These can be real people, fictional characters, or anyone
                      else you admired.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
                  <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                    Role Model Reflection
                  </h4>
                  <p className="text-sm text-primary-green-700 leading-relaxed">
                    These can be real people, fictional characters, or anyone
                    else you admired. Think about what qualities made them
                    special to you.
                  </p>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-primary-green-200 rounded-lg bg-white/50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-medium text-primary-green-600">
                          Hero {index + 1}
                        </h5>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => deleteHero(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name={`heroes.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Hero/Role Model Name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`heroes.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Describe in 2-4 sentences what you admired about this person. What qualities did they have that inspired you?"
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addHero}
                    className="w-full border-dashed border-primary-green-300 text-primary-green-600 hover:bg-primary-green-50"
                  >
                    Add Hero
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* enhanced Save Button */}
            <div className="text-center mt-8">
              <Button
                className="group relative px-10 py-6 bg-gradient-to-r from-primary-green-500 to-primary-blue-500 text-white rounded-2xl font-bold text-lg hover:from-primary-green-600 hover:to-primary-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSaving}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-green-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <span>{isSaving ? "Saving..." : "Save Progress"}</span>
                  {!isSaving && (
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                  {isSaving && (
                    <div className="animate-spin rounded-full size-5 border-b-2 border-white"></div>
                  )}
                </div>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CareerStory1;
