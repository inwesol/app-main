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
} from "lucide-react";

const MeetingScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [step, setStep] = useState(1); // 1: date, 2: time, 3: confirm

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
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

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const selectDate = (day) => {
    if (!day.isAvailable) return;
    setSelectedDate(day.date);
    setTimeout(() => setStep(2), 300);
  };

  const selectTime = (time) => {
    setSelectedTime(time);
    setTimeout(() => setStep(3), 300);
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
    setSelectedTime("");
    setGeneratedLink("");
    setStep(1);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-4 size-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Video className="size-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Schedule Your Meeting
          </h1>
          <p className="text-slate-600">Choose your preferred date and time</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300 ${
                step >= 1
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-slate-300 text-slate-400"
              }`}
            >
              <Calendar className="size-5" />
            </div>
            <div
              className={`size-1 rounded-full transition-all duration-300 ${
                step >= 2 ? "bg-green-500" : "bg-slate-200"
              }`}
            />
            <div
              className={`flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300 ${
                step >= 2
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-slate-300 text-slate-400"
              }`}
            >
              <Clock className="size-5" />
            </div>
            <div
              className={`size-1 rounded-full transition-all duration-300 ${
                step >= 3 ? "bg-blue-500" : "bg-slate-200"
              }`}
            />
            <div
              className={`flex items-center justify-center size-10 rounded-full border-2 transition-all duration-300 ${
                step >= 3
                  ? "bg-gradient-to-r from-green-500 to-blue-500 border-transparent text-white"
                  : "border-slate-300 text-slate-400"
              }`}
            >
              <Check className="size-5" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl overflow-hidden">
          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div className="p-8 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Pick a Date
                </h2>
                <p className="text-slate-600">
                  Select your preferred meeting date
                </p>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <ChevronLeft className="size-5 text-slate-600" />
                </button>

                <h3 className="text-xl font-bold text-slate-800">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h3>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <ChevronRight className="size-5 text-slate-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="h-10 flex items-center justify-center text-sm font-medium text-slate-500"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => selectDate(day)}
                    disabled={!day.isAvailable}
                    className={`h-12 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ${
                      day.isSelected
                        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md scale-105"
                        : day.isToday
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
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
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <div className="p-8 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Select Time
                </h2>
                <p className="text-green-600 font-medium">
                  {formatSelectedDate()}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => selectTime(slot)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                      selectedTime.value === slot.value
                        ? "bg-gradient-to-r from-blue-500 to-green-500 text-white border-transparent shadow-lg scale-105"
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:scale-105"
                    }`}
                  >
                    {slot.display}
                  </button>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
                >
                  ← Back to Date
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation & Generate */}
          {step === 3 && (
            <div className="p-8 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Confirm Your Meeting
                </h2>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <Calendar className="size-5 text-green-600" />
                      <span className="font-medium text-slate-800">
                        {formatSelectedDate()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Clock className="size-5 text-blue-600" />
                      <span className="font-medium text-slate-800">
                        {selectedTime.display}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!generatedLink ? (
                <div className="space-y-4">
                  <button
                    onClick={generateMeetingLink}
                    disabled={isGenerating}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                      isGenerating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:shadow-xl hover:scale-[1.02]"
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Your Meeting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Video className="size-5" />
                        Generate Meeting Link
                        <ArrowRight className="size-5" />
                      </div>
                    )}
                  </button>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
                    >
                      ← Back to Time
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full p-3 size-16 mx-auto mb-4 flex items-center justify-center">
                      <Check className="size-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Meeting Link Ready!
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
                    <p className="font-mono text-sm text-blue-600 break-all text-center">
                      {generatedLink}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={copyToClipboard}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        isCopied
                          ? "bg-green-100 text-green-700 border-2 border-green-200"
                          : "bg-blue-100 text-blue-700 border-2 border-blue-200 hover:bg-blue-200"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-4" />
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          Copy Meeting Link
                        </>
                      )}
                    </button>

                    {/* Journey Redirect Button */}
                    <button
                      onClick={redirectToJourney}
                      className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <MapPin className="size-4" />
                      Continue Your Journey
                      <ArrowRight className="size-4" />
                    </button>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200/50 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-green-700 font-semibold">
                          Confirmation email will be sent to you soon!
                        </p>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
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
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default MeetingScheduler;
