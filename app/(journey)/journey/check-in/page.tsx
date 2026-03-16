"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Calendar,
  Clock,
  Video,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FilePen,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Header from "@/components/form-components/header";
import { BreadcrumbUI } from "@/components/breadcrumbUI";
import { useRouter } from "next/navigation";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  getCheckInSessions,
  saveCheckInSessions,
  type CheckInSessionItem,
} from "@/lib/check-in-sessions";

const CHECK_IN_FORMS = [
  {
    id: "schedule",
    title: "Schedule",
    description: "View or update your scheduled check-in date and time",
    icon: Calendar,
    routeKey: "schedule" as const,
    statusKey: "scheduleStatus" as const,
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Share feedback after your check-in session",
    icon: FilePen,
    routeKey: "feedback" as const,
    statusKey: "feedbackStatus" as const,
  },
  {
    id: "report",
    title: "Report",
    description: "View your check-in session summary",
    icon: FileText,
    routeKey: "report" as const,
    statusKey: "reportStatus" as const,
  },
];

function CheckInFormCard({
  form,
  session,
  basePath,
}: {
  form: (typeof CHECK_IN_FORMS)[0];
  session: CheckInSessionItem;
  basePath: string;
}) {
  const router = useRouter();
  const FormIcon = form.icon;
  const isCompleted = !!session[form.statusKey];
  const isUnlocked =
    form.id === "schedule" ||
    (form.id === "feedback" && session.scheduleStatus) ||
    (form.id === "report" && session.scheduleStatus && session.feedbackStatus);

  const cardStyles = isCompleted
    ? "bg-gradient-to-br from-primary-green-50 via-emerald-50 to-green-100 border-primary-green-300 hover:shadow-xl"
    : isUnlocked
      ? "bg-gradient-to-br from-primary-blue-50 via-cyan-50 to-blue-100 border-primary-blue-300 hover:shadow-xl"
      : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border-gray-300 opacity-75";

  const iconBg = isCompleted
    ? "bg-gradient-to-br from-primary-green-500 to-emerald-600 shadow-lg"
    : isUnlocked
      ? "bg-gradient-to-br from-primary-blue-500 to-cyan-600 shadow-lg"
      : "bg-gray-400 to-gray-500";

  const handleClick = () => {
    if (!isUnlocked) return;
    router.push(`${basePath}/${form.routeKey}`);
  };

  return (
    <Card
      className={`group relative overflow-hidden flex flex-col border-2 shadow-lg transition-all duration-300 rounded-xl ${cardStyles} ${
        isUnlocked ? "cursor-pointer hover:scale-[1.02]" : "cursor-not-allowed"
      }`}
      onClick={handleClick}
    >
      <div
        className={`h-1 w-full ${
          isCompleted
            ? "bg-gradient-to-r from-primary-green-500 to-emerald-500"
            : isUnlocked
              ? "bg-gradient-to-r from-primary-blue-500 to-cyan-500"
              : "bg-gray-400"
        }`}
      />
      <CardHeader className="px-3 pt-3 pb-2">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconBg}`}
          >
            {isCompleted ? (
              <CheckCircle className="text-white size-4" />
            ) : (
              <FormIcon className="text-white size-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-bold leading-tight mb-1 ${
                    isCompleted
                      ? "text-primary-green-800"
                      : isUnlocked
                        ? "text-primary-blue-800"
                        : "text-gray-500"
                  }`}
                >
                  {form.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isUnlocked ? "text-slate-600" : "text-gray-400"
                  }`}
                >
                  {form.description}
                </p>
              </div>
              <Badge
                className={`text-xs font-medium px-2 py-1 shrink-0 ${
                  isCompleted
                    ? "bg-primary-green-100 text-primary-green-800 border-primary-green-300"
                    : isUnlocked
                      ? "bg-primary-blue-100 text-primary-blue-800 border-primary-blue-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                }`}
              >
                {isCompleted ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    Done
                  </span>
                ) : isUnlocked ? (
                  <span className="flex items-center gap-1">
                    <div className="size-1.5 rounded-full bg-primary-blue-500 animate-pulse" />
                    Start
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <div className="size-1.5 rounded-full bg-yellow-500" />
                    Locked
                  </span>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pt-0 pb-3">
        <div className="flex justify-end mt-auto">
          <Button
            disabled={!isUnlocked}
            size="sm"
            className={`text-xs font-semibold h-7 px-3 ${
              isCompleted
                ? "bg-gradient-to-r from-primary-green-500 to-emerald-500 hover:from-primary-green-600 hover:to-emerald-600"
                : isUnlocked
                  ? "bg-gradient-to-r from-primary-blue-500 to-cyan-500 hover:from-primary-blue-600 hover:to-cyan-600"
                  : "bg-gray-300 text-gray-500"
            } text-white border-0`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <span className="flex items-center gap-1">
              {isCompleted ? "Review" : isUnlocked ? "Start" : "Locked"}
              <ChevronRight className="size-3 shrink-0" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function generateTimeSlots(date: Date | null) {
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
      const isPast = isToday && (hour < currentHour || (hour === currentHour && minute <= currentMinute));
      slots.push({ value: time, display: displayTime, isPast });
    }
  }
  return slots;
}

function getCalendarDays(
  currentMonth: Date,
  selectedDate: Date | null
) {
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
    const isSelected = !!selectedDate && date.toDateString() === selectedDate.toDateString();
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
}

const CheckInPage = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [checkInSessions, setCheckInSessions] = useState<CheckInSessionItem[]>([]);

  // Inline scheduling state (replaces navigation to /check-in/schedule)
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleStep, setScheduleStep] = useState<2 | 3>(2);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<{ value: string; display: string } | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeSlots, setTimeSlots] = useState<Array<{ value: string; display: string; isPast: boolean }>>([]);
  const [isTimeSlotsLoaded, setIsTimeSlotsLoaded] = useState(false);

  useEffect(() => {
    setCheckInSessions(getCheckInSessions());
  }, []);

  useEffect(() => {
    const onFocus = () => setCheckInSessions(getCheckInSessions());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    if (isScheduling) {
      setTimeSlots(generateTimeSlots(selectedDate));
      setIsTimeSlotsLoaded(true);
    }
  }, [isScheduling, selectedDate]);

  useEffect(() => {
    if (!isScheduling) return;
    if (!selectedTime && isTimeSlotsLoaded && timeSlots.length > 0) {
      const nearest = timeSlots.find((s) => !s.isPast);
      if (nearest) setSelectedTime({ value: nearest.value, display: nearest.display });
    }
  }, [isScheduling, selectedTime, timeSlots, isTimeSlotsLoaded]);

  const calendarDays = getCalendarDays(currentMonth, selectedDate);
  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmitSchedule = () => {
    if (!selectedDate || !selectedTime) return;
    setIsGenerating(true);
    const [hours, minutes] = selectedTime.value.split(":").map(Number);
    const sessionDateTime = new Date(selectedDate);
    sessionDateTime.setHours(hours, minutes, 0, 0);
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ci-${Date.now()}`;
    const sessions = getCheckInSessions();
    sessions.push({ id, scheduledAt: sessionDateTime.toISOString(), scheduleStatus: "completed" });
    saveCheckInSessions(sessions);
    setCheckInSessions(getCheckInSessions());
    setIsScheduling(false);
    setScheduleStep(2);
    setIsGenerating(false);
  };

  const handleCancelSchedule = () => {
    setIsScheduling(false);
    setScheduleStep(2);
  };

  if (isScheduling) {
    return (
      <div className="p-2">
        {isMobile ? <SidebarToggle /> : <div />}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <BreadcrumbUI
            items={[
              { label: "Home", href: "/" },
              { label: "Journey", href: "/journey" },
              { label: "Check-in", isActive: true },
            ]}
          />
          <Header
            headerIcon={CalendarCheck}
            headerText="Check-in Sessions"
            headerDescription="Book a new check-in session"
          />
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-2xl overflow-hidden">
            {scheduleStep === 2 && (
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
                        onClick={() => {
                          const next = new Date(currentMonth);
                          next.setMonth(currentMonth.getMonth() - 1);
                          setCurrentMonth(next);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                      >
                        <ChevronLeft className="size-5 text-slate-600" />
                      </button>
                      <h4 className="text-base font-bold text-slate-800">
                        {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const next = new Date(currentMonth);
                          next.setMonth(currentMonth.getMonth() + 1);
                          setCurrentMonth(next);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                      >
                        <ChevronRight className="size-5 text-slate-600" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-slate-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day) => (
                        <button
                          key={day.date.toISOString()}
                          type="button"
                          onClick={() => day.isAvailable && setSelectedDate(day.date)}
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
                              onClick={() => {
                                setSelectedTime({ value: slot.value, display: slot.display });
                                if (selectedDate) setTimeout(() => setScheduleStep(3), 300);
                              }}
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
                <div className="flex justify-between mt-6 sm:mt-8">
                  <Button type="button" variant="outline" onClick={handleCancelSchedule}>
                    <ArrowLeft className="size-4 mr-2" />
                    Cancel
                  </Button>
                  {selectedDate && selectedTime && (
                    <Button onClick={() => setScheduleStep(3)}>
                      Continue to Confirmation
                      <ArrowRight className="size-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}
            {scheduleStep === 3 && (
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
                  <Button type="button" variant="outline" onClick={() => setScheduleStep(2)}>
                    <ArrowLeft className="size-4 mr-2" />
                    Back to Date & Time
                  </Button>
                  <Button
                    onClick={handleSubmitSchedule}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2"
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
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (checkInSessions.length > 0) {
    return (
      <div className="p-2">
        {isMobile ? <SidebarToggle /> : <div />}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <BreadcrumbUI
            items={[
              { label: "Home", href: "/" },
              { label: "Journey", href: "/journey" },
              { label: "Check-in", isActive: true },
            ]}
          />
          <Header
            headerIcon={CalendarCheck}
            headerText="Check-in Sessions"
            headerDescription="View and manage your check-in sessions"
          />
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button onClick={() => setIsScheduling(true)}>
                Create Check In Session
              </Button>
            </div>
            {checkInSessions.map((session, index) => {
              const scheduledDate = new Date(session.scheduledAt);
              const dateLabel = scheduledDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const basePath = `/journey/check-in/${session.id}`;
              return (
                <Card
                  key={session.id}
                  className="overflow-hidden border-2 border-slate-200/60 rounded-xl shadow-md bg-white"
                >
                  <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-primary-green-50/50 to-primary-blue-50/50">
                    <h3 className="text-lg font-bold text-slate-800">
                      Check-in {index + 1}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Scheduled for {dateLabel}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {CHECK_IN_FORMS.map((form) => (
                        <CheckInFormCard
                          key={form.id}
                          form={form}
                          session={session}
                          basePath={basePath}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {isMobile ? <SidebarToggle /> : <div />}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <BreadcrumbUI
          items={[
            { label: "Home", href: "/" },
            { label: "Journey", href: "/journey" },
            { label: "Check-in", isActive: true },
          ]}
        />
        <Header
          headerIcon={CalendarCheck}
          headerText="Check-in Sessions"
          headerDescription="Book and manage check-in sessions to stay on track"
        />
        <Empty className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarCheck className="size-6 text-slate-500" />
            </EmptyMedia>
            <EmptyTitle>No check-in sessions yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t booked any check-in sessions. Book one to stay on
              track and keep your momentum going after completing your journey.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={() => setIsScheduling(true)}>
                Book Check In Session
              </Button>
              <Button
                onClick={() => router.push("/journey")}
                variant="outline"
                className="text-slate-600"
              >
                Back to Journey
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
};

export default CheckInPage;
