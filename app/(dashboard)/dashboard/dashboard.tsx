"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Sparkles,
  RouteIcon,
  Lightbulb,
  MapIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import GradientCard from "@/components/gradient-card";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthStatus {
  authenticated: boolean;
  user: User | null;
}

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);
  const [tasks, setTasks] = useState<{
    [key: string]: Array<{ id: string; text: string; time: string }>;
  }>({});
  const [newTask, setNewTask] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [journalEntries, setJournalEntries] = useState<
    Array<{
      id: string;
      title: string | null;
      content: string;
      entryDate: string;
      wordCount: number;
      createdAt: string;
      updatedAt: string;
    }>
  >([]);
  const [todayEntry, setTodayEntry] = useState({ title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const isMobile = useIsMobile();

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data: AuthStatus = await response.json();
        setAuthStatus(data);
      } else {
        setAuthStatus({ authenticated: false, user: null });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthStatus({ authenticated: false, user: null });
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  // Load journal entries from API
  const loadJournalEntries = useCallback(async () => {
    if (!authStatus?.authenticated || !authStatus?.user?.id) return;

    setIsLoadingEntries(true);
    try {
      const response = await fetch("/api/journal/entries");
      if (response.ok) {
        const { entries } = await response.json();
        setJournalEntries(entries);
      }
    } catch (error) {
      console.error("Error loading journal entries:", error);
    } finally {
      setIsLoadingEntries(false);
    }
  }, [authStatus?.authenticated, authStatus?.user?.id]);

  // Load today's entry if it exists
  const loadTodayEntry = useCallback(async () => {
    if (!authStatus?.authenticated || !authStatus?.user?.id) return;

    const today = new Date().toISOString().split("T")[0];
    try {
      const response = await fetch(`/api/journal/entries/${today}`);
      if (response.ok) {
        const { entry } = await response.json();
        setTodayEntry({
          title: entry.title || "",
          content: entry.content,
        });
      }
    } catch (error) {
      console.error("Error loading today's entry:", error);
    }
  }, [authStatus?.authenticated, authStatus?.user?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastSaved = (date: Date) => {
    const diffInSeconds = Math.floor(
      (currentDateTime.getTime() - date.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    // Set client-side flag and initialize date
    setIsClient(true);
    setDate(new Date());

    // Load tasks from localStorage (keeping this for now)
    const savedTasks = localStorage.getItem("dashboard-tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
      }
    }
  }, []);

  // Migrate localStorage data to database
  const migrateLocalStorageData = useCallback(async () => {
    if (!authStatus?.authenticated || !authStatus?.user?.id) return;

    try {
      const savedJournalEntries = localStorage.getItem(
        "dashboard-journal-entries",
      );
      if (savedJournalEntries) {
        const entries = JSON.parse(savedJournalEntries);
        const entriesArray = Object.values(entries);

        if (entriesArray.length > 0) {
          const response = await fetch("/api/journal/migrate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ entries: entriesArray }),
          });

          if (response.ok) {
            // Clear localStorage after successful migration
            localStorage.removeItem("dashboard-journal-entries");
            localStorage.removeItem("dashboard-today-entry");

            // Reload entries from database
            loadJournalEntries();
            loadTodayEntry();

            console.log("Successfully migrated journal entries to database");
          }
        }
      }
    } catch (error) {
      console.error("Error migrating localStorage data:", error);
    }
  }, [
    authStatus?.authenticated,
    authStatus?.user?.id,
    loadJournalEntries,
    loadTodayEntry,
  ]);

  // Load journal data when user is authenticated
  useEffect(() => {
    if (authStatus?.authenticated && authStatus?.user?.id) {
      loadJournalEntries();
      loadTodayEntry();
    }
  }, [
    authStatus?.authenticated,
    authStatus?.user?.id,
    loadJournalEntries,
    loadTodayEntry,
  ]);

  // Migrate localStorage data when user is authenticated
  useEffect(() => {
    if (authStatus?.authenticated && authStatus?.user?.id) {
      migrateLocalStorageData();
    }
  }, [
    authStatus?.authenticated,
    authStatus?.user?.id,
    migrateLocalStorageData,
  ]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("dashboard-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setInterval(async () => {
      if (
        (todayEntry.title.trim() || todayEntry.content.trim()) &&
        authStatus?.authenticated &&
        authStatus?.user?.id
      ) {
        // Auto-save without clearing the form
        const today = new Date().toISOString().split("T")[0];
        try {
          const response = await fetch(`/api/journal/entries/${today}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: todayEntry.title.trim() || null,
              content: todayEntry.content.trim(),
            }),
          });

          if (response.ok) {
            setLastSaved(new Date());
          }
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [todayEntry, authStatus?.authenticated, authStatus?.user?.id]);

  // Update current time for real-time last saved display
  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timeUpdateInterval);
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Show loading state while checking authentication
  if (isLoadingAuth || authStatus === null) {
    return (
      <div className="p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
        {isMobile ? <SidebarToggle /> : <div />}
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!authStatus.authenticated) {
    return (
      <div className="p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
        {isMobile ? <SidebarToggle /> : <div />}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Please sign in</h2>
            <p className="text-muted-foreground">
              You need to be signed in to access the dashboard.
            </p>
            <div className="mt-2">
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
      {isMobile ? <SidebarToggle /> : <div />}

      {/* Greeting Card */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-2xl">👋</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                  {authStatus.user?.name
                    ? `Hi ${authStatus.user.name}, ${getTimeBasedGreeting()}!`
                    : `Hi there, ${getTimeBasedGreeting()}!`}
                </h2>
                <p className="text-sm md:text-base font-medium text-foreground mt-1 leading-relaxed">
                  Welcome to your Self-discovery Journey, your space to find
                  clarity, gain confidence and build a mindset for growth! 🚀
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Feature Introduction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* CoCo AI Coach Feature Card */}
        <GradientCard
          icon={<Sparkles className="size-5 sm:size-8" />}
          title="CoCo"
          description="CoCo is AI mindset coach. CoCo helps you pause, reflect, and think clearly in a fast-paced world."
          internalUrl="/chat"
          imageUrl="/images/coco.png"
          gradientColors={{
            from: "from-blue-500",
            via: "via-indigo-500",
            to: "to-purple-600",
          }}
        />
        {/* <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={() => {
            window.location.href = "/chat";
          }}
        >
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">🤖</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    CoCo: AI Mindset Coach
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Everyday ally for your journey
                  </CardDescription>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="ml-3 size-8"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Info className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    className="w-80 p-4"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        How CoCo can help you:
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>
                          • Helps you pause, reflect, and think with clarity.
                        </li>
                        <li>
                          • Guides you with thoughtful questions instead of
                          quick, generic answers.
                        </li>
                        <li>
                          • Provides you with reliable and relevant information
                          for your career exploration.
                        </li>
                        <li>
                          • Supports you in managing your priorities and
                          wellbeing.
                        </li>
                        <li>
                          • Available 24/7 to support you as an everyday ally on
                          your journey.
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get personalized support from CoCo, your AI Mindset Coach. Whether
              you&apos;re exploring career paths, managing your well-being, or
              making everyday decisions, CoCo is your everyday ally. CoCo helps
              you pause, reflect, and think clearly in a fast-paced world.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = "/chat";
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Say Hi to CoCo
            </Button>
          </CardFooter>
        </Card> */}

        {/* Human Coach Journey Feature Card */}
        <GradientCard
          icon={<RouteIcon className="size-5 sm:size-8" />}
          title="1:1 Coaching"
          description="Connect with experienced coaches who provide personalized, one-on-one guidance tailored to your goals."
          imageUrl="/images/1-1-coaching.png"
          internalUrl="/journey"
          gradientColors={{
            from: "from-green-500",
            via: "via-teal-500",
            to: "to-teal-600",
          }}
        />
        {/* <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={() => {
            window.location.href = "/journey";
          }}
        >
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="size-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">👨‍🏫</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">1:1 Coaching</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Personalized and holistic support
                  </CardDescription>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="ml-3 size-8"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Info className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    className="w-80 p-4"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        What Coaching offers:
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>
                          • 1:1 reflective coaching sessions conducted online at
                          your convenience.
                        </li>
                        <li>
                          • Coaching facilitated by a psychologist to help you
                          understand yourself better.
                        </li>
                        <li>
                          • Exploratory activities, tools to discover your
                          values, strengths, and interests.
                        </li>
                        <li>
                          • Guided action planning to help you make informed
                          decisions.
                        </li>
                        <li>
                          • Career clarity, well-being management and confident
                          actions.
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect with experienced coaches who provide personalized,
              one-on-one guidance tailored to your goals.{" "}
              <span className="px-1 bg-amber-200 text-amber-900 font-semibold shine-animation">
                Book your first session for FREE
              </span>{" "}
              and begin your journey towards a learning mindset that helps you
              build a meaningful career and a fulfilling life.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = "/journey";
              }}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              Begin your Journey
            </Button>
          </CardFooter>
        </Card> */}
      </div>
      {/* Row 2: Be Future-Ready Card */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <GradientCard
          icon={<BookOpen className="size-5 sm:size-8" />}
          title="Be Future-Ready"
          description="Discover how ready you are for life after school. Understand yourself better through our assessments and guides."
          imageUrl="/images/be-future-ready.png"
          externalUrl="https://inwesol.com/be-future-ready"
        />
      </div>
      {/* Row 3: Explorer and Behavioural Tools Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <GradientCard
          icon={<MapIcon className="size-5 sm:size-8" />}
          title="Explorer"
          description="Discover how ready you are for life after school. Understand yourself better through our assessments and guides."
          imageUrl="/images/explorer.png"
          externalUrl="https://inwesol.com/explorer"
          gradientColors={{
            from: "from-cyan-500",
            via: "via-sky-500",
            to: "to-blue-600",
          }}
        />

        <GradientCard
          icon={<Lightbulb className="size-5 sm:size-8" />}
          title="Behavioural Tools"
          description="Discover how ready you are for life after school. Understand yourself better through our assessments and guides."
          imageUrl="/images/behavioural-tools.png"
          internalUrl="/tools"
          gradientColors={{
            from: "from-amber-500",
            via: "via-orange-500",
            to: "to-rose-600",
          }}
        />
      </div>
    </div>
  );
}
