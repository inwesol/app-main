"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { QuestionSection } from "@/components/activity-components/question-section";
import { TextArea } from "@/components/activity-components/text-area";
import { InputField } from "@/components/activity-components/input-field";
import Header from "@/components/form-components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/toast";
import {
  User,
  MapPin,
  BookOpen,
  Target,
  MessageSquare,
  Search,
  ArrowRight,
  Briefcase,
  Info,
  Star,
  Lightbulb,
  Loader2,
} from "lucide-react";

interface CareerStoryThreeData {
  selfStatement: string;
  settingStatement: string;
  plotDescription: string;
  plotActivities: string;
  ableToBeStatement: string;
  placesWhereStatement: string;
  soThatStatement: string;
  mottoStatement: string;
  selectedOccupations: string[];
}

// Sample occupations - in a real app, this would come from an API or database
const occupationOptions = [
  "Software Developer",
  "Teacher",
  "Nurse",
  "Marketing Manager",
  "Graphic Designer",
  "Data Analyst",
  "Social Worker",
  "Engineer",
  "Writer",
  "Counselor",
  "Project Manager",
  "Researcher",
  "Sales Representative",
  "Therapist",
  "Architect",
  "Financial Advisor",
  "Human Resources Specialist",
  "Environmental Scientist",
  "Chef",
  "Photographer",
  "Accountant",
  "Pharmacist",
  "Physical Therapist",
  "Veterinarian",
  "Journalist",
  "Police Officer",
  "Firefighter",
  "Pilot",
  "Lawyer",
  "Doctor",
  "Dentist",
  "Psychologist",
  "Interior Designer",
  "Web Designer",
  "Game Developer",
  "Business Analyst",
  "Consultant",
  "Real Estate Agent",
  "Event Planner",
  "Translator",
];

export default function CareerStoryThree() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState<CareerStoryThreeData>({
    selfStatement: "",
    settingStatement: "",
    plotDescription: "",
    plotActivities: "",
    ableToBeStatement: "",
    placesWhereStatement: "",
    soThatStatement: "",
    mottoStatement: "",
    selectedOccupations: [],
  });

  // Mock data for Career Story 1 (will come from API)
  const mockCareerStoryOneData = {
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

  // Mock data for Career Story 2 (will come from API)
  const mockCareerStoryTwoData = {
    firstAdjectives: "brave, innovative, compassionate",
    repeatedWords: "determined, caring, creative",
    commonTraits:
      "They all showed courage in the face of adversity and used their talents to help others. They were persistent in pursuing their goals and never gave up on their values.",
    significantWords: "inspiring, authentic, resilient, visionary, empathetic",
    selfStatement:
      "I am becoming a person who is brave, innovative, and compassionate. I value creativity, helping others, and making a positive impact through technology and design.",
    mediaActivities:
      "I'm drawn to content that explores human potential, scientific discoveries, and innovative solutions to global challenges. I love learning about different cultures and emerging technologies through documentaries, tech magazines, and educational content.",
    selectedRiasec: ["I", "A", "S"],
    settingStatement:
      "I like being in places where people collaborate on creative solutions, use technology to solve problems, and work together to make the world better. I enjoy environments that are dynamic, supportive, and focused on growth and learning.",
  };

  // Load existing data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `/api/journey/sessions/${params.sessionId}/a/career-story-3`
        );

        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (params.sessionId) {
      loadData();
    } else {
      setInitialLoading(false);
    }
  }, [params.sessionId]);

  // Helper function to get RIASEC option details
  const getRiasecDetails = (code: string) => {
    const riasecOptions = [
      { code: "R", title: "Realistic" },
      { code: "I", title: "Investigative" },
      { code: "A", title: "Artistic" },
      { code: "S", title: "Social" },
      { code: "E", title: "Enterprising" },
      { code: "C", title: "Conventional" },
    ];
    return riasecOptions.find((option) => option.code === code);
  };

  const handleOccupationChange = (occupation: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedOccupations: prev.selectedOccupations.includes(occupation)
        ? prev.selectedOccupations.filter((o) => o !== occupation)
        : [...prev.selectedOccupations, occupation],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.selfStatement.trim()) {
        toast({
          type: "error",
          description: "Self statement is required",
        });
        return;
      }

      if (!formData.settingStatement.trim()) {
        toast({
          type: "error",
          description: "Setting statement is required",
        });
        return;
      }

      if (!formData.plotDescription.trim()) {
        toast({
          type: "error",
          description: "Plot description is required",
        });
        return;
      }

      if (!formData.plotActivities.trim()) {
        toast({
          type: "error",
          description: "Plot activities are required",
        });
        return;
      }

      if (!formData.ableToBeStatement.trim()) {
        toast({
          type: "error",
          description: "Able to be statement is required",
        });
        return;
      }

      if (!formData.placesWhereStatement.trim()) {
        toast({
          type: "error",
          description: "Places where statement is required",
        });
        return;
      }

      if (!formData.soThatStatement.trim()) {
        toast({
          type: "error",
          description: "So that statement is required",
        });
        return;
      }

      if (!formData.mottoStatement.trim()) {
        toast({
          type: "error",
          description: "Motto statement is required",
        });
        return;
      }

      if (formData.selectedOccupations.length === 0) {
        toast({
          type: "error",
          description: "At least one occupation must be selected",
        });
        return;
      }

      const response = await fetch(
        `/api/journey/sessions/${params.sessionId}/a/career-story-3`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save data");
      }

      toast({
        type: "success",
        description: "Career Story 3 saved successfully!",
      });

      // Navigate to session page
      setTimeout(() => {
        router.push(`/journey/sessions/${params.sessionId}`);
      }, 1000); // Small delay to show the success toast
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        type: "error",
        description:
          error instanceof Error ? error.message : "Failed to save data",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 to-primary-green-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary-blue-500" />
          <span className="text-primary-blue-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue-50 to primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header
          headerIcon={Briefcase}
          headerText="Career Story Exploration - 3"
          headerDescription="Synthesize your self-understanding and career interests into a comprehensive career formula"
        />

        {/* SELF Section */}
        <div className="mb-8">
          <Card className="mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary-green-100 rounded-lg">
                      <User className="sm:size-5 text-primary-green-600 size-4" />
                    </div>
                    <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
                      Self
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
                            Career Story 2 - Self Analysis
                          </SheetTitle>
                          <SheetDescription>
                            Reference your previous self-analysis from Career
                            Story 2
                          </SheetDescription>
                        </SheetHeader>

                        {/* Self Statement from Story 2 */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Self Statement from Career Story 2
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-primary-green-200/60 shadow-md">
                            <h5 className="text-primary-green-600 font-semibold mb-2">
                              &quot;I AM / I AM BECOMING...&quot;
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryTwoData.selfStatement}
                            </p>
                          </div>
                        </div>

                        {/* Hero Analysis Summary */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Hero Analysis Summary
                            </h4>
                          </div>
                          <div className="space-y-3">
                            <div className="bg-white/90 rounded-lg p-3 border border-primary-green-200/50">
                              <h6 className="font-bold text-primary-green-600 mb-1 text-sm">
                                First Adjectives:
                              </h6>
                              <p className="text-sm text-slate-600">
                                {mockCareerStoryTwoData.firstAdjectives}
                              </p>
                            </div>
                            <div className="bg-white/90 rounded-lg p-3 border border-primary-green-200/50">
                              <h6 className="font-bold text-primary-green-600 mb-1 text-sm">
                                Repeated Words:
                              </h6>
                              <p className="text-sm text-slate-600">
                                {mockCareerStoryTwoData.repeatedWords}
                              </p>
                            </div>
                            <div className="bg-white/90 rounded-lg p-3 border border-primary-green-200/50">
                              <h6 className="font-bold text-primary-green-600 mb-1 text-sm">
                                Common Traits:
                              </h6>
                              <p className="text-sm text-slate-600">
                                {mockCareerStoryTwoData.commonTraits}
                              </p>
                            </div>
                            <div className="bg-white/90 rounded-lg p-3 border border-primary-green-200/50">
                              <h6 className="font-bold text-primary-green-600 mb-1 text-sm">
                                Significant Words:
                              </h6>
                              <p className="text-sm text-slate-600">
                                {mockCareerStoryTwoData.significantWords}
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
                    Reflect on your core identity and the person you are
                    becoming. Use your previous self-analysis as reference.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
                <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                  Complete this statement about yourself:
                </h4>
                <p className="text-sm text-primary-green-700 leading-relaxed">
                  I AM / I AM BECOMING...
                </p>
              </div>
              <TextArea
                value={formData.selfStatement}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, selfStatement: value }))
                }
                placeholder="I am/I am becoming a person who is..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* SETTING Section */}
        <div className="mb-8">
          <Card className="mb-6 bg-gradient-to-br from-primary-blue-50/50 to-cyan-50/50 border-primary-blue-100/60">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-primary-blue-100 rounded-lg">
                      <MapPin className="sm:size-5 text-primary-blue-600 size-4" />
                    </div>
                    <CardTitle className="text-primary-blue-600 text-lg sm:text-xl">
                      Setting
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
                            Career Story 2 - Setting Analysis
                          </SheetTitle>
                          <SheetDescription>
                            Reference your preferred work settings from Career
                            Story 2
                          </SheetDescription>
                        </SheetHeader>

                        {/* Setting Statement from Story 2 */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Setting Statement from Career Story 2
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-primary-blue-200/60 shadow-md">
                            <h5 className="text-primary-blue-600 font-semibold mb-2">
                              &quot;I LIKE BEING IN PLACES WHERE...&quot;
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryTwoData.settingStatement}
                            </p>
                          </div>
                        </div>

                        {/* Media Activities */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Media Activities Analysis
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-primary-blue-200/60 shadow-md">
                            <h5 className="text-primary-blue-600 font-semibold mb-2">
                              Media Activities & Settings
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryTwoData.mediaActivities}
                            </p>
                          </div>
                        </div>

                        {/* RIASEC Selection */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Selected RIASEC Work Settings
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {mockCareerStoryTwoData.selectedRiasec.map(
                              (code, index) => {
                                const riasecOption = getRiasecDetails(code);
                                return (
                                  <div
                                    key={index}
                                    className="bg-white/90 rounded-lg p-3 border border-primary-blue-200/50 flex items-center gap-3"
                                  >
                                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                      {code}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">
                                      {code} - {riasecOption?.title}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Describe your preferred work environment and the types of
                    activities you enjoy. Reference your previous setting
                    analysis.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary-blue-100/50 to-cyan-100/50 rounded-xl p-4 border border-primary-blue-200/40 mb-4">
                <h4 className="font-semibold text-primary-blue-600 mb-2 flex items-center gap-2">
                  Complete this statement about your preferred settings:
                </h4>
                <p className="text-sm text-primary-blue-700 leading-relaxed">
                  I LIKE BEING IN PLACES WHERE PEOPLE DO ACTIVITIES SUCH AS...
                </p>
              </div>
              <TextArea
                value={formData.settingStatement}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, settingStatement: value }))
                }
                placeholder="I like being in places where people do activities such as..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* SCRIPT Section */}
        <div className="mb-8">
          <Card className="mb-6 bg-gradient-to-br from-emerald-50/50 to-primary-green-50/50 border-emerald-100/60">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <BookOpen className="sm:size-5 text-emerald-600 size-4" />
                    </div>
                    <CardTitle className="text-emerald-600 text-lg sm:text-xl">
                      Script
                    </CardTitle>
                  </div>
                  <div>
                    <Sheet>
                      <SheetTrigger>
                        <Info className="text-emerald-600 size-4 sm:size-5" />
                      </SheetTrigger>
                      <SheetContent className="min-w-[340px] sm:min-w-[600px] overflow-y-scroll bg-gradient-to-r from-emerald-100 to-white">
                        <SheetHeader>
                          <SheetTitle className="text-emerald-600 text-xl font-bold">
                            Career Story 1 - Favorite Story & Saying
                          </SheetTitle>
                          <SheetDescription>
                            Reference your favorite story and saying from Career
                            Story 1
                          </SheetDescription>
                        </SheetHeader>

                        {/* Favorite Story */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Favorite Story from Career Story 1
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-emerald-200/60 shadow-md">
                            <h5 className="text-emerald-600 font-semibold mb-2">
                              Favorite Book/Movie
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryOneData.favoriteStory}
                            </p>
                          </div>
                        </div>

                        {/* Favorite Saying */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Your Favorite Saying from Career Story 1
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-emerald-200/60 shadow-md">
                            <h5 className="text-emerald-600 font-semibold mb-2">
                              Favorite Quote/Saying
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryOneData.favoriteSaying}
                            </p>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Analyze your favorite story to understand what motivates and
                    inspires you. Reference your favorite story from Career
                    Story 1.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-emerald-100/50 to-primary-green-100/50 rounded-xl p-4 border border-emerald-200/40 mb-4">
                <h4 className="font-semibold text-emerald-600 mb-2 flex items-center gap-2">
                  <BookOpen className="size-4" />
                  Analyze Your Favorite Story
                </h4>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  Describe the plot of your favorite book or movie:
                </p>
              </div>
              <TextArea
                value={formData.plotDescription}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, plotDescription: value }))
                }
                placeholder="Describe the main storyline, characters, and themes of your favorite book or movie..."
                rows={4}
                className="mb-4"
              />

              <div className="bg-gradient-to-r from-emerald-100/50 to-primary-green-100/50 rounded-xl p-4 border border-emerald-200/40 mb-4">
                <h4 className="font-semibold text-emerald-600 mb-2 flex items-center gap-2">
                  <Target className="size-4" />
                  What This Means for Your Work
                </h4>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  THEREFORE, IN THESE PLACES, I WANT TO...
                </p>
              </div>
              <TextArea
                value={formData.plotActivities}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, plotActivities: value }))
                }
                placeholder="Based on what inspires you about this story, what do you want to do in your work environment?"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* EXCELLENCE FORMULA Section */}
        <div className="mb-8">
          <QuestionSection
            title="Excellence Formula"
            subtitle="Create your personal formula for happiness and success in your career"
            icon={
              <Target className="sm:size-5 text-primary-green-600 size-4" />
            }
          >
            {/* able to be */}
            <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
              <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                <Star className="size-4" />
                Personal Qualities
              </h4>
              <p className="text-sm text-primary-green-700 leading-relaxed">
                I will be most happy and successful when I am able to be:
              </p>
            </div>
            <InputField
              value={formData.ableToBeStatement}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  ableToBeStatement: value,
                }))
              }
              placeholder="I will be most happy and successful when I am able to be..."
              className="mb-4"
            />

            {/* in places where people */}
            <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
              <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                <MapPin className="size-4" />
                Work Environment
              </h4>
              <p className="text-sm text-primary-green-700 leading-relaxed">
                I will be most happy and successful in places where people:
              </p>
            </div>
            <InputField
              value={formData.placesWhereStatement}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  placesWhereStatement: value,
                }))
              }
              placeholder="I will be most happy and successful in places where people..."
              className="mb-4"
            />

            {/* so that i can */}
            <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
              <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                <Target className="size-4" />
                Purpose & Impact
              </h4>
              <p className="text-sm text-primary-green-700 leading-relaxed">
                I will be most happy and successful so that I can:
              </p>
            </div>
            <InputField
              value={formData.soThatStatement}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, soThatStatement: value }))
              }
              placeholder="I will be most happy and successful so that I can..."
            />
          </QuestionSection>
        </div>

        {/* SELF-ADVICE Section */}
        <div className="mb-8">
          <QuestionSection
            title="My motto contains my best advice to myself"
            subtitle="Create a personal motto that encapsulates your career guidance to yourself"
            icon={
              <MessageSquare className="sm:size-5 text-primary-green-600 size-4" />
            }
          >
            <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-4 border border-primary-green-200/40 mb-4">
              <h4 className="font-semibold text-primary-green-600 mb-2 flex items-center gap-2">
                MY PERSONAL CAREER MOTTO
              </h4>
              <p className="text-sm text-primary-green-700 leading-relaxed">
                My motto contains my best advice to myself for dealing with my
                career concerns. To apply my success formula now, the best
                advice I can give myself is (write your motto here):
              </p>
            </div>
            <TextArea
              value={formData.mottoStatement}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, mottoStatement: value }))
              }
              placeholder="Write your personal career motto here..."
              rows={4}
            />
          </QuestionSection>
        </div>

        {/* EXPLORING OCCUPATIONS Section */}
        <div className="mb-8">
          <Card className="mb-6 bg-gradient-to-br from-teal-50/50 to-primary-green-50/50 border-teal-100/60">
            <CardHeader>
              <div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Search className="sm:size-5 text-teal-600 size-4" />
                    </div>
                    <CardTitle className="text-teal-600 text-lg sm:text-xl">
                      Occupations I Am Now Considering
                    </CardTitle>
                  </div>
                  <div>
                    <Sheet>
                      <SheetTrigger>
                        <Info className="text-teal-600 size-4 sm:size-5" />
                      </SheetTrigger>
                      <SheetContent className="min-w-[340px] sm:min-w-[600px] overflow-y-scroll bg-gradient-to-r from-teal-100 to-white">
                        <SheetHeader>
                          <SheetTitle className="text-teal-600 text-xl font-bold">
                            Career Story 1 - Occupations Listed
                          </SheetTitle>
                          <SheetDescription>
                            Reference the occupations you listed in Career Story
                            1
                          </SheetDescription>
                        </SheetHeader>

                        {/* Occupations from Story 1 */}
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-slate-600 text-sm">
                              Occupations You Listed in Career Story 1
                            </h4>
                          </div>
                          <div className="bg-white/90 rounded-xl p-4 border border-teal-200/60 shadow-md">
                            <h5 className="text-teal-600 font-semibold mb-2">
                              Your Original Occupation List
                            </h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {mockCareerStoryOneData.occupations}
                            </p>
                          </div>
                        </div>

                        {/* Instruction */}
                        <div className="mt-6">
                          <div className="bg-teal-50/80 rounded-xl p-4 border border-teal-200/60">
                            <h5 className="text-teal-600 font-semibold mb-2 flex items-center gap-2">
                              <Lightbulb className="size-4" />
                              Selection Guidance
                            </h5>
                            <p className="text-sm text-teal-700 leading-relaxed">
                              Based on your career story analysis (Self,
                              Setting, Script, and Excellence Formula), review
                              these occupations and identify those that now
                              align with your deeper understanding of who you
                              are and what you want.
                            </p>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    Based on your career story analysis, look over the
                    occupations you listed in Career Story 1 and identify those
                    that you now see as potential choices.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 mb-4">
                  Select the occupations you are now considering based on your
                  career story analysis:
                </p>

                <div className="grid gap-3 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-4 bg-white/50">
                  {occupationOptions.map((occupation) => (
                    <div
                      key={occupation}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        formData.selectedOccupations.includes(occupation)
                          ? "border-teal-500 bg-teal-50 shadow-md"
                          : "border-slate-200 hover:border-teal-300 hover:bg-teal-25"
                      }`}
                      onClick={() => handleOccupationChange(occupation)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-5 rounded border-2 flex items-center justify-center ${
                            formData.selectedOccupations.includes(occupation)
                              ? "border-teal-500 bg-teal-500"
                              : "border-slate-300"
                          }`}
                        >
                          {formData.selectedOccupations.includes(
                            occupation
                          ) && <div className="size-2 bg-white rounded-full" />}
                        </div>
                        <span className="font-medium text-slate-800">
                          {occupation}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.selectedOccupations.length > 0 && (
                  <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-sm font-medium text-teal-800 mb-2">
                      Selected Occupations (
                      {formData.selectedOccupations.length}
                      ):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedOccupations.map((occupation) => (
                        <span
                          key={occupation}
                          className="px-3 py-1 bg-teal-500 text-white text-sm rounded-full"
                        >
                          {occupation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="text-center mt-8">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="group relative px-10 py-6 bg-gradient-to-r from-primary-green-500 to-primary-blue-500 text-white rounded-2xl font-bold text-lg hover:from-primary-green-600 hover:to-primary-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              {loading ? (
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
        </div>
      </div>
    </div>
  );
}
