"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";

// Updated Zod schema to match your database structure
const feedbackSchema = z.object({
  overallFeeling: z.string().min(1, "Please select how you're feeling"),
  keyInsight: z.string().min(10, "Please share at least a brief insight"),
  overallRating: z.number().min(1, "Please rate the session").max(5),
  wouldRecommend: z.boolean(),
  improvementSuggestion: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface SessionFeedbackFormProps {
  sessionNumber?: number;
  sessionTitle?: string;
  userId?: string;
  onSubmit?: (
    feedback: FeedbackFormData & {
      sessionNumber?: number;
      sessionTitle?: string;
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
  sessionNumber = 1,
  sessionTitle = "Feedback Session",
  userId,
  onSubmit,
  className = "",
}: SessionFeedbackFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

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

  const onFormSubmit = async (data: FeedbackFormData) => {
    console.log("🚀 Form submission started");
    console.log("📋 Form data:", data);
    console.log("🎯 Session number:", sessionNumber);

    // Validate userId is provided
    if (!userId) {
      setSubmitError("User identification is required");
      return;
    }

    // Validate sessionNumber (0-8 range)
    if (sessionNumber < 0 || sessionNumber > 8) {
      setSubmitError("Invalid session number. Must be between 0 and 8");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use sessionNumber directly as sessionId (no conversion needed)
      const sessionId = sessionNumber;

      console.log("🔢 Session ID for database:", sessionId);

      const apiData = {
        userId: userId,
        feeling: String(data.overallFeeling),
        takeaway: String(data.keyInsight),
        rating: Number(data.overallRating),
        wouldRecommend: Boolean(data.wouldRecommend),
        suggestions: data.improvementSuggestion
          ? String(data.improvementSuggestion)
          : null,
        sessionId: sessionId, // Direct mapping: URL param = database value
        sessionNumber: sessionNumber, // Same as sessionId for logging
      };

      console.log("🌐 Sending data to API:", apiData);

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("❌ Non-JSON response received:", textResponse);
        throw new Error(
          "Server returned non-JSON response. Check your API endpoint."
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error Response:", errorData);
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to submit feedback`
        );
      }

      const result = await response.json();
      console.log("✅ Success! Response:", result);

      // Call the optional onSubmit callback if provided
      const completeData = {
        ...data,
        sessionNumber,
        sessionTitle,
        submittedAt: new Date(),
      };
      onSubmit?.(completeData);

      setIsSubmitted(true);
    } catch (error) {
      console.error("❌ Submission error:", error);

      let errorMessage = "An unexpected error occurred";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="bg-white/95 backdrop-blur-xl border-2 border-green-200/50 shadow-2xl shadow-green-100/20 rounded-3xl overflow-hidden">
            <div className="p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl mb-6">
                  <CheckCircle className="size-16 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-4">
                  Thank You!
                </h2>
                <p className="text-green-700/80 text-lg leading-relaxed">
                  Your feedback for {sessionTitle} has been successfully saved
                  and helps us create better experiences for your journey of
                  self-discovery.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 mb-8">
                <h3 className="font-bold text-green-800 mb-2">
                  What&apos;s Next?
                </h3>
                <p className="text-green-700/90 text-sm">
                  You&apos;ll receive a summary and next steps via email within
                  24 hours.
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(`/journey/sessions/${sessionNumber}`)
                }
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                Continue Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 sm:py-8 ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-xl">
              <Heart className="size-5 sm:size-6 text-white" />
            </div>
            <div>
              <h1 className="sm:text-2xl text-xl font-bold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
                {sessionTitle} Feedback
              </h1>
              <p className="text-sm text-slate-500">Session {sessionNumber}</p>
            </div>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Just 5 quick questions to help us improve your experience
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="bg-white/95 backdrop-blur-xl border-2 border-blue-100/50 shadow-xl shadow-blue-100/20 rounded-3xl overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Error Display */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <AlertCircle className="size-5" />
                    <p className="font-medium">Submission Failed</p>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{submitError}</p>
                </div>
              )}

              {/* 1. Overall Feeling */}
              <div>
                <label className="block text-xl font-bold text-blue-800 mb-4 text-center">
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
                            ? "border-blue-400 bg-gradient-to-br from-blue-50 to-green-50 shadow-xl scale-105"
                            : "border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-br hover:from-blue-25 hover:to-green-25"
                        }`}
                      >
                        <div
                          className={`inline-flex p-3 rounded-xl mb-2 bg-gradient-to-br ${feeling.color} shadow-lg`}
                        >
                          <Icon className="size-5 text-white" />
                        </div>
                        <h3 className="font-bold text-blue-800 text-sm">
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
                <label className="block text-xl font-bold text-blue-800 mb-3 text-center">
                  What&apos;s your biggest takeaway from this session?
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
                <label className="block text-xl font-bold text-blue-800 mb-3">
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
              <div className="bg-gradient-to-r from-blue-25 to-green-25 rounded-2xl p-6 border border-blue-200/50">
                <div className="flex items-center justify-center gap-4">
                  <input
                    type="checkbox"
                    {...register("wouldRecommend")}
                    className="size-6 text-blue-600 border-2 border-blue-300 rounded focus-visible:ring-transparent"
                  />
                  <label className="text-lg font-bold text-blue-800 text-center">
                    I would recommend this session to others
                  </label>
                </div>
              </div>

              {/* 5. Improvement Suggestion (Optional) */}
              <div>
                <label className="block text-lg font-semibold text-blue-800 mb-3 text-center">
                  Any quick suggestion to make it even better? (Optional)
                </label>
                <textarea
                  {...register("improvementSuggestion")}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none text-center"
                  rows={2}
                  placeholder="One thing we could improve..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-8 bg-gradient-to-r from-blue-25/50 to-green-25/50 border-t border-blue-100/50 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-6 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-6" />
                    Submit Feedback
                  </>
                )}
              </button>
              <p className="text-slate-600 text-sm mt-3">
                Takes less than 2 minutes • Your privacy is protected
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
