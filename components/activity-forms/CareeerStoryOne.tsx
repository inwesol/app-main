"use client";

import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// interface HeroItem {
//   id: string;
//   title: string;
//   description: string;
// }
// interface CareerStoryOneData {
//   transitionEssay: string;
//   occupations: string;
//   heroes: HeroItem[];
//   magazines: string;
//   magazineWhy: string;
//   favoriteStory: string;
//   favoriteSaying: string;
// }
const careerStoryOneDataSchema = z.object({
  transitionEssay: z.string().min(20, "hello"),
  occupations: z.string(),
  heroes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  // magazines: z.string().min(10, "error message for magazines"),
  // magazineWhy: z.string(),
  // favoriteStory: z.string(),
  // favoriteSaying: z.string(),
});

type CareerStoryOneData = z.infer<typeof careerStoryOneDataSchema>;

// const data: Data = {
//   transitionEssay: "",
//   occupations: "",
//   heroes: [],
//   magazines: "",
//   magazineWhy: "",
//   favoriteStory: "",
//   favoriteSaying: "",
// };
// console.log(careerStoryOneSchema.safeParse(data));
function CareeerStory1() {
  const form = useForm<CareerStoryOneData>({
    resolver: zodResolver(careerStoryOneDataSchema),
    defaultValues: {
      transitionEssay: "",
      occupations: "",
      heroes: [],
      // magazines: "",
      // magazineWhy: "",
      // favoriteStory: "",
      // favoriteSaying: "",
    },
  });

  function onSubmit(values: z.infer<typeof careerStoryOneDataSchema>) {
    // Do something with the form values.
    // This will be type-safe and validated.
    console.log("running");
    console.log(values);
  }
  // const [formData, setFormData] = useState<CareerStoryOneData>({
  //   transitionEssay: "",
  //   occupations: "",
  //   heroes: [],
  //   magazines: "",
  //   magazineWhy: "",
  //   favoriteStory: "",
  //   favoriteSaying: "",
  // });

  // const addHero = () => {
  //   const newHero: HeroItem = {
  //     id: Date.now().toString(),
  //     title: "",
  //     description: "",
  //   };
  //   setFormData((prev) => ({
  //     ...prev,
  //     heroes: [...prev.heroes, newHero],
  //   }));
  // };

  // const updateHero = (
  //   id: string,
  //   field: "title" | "description",
  //   value: string
  // ) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     heroes: prev.heroes.map((hero) =>
  //       hero.id === id ? { ...hero, [field]: value } : hero
  //     ),
  //   }));
  // };

  // const deleteHero = (id: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     heroes: prev.heroes.filter((hero) => hero.id !== id),
  //   }));
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 to primary-green-50 p-4 sm:py-8">
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
                        <TextArea
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
                </FormItem>
              )}
            />
            {/* heroes Section */}
            <FormField
              control={form.control}
              name="heroes"
              render={({ field }) => (
                <QuestionSection
                  title="Childhood Heroes & Role Models"
                  subtitle="Who did you admire when you were growing up? List three people, other than your mom and dad, who you admired when you were a child of about six, seven, or eight years old. These can be real people, fictional characters, or anyone else you admired."
                  icon={
                    <Star className="sm:size-5 text-primary-green-600 size-4" />
                  }
                >
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
                  <BulletPointList
                    items={formData.heroes}
                    onItemChange={updateHero}
                    onAddItem={addHero}
                    onDeleteItem={deleteHero}
                    titlePlaceholder="Hero/Role Model"
                    descriptionPlaceholder="Describe in 2-4 sentences what you admired about this person. What qualities did they have that inspired you?"
                  />
                </QuestionSection>
              )}
            />
            {/* media consumption */}
            {/* <QuestionSection
              title="Media & Entertainment"
              subtitle="Do you read any magazines or watch any web series/television shows regularly? Which ones?"
              icon={<Tv className="sm:size-5 text-primary-green-600 size-4" />}
            >
              <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
                <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                  Media Analysis
                </h4>
                <p className="text-sm text-primary-green-700 leading-relaxed">
                  Your entertainment choices often reflect your interests and
                  values. Let&apos;s explore what attracts you to certain
                  content.
                </p>
              </div>
              <div className="space-y-4">
                <InputField
                  value={formData.magazines}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, magazines: value }))
                  }
                  placeholder="List magazines, web series, or TV shows you watch regularly"
                />
                <TextArea
                  value={formData.magazineWhy}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, magazineWhy: value }))
                  }
                  placeholder="What do you like about these magazines/web series/television shows? What draws you to them?"
                  rows={3}
                />
              </div>
            </QuestionSection> */}
            {/* favorite story */}
            {/* <QuestionSection
              title="Your Favorite Story"
              subtitle="Think of a book that you read a lot or may have read over and over again, or a movie that you watch repeatedly. Tell the story and describe your favorite character. What is it about? What makes it special to you?"
              icon={
                <BookOpen className="sm:size-5 text-primary-green-600 size-4" />
              }
            >
              <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
                <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                  Story Connection
                </h4>
                <p className="text-sm text-primary-green-700 leading-relaxed">
                  The stories we return to often reflect our deepest values and
                  aspirations. What themes or messages resonate with you?
                </p>
              </div>
              <TextArea
                value={formData.favoriteStory}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, favoriteStory: value }))
                }
                placeholder="Describe your favorite book or movie. What is the story about? Who is your favorite character and why? What themes or messages resonate with you?"
                rows={5}
              />
            </QuestionSection> */}
            {/* favorite saying */}
            {/* <QuestionSection
              title="Words to Live By"
              subtitle="What is your favorite saying? Think about a motto you live by or words that inspire you. This could be from a bumper sticker, poster, quote, or even something you've created yourself."
              icon={
                <Heart className="sm:size-5 text-primary-green-600 size-4" />
              }
            >
              <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
                <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                  Personal Philosophy
                </h4>
                <p className="text-sm text-primary-green-700 leading-relaxed">
                  The words that inspire us often reveal our core beliefs and
                  values. What saying or motto guides your decisions?
                </p>
              </div>
              <TextArea
                value={formData.favoriteSaying}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, favoriteSaying: value }))
                }
                placeholder="Share your favorite saying, motto, or inspiring words. Explain why these words are meaningful to you."
                rows={3}
              />
            </QuestionSection> */}
            {/* enhanced Save Button */}
            <div className="text-center mt-8">
              <Button
                className="group relative px-10 py-6 bg-gradient-to-r from-primary-green-500 to-primary-blue-500 text-white rounded-2xl font-bold text-lg hover:from-primary-green-600 hover:to-primary-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1"
                type="submit"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-green-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <span>Save Progress</span>
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CareeerStory1;
