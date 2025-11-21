"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Video,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowLeft,
  Loader2,
  Users,
} from "lucide-react";
import { BreadcrumbUI } from "@/components/breadcrumbUI";

const MeetingScheduler = () => {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<{
    value: string;
    display: string;
  } | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [step, setStep] = useState(2); // 2: date & time, 3: confirm

  // New scheduling states
  const [schedulingStatus, setSchedulingStatus] = useState<
    "not_scheduled" | "pending" | "assigned" | "completed"
  >("not_scheduled");
  const [insights, setInsights] = useState<any>({});
  const [timeUntilSession, setTimeUntilSession] = useState<number | null>(null);
  const [canJoinSession, setCanJoinSession] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [showCompletedPage, setShowCompletedPage] = useState(false);

  // Time slots state - initialized on client side
  const [timeSlots, setTimeSlots] = useState<
    Array<{
      value: string;
      display: string;
      isPast: boolean;
    }>
  >([]);
  const [isTimeSlotsLoaded, setIsTimeSlotsLoaded] = useState(false);

  // Generate time slots - moved to useEffect to prevent hydration mismatch
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let hour = 9; hour <= 22; hour++) {
      for (const minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayTime = `${displayHour}:${minute
          .toString()
          .padStart(2, "0")} ${period}`;

        // Check if this time slot is in the past
        const isPast =
          hour < currentHour ||
          (hour === currentHour && minute <= currentMinute);

        slots.push({
          value: time,
          display: displayTime,
          isPast: isPast,
        });
      }
    }
    return slots;
  };

  // Update session status to completed in database
  const updateSessionStatusToCompleted = useCallback(async () => {
    try {
      await fetch(`/api/journey/sessions/${sessionId}/schedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      });
      setSchedulingStatus("completed");
    } catch (error) {
      console.error("Error updating session status to completed:", error);
    }
  }, [sessionId]);

  // Calculate time until session and check if user can join
  const calculateTimeUntilSession = useCallback(
    (sessionDateTime: string) => {
      const sessionDate = new Date(sessionDateTime);
      const now = new Date();
      const timeDiff = sessionDate.getTime() - now.getTime();

      setTimeUntilSession(timeDiff);

      // Can join 10 minutes before session OR up to 24 hours after session starts
      const tenMinutesInMs = 10 * 60 * 1000;
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

      // Check if session is completed (more than 24 hours after session)
      if (timeDiff < -twentyFourHoursInMs) {
        setIsSessionCompleted(true);
        setCanJoinSession(false);
        // Update status to completed in database
        updateSessionStatusToCompleted();
      } else {
        setIsSessionCompleted(false);
        setCanJoinSession(
          timeDiff <= tenMinutesInMs && timeDiff > -twentyFourHoursInMs
        );
      }
    },
    [updateSessionStatusToCompleted]
  );

  // Check scheduling status on component mount
  const checkSchedulingStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/schedule`
      );
      const data = await response.json();

      if (response.ok) {
        setSchedulingStatus(data.scheduling_status);
        setInsights(data.insights || {});

        // If there's a scheduled session, calculate time until session
        if (data.insights?.session_datetime) {
          calculateTimeUntilSession(data.insights.session_datetime);
        }
      }
    } catch (error) {
      console.error("Error checking scheduling status:", error);
    }
  }, [sessionId, calculateTimeUntilSession]);

  // Generate time slots on client side to prevent hydration mismatch
  useEffect(() => {
    const slots = generateTimeSlots();
    setTimeSlots(slots);
    setIsTimeSlotsLoaded(true);
  }, []);

  // Set default time slot on component mount
  useEffect(() => {
    if (!selectedTime && isTimeSlotsLoaded) {
      const nearestSlot = timeSlots.find((slot) => !slot.isPast);
      if (nearestSlot) {
        setSelectedTime({
          value: nearestSlot.value,
          display: nearestSlot.display,
        });
      }
    }
  }, [selectedTime, timeSlots, isTimeSlotsLoaded]);

  // Check scheduling status on mount
  useEffect(() => {
    checkSchedulingStatus();
  }, [checkSchedulingStatus]);

  // Update step based on scheduling status
  useEffect(() => {
    if (schedulingStatus === "pending" || schedulingStatus === "assigned") {
      setStep(3);
    } else if (schedulingStatus === "completed") {
      setStep(4); // Show completed page
      setShowCompletedPage(true);

      // Redirect to session page after 5 seconds
      const redirectTimer = setTimeout(() => {
        window.location.href = `/journey/sessions/${sessionId}`;
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [schedulingStatus, sessionId]);

  // Set up real-time updates for scheduling status
  useEffect(() => {
    if (schedulingStatus === "pending" || schedulingStatus === "assigned") {
      const interval = setInterval(() => {
        checkSchedulingStatus();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
    // Don't poll when status is "completed" - show static completed page
  }, [schedulingStatus, checkSchedulingStatus]);

  // Update time countdown every minute
  useEffect(() => {
    if (timeUntilSession !== null && timeUntilSession > 0) {
      const interval = setInterval(() => {
        if (insights.session_datetime) {
          calculateTimeUntilSession(insights.session_datetime);
        }
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [timeUntilSession, insights.session_datetime, calculateTimeUntilSession]);

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isToday,
        isSelected,
        isAvailable: isCurrentMonth && !isPast,
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  const navigateMonth = (direction: any) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const selectDate = (day: any) => {
    if (!day.isAvailable) return;
    setSelectedDate(day.date);
  };

  const selectTime = (time: any) => {
    setSelectedTime(time);
    // Auto-advance to confirmation if both date and time are selected
    if (selectedDate) {
      setTimeout(() => setStep(3), 300);
    }
  };

  // Submit schedule request
  const submitScheduleRequest = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsGenerating(true);

    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.value.split(":").map(Number);
      const sessionDateTime = new Date(selectedDate);
      sessionDateTime.setHours(hours, minutes, 0, 0);

      const response = await fetch(
        `/api/journey/sessions/${sessionId}/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_datetime: sessionDateTime.toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSchedulingStatus("pending");
        setInsights(data.insights);
        setStep(3);
      } else {
        console.error("Error submitting schedule request:", data.error);
        alert(data.error || "Failed to submit schedule request");
      }
    } catch (error) {
      console.error("Error submitting schedule request:", error);
      alert("Failed to submit schedule request");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const redirectToJourney = () => {
    window.location.href = "/journey";
  };

  // Join session - open meeting link in new tab
  const joinSession = () => {
    if (insights.meeting_link) {
      window.open(insights.meeting_link, "_blank");
    } else {
      console.error("Meeting link not available");
    }
  };

  // Format time remaining
  const formatTimeRemaining = (milliseconds: number) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const resetScheduler = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setGeneratedLink("");
    setStep(2);
    setIsCopied(false);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Breadcrumb navigation
  const getBreadcrumbs = () => {
    return [
      { label: "Home", href: "/" },
      { label: "Journey", href: "/journey" },
      {
        label: `Session ${Number(sessionId) + 1}`,
        href: `/journey/sessions/${sessionId}`,
      },
      { label: "Schedule Meeting", isActive: true },
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbUI items={getBreadcrumbs()} />

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-2xl overflow-hidden">
          {/* Step 1: Date and Time Selection Side by Side */}
          {step === 2 && (
            <div className="p-4 sm:p-6 lg:p-8 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                  Select Date & Time
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Choose your preferred date and time for the meeting
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Date Picker */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-lg font-semibold">
                      <Calendar className="size-4" />
                      {formatSelectedDate() || "Select date"}
                    </div>
                  </div>

                  {/* Calendar Header */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigateMonth(-1)}
                      className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                    >
                      <ChevronLeft className="size-5 text-slate-600" />
                    </button>

                    <h4 className="text-base font-bold text-slate-800">
                      {monthNames[currentMonth.getMonth()]}{" "}
                      {currentMonth.getFullYear()}
                    </h4>

                    <button
                      type="button"
                      onClick={() => navigateMonth(1)}
                      className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                    >
                      <ChevronRight className="size-5 text-slate-600" />
                    </button>
                  </div>

                  {/* Compact Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day, index) => (
                        <div
                          key={day}
                          className="h-8 flex items-center justify-center text-xs font-semibold text-slate-500"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <button
                        key={day.date.toISOString()}
                        type="button"
                        onClick={() => selectDate(day)}
                        disabled={!day.isAvailable}
                        className={`h-8 flex items-center justify-center text-xs font-medium rounded-lg transition-all duration-200 ${
                          day.isSelected
                            ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md scale-105"
                            : day.isToday
                            ? "bg-blue-100 text-blue-700 border border-blue-300 font-semibold"
                            : day.isAvailable
                            ? "hover:bg-slate-100 text-slate-700 hover:scale-105"
                            : "text-slate-300 cursor-not-allowed"
                        } ${!day.isCurrentMonth ? "opacity-40" : ""}`}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Picker */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-lg font-semibold">
                      <Clock className="size-4" />
                      {selectedTime?.display || "Select time"}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 max-h-80 p-2 overflow-y-auto custom-scrollbar">
                    {!isTimeSlotsLoaded
                      ? // Loading state
                        Array.from({ length: 16 }, (_, i) => (
                          <div
                            key={`loading-slot-${Date.now()}-${i}`}
                            className="p-3 rounded-lg bg-gray-100 animate-pulse"
                          >
                            <div className="h-4 bg-gray-200 rounded" />
                          </div>
                        ))
                      : timeSlots.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => !slot.isPast && selectTime(slot)}
                            disabled={slot.isPast}
                            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                              selectedTime?.value === slot.value
                                ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-transparent shadow-lg scale-105"
                                : slot.isPast
                                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                                : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:scale-105 hover:shadow-md"
                            }`}
                          >
                            {slot.display}
                          </button>
                        ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 sm:mt-8">
                {selectedDate && selectedTime && (
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 hover:shadow-lg hover:scale-105 font-semibold"
                  >
                    Continue to Confirmation
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Confirmation & Generate */}
          {step === 3 && (
            <div className="p-4 sm:p-6 lg:p-8 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-t-2xl p-4 sm:p-6 border border-slate-200/60 shadow-sm">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-4 sm:mb-6">
                    {schedulingStatus === "pending"
                      ? "Scheduling Under Process"
                      : schedulingStatus === "assigned"
                      ? "Coach Assigned!"
                      : "Confirm Your Meeting"}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Calendar className="size-5 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">
                        {["pending", "assigned"].includes(schedulingStatus) &&
                        insights.session_datetime
                          ? new Date(
                              insights.session_datetime
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : formatSelectedDate()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="size-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">
                        {["pending", "assigned"].includes(schedulingStatus) &&
                        insights.session_datetime
                          ? new Date(
                              insights.session_datetime
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : selectedTime?.display}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Guidelines */}
                <div className="bg-slate-50 rounded-b-2xl p-4 sm:p-6 border border-slate-200/60">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                    Before the session, please ensure:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        <strong>Quiet Environment:</strong> Sit in a quiet,
                        isolated room to avoid distractions.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        <strong>Video On:</strong> Keep your video on throughout
                        the session.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        <strong>Use a Laptop:</strong> Prefer joining via laptop
                        or desktop for a stable experience.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        <strong>Stable Internet:</strong> Ensure a reliable
                        internet connection.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        <strong>Use Headphones:</strong> Use headphones for
                        clear audio.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        <strong>Be On Time:</strong> Join the session
                        punctually.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        <strong>Eliminate Distractions:</strong> Silence phones
                        and avoid multitasking.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        <strong>Be Fully Present:</strong> Stay engaged and open
                        to the process.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {schedulingStatus === "not_scheduled" ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 transition-all duration-200 hover:bg-slate-100 rounded-xl border border-slate-200"
                    >
                      <ArrowLeft className="size-4" />
                      Back to Date & Time
                    </button>
                    <button
                      type="button"
                      onClick={submitScheduleRequest}
                      disabled={isGenerating}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                        isGenerating
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 hover:shadow-xl hover:scale-105"
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="size-5 animate-spin" />
                          <span className="text-sm sm:text-base">
                            Submitting...
                          </span>
                        </>
                      ) : (
                        <>
                          <Video className="size-5" />
                          <span className="text-sm sm:text-base">
                            Send Schedule Request
                          </span>
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : schedulingStatus === "pending" ? (
                <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
                  <div className="text-center">
                    <div className="bg-amber-100 rounded-full p-3 size-16 sm:size-20 mx-auto mb-4 flex items-center justify-center">
                      <Loader2 className="size-8 sm:size-10 text-amber-600 animate-spin" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-800 mb-2">
                      Scheduling Under Process
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base">
                      Your schedule request has been submitted. We&apos;re
                      working on assigning a coach for your session.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-amber-200/50 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="size-2 bg-amber-500 rounded-full animate-pulse" />
                      <p className="text-amber-700 font-semibold text-sm sm:text-base">
                        We&apos;ll notify you once a coach is assigned!
                      </p>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      📅 Your session is scheduled for{" "}
                      {insights.session_datetime
                        ? new Date(
                            insights.session_datetime
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "TBD"}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={redirectToJourney}
                      className="inline-flex items-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg hover:scale-105"
                    >
                      <MapPin className="size-3" />
                      <span className="text-xs">Continue Your Journey</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              ) : schedulingStatus === "assigned" ||
                schedulingStatus === "completed" ? (
                <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
                  <div className="text-center">
                    <div className="bg-emerald-100 rounded-full p-3 size-16 sm:size-20 mx-auto mb-4 flex items-center justify-center">
                      <Users className="size-8 sm:size-10 text-emerald-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-800 mb-2">
                      {schedulingStatus === "completed"
                        ? "Session Completed!"
                        : "Coach Assigned!"}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base">
                      {schedulingStatus === "completed"
                        ? `Your coaching session has been completed. Thank you for participating!${
                            insights.session_datetime
                              ? ` Session was held on ${new Date(
                                  insights.session_datetime
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}.`
                              : ""
                          }`
                        : `Your coach has been assigned. ${
                            insights.meeting_link
                              ? "Meeting link is ready!"
                              : "Meeting link will be available 10 minutes before your session."
                          }`}
                    </p>
                  </div>

                  {insights.session_datetime && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <div className="text-center">
                        <p className="text-slate-700 font-semibold mb-2">
                          {schedulingStatus === "completed"
                            ? "Session Information"
                            : "Session Details"}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {new Date(
                            insights.session_datetime
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {schedulingStatus === "completed" ? (
                          <p className="text-green-600 font-semibold mt-2">
                            Session Completed Successfully
                          </p>
                        ) : timeUntilSession !== null &&
                          timeUntilSession > 0 ? (
                          <p className="text-emerald-600 font-semibold mt-2">
                            {formatTimeRemaining(timeUntilSession)} remaining
                          </p>
                        ) : null}

                        {/* Join Session Button inside Session Details */}
                        {insights.meeting_link && !isSessionCompleted && (
                          <div className="mt-4">
                            {canJoinSession ? (
                              <button
                                type="button"
                                onClick={joinSession}
                                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg hover:scale-105"
                              >
                                <Video className="size-4" />
                                <span className="text-sm">Join Session</span>
                                <ArrowRight className="size-4" />
                              </button>
                            ) : (
                              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                <p className="text-blue-700 font-semibold text-sm">
                                  Meeting link is ready! You can join 10 minutes
                                  before your session.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Session Completed Message */}
                        {isSessionCompleted && (
                          <div className="mt-4">
                            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                              <p className="text-green-700 font-semibold text-sm">
                                Session has been completed. Thank you for
                                participating!
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 sm:space-y-4">
                    {!insights.meeting_link && (
                      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center">
                        <p className="text-amber-700 font-semibold text-sm">
                          Coach is assigned. Meeting link will be available
                          soon.
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={redirectToJourney}
                        className="inline-flex items-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg hover:scale-105"
                      >
                        <MapPin className="size-3" />
                        <span className="text-xs">Continue Your Journey</span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Step 4: Session Completed Page */}
          {step === 4 && (
            <div className="p-4 sm:p-6 lg:p-8 animate-in slide-in-from-bottom duration-500">
              <div className="text-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl p-4 sm:p-6 border border-green-200/60 shadow-sm">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-4 sm:mb-6">
                    Session Completed!
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="size-5 text-green-600" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">
                        {insights.session_datetime
                          ? new Date(
                              insights.session_datetime
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Session Date"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Clock className="size-5 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">
                        {insights.session_datetime
                          ? new Date(
                              insights.session_datetime
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Session Time"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Completion Message */}
                <div className="bg-green-50 rounded-b-2xl p-4 sm:p-6 border border-green-200/60">
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full p-3 size-16 sm:size-20 mx-auto mb-4 flex items-center justify-center">
                      <Users className="size-8 sm:size-10 text-green-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800 mb-2">
                      Thank You for Participating!
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base mb-4">
                      Your coaching session has been completed successfully. We
                      hope you found it valuable and insightful.
                    </p>
                    <p className="text-green-700 font-semibold text-sm mb-4">
                      Session was held on{" "}
                      {insights.session_datetime
                        ? new Date(
                            insights.session_datetime
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "the scheduled date"}
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={redirectToJourney}
                    className="inline-flex items-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg hover:scale-105"
                  >
                    <MapPin className="size-3" />
                    <span className="text-xs">Continue Your Journey</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default MeetingScheduler;
