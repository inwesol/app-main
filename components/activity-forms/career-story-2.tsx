"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import {
  ArrowRight,
  ArrowLeft,
  Book,
  User,
  MapPin,
  CheckCircle,
  Award,
  Info,
  FileText,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { toast } from "sonner";
import { StrengthDialog } from "@/components/strength-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const sections = [
  {
    title: "The Self",
    subtitle: "Who am I? Who am I becoming?",
    icon: User,
    color: "primary-green",
    description1:
      "Take a look at the words you used to describe your heroes or heroines (role models) question in the previous My Story-1 Activity.",
    questions1: [
      {
        question:
          "Write down the first adjective you used to describe each one of them:",
        fieldName: "firstAdjectives",
        ui_type: "text area",
        rows: 3,
      },
      {
        question:
          "Write down any words or similar words that you used more than once to describe them:",
        fieldName: "repeatedWords",
        ui_type: "text area",
        rows: 3,
      },
      {
        question:
          "Write down two or more things your heroes or heroines (role models) have in common:",
        fieldName: "commonTraits",
        ui_type: "text area",
        rows: 4,
      },
      {
        question:
          "List any other significant words or phrases you used to describe them:",
        fieldName: "significantWords",
        ui_type: "text area",
        rows: 4,
      },
    ],
    description2:
      "This is you - your true self. Observe the words you used to describe your heroes or heroines (role models). Those words also describe you. You choose qualities you admire in others and make them a part of who you are.",
    questions2: [
      {
        question:
          "Now, using those words, write a few lines about who you are and who you are becoming.",
        fieldName: "selfStatement",
        ui_type: "text area",
        placeholder: "Start with: I am / I am becoming a person who is...",
        rows: 6,
      },
    ],
  },
  {
    title: "The Setting",
    subtitle: "Where Do I Like To Be?",
    icon: MapPin,
    color: "primary-blue",
    description1:
      "Review your magazine, sport, TV show choices listed in My Story–1 Activity. Look carefully at the words you used to describe them. What types of activities are going on? What kinds of people are seen?",
    questions1: [
      {
        question:
          "Now, describe what's happening and what the people are doing.",
        fieldName: "mediaActivities",
        ui_type: "text area",
        rows: 4,
      },
    ],
    description2:
      "Sports, magazines, and TV shows can also be grouped based on the types of work settings they represent. Each activity reflects a different kind of work environment. Look at column 3 (R, I, A, S, E, C) of Work Settings table below. Select one or two work settings that best match the choices you listed. After reviewing the table, update your summary above by adding words from column 2 (or your own) that describe the work setting(s) you like the most.",
    description3:
      "This is about your career interests - the kind of places you enjoy working in, the type of people you like to be around, the problems you want to solve, and the ways you prefer to work. It's important to choose a work environment that matches your interests and feels comfortable for you.",
    questions2: [
      {
        question:
          "Using the words from your summary above, write a few lines about the kind of place you enjoy being in.",
        fieldName: "settingStatement",
        ui_type: "text area",
        placeholder: "Start with: I like being in places where...",
        rows: 6,
      },
    ],
  },
];

const workSettingsData = [
  {
    code: "R",
    name: "Realistic",
    sampleShows: {
      telugu: "Ghazi, Mallesham, Jersey, Sye",
      hindi:
        "Dangal, Lagaan, M.S. Dhoni, Manjhi- The Mountain Man, Takeshi's Castle",
      english: "Man Vs Wild, Everest, The Martian",
    },
    description:
      "Mechanical and outdoor places where practical, physical, and athletic people use machines, tools, physical coordination, and common sense to solve concrete problems involving repair, building, transport, plants and animals, and athletics.",
  },
  {
    code: "I",
    name: "Investigative",
    sampleShows: {
      telugu: "Detective Sai Srinivas Athreya, Aditya 369, Goodachari",
      hindi: "Shakuntala Devi, Talaash, Detective Byomkesh Bakshi",
      english:
        "Sherlock, Breaking Bad, MindHunter, Beautiful Mind, Big Bang Theory, Star Trek, Interstellar",
    },
    description:
      "Scientific and analytical places where logical and curious people use reason, math, and research methods to solve problems involving discovery, exploration, investigation, observation, and evaluation.",
  },
  {
    code: "A",
    name: "Artistic",
    sampleShows: {
      telugu: "C/O Kancherlapalam, Dance baby Dance, Style",
      hindi: "Secret Superstar, Rockstar, M.A.D",
      english: "La La Land, The Greatest Showman",
    },
    description:
      "Creative and aesthetic places where imaginative and expressive people use art, theatre, music, and originality to solve artistic problems involving creativity, invention, performance, and writing.",
  },
  {
    code: "S",
    name: "Social",
    sampleShows: {
      telugu: "Srimanthudu",
      hindi: "Taare Zameen Par, Pad Man, Piku, English Vinglish, Chichchore",
      english: "Friends, The Help, This is US",
    },
    description:
      "Caring and educational places where helpful and sociable people use dialogue, instruction, understanding, teamwork, and nurturance to solve social problems involving education, caretaking, support, community service, and relationships.",
  },
  {
    code: "E",
    name: "Enterprising",
    sampleShows: {
      telugu: "Maharshi, Leader, Prasthanam",
      hindi: "Band Baaja Baaraat, Rocket Singh, Guru",
      english: "The Social Network, House of Cards",
    },
    description:
      "Managerial and political places where persuasive and powerful people use leadership, strategy, influence, and wit to solve business, legal, and government problems involving economic gain, opinion, risk, and competition.",
  },
  {
    code: "C",
    name: "Conventional",
    sampleShows: {
      telugu: "Shankar Dada MBBS,Courier Boy Kalyan",
      hindi: "Munna Bhai MBBS, Corporate, Rajneeti",
      english: "Suits, Parks & Recreation, Brooklyn Nine-Nine",
    },
    description:
      "Office and uniform places where orderly and organized people use precision, conscientiousness, detail, accuracy, and caution to solve clerical and procedural problems involving organization, record-keeping, data management, and scheduling.",
  },
];

const careerStoryTwoDataSchema = z.object({
  firstAdjectives: z
    .string()
    .min(1, "Please write down the first adjectives you used"),
  repeatedWords: z.string().min(1, "Please write down any repeated words"),
  commonTraits: z
    .string()
    .min(10, "Please write down common traits (at least 10 characters)"),
  significantWords: z
    .string()
    .min(10, "Please list significant words (at least 10 characters)"),
  selfStatement: z
    .string()
    .min(20, "Please write at least 20 characters about who you are becoming"),
  mediaActivities: z
    .string()
    .min(
      10,
      "Please describe what's happening and what people are doing (at least 10 characters)"
    ),
  selectedRiasec: z
    .array(z.string())
    .min(1, "Please select at least one work setting")
    .max(3, "Please select at most two work settings"),
  settingStatement: z
    .string()
    .min(20, "Please write at least 20 characters about where you like to be"),
});

type CareerStoryTwoData = z.infer<typeof careerStoryTwoDataSchema>;

interface Hero {
  id: string;
  title: string;
  description: string;
}

export default function CareerStory2() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeroSheetOpen, setIsHeroSheetOpen] = useState(false);
  const [heroData, setHeroData] = useState<Hero[]>([]);
  const [isLoadingHeroes, setIsLoadingHeroes] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [isStrengthEnabled, setIsStrengthEnabled] = useState(false);
  const [isStrengthDialogOpen, setIsStrengthDialogOpen] = useState(false);
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "My Story-2 Activity");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  // Function to fetch hero data from career-story-1
  const fetchHeroData = async () => {
    if (!sessionId) return;

    setIsLoadingHeroes(true);
    setHeroError(null);

    try {
      const response = await fetch(`/api/journey/sessions/1/a/career-story-1`);

      if (response.ok) {
        const data = await response.json();
        setHeroData(data.heroes || []);
      } else {
        throw new Error("Failed to fetch hero data");
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
      setHeroError("Failed to load your childhood heroes. Please try again.");
      toast.error("Failed to load hero details");
    } finally {
      setIsLoadingHeroes(false);
    }
  };

  const form = useForm<CareerStoryTwoData>({
    resolver: zodResolver(careerStoryTwoDataSchema),
    defaultValues: {
      firstAdjectives: "",
      repeatedWords: "",
      commonTraits: "",
      significantWords: "",
      selfStatement: "",
      mediaActivities: "",
      selectedRiasec: [],
      settingStatement: "",
    },
    mode: "onChange",
  });

  // Load existing data on component mount
  useEffect(() => {
    if (!sessionId) return;

    const loadData = async () => {
      try {
        // Load form data
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/career-story-2`
        );
        if (response.ok) {
          const data = await response.json();
          form.reset(data);
        }

        // Check if strength feature is enabled from journey progress
        const journeyResponse = await fetch("/api/journey");
        if (journeyResponse.ok) {
          const journeyData = await journeyResponse.json();
          const enableByCoach = journeyData.enableByCoach as any;
          setIsStrengthEnabled(enableByCoach?.["cs-2:strengths"] === true);
        }
      } catch (error) {
        console.error("Error loading career story 2 data:", error);
        toast.error("Failed to load existing data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionId, form]);

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmitAssessment = async (data: CareerStoryTwoData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/career-story-2`,
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
        toast.success("Career Story 2 saved successfully!");
      } else {
        throw new Error("Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
      router.push(`/journey/sessions/${sessionId}`);
    }
  };

  // Current section data and progress calculation
  const currentSectionData = sections[currentSection];
  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">
            Loading your career story...
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
              Career Story Complete!
            </h2>
            <p className="text-slate-600">
              Thank you for completing your career story exploration.
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
          {/* Common Instruction */}
          <div className="p-4 mb-6 border shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-3xl sm:p-6 sm:mb-8">
            <div className="text-center">
              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                This activity is a continuation to the previous My Story-1
                Activity you have completed. It contains related questions, so
                please refer your previous document while working on the below
                activities.
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6 sm:mb-8">
            <div className="relative flex items-center justify-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setCurrentSection(0)}
                className={`flex items-center gap-2 sm:gap-3 transition-all duration-500 cursor-pointer hover:scale-105 ${
                  currentSection === 0
                    ? "text-primary-blue-600 scale-105"
                    : "text-primary-green-600 scale-100"
                }`}
              >
                <div
                  className={`
                relative size-9 sm:size-11 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold shadow-lg transition-all duration-500
                ${
                  currentSection === 0
                    ? "bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 text-white border-2 border-primary-blue-200"
                    : "bg-gradient-to-br from-primary-green-500 to-primary-green-600 text-white border-2 border-primary-green-200"
                }
              `}
                >
                  {currentSection === 0 ? (
                    "1"
                  ) : (
                    <CheckCircle className="size-5 sm:size-6" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold">The Self</div>
                  <div className="text-xs text-slate-500">
                    Who am I? Who am I becoming?
                  </div>
                </div>
              </button>

              <div
                className={`
              w-8 sm:w-12 h-2 sm:h-2.5 rounded-full transition-all duration-700 relative overflow-hidden
              ${
                currentSection === 1
                  ? "bg-gradient-to-r from-primary-blue-400 to-primary-green-400"
                  : "bg-slate-200"
              }
            `}
              >
                {currentSection === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-blue-500 to-primary-green-500" />
                )}
              </div>

              <button
                type="button"
                onClick={() => setCurrentSection(1)}
                className={`flex items-center gap-2 sm:gap-3 transition-all duration-500 cursor-pointer hover:scale-105 ${
                  currentSection === 1
                    ? "text-primary-blue-600 scale-105"
                    : "text-slate-400 scale-95"
                }`}
              >
                <div
                  className={`
                relative size-9 sm:size-11 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold shadow-lg transition-all duration-500
                ${
                  currentSection === 1
                    ? "bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 text-white border-2 border-primary-blue-200"
                    : "bg-slate-100 text-slate-400 border-2 border-slate-200"
                }
              `}
                >
                  2
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold">The Setting</div>
                  <div className="text-xs text-slate-500">
                    Where Do I Like To Be?
                  </div>
                </div>
              </button>

              {/* My Strengths Button - Positioned Absolutely on Right */}
              {isStrengthEnabled && (
                <div className="absolute top-0 right-0">
                  <Button
                    onClick={() => setIsStrengthDialogOpen(true)}
                    className="px-4 py-1.5 font-medium text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-105"
                  >
                    <Zap className="mr-1 size-4" />
                    My Strengths
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Section Card */}
          <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
            {/* Section Content */}
            <CardContent className="p-6 sm:p-8">
              <Form {...form}>
                <div className="space-y-6">
                  {/* Section Header with Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`size-10 bg-gradient-to-br from-${currentSectionData.color}-500 to-${currentSectionData.color}-600 rounded-lg flex items-center justify-center shadow-md`}
                    >
                      <currentSectionData.icon className="text-white size-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-500">
                          Section {currentSection + 1}:
                        </span>
                        <h2 className="text-base font-semibold leading-tight text-slate-800">
                          {currentSectionData.subtitle}
                        </h2>
                        {/* Info Button for The Self section */}
                        {currentSection === 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setIsHeroSheetOpen(true);
                                    fetchHeroData();
                                  }}
                                  className="ml-auto p-2 size-10 text-primary-green-600 hover:text-primary-green-700 hover:bg-primary-green-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                  <FileText className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" sideOffset={16}>
                                <p>View your childhood heroes</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>

                  {currentSection === 0 ? (
                    // Section 1: The Self - Detailed Questions
                    <div className="space-y-6">
                      {/* Description 1 */}
                      <div className="mb-4">
                        <p className="text-lg font-medium leading-relaxed text-slate-700">
                          {currentSectionData.description1}
                        </p>
                      </div>

                      {/* Questions 1 */}
                      <div className="space-y-4">
                        {currentSectionData.questions1?.map(
                          (question, index) => (
                            <FormField
                              key={question.fieldName}
                              control={form.control}
                              name={
                                question.fieldName as keyof CareerStoryTwoData
                              }
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="block text-sm font-medium text-slate-700">
                                    {question.question}
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder=""
                                      rows={question.rows}
                                      className="min-h-[100px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 border-slate-200 focus:border-primary-green-400 focus:ring-primary-green-400/20"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        )}
                      </div>

                      {/* Description 2 */}
                      <div className="mb-4">
                        <p className="text-lg font-medium leading-relaxed text-slate-700">
                          {currentSectionData.description2}
                        </p>
                      </div>

                      {/* Questions 2 */}
                      <div className="space-y-4">
                        {currentSectionData.questions2?.map(
                          (question, index) => (
                            <FormField
                              key={question.fieldName}
                              control={form.control}
                              name={
                                question.fieldName as keyof CareerStoryTwoData
                              }
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="block text-sm font-medium text-slate-700">
                                    {question.question}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative p-1.5 space-y-1 border shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-slate-200">
                                      <Textarea
                                        {...field}
                                        placeholder={question.placeholder || ""}
                                        rows={question.rows}
                                        className="min-h-[200px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 md:text-lg border-0 focus:ring-0"
                                      />
                                      <div className="flex items-center justify-between pt-2 text-xs border-t text-slate-500 border-slate-200/50">
                                        <span className="flex items-center gap-1">
                                          <Book className="size-3" />
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
                    </div>
                  ) : (
                    // Section 2: The Setting - Detailed Questions
                    <div className="space-y-6">
                      {/* Description 1 */}
                      <div className="mb-4">
                        <p className="text-lg font-medium leading-relaxed text-slate-700">
                          {currentSectionData.description1}
                        </p>
                      </div>

                      {/* Questions 1 */}
                      <div className="space-y-4">
                        {currentSectionData.questions1?.map(
                          (question, index) => (
                            <FormField
                              key={question.fieldName}
                              control={form.control}
                              name={
                                question.fieldName as keyof CareerStoryTwoData
                              }
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="block text-sm font-medium text-slate-700">
                                    {question.question}
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder=""
                                      rows={question.rows}
                                      className="min-h-[100px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 border-slate-200 focus:border-primary-blue-400 focus:ring-primary-blue-400/20"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        )}
                      </div>

                      {/* Description 2 */}
                      <div className="mb-4">
                        <p className="text-lg font-medium leading-relaxed text-slate-700">
                          {currentSectionData.description2}
                        </p>
                      </div>

                      {/* Work Settings Table */}
                      <div className="mb-6">
                        <h3 className="mb-4 text-lg font-bold text-slate-800">
                          Work Settings Table
                        </h3>
                        <FormField
                          control={form.control}
                          name="selectedRiasec"
                          render={({ field }) => (
                            <FormItem>
                              <div className="overflow-hidden border border-slate-200 rounded-lg">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 p-4 font-bold text-white bg-gradient-to-r from-primary-blue-600 to-primary-blue-700">
                                  <div className="col-span-4 flex text-center items-center justify-center">
                                    SAMPLE TV SHOWS
                                  </div>
                                  <div className="col-span-6 flex text-center items-center justify-center">
                                    DESCRIPTION
                                  </div>
                                  <div className="col-span-2 text-center flex items-center justify-center">
                                    WORK SETTING
                                  </div>
                                </div>

                                {/* Table Rows */}
                                {workSettingsData.map((setting, index) => {
                                  const isSelected =
                                    field.value?.includes(setting.code) ||
                                    false;
                                  const isDisabled =
                                    !isSelected && field.value?.length >= 3;

                                  return (
                                    <button
                                      key={setting.code}
                                      type="button"
                                      disabled={isDisabled}
                                      className={`w-full grid grid-cols-12 gap-4 p-4 border-b border-slate-200 transition-colors duration-200 ${
                                        index % 2 === 0
                                          ? "bg-slate-50"
                                          : "bg-white"
                                      } ${
                                        isSelected
                                          ? "bg-primary-blue-50 border-primary-blue-200"
                                          : ""
                                      } ${
                                        isDisabled
                                          ? "opacity-50 cursor-not-allowed"
                                          : "hover:bg-slate-100 cursor-pointer"
                                      }`}
                                      onClick={() => {
                                        if (isDisabled) return;

                                        if (isSelected) {
                                          field.onChange(
                                            field.value?.filter(
                                              (code) => code !== setting.code
                                            ) || []
                                          );
                                        } else {
                                          field.onChange([
                                            ...(field.value || []),
                                            setting.code,
                                          ]);
                                        }
                                      }}
                                    >
                                      {/* Sample TV Shows Column */}
                                      <div className="col-span-4 p-2">
                                        <div className="space-y-3">
                                          {setting.sampleShows.english && (
                                            <div>
                                              <div className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-1">
                                                English
                                              </div>
                                              <div className="text-sm text-slate-700 leading-relaxed">
                                                {setting.sampleShows.english}
                                              </div>
                                            </div>
                                          )}
                                          <div>
                                            <div className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-1">
                                              Hindi
                                            </div>
                                            <div className="text-sm text-slate-700 leading-relaxed">
                                              {setting.sampleShows.hindi}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-1">
                                              Telugu
                                            </div>
                                            <div className="text-sm text-slate-700 leading-relaxed">
                                              {setting.sampleShows.telugu}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Description Column */}
                                      <div className="col-span-6 flex flex-col items-center justify-center p-2">
                                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg border border-slate-200">
                                          <div className="text-sm text-slate-700 leading-relaxed text-center">
                                            {setting.description}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Work Setting Column */}
                                      <div className="col-span-2 flex flex-col items-center justify-center p-2">
                                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg border border-slate-200 w-full">
                                          <div
                                            className={`size-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 mx-auto mb-2 ${
                                              isSelected
                                                ? "bg-gradient-to-r from-primary-blue-600 to-primary-blue-700 text-white shadow-lg"
                                                : "bg-slate-200 text-slate-600"
                                            }`}
                                          >
                                            {setting.code}
                                          </div>
                                          <div className="text-xs font-semibold text-slate-700 text-center mb-1">
                                            {setting.name}
                                          </div>
                                          {isSelected && (
                                            <div className="flex items-center justify-center gap-1 text-xs text-primary-blue-600 font-medium">
                                              <div className="size-1.5 bg-primary-blue-600 rounded-full" />
                                              Selected
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Selection Summary */}
                              {field.value && field.value.length > 0 && (
                                <div className="mt-3 p-3 bg-primary-blue-50 border border-primary-blue-200 rounded-lg">
                                  <div className="text-sm font-medium text-primary-blue-800 mb-2">
                                    Selected Work Settings:
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {field.value.map((code) => {
                                      const setting = workSettingsData.find(
                                        (s) => s.code === code
                                      );
                                      return (
                                        <span
                                          key={code}
                                          className="px-3 py-1 text-sm text-white bg-primary-blue-600 rounded-full"
                                        >
                                          {code} - {setting?.name}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Description 3 */}
                      <div className="mb-4">
                        <p className="text-lg font-medium leading-relaxed text-slate-700">
                          {currentSectionData.description3}
                        </p>
                      </div>

                      {/* Questions 2 */}
                      <div className="space-y-4">
                        {currentSectionData.questions2?.map(
                          (question, index) => (
                            <FormField
                              key={question.fieldName}
                              control={form.control}
                              name={
                                question.fieldName as keyof CareerStoryTwoData
                              }
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="block text-sm font-medium text-slate-700">
                                    {question.question}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative p-1.5 space-y-1 border shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-slate-200">
                                      <Textarea
                                        {...field}
                                        placeholder={question.placeholder || ""}
                                        rows={question.rows}
                                        className="min-h-[200px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 md:text-lg border-0 focus:ring-0"
                                      />
                                      <div className="flex items-center justify-between pt-2 text-xs border-t text-slate-500 border-slate-200/50">
                                        <span className="flex items-center gap-1">
                                          <Book className="size-3" />
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
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row border-slate-200">
                    {/* Previous Button */}
                    <Button
                      type="button"
                      onClick={goToPreviousSection}
                      disabled={currentSection === 0}
                      className="flex items-center justify-center w-full h-10 gap-2 font-medium transition-all duration-200 bg-white border rounded-lg sm:flex-1 border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <ArrowLeft className="transition-transform duration-200 size-4 group-hover:-translate-x-1" />
                      Previous
                    </Button>

                    {/* Next/Submit Button */}
                    {currentSection === sections.length - 1 ? (
                      <Button
                        type="button"
                        onClick={form.handleSubmit(handleSubmitAssessment)}
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="mr-2 text-white animate-spin size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            Complete Story
                            <Award className="transition-transform duration-200 size-4 group-hover:rotate-12" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={goToNextSection}
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
        </JourneyBreadcrumbLayout>
      </div>

      {/* Hero Details Sheet */}
      <Sheet open={isHeroSheetOpen} onOpenChange={setIsHeroSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader className="pb-3 shrink-0 border-b border-slate-200">
            <SheetTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-xl shadow-md">
                <User className="size-6 text-white" />
              </div>
              Your Childhood Heroes
            </SheetTitle>
            <SheetDescription className="text-base leading-relaxed text-slate-600 mt-2">
              These are the heroes you listed in My Story-1 Activity. Use these
              details to help you reflect on the qualities you admire.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 flex-1 p-4 overflow-y-auto">
            {isLoadingHeroes ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-10 border-primary-green-600" />
                  <p className="text-base text-slate-600 font-medium">
                    Loading your heroes...
                  </p>
                </div>
              </div>
            ) : heroError ? (
              <div className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
                <div className="mx-auto mb-4 size-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Info className="size-6 text-red-600" />
                </div>
                <p className="text-base text-red-700 font-medium mb-4">
                  {heroError}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fetchHeroData}
                  className="bg-white hover:bg-red-50 border-red-300 text-red-700 hover:text-red-800"
                >
                  Try Again
                </Button>
              </div>
            ) : heroData.length === 0 ? (
              <div className="p-6 text-center bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-sm">
                <div className="mx-auto mb-4 size-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="size-6 text-slate-400" />
                </div>
                <p className="text-base text-slate-600 font-medium">
                  No heroes found. Complete My Story-1 Activity first to see
                  your childhood heroes here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {heroData.map((hero, index) => (
                  <Card
                    key={hero.id}
                    className="group border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary-green-300 bg-gradient-to-br from-white to-slate-50/30"
                  >
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="flex items-center bg-gradient-to-r p-2 rounded-t-lg from-primary-green-600 to-primary-green-500 gap-3">
                          <h3 className="text-lg font-bold  text-white px-3 py-1 shadow-sm">
                            {hero.title || "Unnamed Hero"}
                          </h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed p-2 rounded-b-lg whitespace-pre-wrap">
                          {hero.description || "No description provided"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Strength Dialog */}
      <StrengthDialog
        isOpen={isStrengthDialogOpen}
        onClose={() => setIsStrengthDialogOpen(false)}
        sessionId={sessionId}
        formId="career-story-2"
        onSave={(strengths) => {
          console.log("Strengths saved:", strengths);
        }}
      />
    </div>
  );
}
