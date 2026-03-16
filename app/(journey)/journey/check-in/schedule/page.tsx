"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Video,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { BreadcrumbUI } from "@/components/breadcrumbUI";
import { getCheckInSessions, saveCheckInSessions } from "@/lib/check-in-sessions";

const NewCheckInSchedulePage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<{
    value: string;
    display: string;
  } | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(2);

  const [timeSlots, setTimeSlots] = useState<
    Array<{ value: string; display: string; isPast: boolean }>
  >([]);
  const [isTimeSlotsLoaded, setIsTimeSlotsLoaded] = useState(false);

  const generateTimeSlots = (date: Date | null) => {
    const slots: Array<{ value: string; display: string; isPast: boolean }> = [];
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const ref = date || now;
    const refOnly = new Date(ref);
    refOnly.setHours(0, 0, 0, 0);
    const isToday = refOnly.getTime() === today.getTime();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let hour = 9; hour <= 22; hour++) {
      for (const minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayTime = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
        const isPast =
          isToday &&
          (hour < currentHour || (hour === currentHour && minute <= currentMinute));
        slots.push({ value: time, display: displayTime, isPast });
      }
    }
    return slots;
  };

  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
    setIsTimeSlotsLoaded(true);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedTime && isTimeSlotsLoaded && timeSlots.length > 0) {
      const nearest = timeSlots.find((s) => !s.isPast);
      if (nearest) setSelectedTime({ value: nearest.value, display: nearest.display });
    }
  }, [selectedTime, timeSlots, isTimeSlotsLoaded]);

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: Array<{
      date: Date;
      day: number;
      isCurrentMonth: boolean;
      isPast: boolean;
      isToday: boolean;
      isSelected: boolean;
      isAvailable: boolean;
    }> = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isSelected =
        !!selectedDate && date.toDateString() === selectedDate.toDateString();
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
  const navigateMonth = (d: number) => {
    const next = new Date(currentMonth);
    next.setMonth(currentMonth.getMonth() + d);
    setCurrentMonth(next);
  };
  const selectDate = (day: (typeof calendarDays)[0]) => {
    if (!day.isAvailable) return;
    setSelectedDate(day.date);
  };
  const selectTime = (slot: { value: string; display: string }) => {
    setSelectedTime(slot);
    if (selectedDate) setTimeout(() => setStep(3), 300);
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const submitScheduleRequest = () => {
    if (!selectedDate || !selectedTime) return;
    setIsGenerating(true);
    const [hours, minutes] = selectedTime.value.split(":").map(Number);
    const sessionDateTime = new Date(selectedDate);
    sessionDateTime.setHours(hours, minutes, 0, 0);

    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `ci-${Date.now()}`;
    const sessions = getCheckInSessions();
    sessions.push({
      id,
      scheduledAt: sessionDateTime.toISOString(),
      scheduleStatus: "completed",
    });
    saveCheckInSessions(sessions);
    setIsGenerating(false);
    router.push("/journey/check-in");
  };

  const getBreadcrumbs = () => [
    { label: "Home", href: "/" },
    { label: "Journey", href: "/journey" },
    { label: "Check-in", href: "/journey/check-in" },
    { label: "Schedule Check-in", isActive: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <BreadcrumbUI items={getBreadcrumbs()} />

        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-2xl overflow-hidden">
          {step === 2 && (
            <div className="p-4 sm:p-6 lg:p-8 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                  Select Date & Time
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Choose your preferred date and time for the check-in session
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-lg font-semibold">
                      <Calendar className="size-4" />
                      {formatSelectedDate() || "Select date"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigateMonth(-1)}
                      className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                    >
                      <ChevronLeft className="size-5 text-slate-600" />
                    </button>
                    <h4 className="text-base font-bold text-slate-800">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h4>
                    <button
                      type="button"
                      onClick={() => navigateMonth(1)}
                      className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                    >
                      <ChevronRight className="size-5 text-slate-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div
                        key={day}
                        className="h-8 flex items-center justify-center text-xs font-semibold text-slate-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => (
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
                                ? "hover:bg-slate-100 text-slate-700"
                                : "text-slate-300 cursor-not-allowed"
                        } ${!day.isCurrentMonth ? "opacity-40" : ""}`}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-lg font-semibold">
                      <Clock className="size-4" />
                      {selectedTime?.display || "Select time"}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-80 p-2 overflow-y-auto">
                    {!isTimeSlotsLoaded
                      ? ["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
                          <div key={k} className="p-3 rounded-lg bg-gray-100 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded" />
                          </div>
                        ))
                      : timeSlots.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => selectTime(slot)}
                            disabled={slot.isPast}
                            className={`p-3 rounded-lg border text-xs font-medium transition-all ${
                              selectedTime?.value === slot.value
                                ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-transparent"
                                : slot.isPast
                                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
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
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 font-semibold"
                  >
                    Continue to Confirmation
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-4 sm:p-6 lg:p-8 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-t-2xl p-4 sm:p-6 border border-slate-200/60">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                    Confirm Your Check-in
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Calendar className="size-5 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-slate-800">{formatSelectedDate()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="size-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-slate-800">{selectedTime?.display}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  <ArrowLeft className="size-4" />
                  Back to Date & Time
                </button>
                <button
                  type="button"
                  onClick={submitScheduleRequest}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Video className="size-5" />
                      Create Check-in Session
                      <ArrowRight className="size-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCheckInSchedulePage;
