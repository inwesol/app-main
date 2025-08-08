"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  Activity,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Session Report Types
export interface FormReport {
  title: string;
  description: string;
  status: string;
  topics: string[];
}

export interface EmailReportRequest {
  sessionName: string | undefined;
  sessionId: number | string;
  // userEmail: string;
  dateCompleted: string;
  schedulerSummary?: string;
  forms: FormReport[] | undefined;
  // activities: string[];
  additionalNotes?: string;
}

export interface EmailReportResponse {
  success: boolean;
  message: string;
  error?: string;
}
interface SessionForm {
  id: string;
  title: string;
  description: string;
  status: string;
  icon: string;
  route: string;
  topics: string[];
  difficulty: string;
}
interface SessionData {
  id: number;
  title: string;
  description: string;
  icon: string;
  forms: SessionForm[];
  status: string;
  topics: string[];
  learningObjectives: string[];
}
export default function SessionReport({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/journey/sessions/${sessionId}`);

        if (res.ok) {
          const data = await res.json();
          setSessionData(data);
          console.log("Data:", data);
        } else {
          setSessionData(null);
        }
      } catch {
        setSessionData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-b-2 border-primary-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Generating...</p>
        </div>
      </div>
    );
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSendEmail = async () => {
    setIsEmailLoading(true);

    try {
      const requestData: EmailReportRequest = {
        sessionName: sessionData?.title,
        sessionId: sessionId,
        // userEmail,
        dateCompleted: formatDate(new Date().toISOString()),
        schedulerSummary: `The scheduler in our psychological well-being application is
                designed to help users build consistent and structured mental
                health routines. It allows users to plan and manage daily
                activities such as meditation, journaling, therapy sessions, and
                medication reminders, all in one place. With features like
                recurring event setup, smart notifications, and mood-based
                suggestions, the scheduler ensures that users stay engaged with
                their wellness journey. It also integrates with progress
                tracking tools to provide insights into habits and emotional
                trends over time. This helps promote accountability,
                self-awareness, and long-term improvement in mental health.`,
        forms: sessionData?.forms,
        // activities,
        additionalNotes: "notes from coach",
      };

      const response = await fetch(
        `/api/journey/sessions/${sessionId}/session-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data: EmailReportResponse = await response.json();

      if (response.ok && data.success) {
        toast.success("Report sent to your registered email!");
        router.push("/journey/");
      } else {
        toast.error(data.error || "Failed to send report.");
      }
    } catch (error) {
      toast.error("Network error or server issue.");
      console.error(error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {sessionData && (
        <>
          <Card className="border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-primary">
                    Session {sessionId} : {sessionData?.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Session #{sessionId} Complete
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary-blue-600" />
                Schedule Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-0 pt-0">
              <p className="text-muted-foreground leading-relaxed">
                The scheduler in our psychological well-being application is
                designed to help users build consistent and structured mental
                health routines. It allows users to plan and manage daily
                activities such as meditation, journaling, therapy sessions, and
                medication reminders, all in one place. With features like
                recurring event setup, smart notifications, and mood-based
                suggestions, the scheduler ensures that users stay engaged with
                their wellness journey. It also integrates with progress
                tracking tools to provide insights into habits and emotional
                trends over time. This helps promote accountability,
                self-awareness, and long-term improvement in mental health.
              </p>
            </CardContent>
          </Card>

          {/* Forms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-primary-green-600" />
                Completed Forms
              </CardTitle>
              <CardDescription>
                Forms you completed during this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionData?.forms.map(
                  (form, index) =>
                    form.status === "completed" && (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-primary-green-50 border border-primary-green-200 rounded-lg"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary-green-600 flex-shrink-0" />
                        <span className="text-sm text-primary-green-800">
                          Completed : {form.title}
                        </span>
                      </div>
                    )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-orange-600" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                From the coach
              </p>
            </CardContent>
          </Card>

          {/* Email CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Get Your Report via Email
                  </h3>
                  <p className="text-muted-foreground">
                    Receive a copy of this detailed report in your inbox for
                    future reference
                  </p>
                </div>

                <Button
                  onClick={handleSendEmail}
                  disabled={isEmailLoading}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  {isEmailLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Report...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Report to My Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
