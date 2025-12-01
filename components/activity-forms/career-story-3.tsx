"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { z } from "zod";
import {
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  BookOpen,
  MessageSquare,
  Search,
  CheckCircle,
  Award,
  Star,
  Loader2,
  Briefcase,
  FileText,
  Info,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { toast } from "@/components/toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const careerStoryThreeDataSchema = z.object({
  selfStatement: z
    .string()
    .min(10, "Please write at least 10 characters about yourself"),
  settingStatement: z
    .string()
    .min(10, "Please describe your preferred settings"),
  plotDescription: z
    .string()
    .min(10, "Please describe the plot of your favorite story"),
  plotActivities: z.string().min(10, "Please describe what you want to do"),
  ableToBeStatement: z
    .string()
    .min(10, "Please complete the 'I am able to be' statement"),
  placesWhereStatement: z
    .string()
    .min(10, "Please complete the 'in places where people' statement"),
  soThatStatement: z
    .string()
    .min(10, "Please complete the 'so that I can' statement"),
  mottoStatement: z.string().min(10, "Please write your personal motto"),
  selectedOccupations: z
    .array(z.string())
    .min(1, "Please select at least one occupation"),
});

type CareerStory3Data = z.infer<typeof careerStoryThreeDataSchema>;

// Fallback occupations in case API fails
const FALLBACK_OCCUPATIONS = [
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

const questionGroups = [
  {
    title: "SELF",
    icon: User,
    color: "primary-green",
    questions: [
      {
        text: "I am/I am becoming:",
        fieldName: "selfStatement",
        placeholder: "I am/I am becoming a person who is...",
        rows: 4,
      },
    ],
  },
  {
    title: "SETTING",
    icon: MapPin,
    color: "primary-blue",
    questions: [
      {
        text: "I like being in places where people do activities such as:",
        fieldName: "settingStatement",
        placeholder:
          "I like being in places where people do activities such as...",
        rows: 4,
      },
    ],
  },
  {
    title: "SCRIPT",
    icon: BookOpen,
    color: "emerald",
    questions: [
      {
        text: "The plot of my favourite book or movie is:",
        fieldName: "plotDescription",
        placeholder:
          "Describe the main storyline, characters, and themes of your favorite book or movie...",
        rows: 4,
      },
      {
        text: "Therefore, in these aspects of life, I want to:",
        fieldName: "plotActivities",
        placeholder:
          "Based on what inspires you about this story, what do you want to do in your work environment?",
        rows: 3,
      },
    ],
  },
  {
    title: "EXCELLENCE FORMULA",
    icon: Star,
    color: "primary-green",
    questions: [
      {
        text: "I will be most satisfied and successful when I am able to be:",
        fieldName: "ableToBeStatement",
        placeholder:
          "I will be most happy and successful when I am able to be...",
        rows: 3,
      },
      {
        text: "I will be most satisfied and successful in places where people:",
        fieldName: "placesWhereStatement",
        placeholder:
          "I will be most happy and successful in places where people...",
        rows: 3,
      },
      {
        text: "I will be most satisfied and successful so that I can:",
        fieldName: "soThatStatement",
        placeholder: "I will be most happy and successful so that I can...",
        rows: 3,
      },
    ],
  },
  {
    title: "SELF ADVICE",
    icon: MessageSquare,
    color: "purple",
    questions: [
      {
        text: "My motto contains my best advice to myself for dealing with my career concerns. To apply my excellence formula now, the best advice I can give myself is (write your motto here):",
        fieldName: "mottoStatement",
        placeholder: "Write your personal career motto here...",
        rows: 4,
      },
    ],
  },
];

export default function CareerStory3() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReferenceSheetOpen, setIsReferenceSheetOpen] = useState(false);
  const [referenceData, setReferenceData] = useState<any>(null);
  const [isLoadingReference, setIsLoadingReference] = useState(false);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [isSection2ReferenceSheetOpen, setIsSection2ReferenceSheetOpen] =
    useState(false);
  const [careerStoryOneData, setCareerStoryOneData] = useState<any>(null);
  const [isLoadingSection2Reference, setIsLoadingSection2Reference] =
    useState(false);
  const [section2ReferenceError, setSection2ReferenceError] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customOccupation, setCustomOccupation] = useState("");
  const [occupationOptions, setOccupationOptions] = useState<string[]>([]);
  const [isLoadingOccupations, setIsLoadingOccupations] = useState(false);
  const [occupationError, setOccupationError] = useState<string | null>(null);
  const hasFetchedOccupations = useRef(false);
  const hasTriedToFetch = useRef(false);
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "My Story-3 Activity");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  // Function to fetch occupations from API
  const fetchOccupations = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (hasFetchedOccupations.current) {
      return;
    }

    hasFetchedOccupations.current = true;
    setIsLoadingOccupations(true);
    setOccupationError(null);

    try {
      const response = await fetch("/api/occupations");

      if (response.ok) {
        const data = await response.json();

        if (data.occupations && data.occupations.length > 0) {
          setOccupationOptions(data.occupations);
        } else {
          throw new Error("No occupations found in API response");
        }
      } else {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(
          errorData.error ||
            `API returned ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error fetching occupations:", error);

      let errorMessage = "Failed to load occupations. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("No occupations found")) {
          errorMessage = "No occupations available at the moment.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      setOccupationError(errorMessage);
      hasFetchedOccupations.current = false; // Allow retry on error

      // Use fallback occupations if API fails
      setOccupationOptions(FALLBACK_OCCUPATIONS);

      toast({
        type: "error",
        description:
          "Using offline occupation list. Some occupations may not be available.",
      });
    } finally {
      setIsLoadingOccupations(false);
    }
  }, []); // Empty dependency array - function never changes

  // Function to fetch reference data based on current group
  const fetchReferenceData = async () => {
    setIsLoadingReference(true);
    setReferenceError(null);

    try {
      const currentGroupData = questionGroups[currentGroup];
      let response: Response;

      if (
        currentGroupData.title === "SELF" ||
        currentGroupData.title === "SETTING"
      ) {
        // Fetch career-story-2 data
        response = await fetch("/api/journey/sessions/3/a/career-story-2");
      } else if (
        currentGroupData.title === "SCRIPT" ||
        currentGroupData.title === "SELF ADVICE"
      ) {
        // Fetch career-story-1 data
        response = await fetch("/api/journey/sessions/1/a/career-story-1");
      } else {
        // EXCELLENCE FORMULA - no data needed
        setReferenceData({ type: "excellence_formula" });
        setIsLoadingReference(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setReferenceData({ ...data, type: currentGroupData.title });
      } else {
        throw new Error("Failed to fetch reference data");
      }
    } catch (error) {
      console.error("Error fetching reference data:", error);
      setReferenceError("Failed to load reference data. Please try again.");
      toast({
        type: "error",
        description: "Failed to load reference data",
      });
    } finally {
      setIsLoadingReference(false);
    }
  };

  // Function to fetch career-story-1 data for Section 2 reference
  const fetchSection2ReferenceData = async () => {
    setIsLoadingSection2Reference(true);
    setSection2ReferenceError(null);

    try {
      const response = await fetch("/api/journey/sessions/1/a/career-story-1");

      if (response.ok) {
        const data = await response.json();
        setCareerStoryOneData(data);
      } else {
        throw new Error("Failed to fetch My Story-1 data");
      }
    } catch (error) {
      console.error("Error fetching My Story-1 data:", error);
      setSection2ReferenceError(
        "Failed to load reference data. Please try again."
      );
      toast({
        type: "error",
        description: "Failed to load My Story-1 reference data",
      });
    } finally {
      setIsLoadingSection2Reference(false);
    }
  };

  const form = useForm<CareerStory3Data>({
    resolver: zodResolver(careerStoryThreeDataSchema),
    defaultValues: {
      selfStatement: "",
      settingStatement: "",
      plotDescription: "",
      plotActivities: "",
      ableToBeStatement: "",
      placesWhereStatement: "",
      soThatStatement: "",
      mottoStatement: "",
      selectedOccupations: [],
    },
    mode: "onChange",
  });

  // Load existing data on component mount
  useEffect(() => {
    if (!sessionId) return;

    const loadData = async () => {
      const aId = "career-story-3";
      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/${aId}`
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // form is intentionally excluded to prevent re-fetching

  // Fetch occupations once when component mounts and loading is complete
  useEffect(() => {
    if (
      !isLoading &&
      !hasFetchedOccupations.current &&
      !hasTriedToFetch.current
    ) {
      hasTriedToFetch.current = true;
      fetchOccupations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]); // fetchOccupations is intentionally excluded to prevent re-fetching

  const goToNextGroup = () => {
    if (currentGroup < questionGroups.length - 1) {
      setCurrentGroup(currentGroup + 1);
    } else if (currentSection === 1) {
      setCurrentSection(2);
    }
  };

  const goToPreviousGroup = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
    } else if (currentSection === 2) {
      setCurrentSection(1);
      setCurrentGroup(questionGroups.length - 1);
    }
  };

  const handleOccupationChange = (occupation: string) => {
    const currentOccupations = form.getValues("selectedOccupations");
    const updatedOccupations = currentOccupations.includes(occupation)
      ? currentOccupations.filter((o) => o !== occupation)
      : [...currentOccupations, occupation];
    form.setValue("selectedOccupations", updatedOccupations);
  };

  const handleAddCustomOccupation = () => {
    if (
      customOccupation.trim() &&
      !form.getValues("selectedOccupations").includes(customOccupation.trim())
    ) {
      form.setValue("selectedOccupations", [
        ...form.getValues("selectedOccupations"),
        customOccupation.trim(),
      ]);
      setCustomOccupation("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomOccupation();
    }
  };

  // Filter occupations based on search query
  const filteredOccupations = occupationOptions.filter((occupation) =>
    occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitAssessment = async (data: CareerStory3Data) => {
    const aId = "career-story-3";
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${aId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setIsCompleted(true);
        toast({
          type: "success",
          description: "My Story 3 saved successfully!",
        });
        setTimeout(() => {
          router.push(`/journey/sessions/${sessionId}`);
        }, 1000);
      } else {
        throw new Error("Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        type: "error",
        description: "Failed to save data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Current group data and progress calculation
  const currentGroupData = questionGroups[currentGroup];
  const progressPercentage =
    currentSection === 1
      ? ((currentGroup + 1) / questionGroups.length) * 50
      : 50 + ((currentGroup + 1) / questionGroups.length) * 50;

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">
            Loading your My Story-3 Activity...
          </p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mx-auto mb-4 shadow-lg size-16 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-2xl">
              <CheckCircle className="text-white size-8" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">
              My Story Complete!
            </h2>
            <p className="text-slate-600">
              Thank you for completing your My Story-3 exploration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main assessment form UI
  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Section Navigation */}
          <div className="flex flex-col items-center gap-4 mb-6">
            {/* Section Tabs */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setCurrentSection(1);
                  setCurrentGroup(0);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentSection === 1
                    ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Section 1: Self Analysis
              </Button>
              <Button
                onClick={() => {
                  setCurrentSection(2);
                  setCurrentGroup(0);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentSection === 2
                    ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Section 2: Occupations
              </Button>
            </div>
          </div>

          {/* Section 1: Self Analysis Questions */}
          {currentSection === 1 && (
            <>
              {/* Question Navigation Dots */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                {questionGroups.map((group, index) => (
                  <Button
                    key={group.title}
                    onClick={() => setCurrentGroup(index)}
                    className={`
                    size-8 rounded-md font-bold text-xs transition-all duration-300 hover:scale-105 flex justify-center items-center
                    ${
                      index === currentGroup
                        ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                        : index < currentGroup
                        ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                        : "bg-white text-slate-500 hover:bg-slate-200"
                    }
                  `}
                  >
                    {index < currentGroup ? (
                      <CheckCircle className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </Button>
                ))}
              </div>

              {/* Main Question Group Card */}
              <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
                <CardContent className="p-6 sm:p-8">
                  <Form {...form}>
                    <div className="space-y-6">
                      {/* Group Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center shadow-md size-8 bg-gradient-to-br from-primary-blue-500 to-primary-green-500 rounded-lg">
                            <currentGroupData.icon className="text-white size-4" />
                          </div>
                          <h2 className="text-lg font-semibold text-slate-800">
                            {currentGroupData.title}
                          </h2>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsReferenceSheetOpen(true);
                            fetchReferenceData();
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border-slate-300"
                        >
                          <FileText className="mr-1 size-4" />
                          Reference
                        </Button>
                      </div>

                      {/* Questions in this group */}
                      <div className="space-y-6">
                        {currentGroupData.questions.map(
                          (question, questionIndex) => (
                            <FormField
                              key={question.fieldName}
                              control={form.control}
                              name={
                                question.fieldName as keyof CareerStory3Data
                              }
                              render={({ field }) => (
                                <FormItem className="space-y-4">
                                  {/* Question Text */}
                                  <div className="mb-4">
                                    <p className="text-lg font-medium leading-relaxed text-slate-700">
                                      {question.text}
                                    </p>
                                  </div>

                                  {/* Textarea Input Section */}
                                  <FormControl>
                                    <div className="relative p-1.5 space-y-1 border shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-slate-200">
                                      <div className="space-y-3">
                                        <Textarea
                                          key={`textarea-${question.fieldName}`}
                                          {...field}
                                          value={
                                            typeof field.value === "string"
                                              ? field.value
                                              : ""
                                          }
                                          placeholder={question.placeholder}
                                          rows={question.rows}
                                          className="min-h-[200px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 md:text-lg"
                                        />
                                      </div>
                                      <div className="flex items-center justify-between pt-2 text-xs border-t text-slate-500 border-slate-200/50">
                                        <span className="flex items-center gap-1">
                                          <Briefcase className="size-3" />
                                          Take your time to reflect and write
                                          thoughtfully
                                        </span>
                                        <span className="font-medium">
                                          {field.value?.length || 0} characters
                                        </span>
                                      </div>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row border-slate-200">
                        {/* Previous Button */}
                        <Button
                          type="button"
                          onClick={goToPreviousGroup}
                          disabled={currentGroup === 0}
                          className="flex items-center justify-center w-full h-10 gap-2 font-medium transition-all duration-200 bg-white border rounded-lg sm:flex-1 border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          <ArrowLeft className="transition-transform duration-200 size-4 group-hover:-translate-x-1" />
                          Previous
                        </Button>

                        {/* Next Button */}
                        {currentGroup === questionGroups.length - 1 ? (
                          <Button
                            type="button"
                            onClick={() => setCurrentSection(2)}
                            className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2"
                          >
                            Next Section
                            <ArrowRight className="transition-transform duration-200 size-4 group-hover:translate-x-1" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={goToNextGroup}
                            className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2"
                          >
                            Next
                            <ArrowRight className="transition-transform duration-200 size-4 group-hover:translate-x-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </>
          )}

          {/* Section 2: Occupations */}
          {currentSection === 2 && (
            <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center shadow-md size-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                        <Search className="text-white size-4" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">
                        Exploring Occupations
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsSection2ReferenceSheetOpen(true);
                          fetchSection2ReferenceData();
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border-slate-300"
                      >
                        <FileText className="mr-1 size-4" />
                        Reference
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                        className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-gradient-to-br from-teal-50 to-teal-100 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border-slate-300"
                      >
                        <a
                          href="https://www.inwesol.com/explorer/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          Explorer
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Section Description */}
                  <div className="mb-6">
                    <p className="text-slate-600">
                      If you want to explore careers that best match your
                      interests, please revisit My Story-1 (Step 2). Review the
                      occupations you listed there and, based on your summary
                      above, identify the ones that now seem like good options
                      for you.
                    </p>
                  </div>

                  {/* Occupation Selection */}
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Select the occupations you are now considering based on
                      your My Story analysis:
                    </p>

                    {/* Side by Side Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Available Occupations */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-700">
                          Available Occupations
                        </h3>

                        {/* Search Bar */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search occupations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="size-4 text-slate-400" />
                          </div>
                        </div>

                        <div className="grid gap-2 p-4 overflow-y-auto border rounded-lg max-h-[470px] border-slate-200 bg-white/50">
                          {isLoadingOccupations ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="text-center">
                                <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-8 border-teal-600" />
                                <p className="text-sm text-slate-600">
                                  Loading occupations...
                                </p>
                              </div>
                            </div>
                          ) : occupationError ? (
                            <div className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
                              <div className="mx-auto mb-4 size-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Info className="size-6 text-red-600" />
                              </div>
                              <p className="text-sm text-red-700 font-medium mb-4">
                                {occupationError}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  hasFetchedOccupations.current = false;
                                  hasTriedToFetch.current = false;
                                  setOccupationError(null);
                                  fetchOccupations();
                                }}
                                className="bg-white hover:bg-red-50 border-red-300 text-red-700 hover:text-red-800"
                              >
                                Try Again
                              </Button>
                            </div>
                          ) : filteredOccupations.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="text-center">
                                <div className="mx-auto mb-2 size-8 bg-slate-200 rounded-full flex items-center justify-center">
                                  <Search className="size-4" />
                                </div>
                                <p className="text-sm text-slate-600">
                                  {searchQuery
                                    ? "No occupations found"
                                    : "No occupations available"}
                                </p>
                                {searchQuery && (
                                  <p className="text-xs text-slate-400">
                                    Try a different search term
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            filteredOccupations.map((occupation) => (
                              <button
                                key={occupation}
                                type="button"
                                className={`w-full text-left border-2 rounded-lg p-3 transition-all duration-200 ${
                                  form
                                    .watch("selectedOccupations")
                                    .includes(occupation)
                                    ? "border-teal-500 bg-teal-50 shadow-md"
                                    : "border-slate-200 hover:border-teal-300 hover:bg-teal-25"
                                }`}
                                onClick={() =>
                                  handleOccupationChange(occupation)
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`size-5 rounded border-2 flex items-center justify-center ${
                                      form
                                        .watch("selectedOccupations")
                                        .includes(occupation)
                                        ? "border-teal-500 bg-teal-500"
                                        : "border-slate-300"
                                    }`}
                                  >
                                    {form
                                      .watch("selectedOccupations")
                                      .includes(occupation) && (
                                      <div className="bg-white rounded-full size-2" />
                                    )}
                                  </div>
                                  <span className="font-medium text-slate-800">
                                    {occupation}
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Selected Occupations */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-700">
                          Selected Occupations (
                          {form.watch("selectedOccupations").length})
                        </h3>

                        <div className="p-3 border rounded-lg min-h-[520px] max-h-[520px] border-teal-200 bg-teal-50 overflow-y-auto">
                          {/* Add Custom Occupation */}
                          <div className="flex gap-2 mb-2 sticky top-0 ">
                            <input
                              type="text"
                              placeholder="Add custom occupation..."
                              value={customOccupation}
                              onChange={(e) =>
                                setCustomOccupation(e.target.value)
                              }
                              onKeyPress={handleKeyPress}
                              className="flex-1 px-3 py-2 text-sm border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomOccupation}
                              disabled={!customOccupation.trim()}
                              className="px-4 py-2 text-sm font-medium  bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              Add
                            </button>
                          </div>
                          {form.watch("selectedOccupations").length > 0 ? (
                            <div className="space-y-3">
                              {form
                                .watch("selectedOccupations")
                                .map((occupation) => (
                                  <div
                                    key={occupation}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-teal-200 shadow-sm"
                                  >
                                    <span className="font-medium text-slate-800">
                                      {occupation}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOccupationChange(occupation)
                                      }
                                      className="p-1 text-teal-600 hover:text-teal-800 hover:bg-teal-100 rounded transition-colors duration-200"
                                      title="Remove occupation"
                                    >
                                      <svg
                                        className="size-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-32 text-slate-500">
                              <div className="text-center">
                                <div className="mx-auto mb-2 size-8 bg-slate-200 rounded-full flex items-center justify-center">
                                  <Search className="size-4" />
                                </div>
                                <p className="text-sm">
                                  No occupations selected
                                </p>
                                <p className="text-xs text-slate-400">
                                  Select from the left panel or add custom
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row border-slate-200">
                      {/* Previous Button */}
                      <Button
                        type="button"
                        onClick={() => {
                          setCurrentSection(1);
                          setCurrentGroup(questionGroups.length - 1);
                        }}
                        className="flex items-center justify-center w-full h-10 gap-2 font-medium transition-all duration-200 bg-white border rounded-lg sm:flex-1 border-slate-300 hover:bg-slate-50 text-slate-700 group"
                      >
                        <ArrowLeft className="transition-transform duration-200 size-4 group-hover:-translate-x-1" />
                        Previous Section
                      </Button>

                      {/* Submit Button */}
                      <Button
                        type="button"
                        onClick={form.handleSubmit(handleSubmitAssessment)}
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 text-white animate-spin size-4" />
                            Saving...
                          </>
                        ) : (
                          <>
                            Complete Story
                            <Award className="transition-transform duration-200 size-4 group-hover:rotate-12" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reference Sheet */}
          <Sheet
            open={isReferenceSheetOpen}
            onOpenChange={setIsReferenceSheetOpen}
          >
            <SheetContent className="w-full sm:max-w-lg flex flex-col">
              <SheetHeader className="pb-3 shrink-0 border-b border-slate-200">
                <SheetTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-primary-blue-500 to-primary-green-500 rounded-xl shadow-md">
                    <FileText className="size-6 text-white" />
                  </div>
                  {currentGroupData?.title} Reference
                </SheetTitle>
                <SheetDescription className="text-base leading-relaxed text-slate-600 mt-2">
                  {currentGroupData?.title === "SELF" &&
                    "Reference your self-analysis from My Story 2"}
                  {currentGroupData?.title === "SETTING" &&
                    "Reference your setting analysis from My Story 2"}
                  {currentGroupData?.title === "SCRIPT" &&
                    "Reference your favorite story from My Story 1"}
                  {currentGroupData?.title === "EXCELLENCE FORMULA" &&
                    "Guidance for creating your personal mission statement"}
                  {currentGroupData?.title === "SELF ADVICE" &&
                    "Reference your favorite story and saying from My Story 1"}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 flex-1 p-4 overflow-y-auto">
                {isLoadingReference ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-10 border-primary-blue-600" />
                      <p className="text-base text-slate-600 font-medium">
                        Loading reference data...
                      </p>
                    </div>
                  </div>
                ) : referenceError ? (
                  <div className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
                    <div className="mx-auto mb-4 size-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Info className="size-6 text-red-600" />
                    </div>
                    <p className="text-base text-red-700 font-medium mb-4">
                      {referenceError}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fetchReferenceData}
                      className="bg-white hover:bg-red-50 border-red-300 text-red-700 hover:text-red-800"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : !referenceData ? (
                  <div className="p-6 text-center bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-sm">
                    <div className="mx-auto mb-4 size-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <FileText className="size-6 text-slate-400" />
                    </div>
                    <p className="text-base text-slate-600 font-medium">
                      No reference data available.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* SELF Group Content */}
                    {referenceData.type === "SELF" && (
                      <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-slate-800 mb-3">
                            Self Analysis Summary
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                First Adjectives:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.firstAdjectives ||
                                  "Not available"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Repeated Words:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.repeatedWords || "Not available"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Common Traits:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.commonTraits || "Not available"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Significant Words:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.significantWords ||
                                  "Not available"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Self Statement:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.selfStatement || "Not available"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* SETTING Group Content */}
                    {referenceData.type === "SETTING" && (
                      <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-slate-800 mb-3">
                            Setting Analysis Summary
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Media Activities:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.mediaActivities ||
                                  "Not available"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Selected Work Settings:
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {referenceData.selectedRiasec?.map(
                                  (code: string) => (
                                    <span
                                      key={code}
                                      className="px-3 py-1 text-sm border border-primary-blue-600 rounded-full"
                                    >
                                      {code}
                                    </span>
                                  )
                                ) || (
                                  <span className="text-sm text-slate-600">
                                    Not available
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Setting Statement:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.settingStatement ||
                                  "Not available"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* SCRIPT Group Content */}
                    {referenceData.type === "SCRIPT" && (
                      <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-slate-800 mb-3">
                            Favorite Story & Saying
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Favorite Story:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.favoriteStory || "Not available"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-1">
                                Favorite Saying:
                              </h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                {referenceData.favoriteSaying ||
                                  "Not available"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* EXCELLENCE FORMULA Group Content */}
                    {referenceData.type === "excellence_formula" && (
                      <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-slate-800 mb-3">
                            Excellence Formula Guidance
                          </h3>
                          <div className="p-4 bg-gradient-to-br from-primary-green-50 to-primary-blue-50 border border-primary-green-200 rounded-lg">
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                              USE YOUR SELF, SETTING, AND SCRIPT TO WRITE A
                              ONE-SENTENCE PERSONAL LIFE CAREER MISSION
                              STATEMENT.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* SELF ADVICE Group Content */}
                    {referenceData.type === "SELF ADVICE" && (
                      <div className="space-y-4">
                        {/* Transition Essay */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">
                              Current Transition
                            </h3>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">
                              {referenceData.transitionEssay || "Not available"}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Occupations */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">
                              Career Aspirations
                            </h3>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">
                              {referenceData.occupations || "Not available"}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Heroes */}
                        {referenceData.heroes &&
                          referenceData.heroes.length > 0 && (
                            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                              <CardContent className="p-4">
                                <h3 className="text-lg font-bold text-slate-800 mb-3">
                                  Childhood Heroes
                                </h3>
                                <div className="space-y-3">
                                  {referenceData.heroes.map(
                                    (hero: any, index: number) => (
                                      <div
                                        key={hero.id || index}
                                        className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                                      >
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">
                                          {hero.title || `Hero ${index + 1}`}
                                        </h4>
                                        <p className="text-sm text-slate-600 whitespace-pre-wrap">
                                          {hero.description ||
                                            "No description available"}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                        {/* Media Preferences */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">
                              Media Preferences
                            </h3>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">
                              {referenceData.mediaPreferences ||
                                "Not available"}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Favorite Story */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">
                              Favorite Story
                            </h3>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">
                              {referenceData.favoriteStory || "Not available"}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Favorite Saying */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50/30">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-slate-800 mb-3">
                              Favorite Saying
                            </h3>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">
                              {referenceData.favoriteSaying || "Not available"}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Section 2 Reference Sheet - My Story-1 Activity Reference */}
          <Sheet
            open={isSection2ReferenceSheetOpen}
            onOpenChange={setIsSection2ReferenceSheetOpen}
          >
            <SheetContent className="min-w-[340px] sm:min-w-[600px] overflow-y-scroll bg-gradient-to-r from-primary-blue-100 to-white">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-primary-blue-600">
                  My Story-1 Activity - Your Original Transition Essay
                </SheetTitle>
                <SheetDescription>
                  Review your original transition essay and career aspirations
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 flex-1 p-4 overflow-y-auto">
                {isLoadingSection2Reference ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-10 border-primary-blue-600" />
                      <p className="text-base text-slate-600 font-medium">
                        Loading reference data...
                      </p>
                    </div>
                  </div>
                ) : section2ReferenceError ? (
                  <div className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
                    <div className="mx-auto mb-4 size-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Info className="size-6 text-red-600" />
                    </div>
                    <p className="text-base text-red-700 font-medium mb-4">
                      {section2ReferenceError}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fetchSection2ReferenceData}
                      className="bg-white hover:bg-red-50 border-red-300 text-red-700 hover:text-red-800"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : !careerStoryOneData ? (
                  <div className="p-6 text-center bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-sm">
                    <div className="mx-auto mb-4 size-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <FileText className="size-6 text-slate-400" />
                    </div>
                    <p className="text-base text-slate-600 font-medium">
                      No reference data available.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Original Transition Essay */}
                    <div className="mt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="text-sm font-medium text-slate-600">
                          Your Original Transition Essay
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
                    {careerStoryOneData?.heroes &&
                      careerStoryOneData.heroes.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="text-sm font-medium text-slate-600">
                              Your Heroes & Role Models
                            </h4>
                          </div>
                          <div className="space-y-4">
                            {careerStoryOneData.heroes.map(
                              (hero: any, index: number) => (
                                <div
                                  key={hero.id || index}
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
                              )
                            )}
                          </div>
                        </div>
                      )}

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
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
