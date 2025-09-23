"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  ArrowRight,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowLeft,
} from "lucide-react";

const MeetingScheduler = () => {
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

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
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
        slots.push({ value: time, display: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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

  const generateMeetingLink = async () => {
    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const meetingId = `meeting_${Date.now()}`;
      const streamLink = `https://getstream.io/video/demos/join/${meetingId}`;
      setGeneratedLink(streamLink);
    } catch (error) {
      console.error("Error generating meeting link:", error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="shrink-0">
              <div className="inline-flex items-center justify-center size-16 sm:size-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
                <Video className="size-8 sm:size-10 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                Schedule Your Meeting
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                Choose your preferred date and time for our coaching session.
                We&apos;ll send you a confirmation email with all the details.
              </p>
            </div>
            {/* Progress Steps */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div
                className={`flex items-center justify-center size-8 sm:size-10 rounded-full border-2 transition-all duration-300 ${
                  step >= 2
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                <Calendar className="size-4 sm:size-5" />
              </div>
              <div
                className={`w-6 sm:w-8 h-1 rounded-full transition-all duration-300 ${
                  step >= 3 ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
              <div
                className={`flex items-center justify-center size-8 sm:size-10 rounded-full border-2 transition-all duration-300 ${
                  step >= 3
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 border-transparent text-white shadow-lg"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                <Check className="size-4 sm:size-5" />
              </div>
            </div>
          </div>
        </div>

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
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => selectTime(slot)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                          selectedTime?.value === slot.value
                            ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-transparent shadow-lg scale-105"
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
                    Confirm Your Meeting
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Calendar className="size-5 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">
                        {formatSelectedDate()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="size-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">
                        {selectedTime?.display}
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

              {!generatedLink ? (
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
                      onClick={generateMeetingLink}
                      disabled={isGenerating}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                        isGenerating
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 hover:shadow-xl hover:scale-105"
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-sm sm:text-base">
                            Creating...
                          </span>
                        </>
                      ) : (
                        <>
                          <Video className="size-5" />
                          <span className="text-sm sm:text-base">
                            Generate Meeting Link
                          </span>
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom duration-500">
                  <div className="text-center">
                    <div className="bg-emerald-100 rounded-full p-3 size-16 sm:size-20 mx-auto mb-4 flex items-center justify-center">
                      <Check className="size-8 sm:size-10 text-emerald-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-800 mb-2">
                      Meeting Link Ready!
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base">
                      Your meeting has been successfully scheduled
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border-2 border-dashed border-slate-200">
                    <p className="font-mono text-xs sm:text-sm text-blue-600 break-all text-center">
                      {generatedLink}
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className={`w-full py-3 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        isCopied
                          ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
                          : "bg-blue-100 text-blue-700 border-2 border-blue-200 hover:bg-blue-200"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-4" />
                          <span className="text-sm sm:text-base">
                            Copied to Clipboard!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          <span className="text-sm sm:text-base">
                            Copy Meeting Link
                          </span>
                        </>
                      )}
                    </button>

                    {/* Journey Redirect Button */}
                    <button
                      type="button"
                      onClick={redirectToJourney}
                      className="w-full py-3 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <MapPin className="size-4" />
                      <span className="text-sm sm:text-base">
                        Continue Your Journey
                      </span>
                      <ArrowRight className="size-4" />
                    </button>

                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-emerald-200/50 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-emerald-700 font-semibold text-sm sm:text-base">
                          Confirmation email will be sent to you soon!
                        </p>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        🎉 You&apos;re all set! We&apos;ll send you a
                        confirmation email with all the meeting details and
                        calendar invite. Looking forward to connecting with you!
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
