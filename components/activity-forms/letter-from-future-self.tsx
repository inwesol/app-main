"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Send,
  Clock,
  Lightbulb,
  Heart,
  ArrowRight,
  User,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/activity-components/text-area";
import Header from "@/components/form-components/header";

export default function LetterFromFutureSelf() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const activityId = params?.activityId as string;

  const [formData, setFormData] = useState({
    letter: "",
  });
  const [charCount, setCharCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/${activityId}`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          setCharCount(data.letter?.length || 0);
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
        console.error("Failed to save letter from future self");
        // Handle error (you might want to show a toast notification)
      }
    } catch (error) {
      console.error("Error saving letter from future self:", error);
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  const handleWriteAnother = () => {
    router.push(`/journey/sessions/${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-teal-50 to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto border-b-2 rounded-full animate-spin size-12 border-primary-green-600" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-teal-50 to-primary-blue-50">
        <Card className="w-full max-w-2xl shadow-xl border-primary-green-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6 text-center">
            <div className="flex items-center justify-center mx-auto mb-4 rounded-full size-16 bg-gradient-to-br from-primary-green-500 to-teal-600">
              <Sparkles className="text-white size-8" />
            </div>
            <CardTitle className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary-green-600 to-teal-600 bg-clip-text">
              Letter Received!
            </CardTitle>
            <CardDescription className="mt-2 text-lg text-slate-600">
              Your future self has sent you a message of wisdom and
              encouragement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 border rounded-lg bg-gradient-to-r from-primary-green-50 to-teal-50 border-primary-green-200">
              <h3 className="flex items-center gap-2 mb-3 font-semibold text-primary-green-800">
                <Heart className="size-5 text-primary-green-600" />
                Your Letter from the Future
              </h3>
              <div className="font-medium leading-relaxed whitespace-pre-wrap text-slate-700">
                {formData.letter}
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleWriteAnother}
                className="px-8 py-3 font-medium text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-primary-green-500 to-teal-600 hover:from-primary-green-600 hover:to-teal-700 hover:scale-105"
              >
                Write Another Letter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-primary-primary-blue-50 to primary-green-50 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <Header
          headerIcon={User}
          headerText="Write a Letter from Your Future Self"
          headerDescription="Imagine your life 3 or 5 years in the future, where you've
            achieved your goals and grown through challenges. What would your
            future self advise you? What would they prioritize?"
        />
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-4 border rounded-lg bg-gradient-to-br from-primary-green-50 to-primary-green-100 border-primary-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-5 text-primary-green-600" />
              <h3 className="font-semibold text-primary-green-800">
                Reflect on Time
              </h3>
            </div>
            <p className="text-sm text-primary-green-700">
              Consider the journey and growth over the years
            </p>
          </div>

          <div className="p-4 border border-teal-200 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="text-teal-600 size-5" />
              <h3 className="font-semibold text-teal-800">Share Wisdom</h3>
            </div>
            <p className="text-sm text-teal-700">
              What insights would you want to share?
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-gradient-to-br from-primary-blue-50 to-primary-blue-100 border-primary-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="size-5 text-primary-blue-600" />
              <h3 className="font-semibent text-primary-blue-800">
                Express Love
              </h3>
            </div>
            <p className="text-sm text-primary-blue-700">
              Be kind and encouraging to yourself
            </p>
          </div>
        </div>
        <div className="relative">
          <TextArea
            value={formData.letter}
            onChange={(value) => handleTextChange(value)}
            placeholder={`Dear Present Me,

I'm writing to you from five years in the future, and I want you to know how proud I am of the person you're becoming.

Share your hopes, dreams, and the wisdom you've gained. What challenges did you overcome? What would you prioritize differently? What brings you the most joy and fulfillment?

With love,
Future Me`}
            className={`min-h-[300px] resize-none transition-all duration-300 bg-white/50 backdrop-blur-sm text-slate-700 leading-relaxed`}
          />

          <div className="absolute px-2 py-1 text-xs rounded-md bottom-3 right-3 text-slate-500 bg-white/80">
            {charCount} characters
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <Button
            onClick={handleSubmit}
            disabled={!formData.letter.trim() || isSaving}
            className="px-8 py-3 font-medium text-white transition-all duration-300 rounded-lg shadow-md bg-gradient-to-r from-primary-green-500 to-teal-600 hover:from-primary-green-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <Send className="mr-2 size-5" />
            {isSaving ? "Sending..." : "Send Letter from Future Self"}
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
