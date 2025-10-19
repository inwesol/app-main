"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Send,
  Clock,
  Lightbulb,
  Heart,
  Sparkles,
  PenTool,
  CheckCircle,
  Award,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export default function LetterFromFutureSelf() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const activityId = params?.aId as string;
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  const [formData, setFormData] = useState({
    letter: "",
  });
  const [charCount, setCharCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Letter from Future Activity");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      if (!sessionId || !activityId) {
        console.log("Missing sessionId or activityId:", {
          sessionId,
          activityId,
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/${activityId}`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          setCharCount(data.letter?.length || 0);
        } else {
          console.error(
            "Failed to load data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error loading letter from future self data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sessionId, activityId]);

  const handleTextChange = (text: string) => {
    setFormData((prev) => ({
      ...prev,
      letter: text,
    }));
    setCharCount(text.length);
  };

  const handleSubmit = async () => {
    if (!formData.letter.trim()) return;

    if (!sessionId || !activityId) {
      console.error("Missing sessionId or activityId for submission:", {
        sessionId,
        activityId,
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${activityId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        console.error(
          "Failed to save letter from future self:",
          response.status,
          response.statusText
        );
        // Handle error (you might want to show a toast notification)
      }
    } catch (error) {
      console.error("Error saving letter from future self:", error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-redirect after showing success message
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        router.push(`/journey/sessions/${sessionId}`);
      }, 2000); // Redirect after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, router, sessionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">
            Loading your letter activity...
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-blue-50 via-white to-primary-green-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mx-auto mb-4 shadow-lg size-16 bg-gradient-to-br from-primary-green-500 to-primary-green-600 rounded-2xl">
              <CheckCircle className="text-white size-8" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">
              Letter Complete!
            </h2>
            <p className="mb-4 text-slate-600">
              Thank you for writing your letter from the future.
            </p>
            <p className="text-sm text-slate-500">
              Redirecting to your session...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Main Activity Card */}
          <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Activity Header */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="inline-flex items-center justify-center shadow-lg size-12 bg-gradient-to-br from-primary-blue-500 to-primary-green-600 rounded-xl">
                      <Mail className="text-white size-6" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="mb-2 text-xl font-bold text-slate-800 sm:text-2xl">
                      Letter from the Future Self
                    </h1>
                    <p className="text-sm text-slate-600">
                      In this workbook, you will write a letter to yourself from
                      the future. This activity helps you connect with your
                      future dreams and goals. It also gives you a chance to
                      think about the steps you need to take and how to overcome
                      difficulties with confidence.
                    </p>
                  </div>
                </div>

                {/* Instruction Section */}
                <div className="p-3 border rounded-lg bg-gradient-to-br from-primary-blue-50 to-primary-green-50 border-primary-blue-200">
                  <h2 className="mb-2 text-base font-semibold text-slate-800">
                    Instructions
                  </h2>
                  <p className="text-sm text-slate-700">
                    Imagine your life 3 or 5 years in the future. You have gone
                    through the change you&apos;re currently facing. You&apos;ve
                    achieved your goals and grown through various challenges.
                    Now, write a letter from that future self to your current
                    self.
                  </p>
                </div>

                {/* Tips Section */}
                <div className="p-3 border rounded-lg bg-gradient-to-br from-primary-green-50 to-teal-50 border-primary-green-200">
                  <h3 className="mb-2 text-base font-semibold text-primary-green-800">
                    In this letter, reflect on:
                  </h3>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <Clock className="size-3 mt-0.5 text-primary-green-600 shrink-0" />
                      What your future self might advise you about
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="size-3 mt-0.5 text-primary-green-600 shrink-0" />
                      What they would prioritise
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="size-3 mt-0.5 text-primary-green-600 shrink-0" />
                      What should your current self should focus on
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="size-3 mt-0.5 text-primary-green-600 shrink-0" />
                      Finish with a positive message or motivation to keep going
                    </li>
                  </ul>
                </div>

                {/* Text Area Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Write Your Letter
                  </h3>
                  <div className="relative p-1.5 space-y-1 border shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-slate-200">
                    <Textarea
                      value={formData.letter}
                      onChange={(e) => handleTextChange(e.target.value)}
                      placeholder={`Dear Present Me,

I'm writing to you from five years in the future, and I want you to know how proud I am of the person you're becoming.

Share your hopes, dreams, and the wisdom you've gained. What challenges did you overcome? What would you prioritize differently? What brings you the most joy and fulfillment?

With love,
Future Me`}
                      rows={12}
                      className="min-h-[300px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 md:text-lg"
                    />
                    <div className="flex items-center justify-between pt-2 text-xs border-t text-slate-500 border-slate-200/50">
                      <span className="flex items-center gap-1">
                        <PenTool className="size-3" />
                        Take your time to reflect and write thoughtfully
                      </span>
                      <span className="font-medium">
                        {charCount} characters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4 border-t border-slate-200">
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.letter.trim() || isSaving}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                  >
                    {isSaving ? (
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Letter from Future Self
                        <Award className="transition-transform duration-200 size-4 group-hover:rotate-12" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
