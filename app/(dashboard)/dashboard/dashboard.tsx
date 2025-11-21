"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Info,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { useSidebar } from "@/components/ui/sidebar";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
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
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { isMobile } = useSidebar();

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

  // Sample meditation tracks with working audio URLs
  const meditationTracks = useMemo(
    () => [
      {
        id: 1,
        title: "🧘 Breathing Exercise",
        duration: "04:36",
        url: "/musics/breathing-exercise.mp3",
      },
      {
        id: 2,
        title: "🌙 Evening Relax",
        duration: "01:57",
        url: "/musics/dawn-of-change.mp3",
      },
      // {
      //   id: 3,
      //   title: "☀️ Focus Boost",
      //   duration: "01:57",
      //   url: "/musics/dawn-of-change.mp3",
      // },
      // {
      //   id: 4,
      //   title: "🌸 Spring Meditation",
      //   duration: "12:20",
      //   url: "/musics/dawn-of-change.mp3",
      // },
      // {
      //   id: 5,
      //   title: "🌊 Ocean Waves",
      //   duration: "20:00",
      //   url: "/musics/dawn-of-change.mp3",
      // },
    ],
    []
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  const handlePlayPause = async () => {
    if (audioElement) {
      try {
        if (isPlaying) {
          audioElement.pause();
          setIsPlaying(false);
        } else {
          setIsLoading(true);
          await audioElement.play();
          setIsPlaying(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        setIsLoading(false);
        alert(
          "Unable to play audio. Please check your internet connection or try a different track."
        );
      }
    }
  };

  const handleNext = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % meditationTracks.length);
  }, [meditationTracks.length]);

  const handlePrevious = () => {
    setCurrentTrack(
      (prev) => (prev - 1 + meditationTracks.length) % meditationTracks.length
    );
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrack(index);
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
  };

  // Initialize audio element when component mounts
  useEffect(() => {
    const audio = new Audio();
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioElement && meditationTracks[currentTrack]) {
      console.log(
        "Loading track:",
        meditationTracks[currentTrack].title,
        "URL:",
        meditationTracks[currentTrack].url
      );
      setIsLoading(true);
      audioElement.src = meditationTracks[currentTrack].url;
      audioElement.load();

      // Add error handling for audio loading
      const handleError = (e: Event) => {
        console.error("Audio loading error:", e);
        console.error("Failed to load:", meditationTracks[currentTrack].url);
        setIsLoading(false);
        alert("Failed to load audio. Please try a different track.");
      };

      const handleCanPlay = () => {
        console.log("Audio can play:", meditationTracks[currentTrack].title);
        setIsLoading(false);
      };

      audioElement.addEventListener("error", handleError);
      audioElement.addEventListener("canplay", handleCanPlay);

      return () => {
        audioElement.removeEventListener("error", handleError);
        audioElement.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [currentTrack, audioElement, meditationTracks]);

  // Handle audio events
  useEffect(() => {
    if (!audioElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener("play", handlePlay);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("ended", handleEnded);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener("play", handlePlay);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioElement, handleNext]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    if (audioElement) {
      audioElement.volume = newVolume / 100;
    }
  };

  const handleMute = () => {
    if (audioElement) {
      if (isMuted) {
        audioElement.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioElement.volume = 0;
        setIsMuted(true);
      }
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
      (currentDateTime.getTime() - date.getTime()) / 1000
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

    // Load music player state from localStorage (keeping this for now)
    const savedMusicState = localStorage.getItem("dashboard-music-state");
    if (savedMusicState) {
      try {
        const musicState = JSON.parse(savedMusicState);
        setCurrentTrack(musicState.currentTrack || 0);
        setVolume(musicState.volume || 80);
        setIsMuted(musicState.isMuted || false);
      } catch (error) {
        console.error("Error loading music state from localStorage:", error);
      }
    }
  }, []);

  // Migrate localStorage data to database
  const migrateLocalStorageData = useCallback(async () => {
    if (!authStatus?.authenticated || !authStatus?.user?.id) return;

    try {
      const savedJournalEntries = localStorage.getItem(
        "dashboard-journal-entries"
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

  // Save music player state to localStorage
  useEffect(() => {
    const musicState = {
      currentTrack,
      volume,
      isMuted,
    };
    localStorage.setItem("dashboard-music-state", JSON.stringify(musicState));
  }, [currentTrack, volume, isMuted]);

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
                  Welcome to your space to find clarity, gain confidence, and
                  build a mindset for growth. 🚀
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Feature Introduction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* CoCo AI Coach Feature Card */}
        <Card
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
        </Card>

        {/* Human Coach Journey Feature Card */}
        <Card
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
                  <CardTitle className="text-lg">
                    Self-discovery Journey
                  </CardTitle>
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
                        What Self-discovery Journey offers:
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
        </Card>
      </div>

      {/* Bento Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Row 2: Meditation Playlist (40%) + Time Management (60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6 mb-6">
          {/* Meditation Music Player - 40% */}
          <div className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="size-10 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">🧘</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Guided Meditation
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Take a moment to pause, breathe deep, and reset
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Playlist Display */}
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {meditationTracks.map((track, index) => (
                    <button
                      key={track.id}
                      type="button"
                      className={`w-full p-2 rounded-lg cursor-pointer transition-colors text-left ${
                        index === currentTrack
                          ? "bg-blue-500 text-white"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => handleTrackSelect(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0 min-h-5">
                          <p className="font-medium text-sm truncate">
                            {track.title}
                          </p>
                        </div>
                        <span className="text-xs opacity-70 ml-2">
                          {track.duration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Current Track Display */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="font-medium text-sm truncate text-green-800">
                    {meditationTracks[currentTrack]?.title}
                  </p>
                  {/* <p className="text-xs text-green-600 truncate">
                    {meditationTracks[currentTrack]?.artist}
                  </p> */}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          duration > 0 ? (currentTime / duration) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Music Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevious}
                    >
                      <SkipBack size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePlayPause}
                      className="size-10"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full size-4 border-b-2 border-gray-900" />
                      ) : isPlaying ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                      <SkipForward size={14} />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleMute}>
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Journaling Section - 60% */}
          <div className="lg:col-span-6">
            <Card className="h-full">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="size-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">📔</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Daily Journaling
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Reflect, grow, and track your personal journey
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Why Daily Journaling Matters:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Self-Reflection:</strong> Pause, reflect, and
                        think about your day.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Goal Tracking:</strong> Monitor your progress
                        and celebrate small wins.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Habits and Patterns:</strong> Identify recurring
                        patterns in your behavior.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Clarity:</strong> Organize your thoughts and
                        improve decision-making.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        <strong>Positivity:</strong> Prepare for the next day
                        with a positive mindset.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() =>
                      window.open(
                        "/journey/sessions/8/a/daily-journaling",
                        "_blank"
                      )
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    Begin Journaling Now
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <p>
                    Spend 10 minutes each day to journal, practice gratitude,
                    and reflect on your journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
