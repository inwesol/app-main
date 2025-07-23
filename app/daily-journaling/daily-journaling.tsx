"use client";
import React, { useState } from "react";

import { QuestionSection } from "@/components/activity-components/question-section";
import { TextArea } from "@/components/activity-components/text-area";
import { InputField } from "@/components/activity-components/input-field";
import Header from "@/components/form-components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Target,
  Lightbulb,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  X,
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

export const DailyJournaling: React.FC = () => {
  const [journalData, setJournalData] = useState<DailyJournalingData>({
    date: new Date().toISOString().split("T")[0],
    tookAction: "",
    whatHeldBack: "",
    challenges: [],
    progress: [],
    gratitude: [],
    gratitudeHelp: [],
    tomorrowStep: "",
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-primary-blue-50 to-blue-50 relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <Header
          headerIcon={Calendar}
          headerText="Daily Journaling"
          headerDescription="Reflect on your daily progress and set intentions for tomorrow"
        />

        {/* Date Selection */}
        <Card className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 border-slate-200/60 shadow-lg mb-8">
          <div className="flex items-center justify-center gap-4 p-2">
            <Calendar className="size-6 text-slate-600" />
            <label className="text-lg font-semibold text-slate-700">
              Journal Date:
            </label>
            <input
              type="date"
              value={journalData.date}
              onChange={(e) =>
                setJournalData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="px-4 py-2 border border-slate-300 rounded-lgbg-white font-medium"
            />
          </div>
        </Card>

        {/* Habit Section */}
        <Card className="mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60">
          <CardHeader>
            <div>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-primary-green-100 rounded-lg">
                  <Target className="size-4 sm:size-5 text-primary-green-600" />
                </div>
                <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
                  Habit
                </CardTitle>
              </div>
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  Track your daily action towards your goals and identify what
                  might be holding you back.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Action Question */}
              <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-blue-100/50 rounded-xl p-6 border border-primary-green-200/40">
                <h4 className="font-semibold text-primary-green-800 mb-4 text-lg">
                  Did I take action today toward my goal?
                </h4>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                      className="size-5 text-primary-green-600 focus:ring-primary-green-500"
                    />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-5 text-green-600" />
                      <span className="text-lg font-medium text-slate-700 group-hover:text-primary-green-700 transition-colors">
                        Yes
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
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
                      className="size-5 text-red-600 focus:ring-red-500"
                    />
                    <div className="flex items-center gap-2">
                      <XCircle className="size-5 text-red-600" />
                      <span className="text-lg font-medium text-slate-700 group-hover:text-red-700 transition-colors">
                        No
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditional Follow-up Question */}
              {journalData.tookAction === "no" && (
                <div className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-xl p-6 border border-blue-200/40">
                  <h4 className="font-semibold text-blue-800 mb-4 text-lg">
                    If not, what held me back? What will I change tomorrow?
                  </h4>
                  <TextArea
                    value={journalData.whatHeldBack}
                    onChange={(value) =>
                      setJournalData((prev) => ({
                        ...prev,
                        whatHeldBack: value,
                      }))
                    }
                    placeholder="Reflect on the obstacles you faced today and what specific changes you can make tomorrow to overcome them..."
                    rows={4}
                    className="border-blue-300/60 focus:border-blue-500 bg-white/80"
                  />
                </div>
              )}

              {/* Motivational Message */}
              {getMotivationalMessage() && (
                <div
                  className={`bg-gradient-to-r ${
                    getMotivationalMessage()!.color
                  } rounded-xl p-4 border shadow-sm`}
                >
                  <div className="flex items-center gap-3">
                    {getMotivationalMessage()!.icon}
                    <p className="font-medium text-slate-700">
                      {getMotivationalMessage()!.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reflection Section */}
        <Card className="mb-6 bg-gradient-to-br from-primary-blue-50/80 to-blue-50/80 border-primary-blue-200/60 shadow-xl">
          <CardHeader>
            <div>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-primary-blue-100 rounded-lg">
                  <Lightbulb className="size-4 sm:size-5 text-primary-blue-600" />
                </div>
                <CardTitle className="text-primary-blue-600 text-lg sm:text-xl">
                  Reflection
                </CardTitle>
              </div>
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  Take time to reflect on both the challenges you faced and the
                  progress you made today.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Challenges */}
              <div className="bg-gradient-to-r from-primary-blue-100/50 to-blue-100/50 rounded-xl p-6 border border-primary-blue-200/40">
                <h4 className="font-semibold text-primary-blue-800 mb-4 text-lg flex items-center gap-2">
                  What challenges did I face in pursuing my goal today?
                </h4>
                <div className="space-y-4">
                  {journalData.challenges.map((challenge, index) => (
                    <div
                      key={challenge.id}
                      className="bg-white/70 rounded-lg p-4 border border-primary-blue-200/60"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="size-6 bg-primary-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-blue-700">
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
                          onClick={() =>
                            deleteBulletPoint("challenges", challenge.id)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="size-4" />
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
                        rows={2}
                        className="border-primary-blue-200 focus:border-primary-blue-500 bg-white/80"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addBulletPoint("challenges")}
                    className="w-full py-3 border-2 border-dashed border-primary-blue-300/60 rounded-lg text-primary-blue-600 hover:border-primary-blue-400 hover:text-primary-blue-700 transition-colors hover:bg-primary-blue-50/30 flex items-center justify-center gap-2"
                  >
                    <Plus className="size-4" />
                    Add Challenge
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gradient-to-r from-primary-blue-100/50 to-blue-100/50 rounded-xl p-6 border border-primary-blue-200/40">
                <h4 className="font-semibold text-primary-blue-800 mb-4 text-lg flex items-center gap-2">
                  What progress did I make today, no matter how small?
                </h4>
                <div className="space-y-4">
                  {journalData.progress.map((progress, index) => (
                    <div
                      key={progress.id}
                      className="bg-white/70 rounded-lg p-4 border border-primary-green-200/60"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="size-6 bg-primary-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-blue-700">
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
                          onClick={() =>
                            deleteBulletPoint("progress", progress.id)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="size-4" />
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
                        rows={2}
                        className="border-primary-blue-20 bg-white/80"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addBulletPoint("progress")}
                    className="w-full py-3 border-2 border-dashed border-primary-blue-300/60 rounded-lg text-primary-blue-600 hover:border-primary-blue-400 hover:text-primary-blue-700 transition-colors hover:bg-primary-blue-50/30 flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="size-4" />
                    Add Progress
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gratitude Section */}
        <Card className="mb-6 bg-gradient-to-br from-primary-green-50/80 to-green-50/80 border-primary-green-200/60 shadow-xl">
          <CardHeader>
            <div>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-primary-green-100 rounded-lg">
                  <Heart className="size-4 sm:size-5 text-primary-green-600" />
                </div>
                <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
                  Gratitude
                </CardTitle>
              </div>
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  Focus on the positive aspects of your journey and how they
                  contribute to your growth.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Three Things Grateful For */}
              <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-green-100/50 rounded-xl p-6 border border-primary-green-200/40">
                <h4 className="font-semibold text-primary-green-800 mb-4 text-lg flex items-center gap-2">
                  What three things am I grateful for today related to my
                  journey?
                </h4>
                <div className="space-y-4">
                  {journalData.gratitude.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white/70 rounded-lg p-4 border border-pink-200/60"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="size-6 bg-pink-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-green-700">
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
                          className="flex-1 border-primary-green-200 "
                        />
                        <button
                          onClick={() =>
                            deleteBulletPoint("gratitude", item.id)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="size-4" />
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
                        rows={2}
                        className="border-primary-green-200  bg-white/80"
                      />
                    </div>
                  ))}
                  {journalData.gratitude.length < 3 && (
                    <button
                      onClick={() => addBulletPoint("gratitude")}
                      className="w-full py-3 border-2 border-dashed border-primary-green-300/60 rounded-lg text-primary-green-600 hover:border-primary-green-400 hover:text-primary-green-700 transition-colors hover:bg-primary-green-50/30 flex items-center justify-center gap-2"
                    >
                      <Heart className="size-4" />
                      Add Gratitude ({journalData.gratitude.length}/3)
                    </button>
                  )}
                </div>
              </div>

              {/* How Gratitude Helped */}
              <div className="bg-gradient-to-r from-primary-green-100/50 to-primary-green-100/50 rounded-xl p-6 border border-primary-green-200/40">
                <h4 className="font-semibold text-primary-green-800 mb-4 text-lg flex items-center gap-2">
                  How did these positive aspects help me move closer to my goal?
                </h4>
                <div className="space-y-4">
                  {journalData.gratitudeHelp.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-white/70 rounded-lg p-4 border border-primary-green-200/60"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="size-6 bg-primary-green-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-green-700">
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
                          className="flex-1 border-primary-green-200 "
                        />
                        <button
                          onClick={() =>
                            deleteBulletPoint("gratitudeHelp", item.id)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="size-4" />
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
                        rows={2}
                        className="border-primary-green-200  bg-white/80"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addBulletPoint("gratitudeHelp")}
                    className="w-full py-3 border-2 border-dashed border-primary-green-300/60 rounded-lg text-primary-green-600 hover:border-primary-green-400 hover:text-primary-green-700 transition-colors hover:bg-primary-green-50/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="size-4" />
                    Add Connection
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forward Section */}
        <QuestionSection
          title="Forward"
          subtitle="Set your intention for tomorrow with a specific, actionable step."
          icon={<ArrowRight className="size-6 text-blue-600" />}
          className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200/60 shadow-xl"
        >
          <div className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-xl p-6 border border-blue-200/40">
            <h4 className="font-semibold text-blue-800 mb-4 text-lg flex items-center gap-2">
              <div className="size-3 bg-blue-500 rounded-full"></div>
              What small step will I take tomorrow to continue my progress?
            </h4>
            <TextArea
              value={journalData.tomorrowStep}
              onChange={(value) =>
                setJournalData((prev) => ({ ...prev, tomorrowStep: value }))
              }
              placeholder="Describe one specific, small action you will take tomorrow. Make it concrete and achievable..."
              rows={4}
              className="border-blue-300/60 focus:border-blue-500 bg-white/80"
            />
            <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200/40">
              <p className="text-sm text-blue-700 leading-relaxed">
                <strong>Tip:</strong> Make your tomorrow step specific and
                small. Instead of "work on my goal," try "spend 15 minutes
                researching about something" or "send one email to someone."
              </p>
            </div>
          </div>
        </QuestionSection>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-primary-green-50/80 to-primary-blue-50/80 border-primary-green-200/60 shadow-xl mb-8">
          <div className="text-center p-4">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-green-200/60 to-primary-blue-200/60 px-4 py-2 rounded-full mb-4">
              <Calendar className="size-5 text-primary-green-700" />
              <span className="text-sm font-semibold text-primary-green-800">
                Daily Reflection Complete
              </span>
            </div>
            <h3 className="text-xl font-bold text-primary-green-800 mb-3">
              Your Journey Continues
            </h3>
            <p className="text-primary-green-700 leading-relaxed max-w-2xl mx-auto">
              You've completed today's reflection. Remember that progress isn't
              always linear, and every small step counts. Your commitment to
              daily reflection is building the foundation for lasting change.
            </p>
          </div>
        </Card>

        {/* Enhanced Save Button */}
        <div className="text-center">
          <button className="group relative px-10 py-4 bg-gradient-to-r from-primary-green-500 via-primary-blue-500 to-blue-500 text-white rounded-2xl font-bold text-lg hover:from-primary-green-600 hover:via-primary-blue-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green-400 via-primary-blue-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <span>Save Today&apos;s Journal</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
