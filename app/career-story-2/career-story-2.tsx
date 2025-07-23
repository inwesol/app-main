"use client";
import { useState } from "react";

import { QuestionSection } from "@/components/activity-components/question-section";
import { TextArea } from "@/components/activity-components/text-area";
import { InputField } from "@/components/activity-components/input-field";
import Header from "@/components/form-components/header";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Lightbulb,
  Target,
  CheckSquare,
  ArrowRight,
  Book,
  Info,
  Star,
  Tv,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CareerStorySummary } from "./../../components/activity-components/career-story-summary";

interface RiasecOption {
  code: string;
  title: string;
  description: string;
  keywords: string[];
}
interface CareerStoryTwoData {
  firstAdjectives: string;
  repeatedWords: string;
  commonTraits: string;
  significantWords: string;
  selfStatement: string;
  mediaActivities: string;
  selectedRiasec: string[];
  settingStatement: string;
}
const riasecOptions: RiasecOption[] = [
  {
    code: "R",
    title: "Realistic",
    description: "Work with things, tools, machines, or animals",
    keywords: [
      "practical",
      "hands-on",
      "mechanical",
      "outdoors",
      "physical",
      "concrete",
      "tools",
      "building",
    ],
  },
  {
    code: "I",
    title: "Investigative",
    description: "Work with ideas, data, and information",
    keywords: [
      "analytical",
      "research",
      "scientific",
      "logical",
      "problem-solving",
      "theoretical",
      "data",
      "investigation",
    ],
  },
  {
    code: "A",
    title: "Artistic",
    description: "Work with creative expression and aesthetics",
    keywords: [
      "creative",
      "artistic",
      "expressive",
      "imaginative",
      "aesthetic",
      "original",
      "design",
      "performance",
    ],
  },
  {
    code: "S",
    title: "Social",
    description: "Work with people to help, teach, or serve",
    keywords: [
      "helping",
      "teaching",
      "caring",
      "counseling",
      "serving",
      "interpersonal",
      "community",
      "supportive",
    ],
  },
  {
    code: "E",
    title: "Enterprising",
    description: "Work with people and data to influence and persuade",
    keywords: [
      "leadership",
      "persuasive",
      "ambitious",
      "competitive",
      "influential",
      "entrepreneurial",
      "managing",
      "selling",
    ],
  },
  {
    code: "C",
    title: "Conventional",
    description: "Work with data and details in organized environments",
    keywords: [
      "organized",
      "systematic",
      "detailed",
      "structured",
      "efficient",
      "precise",
      "administrative",
      "procedural",
    ],
  },
];

export default function CareerStoryTwo() {
  const [formData, setFormData] = useState<CareerStoryTwoData>({
    firstAdjectives: "",
    repeatedWords: "",
    commonTraits: "",
    significantWords: "",
    selfStatement: "",
    mediaActivities: "",
    selectedRiasec: [],
    settingStatement: "",
  });
  // Mock data for demonstration
  // from calling api for career-story-1 data
  const mockCareerStoryData = {
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

  const handleRiasecChange = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedRiasec: prev.selectedRiasec.includes(code)
        ? prev.selectedRiasec.filter((c) => c !== code)
        : [...prev.selectedRiasec, code],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 to primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <Header
          headerIcon={Book}
          headerText="Career Story Exploration - 2"
          headerDescription="Discover your core self and preferred work settings through RIASEC
            analysis"
        />

        {/* Career Story 1 Summary */}
        {/* <CareerStorySummary
          storyNumber={1}
          data={mockCareerStoryData}
          title="Career Story 1 Summary"
        /> */}
        {/* SELF Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-green-100/80 to-primary-blue-100/80 rounded-xl p-6 mb-6 border border-primary-green-200/60 shadow-xl backdrop-blur-sm">
            <div>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-primary-green-200 rounded-lg">
                  <User className="sm:size-5 size-4 text-primary-green-700" />
                </div>
                <h2 className="text-xl font-bold text-primary-green-800">
                  SELF: Who Am I? / Who Am I Becoming?
                </h2>
              </div>
              <div>
                <p className="text-primary-green-700 text-sm mt-1">
                  Look at the words you used to describe your heroes or heroines
                  (Role Models) in Career Story - 1 activity.
                </p>
              </div>
            </div>
          </div>

          {/* hero Analysis Questions */}
          <Card className="mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary-green-100 rounded-lg">
                      <Lightbulb className="sm:size-5 text-primary-green-600 size-4" />
                    </div>
                    <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
                      Hero Analysis
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
                            Career Story Exploration - 1
                          </SheetTitle>
                          <SheetDescription>
                            {/* Childhood Heroes & Role Models */}
                          </SheetDescription>
                        </SheetHeader>
                        {mockCareerStoryData.heroes.length > 0 && (
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <h4 className="font-medium text-slate-600 text-sm">
                                Childhood Heroes & Role Models
                              </h4>
                            </div>
                            <div className="space-y-4">
                              {mockCareerStoryData.heroes.map((hero, index) => (
                                <div
                                  key={hero.id}
                                  className="bg-white/90 rounded-xl p-4 border border-primary-green-200/60 shadow-md transition-all duration-300 hover:bg-white hover:border-primary-green-300/80 hover:shadow-lg hover:scale-[1.01]"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="shrink-0 size-6 bg-primary-green-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg">
                                      <span className="text-xs font-bold text-white">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-primary-green-600 font-semibold">
                                        {hero.title}
                                      </h5>
                                      <p className="text-sm text-slate-600 leading-relaxed ">
                                        {hero.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Analyze the descriptive words you used for your role models
                    to understand your core values and aspirations.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Write down the first adjective you used to describe each one
                    of them:
                  </label>
                  <InputField
                    value={formData.firstAdjectives}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstAdjectives: value,
                      }))
                    }
                    placeholder="e.g., brave, intelligent, compassionate..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Write down any words or similar words that you used more
                    than once to describe them:
                  </label>
                  <InputField
                    value={formData.repeatedWords}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, repeatedWords: value }))
                    }
                    placeholder="e.g., determined, caring, innovative..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Write down two or more things your heroes or heroines have
                    in common:
                  </label>
                  <TextArea
                    value={formData.commonTraits}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, commonTraits: value }))
                    }
                    placeholder="Describe the common characteristics, values, or behaviors you notice across your role models..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    List any other significant words or phrases you used to
                    describe them:
                  </label>
                  <TextArea
                    value={formData.significantWords}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        significantWords: value,
                      }))
                    }
                    placeholder="Include any other meaningful descriptors that stood out to you..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Self Statement */}
          <QuestionSection
            title="Your Core Self"
            subtitle="This is you, your core self. Look carefully at the words you used to describe your heroes or heroines. You have described yourself! You take things you like about them and put them together to make you."
            icon={
              <Target className="size-4 sm:size-5 text-primary-green-600" />
            }
          >
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Using the words you wrote down above, tell in two to four
                sentences who you are and who you are becoming:
              </label>
              <div className="bg-gradient-to-r from-primary-green-50 to-primary-blue-50 rounded-lg p-4 border border-primary-green-200 mb-3">
                <p className="text-sm font-medium text-primary-green-800 mb-2">
                  I AM / I AM BECOMING A PERSON WHO IS...
                </p>
              </div>
              <TextArea
                value={formData.selfStatement}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, selfStatement: value }))
                }
                placeholder="I am/I am becoming a person who is... (Use the descriptive words from your hero analysis to craft your personal statement)"
                rows={4}
              />
            </div>
          </QuestionSection>
        </div>

        {/* SETTING Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-blue-100/80 to-blue-100/80 rounded-xl p-6 mb-6 border border-primary-blue-200/60 shadow-xl backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-blue-200 rounded-lg">
                  <MapPin className="sm:size-5 size-4 text-primary-blue-700" />
                </div>
                <h2 className="text-2xl font-bold text-primary-blue-800">
                  SETTING: Where Do I Like To Be?
                </h2>
              </div>
            </div>
          </div>
          {/* Media Analysis */}
          <Card className="mb-6 bg-blue-50/50 border-primary-blue-100/60">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary-blue-100 rounded-lg">
                      <Lightbulb className="sm:size-5 text-primary-blue-600 size-4" />
                    </div>
                    <CardTitle className="text-primary-blue-600 text-lg sm:text-xl">
                      Media & Entertainment Analysis
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
                            Career Story Exploration - 1
                          </SheetTitle>
                          <SheetDescription></SheetDescription>
                        </SheetHeader>
                        {/* Media & Entertainment */}
                        {(mockCareerStoryData.magazines ||
                          mockCareerStoryData.magazineWhy) && (
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <h4 className="font-medium text-slate-600 text-sm">
                                Media & Entertainment
                              </h4>
                            </div>
                            <div className="space-y-4">
                              {mockCareerStoryData.magazines && (
                                <div className="bg-white/60 rounded-lg p-3 border border-purple-200/50">
                                  <h5 className="font-bold text-primary-blue-600 mb-2">
                                    What you watch/read:
                                  </h5>
                                  <p className="text-sm text-slate-600 font-medium">
                                    {mockCareerStoryData.magazines}
                                  </p>
                                </div>
                              )}
                              {mockCareerStoryData.magazineWhy && (
                                <div className="bg-white/60 rounded-lg p-3 border border-purple-200/50">
                                  <h5 className="font-bold text-primary-blue-600 mb-2 transition-colors duration-300">
                                    Media Activities & Setting Preferences
                                  </h5>
                                  <p className="text-sm text-slate-600 font-medium transition-colors duration-300">
                                    {mockCareerStoryData.magazineWhy}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Review your magazine or TV show choices from Career Story -
                    1 activity. Look closely at the words you used to describe
                    them.
                  </p>
                </div>
                <div></div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What kinds of activities are going on in these magazines or
                  shows? What kinds of people are seen in them? Tell what is
                  happening and what the people are doing in your magazines or
                  TV shows:
                </label>
                <TextArea
                  value={formData.mediaActivities}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, mediaActivities: value }))
                  }
                  placeholder="Describe the activities, people, and environments you see in your favorite media. What draws you to these settings?"
                  rows={4}
                  className="border-primary-blue-300/60 focus:border-primary-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* RIASEC Selection */}
          <Card className="mb-6 bg-blue-50/50 border-primary-blue-100/60">
            <CardHeader>
              <div>
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-primary-blue-100 rounded-lg">
                    <CheckSquare className="sm:size-5 text-primary-blue-600 size-4" />
                  </div>
                  <CardTitle className="text-primary-blue-600 text-lg sm:text-xl">
                    RIASEC Work Settings
                  </CardTitle>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Magazines and TV shows can be grouped by the work settings
                    they represent. Find the one or two work settings most like
                    your favorite magazines or TV shows.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 mb-4">
                  Select the work setting(s) that best match your favorite
                  magazines or TV shows:
                </p>

                <div className="grid gap-4">
                  {riasecOptions.map((option) => (
                    <div
                      key={option.code}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        formData.selectedRiasec.includes(option.code)
                          ? "border-primary-blue-500 bg-primary-blue-50 shadow-md"
                          : "border-slate-200 hover:border-primary-blue-300 hover:bg-primary-blue-25"
                      }`}
                      onClick={() => handleRiasecChange(option.code)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            formData.selectedRiasec.includes(option.code)
                              ? "bg-primary-blue-500 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {option.code}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 mb-1">
                            {option.title}
                          </h4>
                          <p className="text-sm text-slate-600 mb-2">
                            {option.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {option.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.selectedRiasec.length > 0 && (
                  <div className="mt-4 p-4 bg-primary-blue-50 rounded-lg border border-primary-blue-200">
                    <p className="text-sm font-medium text-primary-blue-800 mb-2">
                      Selected Work Settings:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedRiasec.map((code) => {
                        const option = riasecOptions.find(
                          (opt) => opt.code === code
                        );
                        return (
                          <span
                            key={code}
                            className="px-3 py-1 bg-primary-blue-500 text-white text-sm rounded-full"
                          >
                            {code} - {option?.title}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Setting Statement */}
          <Card className="mb-6 bg-blue-50/50 border-primary-blue-100/60">
            <CardHeader>
              <div>
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-primary-blue-100 rounded-lg">
                    <Target className="sm:size-5 text-primary-blue-600 size-4" />
                  </div>
                  <CardTitle className="text-primary-blue-600 text-lg sm:text-xl">
                    Your Preferred Work Setting
                  </CardTitle>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    This is where you like to be, your career interests. These
                    are the kinds of places in which you want to work, the
                    people with whom you want to be, the problems you want to
                    address, and the procedures you like to use.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Using the words you wrote down in your summary above, tell in
                  2-4 sentences where you like to be:
                </label>
                <div className="bg-gradient-to-r from-primary-blue-50 to-blue-50 rounded-lg p-4 border border-primary-blue-200 mb-3">
                  <p className="text-sm font-medium text-primary-blue-800 mb-2">
                    I LIKE BEING IN PLACES WHERE...
                  </p>
                </div>
                <TextArea
                  value={formData.settingStatement}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      settingStatement: value,
                    }))
                  }
                  placeholder="I like being in places where... (Describe your ideal work environment, the types of people you want to work with, and the kinds of problems you want to solve)"
                  rows={4}
                  className="border-primary-blue-300/60 focus:border-primary-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Save Button */}
        <div className="flex justify-center">
          <Button className="group relative px-10 py-6 bg-gradient-to-r from-primary-green-500 to-primary-blue-500 text-white rounded-2xl font-bold text-lg hover:from-primary-green-600 hover:to-primary-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <span>Save Progress</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
