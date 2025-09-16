"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Clock,
  Search,
  Save,
  FileText,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { useSidebar } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
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
  const { isMobile } = useSidebar();

  // Sample meditation tracks with working audio URLs
  const meditationTracks = useMemo(
    () => [
      {
        id: 1,
        title: "🌿 Morning Calm",
        duration: "01:57",
        url: "/musics/dawn-of-change.mp3",
      },
      {
        id: 2,
        title: "🌙 Evening Relax",
        duration: "01:57",
        url: "/musics/dawn-of-change.mp3",
      },
      {
        id: 3,
        title: "☀️ Focus Boost",
        duration: "01:57",
        url: "/musics/dawn-of-change.mp3",
      },
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

  // Task management functions
  const addTask = () => {
    if (!newTask.trim() || !date) return;

    const dateKey = date.toISOString().split("T")[0];
    const taskId = Date.now().toString();
    const newTaskObj = {
      id: taskId,
      text: newTask.trim(),
      time: newTaskTime || "All day",
    };

    setTasks((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTaskObj],
    }));

    setNewTask("");
    setNewTaskTime("");
  };

  const removeTask = (taskId: string) => {
    if (!date) return;

    const dateKey = date.toISOString().split("T")[0];
    setTasks((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter((task) => task.id !== taskId),
    }));
  };

  const getTasksForDate = (selectedDate: Date) => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    return tasks[dateKey] || [];
  };

  const getDateKey = (selectedDate: Date) => {
    return selectedDate.toISOString().split("T")[0];
  };

  // Journal management functions
  const saveJournalEntry = useCallback(async () => {
    if (!todayEntry.title.trim() && !todayEntry.content.trim()) return;
    if (!session?.user?.id) return;

    const today = new Date();
    const dateKey = today.toISOString().split("T")[0];

    setIsSaving(true);

    try {
      const response = await fetch("/api/journal/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: todayEntry.title.trim() || null,
          content: todayEntry.content.trim(),
          entryDate: dateKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to save journal entry"
        );
      }

      const { entry } = await response.json();

      // Update the entries list
      setJournalEntries((prev) => {
        const existingIndex = prev.findIndex((e) => e.entryDate === dateKey);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = entry;
          return updated;
        } else {
          return [entry, ...prev];
        }
      });

      // Clear today's entry after saving
      setTodayEntry({ title: "", content: "" });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving journal entry:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save journal entry. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [todayEntry, session?.user?.id]);

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getFilteredEntries = () => {
    if (!searchTerm.trim()) return journalEntries;

    return journalEntries.filter(
      (entry) =>
        entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Load journal entries from API
  const loadJournalEntries = useCallback(async () => {
    if (!session?.user?.id) return;

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
  }, [session?.user?.id]);

  // Load today's entry if it exists
  const loadTodayEntry = useCallback(async () => {
    if (!session?.user?.id) return;

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
  }, [session?.user?.id]);

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

  // Load journal data when user is authenticated
  useEffect(() => {
    if (session?.user?.id) {
      loadJournalEntries();
      loadTodayEntry();

      // Check for localStorage data to migrate
      migrateLocalStorageData();
    }
  }, [session?.user?.id, loadJournalEntries, loadTodayEntry]);

  // Migrate localStorage data to database
  const migrateLocalStorageData = useCallback(async () => {
    if (!session?.user?.id) return;

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
  }, [session?.user?.id, loadJournalEntries, loadTodayEntry]);

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
        session?.user?.id
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
  }, [todayEntry, session?.user?.id]);

  // Update current time for real-time last saved display
  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timeUpdateInterval);
  }, []);

  // Show loading state while checking authentication
  if (status === "loading") {
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
  if (status === "unauthenticated") {
    return (
      <div className="p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
        {isMobile ? <SidebarToggle /> : <div />}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Please sign in</h2>
            <p className="text-muted-foreground">
              You need to be signed in to access the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8">
      {isMobile ? <SidebarToggle /> : <div />}
      {/* Row 1: Feature Introduction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Career Journey Feature Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">🎯</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Career Journey</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Discover your path to professional fulfillment
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ml-3"
              >
                Start
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Navigate through personalized career exploration tools, guided
              assessments, and interactive activities designed to help you
              discover your ideal career path and make informed decisions about
              your professional future.
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                How to use better:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Complete assessments honestly for accurate insights</li>
                <li>• Review your results regularly to track progress</li>
                <li>
                  • Engage with all available tools for comprehensive guidance
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Tools Feature Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="size-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">🧘</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Wellness Tools</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Enhance your mental and emotional well-being
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 ml-3"
              >
                Explore
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Access a comprehensive suite of wellness tools including
              meditation playlists, daily journaling, time management tools, and
              mindfulness exercises to support your personal growth and mental
              health.
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                How to use better:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use meditation tools daily for consistent practice</li>
                <li>• Journal regularly to track your emotional patterns</li>
                <li>• Set aside dedicated time for wellness activities</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bento Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Row 2: Meditation Playlist (40%) + Time Management (60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6 mb-6">
          {/* Meditation Music Player - 40% */}
          <div className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader className="pb-4 text-center">
                <CardTitle className="text-lg">Meditation Playlist</CardTitle>
                <CardDescription className="text-sm">
                  Relax and focus with guided meditations
                </CardDescription>
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

          {/* Time Management Calendar - 60% */}
          <div className="lg:col-span-6">
            <Card className="h-full">
              <CardHeader className="pb-4 text-center">
                <CardTitle className="text-lg">Time Management</CardTitle>
                <CardDescription className="text-sm">
                  Plan your day effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Calendar */}
                  <div className="space-y-4">
                    {isClient ? (
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        classNames={{
                          day_selected:
                            "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-500",
                          day_today: "bg-blue-100 text-blue-900 font-bold",
                        }}
                      />
                    ) : (
                      <div className="rounded-md border h-[300px] flex items-center justify-center">
                        <div className="text-muted-foreground">
                          Loading calendar...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Task Management for Selected Date */}
                  {date && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock size={16} />
                        Tasks for {date.toLocaleDateString()}
                      </div>

                      {/* Add New Task */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newTask.trim()) {
                                addTask();
                              }
                            }}
                          />
                          <Button
                            onClick={addTask}
                            size="icon"
                            disabled={!newTask.trim()}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Task List */}
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                        {getTasksForDate(date).length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No tasks for this date
                          </p>
                        ) : (
                          getTasksForDate(date).map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {task.text}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {task.time}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTask(task.id)}
                                className="size-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 3: Daily Journaling - Full Width */}
        <div className="w-full">
          <Card>
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-lg">Daily Journaling</CardTitle>
              <CardDescription className="text-sm">
                Reflect on your day and track your thoughts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Previous Entries */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText size={20} />
                      Previous Entries
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      {Object.keys(journalEntries).length} entries
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Entries List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {isLoadingEntries ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Loading entries...
                      </p>
                    ) : getFilteredEntries().length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {searchTerm
                          ? "No entries match your search"
                          : "No journal entries yet"}
                      </p>
                    ) : (
                      getFilteredEntries().map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm line-clamp-1">
                              {entry.title ||
                                `Journal Entry - ${formatDate(
                                  entry.entryDate
                                )}`}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(entry.entryDate)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {entry.content}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {entry.wordCount} words
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Today's Journal */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">
                      Today&apos;s Journal
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {isSaving && <span>Saving...</span>}
                      {lastSaved && !isSaving && (
                        <span className="hidden sm:inline">
                          Saved {formatLastSaved(lastSaved)}
                        </span>
                      )}
                      {lastSaved && !isSaving && (
                        <span className="sm:hidden">Saved</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Entry title (optional)"
                      value={todayEntry.title}
                      onChange={(e) =>
                        setTodayEntry((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write your thoughts here..."
                        value={todayEntry.content}
                        onChange={(e) =>
                          setTodayEntry((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        rows={8}
                        className="resize-none"
                      />

                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 text-xs text-muted-foreground">
                        <span>{getWordCount(todayEntry.content)} words</span>
                        <span className="hidden sm:inline">
                          Auto-saves every 30 seconds
                        </span>
                        <span className="sm:hidden">Auto-save enabled</span>
                      </div>
                    </div>

                    <Button
                      onClick={saveJournalEntry}
                      disabled={
                        !todayEntry.title.trim() && !todayEntry.content.trim()
                      }
                      className="w-full"
                    >
                      <Save size={16} className="mr-2" />
                      Save Entry
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
