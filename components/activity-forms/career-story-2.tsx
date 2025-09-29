"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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
import { toast } from "sonner";

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

export default function CareerStory2() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;

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

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for demonstration - would come from career-story-1 API call
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

  // Load existing data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!sessionId) return;

      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/career-story-2`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        }
      } catch (error) {
        console.error("Error loading career story 2 data:", error);
        toast.error("Failed to load existing data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionId]);

  const handleRiasecChange = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedRiasec: prev.selectedRiasec.includes(code)
        ? prev.selectedRiasec.filter((c) => c !== code)
        : [...prev.selectedRiasec, code],
    }));
  };

  const handleSave = async () => {
    if (!sessionId) {
      toast.error("Session ID is required");
      return;
    }

    // Validate required fields
    const requiredFields: (keyof CareerStoryTwoData)[] = [
      "firstAdjectives",
      "repeatedWords",
      "commonTraits",
      "significantWords",
      "selfStatement",
      "mediaActivities",
      "settingStatement",
    ];

    const missingFields = requiredFields.filter(
      (field) => !(formData[field] as string).trim()
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.selectedRiasec.length === 0) {
      toast.error("Please select at least one RIASEC work setting");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/career-story-2`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Career Story 2 saved successfully!");
        // Redirect to the session page after successful save
        router.push(`/journey/sessions/${sessionId}`);
      } else {
        const errorData = await response.json();
        console.error("Save error:", errorData);
        toast.error("Failed to save. Please try again.");
      }
    } catch (error) {
      console.error("Error saving career story 2:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-blue-50 to-primary-green-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-500" />
          <p className="text-slate-600">Loading your career story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-primary-blue-50 to primary-green-50 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <Header
          headerIcon={Book}
          headerText="Career Story Exploration - 2"
          headerDescription="Discover your core self and preferred work settings through RIASEC
            analysis"
        />

        {/* SELF Section */}
        <div className="mb-8">
          <div className="p-6 mb-6 border shadow-xl bg-gradient-to-r from-primary-green-100/80 to-primary-blue-100/80 rounded-xl border-primary-green-200/60 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-green-200">
                  <User className="sm:size-5 size-4 text-primary-green-700" />
                </div>
                <h2 className="text-xl font-bold text-primary-green-800">
                  SELF: Who Am I? / Who Am I Becoming?
                </h2>
              </div>
              <div>
                <p className="mt-1 text-sm text-primary-green-700">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-green-100">
                      <Lightbulb className="sm:size-5 text-primary-green-600 size-4" />
                    </div>
                    <CardTitle className="text-lg text-primary-green-600 sm:text-xl">
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
                          <SheetTitle className="text-xl font-bold text-primary-green-600">
                            Career Story Exploration - 1
                          </SheetTitle>
                          <SheetDescription>
                            {/* Childhood Heroes & Role Models */}
                          </SheetDescription>
                        </SheetHeader>
                        {mockCareerStoryData.heroes.length > 0 && (
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <h4 className="text-sm font-medium text-slate-600">
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
                                    <div className="flex items-center justify-center transition-all duration-300 rounded-full shadow-md shrink-0 size-6 bg-primary-green-600 hover:shadow-lg">
                                      <span className="text-xs font-bold text-white">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-primary-green-600">
                                        {hero.title}
                                      </h5>
                                      <p className="text-sm leading-relaxed text-slate-600 ">
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
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Analyze the descriptive words you used for your role models
                    to understand your core values and aspirations.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="firstAdjectives"
                    className="block mb-2 text-sm font-medium text-slate-600"
                  >
                    Write down the first adjective you used to describe each one
                    of them:
                  </label>
                  <InputField
                    id="firstAdjectives"
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
                  <label
                    htmlFor="repeatedWords"
                    className="block mb-2 text-sm font-medium text-slate-600"
                  >
                    Write down any words or similar words that you used more
                    than once to describe them:
                  </label>
                  <InputField
                    id="repeatedWords"
                    value={formData.repeatedWords}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, repeatedWords: value }))
                    }
                    placeholder="e.g., determined, caring, innovative..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="commonTraits"
                    className="block mb-2 text-sm font-medium text-slate-600"
                  >
                    Write down two or more things your heroes or heroines have
                    in common:
                  </label>
                  <TextArea
                    id="commonTraits"
                    value={formData.commonTraits}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, commonTraits: value }))
                    }
                    placeholder="Describe the common characteristics, values, or behaviors you notice across your role models..."
                    rows={3}
                  />
                </div>

                <div>
                  <label
                    htmlFor="significantWords"
                    className="block mb-2 text-sm font-medium text-slate-600"
                  >
                    List any other significant words or phrases you used to
                    describe them:
                  </label>
                  <TextArea
                    id="significantWords"
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
              <label
                htmlFor="selfStatement"
                className="block mb-2 text-sm font-medium text-slate-600"
              >
                Using the words you wrote down above, tell in two to four
                sentences who you are and who you are becoming:
              </label>
              <div className="p-4 mb-3 border rounded-lg bg-gradient-to-r from-primary-green-50 to-primary-blue-50 border-primary-green-200">
                <p className="mb-2 text-sm font-medium text-primary-green-800">
                  I AM / I AM BECOMING A PERSON WHO IS...
                </p>
              </div>
              <TextArea
                id="selfStatement"
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
          <div className="p-6 mb-6 border shadow-xl bg-gradient-to-r from-primary-blue-100/80 to-blue-100/80 rounded-xl border-primary-blue-200/60 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-blue-200">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-blue-100">
                      <Lightbulb className="sm:size-5 text-primary-blue-600 size-4" />
                    </div>
                    <CardTitle className="text-lg text-primary-blue-600 sm:text-xl">
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
                          <SheetTitle className="text-xl font-bold text-primary-blue-600">
                            Career Story Exploration - 1
                          </SheetTitle>
                          <SheetDescription />
                        </SheetHeader>
                        {/* Media & Entertainment */}
                        {(mockCareerStoryData.magazines ||
                          mockCareerStoryData.magazineWhy) && (
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <h4 className="text-sm font-medium text-slate-600">
                                Media & Entertainment
                              </h4>
                            </div>
                            <div className="space-y-4">
                              {mockCareerStoryData.magazines && (
                                <div className="p-3 border rounded-lg bg-white/60 border-purple-200/50">
                                  <h5 className="mb-2 font-bold text-primary-blue-600">
                                    What you watch/read:
                                  </h5>
                                  <p className="text-sm font-medium text-slate-600">
                                    {mockCareerStoryData.magazines}
                                  </p>
                                </div>
                              )}
                              {mockCareerStoryData.magazineWhy && (
                                <div className="p-3 border rounded-lg bg-white/60 border-purple-200/50">
                                  <h5 className="mb-2 font-bold transition-colors duration-300 text-primary-blue-600">
                                    Media Activities & Setting Preferences
                                  </h5>
                                  <p className="text-sm font-medium transition-colors duration-300 text-slate-600">
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
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Review your magazine or TV show choices from Career Story -
                    1 activity. Look closely at the words you used to describe
                    them.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <label
                  htmlFor="mediaActivities"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  What kinds of activities are going on in these magazines or
                  shows? What kinds of people are seen in them? Tell what is
                  happening and what the people are doing in your magazines or
                  TV shows:
                </label>
                <TextArea
                  id="mediaActivities"
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
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-blue-100">
                    <CheckSquare className="sm:size-5 text-primary-blue-600 size-4" />
                  </div>
                  <CardTitle className="text-lg text-primary-blue-600 sm:text-xl">
                    RIASEC Work Settings
                  </CardTitle>
                </div>
                <div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Magazines and TV shows can be grouped by the work settings
                    they represent. Find the one or two work settings most like
                    your favorite magazines or TV shows.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="mb-4 text-sm text-slate-600">
                  Select the work setting(s) that best match your favorite
                  magazines or TV shows:
                </p>

                <div className="grid gap-4">
                  {riasecOptions.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className={`w-full text-left border-2 rounded-lg p-4 transition-all duration-200 ${
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
                          <h4 className="mb-1 font-semibold text-slate-800">
                            {option.title}
                          </h4>
                          <p className="mb-2 text-sm text-slate-600">
                            {option.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {option.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {formData.selectedRiasec.length > 0 && (
                  <div className="p-4 mt-4 border rounded-lg bg-primary-blue-50 border-primary-blue-200">
                    <p className="mb-2 text-sm font-medium text-primary-blue-800">
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
                            className="px-3 py-1 text-sm text-white rounded-full bg-primary-blue-500"
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
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-blue-100">
                    <Target className="sm:size-5 text-primary-blue-600 size-4" />
                  </div>
                  <CardTitle className="text-lg text-primary-blue-600 sm:text-xl">
                    Your Preferred Work Setting
                  </CardTitle>
                </div>
                <div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
                <label
                  htmlFor="settingStatement"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  Using the words you wrote down in your summary above, tell in
                  2-4 sentences where you like to be:
                </label>
                <div className="p-4 mb-3 border rounded-lg bg-gradient-to-r from-primary-blue-50 to-blue-50 border-primary-blue-200">
                  <p className="mb-2 text-sm font-medium text-primary-blue-800">
                    I LIKE BEING IN PLACES WHERE...
                  </p>
                </div>
                <TextArea
                  id="settingStatement"
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
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="relative px-10 py-6 text-lg font-bold text-white transition-all duration-300 shadow-2xl group bg-gradient-to-r from-primary-green-500 to-primary-blue-500 rounded-2xl hover:from-primary-green-600 hover:to-primary-blue-600 hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-r from-primary-green-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50" />
            <div className="relative flex items-center gap-3">
              {isSaving ? (
                <>
                  <div className="border-b-2 border-white rounded-full animate-spin size-5" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Progress</span>
                  <ArrowRight className="transition-transform duration-200 size-5 group-hover:translate-x-1" />
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
