"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Star,
  Send,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Sparkles,
  BookOpen,
  Target,
  MessageCircle,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";

// Simplified Zod validation schema
const feedbackSchema = z.object({
  overallFeeling: z.string().min(1, "Please select how you're feeling"),
  keyInsight: z.string().min(10, "Please share at least a brief insight"),
  overallRating: z.number().min(1, "Please rate the session").max(5),
  wouldRecommend: z.boolean(),
  improvementSuggestion: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface SessionFeedbackFormProps {
  sessionNumber: number;
  sessionTitle: string;
  onSubmit?: (
    feedback: FeedbackFormData & {
      sessionNumber: number;
      sessionTitle: string;
      submittedAt: Date;
    }
  ) => void;
  className?: string;
}

const FEELING_OPTIONS = [
  {
    value: "enlightened",
    label: "Enlightened",
    icon: Lightbulb,
    color: "from-yellow-400 to-amber-500",
  },
  {
    value: "confident",
    label: "Confident",
    icon: TrendingUp,
    color: "from-green-400 to-emerald-500",
  },
  {
    value: "curious",
    label: "Curious",
    icon: Sparkles,
    color: "from-purple-400 to-violet-500",
  },
  {
    value: "reflective",
    label: "Reflective",
    icon: BookOpen,
    color: "from-blue-400 to-cyan-500",
  },
  {
    value: "motivated",
    label: "Motivated",
    icon: Target,
    color: "from-orange-400 to-red-500",
  },
  {
    value: "overwhelmed",
    label: "Overwhelmed",
    icon: MessageCircle,
    color: "from-gray-400 to-slate-500",
  },
];

export function SessionFeedbackForm({
  sessionNumber,
  sessionTitle,
  onSubmit,
  className = "",
}: SessionFeedbackFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    mode: "onChange",
    defaultValues: {
      overallRating: 0,
      wouldRecommend: false,
    },
  });

  const watchedValues = watch();

  const onFormSubmit = (data: FeedbackFormData) => {
    const completeData = {
      ...data,
      sessionNumber,
      sessionTitle,
      submittedAt: new Date(),
    };

    onSubmit?.(completeData);
    setIsSubmitted(true);
  };

  const handleRatingClick = (rating: number) => {
    setValue("overallRating", rating);
    trigger("overallRating");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleRatingClick(index + 1)}
        className={`transition-all duration-300 hover:scale-125 ${
          index < rating
            ? "text-yellow-400 hover:text-yellow-500"
            : "text-gray-300 hover:text-yellow-300"
        }`}
      >
        <Star className={`size-8 ${index < rating ? "fill-current" : ""}`} />
      </button>
    ));
  };

  if (isSubmitted) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:py-8 ${className}`}
      >
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-green-200/50 shadow-2xl shadow-green-100/20 rounded-3xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl mb-6">
                  <CheckCircle className="size-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-4">
                  Thank You!
                </h2>
                <p className="text-green-700/80 text-lg leading-relaxed">
                  Your feedback helps us create better experiences for your
                  journey of self-discovery.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 mb-8">
                <h3 className="font-bold text-green-800 mb-2">What's Next?</h3>
                <p className="text-green-700/90 text-sm">
                  You'll receive a summary and next steps via email within 24
                  hours.
                </p>
              </div>

              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                Continue Your Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 p-4 sm:py-8 ${className}`}
    >
      <div className="max-w-3xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary-blue-500 to-primary-green-500 rounded-2xl shadow-xl">
              <Heart className="size-5 sm:size-6 text-white" />
            </div>
            <div>
              <h1 className="sm:text-2xl text-xl font-bold bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text text-transparent">
                Quick Feedback
              </h1>
              {/* <p className="text-slate-600 text-lg font-medium mt-2">
                {sessionTitle} - Session {sessionNumber}
              </p> */}
            </div>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Just 5 quick questions to help us improve your experience
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-primary-blue-100/50 shadow-xl shadow-primary-blue-100/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8 space-y-8">
              {/* 1. Overall Feeling */}
              <div>
                <label className="block text-xl font-bold text-primary-blue-800 mb-4 text-center">
                  How are you feeling after this session?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {FEELING_OPTIONS.map((feeling) => {
                    const Icon = feeling.icon;
                    const isSelected =
                      watchedValues.overallFeeling === feeling.value;
                    return (
                      <button
                        key={feeling.value}
                        type="button"
                        onClick={() => {
                          setValue("overallFeeling", feeling.value);
                          trigger("overallFeeling");
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                          isSelected
                            ? "border-primary-blue-400 bg-gradient-to-br from-primary-blue-50 to-primary-green-50 shadow-xl scale-105"
                            : "border-gray-200 hover:border-primary-blue-300 bg-white hover:bg-gradient-to-br hover:from-primary-blue-25 hover:to-primary-green-25"
                        }`}
                      >
                        <div
                          className={`inline-flex p-3 rounded-xl mb-2 bg-gradient-to-br ${feeling.color} shadow-lg`}
                        >
                          <Icon className="size-5 text-white" />
                        </div>
                        <h3 className="font-bold text-primary-blue-800 text-sm">
                          {feeling.label}
                        </h3>
                      </button>
                    );
                  })}
                </div>
                {errors.overallFeeling && (
                  <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-2">
                    <AlertCircle className="size-4" />
                    {errors.overallFeeling.message}
                  </p>
                )}
              </div>

              {/* 2. Key Insight */}
              <div>
                <label className="block text-xl font-bold text-primary-blue-800 mb-3 text-center">
                  What's your biggest takeaway from this session ?
                </label>
                <textarea
                  {...register("keyInsight")}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus-visible:ring-transparent outline-none resize-none text-center"
                  rows={3}
                  placeholder="Share your key insight or realization..."
                />
                {errors.keyInsight && (
                  <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-2">
                    <AlertCircle className="size-4" />
                    {errors.keyInsight.message}
                  </p>
                )}
              </div>

              {/* 3. Overall Rating */}
              <div className="text-center">
                <label className="block text-xl font-bold text-primary-blue-800 mb-3">
                  How would you rate this session overall?
                </label>
                <div className="flex justify-center gap-2 mb-2">
                  {renderStars(watchedValues.overallRating || 0)}
                </div>
                <p className="text-slate-600 text-sm">
                  Click the stars to rate from 1 to 5
                </p>
                {errors.overallRating && (
                  <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-2">
                    <AlertCircle className="size-4" />
                    {errors.overallRating.message}
                  </p>
                )}
              </div>

              {/* 4. Would Recommend */}
              <div className="bg-gradient-to-r from-primary-blue-25 to-primary-green-25 rounded-2xl p-6 border border-primary-blue-200/50">
                <div className="flex items-center justify-center gap-4">
                  <input
                    type="checkbox"
                    {...register("wouldRecommend")}
                    className="size-6 text-primary-blue-600 border-2 border-primary-blue-300 rounded focus-visible:ring-transparent"
                  />
                  <label className="text-lg font-bold text-primary-blue-800 text-center">
                    I would recommend this session to others
                  </label>
                </div>
              </div>

              {/* 5. Improvement Suggestion (Optional) */}
              <div>
                <label className="block text-lg font-semibold text-primary-blue-800 mb-3 text-center">
                  Any quick suggestion to make it even better? (Optional)
                </label>
                <textarea
                  {...register("improvementSuggestion")}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary-blue-400 focus:ring-4 focus:ring-primary-blue-100 transition-all duration-300 resize-none text-center"
                  rows={2}
                  placeholder="One thing we could improve..."
                />
              </div>
            </CardContent>

            {/* Submit Button */}
            <div className="p-8 bg-gradient-to-r from-primary-blue-25/50 to-primary-green-25/50 border-t border-primary-blue-100/50 text-center">
              <Button
                type="submit"
                className="flex items-center gap-3 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 hover:from-primary-blue-600 hover:to-primary-green-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mx-auto"
              >
                <Send className="size-6" />
                Submit Feedback
              </Button>
              <p className="text-slate-600 text-sm mt-3">
                Takes less than 2 minutes • Your privacy is protected
              </p>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
