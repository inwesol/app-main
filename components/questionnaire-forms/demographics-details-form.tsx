"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { CompactSelectionButton } from "@/components/form-components/compact-selection-button";

import {
  User,
  GraduationCap,
  Briefcase,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Mail,
  Building,
  BookOpen,
  Brain,
  TrendingUp,
  MessageSquare,
  Zap,
  Award,
  Phone,
  Calendar,
  Users,
} from "lucide-react";
import {
  demographicsDetailsSchema,
  type DemographicsDetailsFormData,
} from "@/lib/form-validation-schemas/questionnaire-schemas/demographics-details-form-schema";
import { useRouter } from "next/navigation";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export function DemographicsDetailsForm({
  sessionId = "0",
}: {
  sessionId?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  const form = useForm<DemographicsDetailsFormData>({
    resolver: zodResolver(demographicsDetailsSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      age: "",
      // gender: "",
      // profession: undefined,
      // previousCoaching: undefined,
      education: "",
      stressLevel: 5,
      motivation: "",
    },
    mode: "onChange",
  });

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Demographics Details");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    async function fetchData() {
      const qId = "demographics-details";
      setIsLoading(true);
      try {
        const res = await fetch(`/api/journey/sessions/${sessionId}/q/${qId}`);

        if (res.ok) {
          const data = await res.json();
          if (!data || data.error) {
            // No data found or error in response
            form.reset({
              fullName: "",
              email: "",
              phoneNumber: "",
              age: "",
              education: "",
              stressLevel: 5,
              motivation: "",
            });
          } else {
            // Data found - use the transformed data directly
            form.reset({
              fullName: data.fullName || "",
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              age: data.age || "",
              education: data.education || "",
              gender: data.gender || "",
              profession: data.profession || "",
              previousCoaching: data.previousCoaching || "",
              stressLevel: data.stressLevel || 5,
              motivation: data.motivation || "",
            });
          }
          setIsLoading(false);
        } else {
          // Handle error response
          let errorMessage = "An error occurred while loading data";
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
            // console.error("API Error:", errorData);
          } catch (parseError) {
            // If response is not JSON, get text
            const textResponse = await res.text();
            errorMessage = textResponse || errorMessage;
            // console.error("API Error (non-JSON):", textResponse);
          }
          setIsLoading(false);
          // You could show a toast notification here with errorMessage
        }
      } catch (error) {
        console.error("Network Error:", error);
        setIsLoading(false);
        // You could show a toast notification here
      }
    }
    fetchData();
  }, [form, sessionId]);

  const onSubmit = async (data: DemographicsDetailsFormData) => {
    const qId = "demographics-details";

    try {
      const res = await fetch(`/api/journey/sessions/${sessionId}/q/${qId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok && responseData.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push(`/journey/sessions/${sessionId}`);
        }, 2000);
      } else {
        // Handle validation errors or other errors
        const errorMessage =
          responseData.message || "An error occurred. Please try again.";

        if (responseData.details) {
          // Handle field-specific validation errors
          console.error("Validation errors:", responseData.details);
          // You could set form errors here for specific fields
        }

        alert(`Error: ${errorMessage}`);
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
      setIsSubmitted(false);
    }
  };

  const nextPage = async () => {
    const page1Fields = [
      "fullName",
      "email",
      "phoneNumber",
      "age",
      "gender",
      "profession",
      "education",
    ] as const;
    const isValid = await form.trigger(page1Fields);

    if (isValid) {
      setCurrentPage(2);
    }
  };

  const prevPage = () => {
    setCurrentPage(1);
  };

  const stressLevel = form.watch("stressLevel");

  const getStressLevelText = (level: number) => {
    if (level <= 2) return "Very Low";
    if (level <= 4) return "Low";
    if (level <= 6) return "Moderate";
    if (level <= 8) return "High";
    return "Very High";
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 3) return "bg-green-600";
    if (level <= 6) return "bg-amber-600";
    return "bg-rose-600";
  };

  const getStressLevelBg = (level: number) => {
    if (level <= 3) return "from-green-400 to-green-600";
    if (level <= 6) return "from-amber-400 to-amber-600";
    return "from-red-400 to-red-600";
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-green-50 sm:py-8">
        <Card className="max-w-lg mx-auto border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center sm:p-12">
            <div className="relative inline-flex items-center justify-center mb-6 shadow-lg size-20 sm:size-24 bg-gradient-to-r from-primary-green-500 to-primary-green-600 rounded-3xl sm:mb-8">
              <CheckCircle className="text-white size-10 sm:size-12" />
              <div className="absolute flex items-center justify-center rounded-full shadow-md -top-2 -right-2 size-6 sm:size-8 bg-primary-blue-500">
                <Sparkles className="text-white size-3 sm:size-4" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-transparent sm:text-4xl bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text sm:mb-6">
              Thank You!
            </h2>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Your demographics details intake form has been submitted
              successfully. We&apos;ll review your information and be in touch
              soon to begin your transformative coaching journey.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Header */}
          {/* <Header
          headerIcon={Heart}
          headerText="Demographics Details Form"
          headerDescription="Welcome to your coaching journey. Please take a few moments to share
            some information about yourself so we can create a personalized
            experience tailored to your unique needs and aspirations."
        /> */}

          {/* Progress Indicator */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <div
                className={`flex items-center gap-2 sm:gap-3 transition-all duration-500 ${
                  currentPage === 1
                    ? "text-primary-blue-600 scale-105"
                    : "text-primary-green-600 scale-100"
                }`}
              >
                <div
                  className={`
                relative size-9 sm:size-11 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold shadow-lg transition-all duration-500
                ${
                  currentPage === 1
                    ? "bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 text-white border-2 border-primary-blue-200"
                    : "bg-gradient-to-br from-primary-green-500 to-primary-green-600 text-white border-2 border-primary-green-200"
                }
              `}
                >
                  {currentPage === 1 ? (
                    "1"
                  ) : (
                    <CheckCircle className="size-5 sm:size-6" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold">Personal Info</div>
                  <div className="text-xs text-slate-500">Basic details</div>
                </div>
              </div>

              <div
                className={`
              w-8 sm:w-12 h-2 sm:h-2.5 rounded-full transition-all duration-700 relative overflow-hidden
              ${
                currentPage === 2
                  ? "bg-gradient-to-r from-primary-blue-400 to-primary-green-400"
                  : "bg-slate-200"
              }
            `}
              >
                {currentPage === 2 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-blue-500 to-primary-green-500" />
                )}
              </div>

              <div
                className={`flex items-center gap-2 sm:gap-3 transition-all duration-500 ${
                  currentPage === 2
                    ? "text-primary-blue-600 scale-105"
                    : "text-slate-400 scale-95"
                }`}
              >
                <div
                  className={`
                relative size-9 sm:size-11 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold shadow-lg transition-all duration-500
                ${
                  currentPage === 2
                    ? "bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 text-white border-2 border-primary-blue-200"
                    : "bg-slate-100 text-slate-400 border-2 border-slate-200"
                }
              `}
                >
                  2
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold">Wellbeing & Goals</div>
                  <div className="text-xs text-slate-500">Your objectives</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader
              className={`
            rounded-t-xl transition-all duration-700 relative overflow-hidden p-3 sm:p-4 lg:p-6
            ${
              currentPage === 1
                ? "bg-gradient-to-r from-primary-blue-50 to-primary-blue-100"
                : "bg-gradient-to-r from-primary-green-50 to-primary-green-100"
            }
          `}
            >
              <CardTitle className="relative z-10 text-base font-bold sm:text-lg lg:text-xl text-slate-800">
                {currentPage === 1
                  ? "Personal & Professional Information"
                  : "Wellbeing & Coaching Goals"}
              </CardTitle>
              <CardDescription className="relative z-10 text-xs text-slate-600 sm:text-sm lg:text-base">
                {currentPage === 1
                  ? "Let's start with some basic information about you and your professional background"
                  : "Help us understand your current stress levels and what you hope to achieve through coaching."}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-3 sm:p-6 lg:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {currentPage === 1 && (
                    // personal info, professional info and CTA button container
                    <div>
                      {/* Personal Information Section */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 mb-3 sm:gap-3 sm:mb-4">
                          <div className="flex items-center justify-center rounded-lg shadow-lg size-8 sm:size-10 lg:size-12 bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 sm:rounded-xl">
                            <User className="text-white size-4 sm:size-5 lg:size-6" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold sm:text-base lg:text-lg text-slate-800">
                              About You
                            </h3>
                            <p className="text-xs text-slate-500 sm:text-sm">
                              Tell us about yourself
                            </p>
                          </div>
                        </div>

                        {/*fullName, email ,age and gender container*/}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field, fieldState }) => (
                              // fullName
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                  <User className="size-3 sm:size-4" />
                                  Full Name
                                  <span className="text-rose-500">*</span>
                                </FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your full name"
                                      {...field}
                                      className={`
                                      h-10 sm:h-12 border-2 focus:border-primary-blue-400 focus:ring-primary-blue-400/20 rounded-lg transition-all duration-200 bg-white/70 text-sm font-medium pl-3 placeholder:text-slate-500 outline-none focus:outline-none 
    focus-visible:ring-0 focus-visible:ring-offset-0
                                      ${
                                        fieldState.error
                                          ? "border-rose-300 bg-rose-50/50"
                                          : "border-slate-200"
                                      }
                                    `}
                                    />
                                  </FormControl>
                                  {field.value && !fieldState.error && (
                                    <CheckCircle className="absolute text-green-500 -translate-y-1/2 right-3 top-1/2 size-4" />
                                  )}
                                </div>
                                <div className="h-4">
                                  <FormMessage className="text-xs font-medium text-rose-500" />
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                              // email
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                  <Mail className="size-3 sm:size-4" />
                                  Email Address
                                  <span className="text-rose-500">*</span>
                                </FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="your.email@example.com"
                                      {...field}
                                      className={`
                                      h-10 sm:h-12 border-2 focus:border-primary-blue-400 focus:ring-primary-blue-400/20 rounded-lg transition-all duration-200 bg-white/70 text-sm font-medium pl-3 placeholder:text-slate-500 outline-none focus:outline-none 
    focus-visible:ring-0 focus-visible:ring-offset-0 
                                      ${
                                        fieldState.error
                                          ? "border-rose-300 bg-rose-50/50"
                                          : "border-slate-200"
                                      }
                                    `}
                                    />
                                  </FormControl>
                                  {field.value && !fieldState.error && (
                                    <CheckCircle className="absolute text-green-500 -translate-y-1/2 right-3 top-1/2 size-4" />
                                  )}
                                </div>
                                <div className="h-4">
                                  <FormMessage className="text-xs font-medium text-rose-500" />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        {/* Phone Number, Age, and Gender in one row */}
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="age"
                            render={({ field, fieldState }) => (
                              // age
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                  <Calendar className="size-3 sm:size-4" />
                                  Age
                                  <span className="text-rose-500">*</span>
                                </FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Enter your age"
                                      {...field}
                                      className={`
                                      h-10 sm:h-12 border-2 focus:border-primary-blue-400 focus:ring-primary-blue-400/20 rounded-lg transition-all duration-200 bg-white/70 text-sm font-medium pl-3 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                                      ${
                                        fieldState.error
                                          ? "border-rose-300 bg-rose-50/50"
                                          : "border-slate-200"
                                      }
                                    `}
                                    />
                                  </FormControl>
                                  {field.value && !fieldState.error && (
                                    <CheckCircle className="absolute text-green-500 -translate-y-1/2 right-3 top-1/2 size-4" />
                                  )}
                                </div>
                                <div className="h-4">
                                  <FormMessage className="text-xs font-medium text-rose-500" />
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field, fieldState }) => (
                              // gender
                              <FormItem className="space-y-1 sm:space-y-2 ">
                                <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                  <Users className="size-3 sm:size-4" />
                                  Gender
                                  <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger
                                      className={`
                                          h-10 sm:h-12 border-2 rounded-lg transition-all duration-200 bg-white/70 text-sm font-medium outline-none focus:outline-none 
                                          focus-visible:ring-0 focus-visible:ring-offset-0
                                          ${
                                            fieldState.error
                                              ? "border-rose-300 bg-rose-50/50"
                                              : "border-slate-200 focus:border-primary-blue-400 focus:ring-primary-blue-400/20"
                                          }
                                        `}
                                    >
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">
                                        Female
                                      </SelectItem>
                                      <SelectItem value="non-binary">
                                        Non-binary
                                      </SelectItem>
                                      <SelectItem value="transgender">
                                        Transgender
                                      </SelectItem>
                                      <SelectItem value="prefer-not-to-say">
                                        Prefer not to say
                                      </SelectItem>
                                      <SelectItem value="others">
                                        Others
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <div className="h-4">
                                  <FormMessage className="text-xs font-medium text-rose-500" />
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field, fieldState }) => (
                              // phoneNumber
                              <FormItem className="space-y-1 sm:space-y-2 md:col-span-2">
                                <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                  <Phone className="size-3 sm:size-4" />
                                  Phone Number
                                  <span className="text-rose-500">*</span>
                                </FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="+91 9000900090"
                                      {...field}
                                      className={`
                                      h-10 sm:h-12 border-2 focus:border-primary-blue-400 focus:ring-primary-blue-400/20 rounded-lg transition-all duration-200 bg-white/70 text-sm font-medium pl-3 placeholder:text-slate-400 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                                      ${
                                        fieldState.error
                                          ? "border-rose-300 bg-rose-50/50"
                                          : "border-slate-200"
                                      }
                                    `}
                                    />
                                  </FormControl>
                                  {field.value && !fieldState.error && (
                                    <CheckCircle className="absolute text-green-500 -translate-y-1/2 right-3 top-1/2 size-4" />
                                  )}
                                </div>
                                <div className="h-4">
                                  <FormMessage className="text-xs font-medium text-rose-500" />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      {/* horizontal rule */}
                      <Separator className="h-px mb-3 bg-gradient-to-r from-blue-200 via-green-200 to-blue-200 sm:mb-4" />

                      {/* Professional Information Section */}
                      <div className="mb-3 space-y-2 sm:space-y-3 sm:mb-4">
                        <div className="flex items-center gap-2 mb-3 sm:gap-3 sm:mb-4">
                          <div className="flex items-center justify-center rounded-lg shadow-lg size-8 sm:size-10 lg:size-12 bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 sm:rounded-xl">
                            <Briefcase className="text-white size-4 sm:size-5 lg:size-6" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold sm:text-base lg:text-lg text-slate-800">
                              Professional Background
                            </h3>
                            <p className="text-xs text-slate-500 sm:text-sm">
                              Your career and education
                            </p>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="profession"
                          render={({ field, fieldState }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                <Building className="size-3 sm:size-4" />
                                Current Status
                                <span className="text-rose-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                                  {[
                                    {
                                      value: "student-pursuing",
                                      title: "Student (Currently Pursuing)",
                                      description:
                                        "Currently enrolled in studies",
                                      icon: GraduationCap,
                                    },
                                    {
                                      value: "seeking-employment",
                                      title: "Seeking Employment",
                                      description:
                                        "Looking for work opportunities",
                                      icon: Award,
                                    },
                                    {
                                      value: "working-business",
                                      title: "Business Owner",
                                      description: "Running your own business",
                                      icon: Building,
                                    },
                                    {
                                      value: "working-employee",
                                      title: "Working Professional",
                                      description: "Employed at a company",
                                      icon: Briefcase,
                                    },
                                  ].map(
                                    ({
                                      value,
                                      title,
                                      description,
                                      icon: Icon,
                                    }) => {
                                      const isSelected = field.value === value;
                                      return (
                                        <button
                                          type="button"
                                          onClick={() => field.onChange(value)}
                                          key={value}
                                          className={`
                                          relative p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                          ${
                                            isSelected
                                              ? "bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 text-white border-primary-blue-500 shadow-lg shadow-primary-blue-500/25"
                                              : "bg-white hover:bg-primary-blue-50 border-slate-200 hover:border-primary-blue-300 text-slate-700"
                                          }
                                        `}
                                        >
                                          {isSelected && (
                                            <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md -top-1 -right-1 size-5">
                                              <CheckCircle className="size-3 text-primary-green-500" />
                                            </div>
                                          )}
                                          <div className="flex items-start space-x-2 sm:space-x-3">
                                            <div
                                              className={`
                                            size-8 sm:size-10 rounded-lg flex items-center justify-center transition-all duration-300
                                            ${
                                              isSelected
                                                ? "bg-white/20"
                                                : "bg-primary-blue-100"
                                            }
                                          `}
                                            >
                                              <Icon
                                                className={`size-4 sm:size-5 ${
                                                  isSelected
                                                    ? "text-white"
                                                    : "text-primary-blue-600"
                                                }`}
                                              />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <h4
                                                className={`font-semibold text-xs sm:text-sm mb-1 ${
                                                  isSelected
                                                    ? "text-white"
                                                    : "text-slate-800"
                                                }`}
                                              >
                                                {title}
                                              </h4>
                                              {description && (
                                                <p
                                                  className={`text-xs ${
                                                    isSelected
                                                      ? "text-white/80"
                                                      : "text-slate-500"
                                                  }`}
                                                >
                                                  {description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                              </FormControl>
                              <div className="h-4">
                                <FormMessage className="text-xs font-medium text-rose-500" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="education"
                          render={({ field, fieldState }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                <BookOpen className="size-3 sm:size-4" />
                                Education & Field of Study
                                <span className="text-rose-500">*</span>
                              </FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Bachelor's in Computer Science, MBA in Marketing"
                                    {...field}
                                    className={`
                                    h-10 sm:h-12 border-2 focus:border-primary-green-400 focus:ring-primary-green-400/20 rounded-lg transition-all duration-200 bg-white/70 text-sm font-medium pl-3 placeholder:text-slate-500
                                    outline-none focus:outline-none 
    focus-visible:ring-0 focus-visible:ring-offset-0 ${
      fieldState.error ? "border-rose-300 bg-rose-50/50" : "border-slate-200"
    }
                                  `}
                                  />
                                </FormControl>
                                {field.value && !fieldState.error && (
                                  <CheckCircle className="absolute -translate-y-1/2 right-3 top-1/2 size-4 text-primary-green-500" />
                                )}
                              </div>
                              <FormDescription className="text-xs text-slate-500">
                                Please include your highest level of education
                                and your field of study
                              </FormDescription>
                              <div className="h-4">
                                <FormMessage className="text-xs font-medium text-rose-500" />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={nextPage}
                          className="w-auto sm:w-64 h-10 sm:h-12 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-semibold text-sm rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] relative overflow-hidden group px-6 sm:px-8"
                        >
                          <div className="absolute inset-0 transition-transform duration-700 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 group-hover:translate-x-full" />
                          <span className="relative z-10 flex items-center justify-center">
                            Continue to Wellbeing & Goals
                            <ArrowRight className="ml-2 transition-transform duration-200 size-4 sm:size-5 group-hover:translate-x-1" />
                          </span>
                        </Button>
                      </div>

                      <p className="p-3 mt-3 text-xs leading-relaxed text-center rounded-lg text-slate-500 bg-slate-50 sm:p-4">
                        🔒 Your information is confidential and will only be
                        used to provide you with the best coaching experience.
                      </p>

                      {/* <div className="flex flex-col gap-4 sm:flex-row">
                      <Button
                        onClick={nextPage}
                        className="w-full sm:flex-1 h-12 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 hover:from-primary-blue-600 hover:to-primary-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                      >
                        Continue to Wellness & Coaching goals
                        <ArrowRight className="transition-transform duration-200 size-5 group-hover:translate-x-1" />
                      </Button>
                    </div> */}
                    </div>
                  )}

                  {currentPage === 2 && (
                    <>
                      {/* Wellness & Goals Section */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 mb-3 sm:gap-3 sm:mb-4">
                          <div className="flex items-center justify-center rounded-lg shadow-lg size-8 sm:size-10 lg:size-12 bg-gradient-to-br from-primary-green-500 to-primary-green-600 sm:rounded-xl">
                            <Target className="text-white size-4 sm:size-5 lg:size-6" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold sm:text-base lg:text-lg text-slate-800">
                              Stress Level
                            </h3>
                            <p className="text-xs text-slate-500 sm:text-sm">
                              Rate your current stress levels related to
                              work/education and personal life
                            </p>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="stressLevel"
                          render={({ field }) => (
                            <FormItem className="mb-3">
                              <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                <Brain className="size-3 sm:size-4" />
                                Current Stress Level
                              </FormLabel>
                              <FormControl>
                                <div
                                  className={`space-y-3 p-4 bg-white rounded-lg border-2 border-slate-200 shadow-sm`}
                                >
                                  <div className="flex items-center justify-between mb-2 text-xs">
                                    <span className="font-medium text-slate-600">
                                      Very Low
                                    </span>
                                    <span className="font-medium text-slate-600">
                                      Very High
                                    </span>
                                  </div>
                                  <Slider
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(value) =>
                                      field.onChange(value[0])
                                    }
                                    className="w-full"
                                  />
                                  <div className="flex justify-center">
                                    <div
                                      className={`text-center px-8 py-2 rounded-lg shadow-sm text-white bg-gradient-to-br ${getStressLevelBg(
                                        stressLevel
                                      )}`}
                                    >
                                      <div className="text-lg font-bold">
                                        {stressLevel}/10
                                      </div>
                                      <div className="text-sm font-medium">
                                        {getStressLevelText(stressLevel)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </FormControl>
                              <div className="h-4">
                                <FormMessage className="text-xs font-medium text-rose-500" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="previousCoaching"
                          render={({ field, fieldState }) => (
                            <FormItem className="mb-3 space-y-1 sm:space-y-2">
                              <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                <TrendingUp className="size-3 sm:size-4" />
                                <div>
                                  Previous Coaching or Therapy Experience
                                  <span className="text-rose-500">
                                    &nbsp;&nbsp;*
                                  </span>
                                </div>
                              </FormLabel>
                              <FormControl>
                                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                  <CompactSelectionButton
                                    value="yes"
                                    currentValue={field.value}
                                    onChange={field.onChange}
                                    icon={CheckCircle}
                                    label="Yes, I have experience"
                                    color="green"
                                  />
                                  <CompactSelectionButton
                                    value="no"
                                    currentValue={field.value}
                                    onChange={field.onChange}
                                    icon={Zap}
                                    label="No, this is my first time"
                                    color="green"
                                  />
                                </div>
                              </FormControl>
                              <div className="h-4">
                                <FormMessage className="text-xs font-medium text-rose-500" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motivation"
                          render={({ field, fieldState }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                                <MessageSquare className="size-3 sm:size-4" />
                                What motivates you to seek coaching?
                                <span className="text-rose-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please share what brings you to coaching. What are you hoping to achieve or work on? What challenges are you facing that you'd like support with?"
                                  className={`
                                  min-h-[100px] sm:min-h-[120px] border-2 focus:border-green-400 focus:ring-green-400/20 rounded-lg transition-all duration-200 bg-white/70 resize-none text-sm p-3 sm:p-4 placeholder:text-slate-500 outline-none focus:outline-none 
    focus-visible:ring-0 focus-visible:ring-offset-0
                                  ${
                                    fieldState.error
                                      ? "border-rose-300 bg-rose-50/50"
                                      : "border-slate-200"
                                  }
                                `}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-slate-500">
                                Take your time to reflect on your goals and what
                                you hope to gain from coaching (minimum 20
                                characters)
                              </FormDescription>
                              <div className="h-4">
                                <FormMessage className="text-xs font-medium text-rose-500" />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div>
                        <div className="flex flex-col justify-end gap-3 mb-3 sm:flex-row sm:gap-4">
                          <Button
                            onClick={prevPage}
                            className="flex items-center justify-center w-auto h-10 gap-2 px-4 font-semibold transition-all duration-200 bg-white border-2 rounded-lg sm:w-32 sm:h-12 border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 group sm:px-6"
                          >
                            <ArrowLeft className="transition-transform duration-200 size-4 group-hover:-translate-x-1" />
                            Previous
                          </Button>
                          <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-auto sm:w-48 h-10 sm:h-12 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex items-center justify-center gap-2 px-4 sm:px-6"
                          >
                            {form.formState.isSubmitting ? (
                              <>
                                <svg
                                  className="mr-2 text-white animate-spin size-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
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
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Now
                                <Award className="transition-transform duration-200 size-4 group-hover:rotate-12" />
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="p-3 text-xs leading-relaxed text-center rounded-lg text-slate-500 bg-slate-50 sm:p-4">
                          🔒 Your information is confidential and will only be
                          used to provide you with the best coaching experience.
                        </p>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
