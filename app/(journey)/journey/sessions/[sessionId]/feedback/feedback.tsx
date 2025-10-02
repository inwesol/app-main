"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
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
  Loader2,
  PenTool,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Updated Zod schema to match your database structure
const feedbackSchema = z.object({
  overallFeeling: z
    .array(z.string())
    .min(1, "Please select at least one feeling"),
  keyInsight: z.string().min(10, "Please share at least a brief insight"),
  overallRating: z.number().min(1, "Please rate the session").max(5),
  wouldRecommend: z.boolean(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface SessionFeedbackFormProps {
  sessionId?: number;
  sessionTitle?: string;
  userId?: string;
  onSubmit?: (
    feedback: FeedbackFormData & {
      sessionId?: number;
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
  sessionId = 0,
  sessionTitle = "",
  userId,
  onSubmit,
  className = "",
}: SessionFeedbackFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textareas
  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) autoResize(textareaRef.current);
      if (suggestionRef.current) autoResize(suggestionRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    mode: "onChange",
    defaultValues: {
      overallFeeling: [],
      keyInsight: "",
      overallRating: 0,
      wouldRecommend: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = form;

  const watchedValues = watch();

  const onFormSubmit = async (data: FeedbackFormData) => {
    // Validate userId is provided
    if (!userId) {
      setSubmitError("User identification is required");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const apiData = {
        userId: userId,
        overallFeeling: data.overallFeeling,
        keyInsight: data.keyInsight,
        overallRating: data.overallRating,
        wouldRecommend: data.wouldRecommend,
        sessionId: sessionId,
      };

      const response = await fetch(
        `/api/journey/sessions/${sessionId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        throw new Error(
          "Server returned non-JSON response. Check your API endpoint."
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to submit feedback`
        );
      }

      const result = await response.json();

      // Call the optional onSubmit callback if provided
      const completeData = {
        ...data,
        sessionId,
        sessionTitle,
        submittedAt: new Date(),
      };
      onSubmit?.(completeData);

      setIsSubmitted(true);
    } catch (error) {
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
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={`star-${index + 1}`}
        type="button"
        onClick={() => handleRatingClick(index + 1)}
        className={`transition-all duration-200 hover:scale-110 ${
          index < rating
            ? "text-yellow-400 hover:text-yellow-500"
            : "text-gray-300 hover:text-yellow-300"
        }`}
      >
        <Star className={`size-5 ${index < rating ? "fill-current" : ""}`} />
      </button>
    ));
  };

  // Auto-redirect after successful submission
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        router.push(`/journey/sessions/${sessionId}`);
      }, 1000); // Redirect after 1 seconds
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, router, sessionId]);

  if (isSubmitted) {
    return (
      <div className={`p-4 py-6 sm:py-8 ${className}`}>
        <div className="max-w-xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-green-200/50 shadow-2xl shadow-green-100/20 rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-xl mb-4">
                  <CheckCircle className="size-12 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
                  Thank You!
                </h2>
                <p className="text-green-700/80 text-base sm:text-lg leading-relaxed">
                  Your feedback has been successfully saved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Compact Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg shadow-md">
            <MessageCircle className="size-3 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
            {sessionTitle} Feedback
          </h1>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="space-y-4">
              {/* Error Display */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <AlertCircle className="size-4" />
                    <p className="font-medium text-sm">Submission Failed</p>
                  </div>
                  <p className="text-red-600 text-xs mt-1">{submitError}</p>
                </div>
              )}

              {/* 1. Overall Feeling */}
              <div>
                <fieldset>
                  <legend className="block text-base font-semibold text-slate-800 mb-3 text-center">
                    How are you feeling after this session?
                  </legend>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {FEELING_OPTIONS.map((feeling) => {
                      const Icon = feeling.icon;
                      const isSelected =
                        watchedValues.overallFeeling?.includes(feeling.value) ||
                        false;
                      return (
                        <button
                          key={feeling.value}
                          type="button"
                          onClick={() => {
                            const currentFeelings =
                              watchedValues.overallFeeling || [];
                            const newFeelings = isSelected
                              ? currentFeelings.filter(
                                  (f) => f !== feeling.value
                                )
                              : [...currentFeelings, feeling.value];
                            setValue("overallFeeling", newFeelings);
                          }}
                          className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${
                            isSelected
                              ? "border-blue-400 bg-gradient-to-br from-blue-50 to-green-50 shadow-md scale-105"
                              : "border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-br hover:from-blue-25 hover:to-green-25"
                          }`}
                        >
                          <div
                            className={`inline-flex p-1.5 rounded-md mb-1.5 bg-gradient-to-br ${feeling.color} shadow-sm`}
                          >
                            <Icon className="size-3 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-700 text-xs">
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
                </fieldset>
              </div>

              {/* 2. Key Insight */}
              <div>
                <label
                  htmlFor="keyInsight"
                  className="block text-base font-semibold text-slate-800 mb-2 text-center"
                >
                  What&apos;s your biggest takeaway from this session?
                </label>
                <div className="relative p-1.5 space-y-1 border shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-slate-200">
                  <div className="space-y-3">
                    <Controller
                      name="keyInsight"
                      control={form.control}
                      render={({ field }) => (
                        <textarea
                          id="keyInsight"
                          {...field}
                          ref={textareaRef}
                          placeholder="Share your key insight or realization..."
                          rows={3}
                          className="w-full min-h-[200px] resize-y rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 md:text-lg p-3 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                          onInput={(e) => {
                            field.onChange(e);
                            autoResize(e.target as HTMLTextAreaElement);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 text-xs border-t text-slate-500 border-slate-200/50">
                    <span className="flex items-center gap-1">
                      <PenTool className="size-3" />
                      Take your time to reflect and write thoughtfully
                    </span>
                    <span className="font-medium">
                      {watchedValues.keyInsight?.length || 0} characters
                    </span>
                  </div>
                </div>
                {errors.keyInsight && (
                  <p className="text-red-500 text-xs mt-1 flex items-center justify-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.keyInsight.message}
                  </p>
                )}
              </div>

              {/* 3. Overall Rating */}
              <div className="text-center">
                <fieldset>
                  <legend className="block text-base font-semibold text-slate-800 mb-2">
                    How would you rate this session overall?
                  </legend>
                  <div className="flex justify-center gap-1 mb-1">
                    {renderStars(watchedValues.overallRating || 0)}
                  </div>
                  {errors.overallRating && (
                    <p className="text-red-500 text-xs mt-1 flex items-center justify-center gap-1">
                      <AlertCircle className="size-3" />
                      {errors.overallRating.message}
                    </p>
                  )}
                </fieldset>
              </div>

              {/* 4. Would Recommend */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 border border-blue-200/50">
                <div className="flex items-center justify-center gap-2">
                  <input
                    id="wouldRecommend"
                    type="checkbox"
                    {...register("wouldRecommend")}
                    className="size-4 text-blue-600 border-2 border-blue-300 rounded focus-visible:ring-transparent"
                  />
                  <label
                    htmlFor="wouldRecommend"
                    className="text-sm font-semibold text-slate-700 text-center"
                  >
                    I would recommend this session to others
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-200 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="size-3" />
                      Submit Feedback
                    </>
                  )}
                </button>
                <p className="text-slate-500 text-xs mt-1.5">
                  Takes less than 2 minutes • Your privacy is protected
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
