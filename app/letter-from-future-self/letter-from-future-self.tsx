"use client";
import React, { useState } from "react";
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

const LetterFromFutureSelf: React.FC = () => {
  //   const [letter, setLetter] = useState("");
  const [formData, setFormData] = useState({
    letter: "",
  });
  const [charCount, setCharCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTextChange = (text: string) => {
    // const text = e.target.value;
    setFormData((prev) => ({
      ...prev,
      letter: text,
    }));
    setCharCount(text.length);
  };

  const handleSubmit = () => {
    if (formData.letter.trim()) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData({
      letter: "",
    });
    setCharCount(0);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-teal-50 to-primary-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-primary-green-200 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 size-16 bg-gradient-to-br from-primary-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <Sparkles className="size-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary-green-600 to-teal-600 bg-clip-text text-transparent">
              Letter Received!
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 mt-2">
              Your future self has sent you a message of wisdom and
              encouragement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-primary-green-50 to-teal-50 p-6 rounded-lg border border-primary-green-200">
              <h3 className="font-semibold text-primary-green-800 mb-3 flex items-center gap-2">
                <Heart className="size-5 text-primary-green-600" />
                Your Letter from the Future
              </h3>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                {formData.letter}
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleReset}
                className="bg-gradient-to-r from-primary-green-500 to-teal-600 hover:from-primary-green-600 hover:to-teal-700 text-white font-medium px-8 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-primary-primary-blue-50 to primary-green-50 p-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <Header
          headerIcon={User}
          headerText="Write a Letter from Your Future Self"
          headerDescription="Imagine your life 3 or 5 years in the future, where you've
            achieved your goals and grown through challenges. What would your
            future self advise you? What would they prioritize?"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary-green-50 to-primary-green-100 p-4 rounded-lg border border-primary-green-200">
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

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="size-5 text-teal-600" />
              <h3 className="font-semibold text-teal-800">Share Wisdom</h3>
            </div>
            <p className="text-sm text-teal-700">
              What insights would you want to share?
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary-blue-50 to-primary-blue-100 p-4 rounded-lg border border-primary-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="size-5 text-primary-blue-600" />
              <h3 className="font-semibold text-primary-blue-800">
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

          <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded-md">
            {charCount} characters
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <Button
            onClick={handleSubmit}
            disabled={!formData.letter.trim()}
            className="bg-gradient-to-r from-primary-green-500 to-teal-600 hover:from-primary-green-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-medium px-8 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <Send className="size-5 mr-2" />
            Send Letter from Future Self
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LetterFromFutureSelf;
