"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextArea } from "@/components/activity-components/text-area";
import { InputField } from "@/components/activity-components/input-field";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreadcrumbUI } from "@/components/breadcrumbUI";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import {
  Calendar,
  Target,
  Lightbulb,
  Heart,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  X,
  Save,
  Loader2,
  ClipboardList,
} from "lucide-react";

interface BulletPoint {
  id: string;
  title: string;
  description: string;
}

interface DailyJournalingData {
  date: string;
  tookAction: "yes" | "no" | "";
  whatHeldBack: string;
  challenges: BulletPoint[];
  progress: BulletPoint[];
  gratitude: BulletPoint[];
  gratitudeHelp: BulletPoint[];
  tomorrowStep: string;
}

const sections = [
  {
    title: "Habit",
    icon: Target,
    color: "primary-green",
    description:
      "Track your daily action towards your goals and identify what might be holding you back.",
  },
  {
    title: "Reflection",
    icon: Lightbulb,
    color: "primary-blue",
    description:
      "Take time to reflect on both the challenges you faced and the progress you made today.",
  },
  {
    title: "Gratitude",
    icon: Heart,
    color: "primary-green",
    description:
      "Focus on the positive aspects of your journey and how they contribute to your growth.",
  },
  {
    title: "Way Forward",
    icon: ArrowRight,
    color: "blue",
    description:
      "Set your intention for tomorrow with a specific, actionable step.",
  },
];

export default function DailyJournaling() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [journalData, setJournalData] = useState<DailyJournalingData>({
    date: new Date().toISOString().split("T")[0],
    tookAction: "",
    whatHeldBack: "",
    challenges: [
      {
        id: Date.now().toString(),
        title: "",
        description: "",
      },
    ],
    progress: [
      {
        id: (Date.now() + 1).toString(),
        title: "",
        description: "",
      },
    ],
    gratitude: [
      {
        id: (Date.now() + 2).toString(),
        title: "",
        description: "",
      },
    ],
    gratitudeHelp: [
      {
        id: (Date.now() + 3).toString(),
        title: "",
        description: "",
      },
    ],
    tomorrowStep: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Set breadcrumbs and load existing data on component mount
  useEffect(() => {
    if (sessionId) {
      setQuestionnaireBreadcrumbs(sessionId, "Daily Journal");
    }
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  useEffect(() => {
    const loadData = async () => {
      if (!sessionId) return;
      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/daily-journaling?date=${journalData.date}`
        );
        if (response.ok) {
          const data = await response.json();
          // Ensure all sections have at least one item if empty
          const updatedData = {
            ...data,
            challenges:
              data.challenges && data.challenges.length > 0
                ? data.challenges
                : [
                    {
                      id: Date.now().toString(),
                      title: "",
                      description: "",
                    },
                  ],
            progress:
              data.progress && data.progress.length > 0
                ? data.progress
                : [
                    {
                      id: (Date.now() + 1).toString(),
                      title: "",
                      description: "",
                    },
                  ],
            gratitude:
              data.gratitude && data.gratitude.length > 0
                ? data.gratitude
                : [
                    {
                      id: (Date.now() + 2).toString(),
                      title: "",
                      description: "",
                    },
                  ],
            gratitudeHelp:
              data.gratitudeHelp && data.gratitudeHelp.length > 0
                ? data.gratitudeHelp
                : [
                    {
                      id: (Date.now() + 3).toString(),
                      title: "",
                      description: "",
                    },
                  ],
          };
          setJournalData(updatedData);
        }
      } catch (error) {
        console.error("Error loading daily journaling data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [sessionId]);

  // Navigation functions
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

  // Save data to API
  const handleSave = async () => {
    if (!sessionId) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/daily-journaling`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(journalData),
        }
      );

      if (response.ok) {
        setIsCompleted(true);
        // Redirect after successful save
        setTimeout(() => {
          router.push(`/journey/sessions/${sessionId}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setSaveMessage({
          type: "error",
          text: errorData.errors
            ? "Please check your entries and try again."
            : "Failed to save journal entry.",
        });
      }
    } catch (error) {
      console.error("Error saving daily journaling:", error);
      setSaveMessage({
        type: "error",
        text: "An error occurred while saving. Please try again.",
      });
    } finally {
      setIsSaving(false);
      // Clear message after 5 seconds (only if there was an error)
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const addBulletPoint = (
    section: "challenges" | "progress" | "gratitude" | "gratitudeHelp"
  ) => {
    const newPoint: BulletPoint = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    setJournalData((prev) => ({
      ...prev,
      [section]: [...prev[section], newPoint],
    }));
  };

  const updateBulletPoint = (
    section: "challenges" | "progress" | "gratitude" | "gratitudeHelp",
    id: string,
    field: "title" | "description",
    value: string
  ) => {
    setJournalData((prev) => ({
      ...prev,
      [section]: prev[section].map((point) =>
        point.id === id ? { ...point, [field]: value } : point
      ),
    }));
  };

  const deleteBulletPoint = (
    section: "challenges" | "progress" | "gratitude" | "gratitudeHelp",
    id: string
  ) => {
    setJournalData((prev) => ({
      ...prev,
      [section]: prev[section].filter((point) => point.id !== id),
    }));
  };

  const getMotivationalMessage = () => {
    if (journalData.tookAction === "yes") {
      return {
        icon: <CheckCircle className="size-6 text-green-600" />,
        message: "Great job taking action today! Every step forward counts.",
        color: "from-green-50 to-primary-green-50 border-green-200",
      };
    } else if (journalData.tookAction === "no") {
      return {
        icon: <TrendingUp className="size-6 text-blue-600" />,
        message:
          "Tomorrow is a new opportunity. Reflect on what you learned today.",
        color: "from-blue-50 to-primary-blue-50 border-blue-200",
      };
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-primary-blue-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-primary-green-600">
          <Loader2 className="size-6 animate-spin" />
          <span className="text-lg font-medium">Loading your journal...</span>
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
              Daily Journal Complete!
            </h2>
            <p className="text-slate-600">
              Thank you for completing your daily reflection.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Journey", href: "/journey" },
            {
              label: `Session ${Number(sessionId) + 1}`,
              href: `/journey/sessions/${sessionId}`,
            },
            { label: "Daily Journal", isActive: true },
          ]}
        />

        {/* Save Message */}
        {saveMessage && (
          <Card
            className={`mb-4 ${
              saveMessage.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              {saveMessage.type === "success" ? (
                <CheckCircle className="size-4 text-green-600" />
              ) : (
                <XCircle className="size-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  saveMessage.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {saveMessage.text}
              </span>
            </div>
          </Card>
        )}

        {/* Instructions Card */}
        <div className="p-5 mb-6 border shadow-lg bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50 rounded-2xl sm:p-6 border-slate-200/60 backdrop-blur-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl shadow-lg size-10 bg-gradient-to-br from-primary-blue-500 to-primary-green-500 shrink-0">
                <ClipboardList className="text-white size-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Instructions
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-700">
              This is your daily journal to reflect on your progress, note what
              you&apos;re grateful for, and set small goals for tomorrow.
            </p>
          </div>
        </div>

        {/* Date Selection */}
        <Card className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 border-slate-200/60 shadow-sm mb-4">
          <div className="flex items-center justify-center gap-3 p-3">
            <Calendar className="size-5 text-slate-600" />
            <label
              htmlFor="journal-date"
              className="text-base font-semibold text-slate-700"
            >
              Journal Date:
            </label>
            <input
              id="journal-date"
              type="date"
              value={journalData.date}
              max={new Date().toISOString().split("T")[0]}
              onChange={async (e) => {
                const newDate = e.target.value;
                setJournalData((prev) => ({ ...prev, date: newDate }));

                // Load data for the new date
                if (sessionId && newDate) {
                  try {
                    const response = await fetch(
                      `/api/journey/sessions/${sessionId}/a/daily-journaling?date=${newDate}`
                    );
                    if (response.ok) {
                      const data = await response.json();
                      // Ensure all sections have at least one item if empty
                      const updatedData = {
                        ...data,
                        date: newDate, // Ensure the date is set correctly
                        challenges:
                          data.challenges && data.challenges.length > 0
                            ? data.challenges
                            : [
                                {
                                  id: Date.now().toString(),
                                  title: "",
                                  description: "",
                                },
                              ],
                        progress:
                          data.progress && data.progress.length > 0
                            ? data.progress
                            : [
                                {
                                  id: (Date.now() + 1).toString(),
                                  title: "",
                                  description: "",
                                },
                              ],
                        gratitude:
                          data.gratitude && data.gratitude.length > 0
                            ? data.gratitude
                            : [
                                {
                                  id: (Date.now() + 2).toString(),
                                  title: "",
                                  description: "",
                                },
                              ],
                        gratitudeHelp:
                          data.gratitudeHelp && data.gratitudeHelp.length > 0
                            ? data.gratitudeHelp
                            : [
                                {
                                  id: (Date.now() + 3).toString(),
                                  title: "",
                                  description: "",
                                },
                              ],
                      };
                      setJournalData(updatedData);
                    }
                  } catch (error) {
                    console.error(
                      "Error loading journal data for date:",
                      error
                    );
                  }
                }
              }}
              className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-sm"
            />
          </div>
          <div className="px-3 pb-2">
            <p className="text-xs text-slate-500 text-center">
              Select any past date to view or edit previous journal entries
            </p>
          </div>
        </Card>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-6">
          {sections.map((section, index) => (
            <Button
              key={section.title}
              onClick={() => setCurrentSection(index)}
              className={`
                size-8 rounded-md font-bold text-xs transition-all duration-300 hover:scale-105 flex justify-center items-center
                ${
                  index === currentSection
                    ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                    : index < currentSection
                    ? "bg-primary-green-100 text-primary-green-700 hover:bg-primary-green-200"
                    : "bg-white text-slate-500 hover:bg-slate-200"
                }
              `}
            >
              {index < currentSection ? (
                <CheckCircle className="size-4" />
              ) : (
                index + 1
              )}
            </Button>
          ))}
        </div>

        {/* Main Section Card */}
        <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Section Header */}
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
                    <h2 className="text-lg font-semibold leading-tight text-slate-800">
                      {currentSectionData.title}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600">
                    {currentSectionData.description}
                  </p>
                </div>
              </div>

              {/* Section Content */}
              {currentSection === 0 && (
                <div className="space-y-4">
                  {/* Habit Question */}
                  <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-lg p-4 border border-primary-green-200/40">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-semibold text-primary-green-800 text-base flex-1">
                        Did I take action today toward my goal?
                      </h4>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="tookAction"
                            value="yes"
                            checked={journalData.tookAction === "yes"}
                            onChange={(e) =>
                              setJournalData((prev) => ({
                                ...prev,
                                tookAction: e.target.value as "yes" | "no",
                              }))
                            }
                            className="size-5 text-primary-green-600 focus:ring-2 focus:ring-primary-green-500 focus:ring-offset-2"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-primary-green-700 transition-colors">
                              Yes
                            </span>
                          </div>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="tookAction"
                            value="no"
                            checked={journalData.tookAction === "no"}
                            onChange={(e) =>
                              setJournalData((prev) => ({
                                ...prev,
                                tookAction: e.target.value as "yes" | "no",
                              }))
                            }
                            className="size-5 text-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-red-700 transition-colors">
                              No
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Follow-up Question */}
                  {journalData.tookAction === "no" && (
                    <div className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-lg p-4 border border-blue-200/40">
                      <h4 className="font-semibold text-blue-800 mb-3 text-base">
                        If not, what held me back? What will I change tomorrow?
                      </h4>
                      <textarea
                        value={journalData.whatHeldBack}
                        onChange={(e) =>
                          setJournalData((prev) => ({
                            ...prev,
                            whatHeldBack: e.target.value,
                          }))
                        }
                        placeholder="Reflect on the obstacles you faced today and what specific changes you can make tomorrow to overcome them..."
                        rows={3}
                        className="w-full px-3 py-2 border border-blue-300/60 rounded-lg bg-white/80 focus:border-blue-500 focus:outline-none resize-y min-h-[120px] text-md"
                      />
                    </div>
                  )}

                  {/* Motivational Message */}
                  {(() => {
                    const message = getMotivationalMessage();
                    return (
                      message && (
                        <div
                          className={`bg-gradient-to-r ${message.color} rounded-lg p-3 border shadow-sm`}
                        >
                          <div className="flex items-center gap-2">
                            {message.icon}
                            <p className="text-sm font-medium text-slate-700">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      )
                    );
                  })()}
                </div>
              )}

              {/* Reflection Section */}
              {currentSection === 1 && (
                <div className="space-y-6">
                  {/* Challenges */}
                  <div className="bg-gradient-to-r from-primary-blue-100/50 to-blue-100/50 rounded-lg p-4 border border-primary-blue-200/40">
                    <h4 className="font-semibold text-primary-blue-800 mb-3 text-base flex items-center gap-2">
                      What challenges did I face in pursuing my goal today?
                    </h4>
                    <div className="space-y-3">
                      {journalData.challenges.map((challenge, index) => (
                        <div
                          key={challenge.id}
                          className="bg-white/70 rounded-lg p-3 border border-primary-blue-200/60"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="size-5 bg-primary-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-blue-700">
                              {index + 1}
                            </div>
                            <InputField
                              value={challenge.title}
                              onChange={(value) =>
                                updateBulletPoint(
                                  "challenges",
                                  challenge.id,
                                  "title",
                                  value
                                )
                              }
                              placeholder={`Challenge ${index + 1}`}
                              className="flex-1 border-primary-blue-200 focus:border-primary-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                deleteBulletPoint("challenges", challenge.id)
                              }
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                          <TextArea
                            value={challenge.description}
                            onChange={(value) =>
                              updateBulletPoint(
                                "challenges",
                                challenge.id,
                                "description",
                                value
                              )
                            }
                            placeholder="Describe this challenge in detail..."
                            rows={3}
                            className="border-primary-blue-200 focus:border-primary-blue-500 bg-white/80 resize-y"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addBulletPoint("challenges")}
                        className="w-full py-2 border-2 border-dashed border-primary-blue-300/60 rounded-lg text-primary-blue-600 hover:border-primary-blue-400 hover:text-primary-blue-700 transition-colors hover:bg-primary-blue-50/30 flex items-center justify-center gap-2 text-sm"
                      >
                        <Plus className="size-3" />
                        Add Challenge
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="bg-gradient-to-r from-primary-blue-100/50 to-blue-100/50 rounded-lg p-4 border border-primary-blue-200/40">
                    <h4 className="font-semibold text-primary-blue-800 mb-3 text-base flex items-center gap-2">
                      What progress did I make today, no matter how small?
                    </h4>
                    <div className="space-y-3">
                      {journalData.progress.map((progress, index) => (
                        <div
                          key={progress.id}
                          className="bg-white/70 rounded-lg p-3 border border-primary-green-200/60"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="size-5 bg-primary-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-blue-700">
                              {index + 1}
                            </div>
                            <InputField
                              value={progress.title}
                              onChange={(value) =>
                                updateBulletPoint(
                                  "progress",
                                  progress.id,
                                  "title",
                                  value
                                )
                              }
                              placeholder={`Progress ${index + 1}`}
                              className="flex-1 border-primary-blue-200 focus:border-primary-green-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                deleteBulletPoint("progress", progress.id)
                              }
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                          <TextArea
                            value={progress.description}
                            onChange={(value) =>
                              updateBulletPoint(
                                "progress",
                                progress.id,
                                "description",
                                value
                              )
                            }
                            placeholder="Describe this progress in detail..."
                            rows={3}
                            className="border-primary-blue-200 focus:border-primary-blue-500 bg-white/80 resize-y"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addBulletPoint("progress")}
                        className="w-full py-2 border-2 border-dashed border-primary-blue-300/60 rounded-lg text-primary-blue-600 hover:border-primary-blue-400 hover:text-primary-blue-700 transition-colors hover:bg-primary-blue-50/30 flex items-center justify-center gap-2 text-sm"
                      >
                        <TrendingUp className="size-3" />
                        Add Progress
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Gratitude Section */}
              {currentSection === 2 && (
                <div className="space-y-6">
                  {/* Three Things Grateful For */}
                  <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-green-100/50 rounded-lg p-4 border border-primary-green-200/40">
                    <h4 className="font-semibold text-primary-green-800 mb-3 text-base flex items-center gap-2">
                      What three things am I grateful for today related to my
                      journey?
                    </h4>
                    <div className="space-y-3">
                      {journalData.gratitude.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-white/70 rounded-lg p-3 border border-pink-200/60"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="size-5 bg-pink-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-green-700">
                              {index + 1}
                            </div>
                            <InputField
                              value={item.title}
                              onChange={(value) =>
                                updateBulletPoint(
                                  "gratitude",
                                  item.id,
                                  "title",
                                  value
                                )
                              }
                              placeholder={`Gratitude ${index + 1}`}
                              className="flex-1 border-primary-green-200 focus:border-primary-green-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                deleteBulletPoint("gratitude", item.id)
                              }
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                          <TextArea
                            value={item.description}
                            onChange={(value) =>
                              updateBulletPoint(
                                "gratitude",
                                item.id,
                                "description",
                                value
                              )
                            }
                            placeholder="Describe why you're grateful for this..."
                            rows={3}
                            className="border-primary-green-200 focus:border-primary-green-500 bg-white/80 resize-y"
                          />
                        </div>
                      ))}
                      {journalData.gratitude.length < 3 && (
                        <button
                          type="button"
                          onClick={() => addBulletPoint("gratitude")}
                          className="w-full py-2 border-2 border-dashed border-primary-green-300/60 rounded-lg text-primary-green-600 hover:border-primary-green-400 hover:text-primary-green-700 transition-colors hover:bg-primary-green-50/30 flex items-center justify-center gap-2 text-sm"
                        >
                          <Heart className="size-3" />
                          Add Gratitude ({journalData.gratitude.length}/3)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* How Gratitude Helped */}
                  <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-green-100/50 rounded-lg p-4 border border-primary-green-200/40">
                    <h4 className="font-semibold text-primary-green-800 mb-3 text-base flex items-center gap-2">
                      How did these positive aspects help me move closer to my
                      goal?
                    </h4>
                    <div className="space-y-3">
                      {journalData.gratitudeHelp.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-white/70 rounded-lg p-3 border border-primary-green-200/60"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="size-5 bg-primary-green-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-green-700">
                              {index + 1}
                            </div>
                            <InputField
                              value={item.title}
                              onChange={(value) =>
                                updateBulletPoint(
                                  "gratitudeHelp",
                                  item.id,
                                  "title",
                                  value
                                )
                              }
                              placeholder={`Connection ${index + 1}`}
                              className="flex-1 border-primary-green-200 focus:border-primary-green-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                deleteBulletPoint("gratitudeHelp", item.id)
                              }
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                          <TextArea
                            value={item.description}
                            onChange={(value) =>
                              updateBulletPoint(
                                "gratitudeHelp",
                                item.id,
                                "description",
                                value
                              )
                            }
                            placeholder="Explain how this positive aspect moved you closer to your goal..."
                            rows={3}
                            className="border-primary-green-200 focus:border-primary-green-500 bg-white/80 resize-y"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addBulletPoint("gratitudeHelp")}
                        className="w-full py-2 border-2 border-dashed border-primary-green-300/60 rounded-lg text-primary-green-600 hover:border-primary-green-400 hover:text-primary-green-700 transition-colors hover:bg-primary-green-50/30 flex items-center justify-center gap-2 text-sm"
                      >
                        <Sparkles className="size-3" />
                        Add Connection
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Forward Section */}
              {currentSection === 3 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-lg p-4 border border-blue-200/40">
                    <h4 className="font-semibold text-blue-800 mb-3 text-base flex items-center gap-2">
                      <div className="size-2 bg-blue-500 rounded-full" />
                      What small step will I take tomorrow to continue my
                      progress?
                    </h4>
                    <textarea
                      value={journalData.tomorrowStep}
                      onChange={(e) =>
                        setJournalData((prev) => ({
                          ...prev,
                          tomorrowStep: e.target.value,
                        }))
                      }
                      placeholder="Describe one specific, small action you will take tomorrow. Make it concrete and achievable..."
                      rows={3}
                      className="w-full px-3 py-2 border border-blue-300/60 rounded-lg bg-white/80 focus:border-blue-500 focus:outline-none resize-y min-h-[150px] text-md"
                    />
                    <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200/40">
                      <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>Tip:</strong> Make your tomorrow step specific
                        and small. Instead of &quot;work on my goal,&quot; try
                        &quot;spend 15 minutes researching about something&quot;
                        or &quot;send one email to someone.&quot;
                      </p>
                    </div>
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
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:flex-1 h-10 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        <span>Save Today&apos;s Journal</span>
                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
