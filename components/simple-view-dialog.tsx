"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Heart,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Activity,
  BookOpen,
  User,
  MapPin,
  Briefcase,
  Award,
  MessageSquare,
  Sparkles,
  Grid3X3,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import html2pdf from "html2pdf.js";

interface SimpleViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProsConsData {
  pros: string;
  cons: {
    thought: string;
    emotions: string;
    behaviour: string;
  };
}

interface SummaryPortraitData {
  selfStatement: string;
  settingStatement: string;
  plotDescription: string;
  plotActivities: string;
  ableToBeStatement: string;
  placesWhereStatement: string;
  soThatStatement: string;
  mottoStatement: string;
}

interface StoryCell {
  id: string;
  content: string;
  createdAt: Date | string;
}

interface Storyboard {
  id: string;
  name: string;
  cells: StoryCell[];
  createdAt: Date | string;
}

export function SimpleViewDialog({ isOpen, onClose }: SimpleViewDialogProps) {
  const [values, setValues] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [prosCons, setProsCons] = useState<ProsConsData>({
    pros: "",
    cons: {
      thought: "",
      emotions: "",
      behaviour: "",
    },
  });
  const [rewrittenStory, setRewrittenStory] = useState<string>("");
  const [summaryPortrait, setSummaryPortrait] = useState<SummaryPortraitData>({
    selfStatement: "",
    settingStatement: "",
    plotDescription: "",
    plotActivities: "",
    ableToBeStatement: "",
    placesWhereStatement: "",
    soThatStatement: "",
    mottoStatement: "",
  });
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const loadValues = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/journey/sessions/1/a/career-story-1/insights`
      );
      if (response.ok) {
        const data = await response.json();
        setValues(data.insights?.values || []);
      }
    } catch (error) {
      console.error("Error loading values:", error);
    }
  }, []);

  const loadStrengths = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/journey/sessions/3/a/career-story-2/insights`
      );
      if (response.ok) {
        const data = await response.json();
        setStrengths(data.insights?.values || []);
      }
    } catch (error) {
      console.error("Error loading strengths:", error);
    }
  }, []);

  const loadProsCons = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/journey/sessions/2/a/my-life-collage/insights`
      );
      if (response.ok) {
        const data = await response.json();
        const insights = data.insights || {};
        setProsCons({
          pros: insights.pros || "",
          cons: {
            thought: insights.cons?.thought || "",
            emotions: insights.cons?.emotions || "",
            behaviour: insights.cons?.behaviour || "",
          },
        });
      }
    } catch (error) {
      console.error("Error loading pros & cons:", error);
    }
  }, []);

  const loadRewrittenStory = useCallback(async () => {
    try {
      const response = await fetch(`/api/journey/sessions/5/a/career-story-4`);
      if (response.ok) {
        const data = await response.json();
        setRewrittenStory(data.rewrittenStory || "");
      }
    } catch (error) {
      console.error("Error loading rewritten story:", error);
    }
  }, []);

  const loadSummaryPortrait = useCallback(async () => {
    try {
      const response = await fetch(`/api/journey/sessions/4/a/career-story-3`);
      if (response.ok) {
        const data = await response.json();
        setSummaryPortrait({
          selfStatement: data.selfStatement || "",
          settingStatement: data.settingStatement || "",
          plotDescription: data.plotDescription || "",
          plotActivities: data.plotActivities || "",
          ableToBeStatement: data.ableToBeStatement || "",
          placesWhereStatement: data.placesWhereStatement || "",
          soThatStatement: data.soThatStatement || "",
          mottoStatement: data.mottoStatement || "",
        });
      }
    } catch (error) {
      console.error("Error loading summary portrait:", error);
    }
  }, []);

  const loadStoryboard = useCallback(async () => {
    try {
      const response = await fetch(`/api/journey/sessions/7/a/career-story-6`);
      if (response.ok) {
        const data = await response.json();
        if (data.storyboard_data) {
          // Parse dates if they come as strings
          const parsedStoryboard: Storyboard = {
            ...data.storyboard_data,
            createdAt: data.storyboard_data.createdAt
              ? new Date(data.storyboard_data.createdAt)
              : new Date(),
            cells: (data.storyboard_data.cells || []).map((cell: any) => ({
              ...cell,
              createdAt: cell.createdAt ? new Date(cell.createdAt) : new Date(),
            })),
          };
          setStoryboard(parsedStoryboard);
        }
      }
    } catch (error) {
      console.error("Error loading storyboard:", error);
    }
  }, []);

  // Load existing data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        loadValues(),
        loadStrengths(),
        loadProsCons(),
        loadRewrittenStory(),
        loadSummaryPortrait(),
        loadStoryboard(),
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [
    isOpen,
    loadValues,
    loadStrengths,
    loadProsCons,
    loadRewrittenStory,
    loadSummaryPortrait,
    loadStoryboard,
  ]);

  const handleDownloadPDF = useCallback(() => {
    if (!cardRef.current) return;

    const cardElement = cardRef.current;
    const contentElement = document.getElementById('journey-insights-content');
    
    if (!contentElement) return;

    // Store original styles
    const originalCardMaxHeight = cardElement.style.maxHeight;
    const originalCardOverflow = cardElement.style.overflow;
    const originalContentMaxHeight = contentElement.style.maxHeight;
    const originalContentOverflow = contentElement.style.overflow;
    
    // Temporarily remove height constraints to show full content
    cardElement.style.maxHeight = 'none';
    cardElement.style.overflow = 'visible';
    contentElement.style.maxHeight = 'none';
    contentElement.style.overflow = 'visible';

    // Wait a moment for styles to apply and content to expand
    setTimeout(() => {
      // Configure html2pdf options - matching the reference snippet
      const opt = {
        margin: 10,
        filename: 'your-journey-insights.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          scrollY: 0,
          scrollX: 0,
          windowHeight: contentElement.scrollHeight, // KEY: Use full scroll height
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const
        },
      };

      // Generate PDF
      html2pdf()
        .set(opt as any)
        .from(contentElement)
        .save()
        .then(() => {
          // Restore original styles
          cardElement.style.maxHeight = originalCardMaxHeight;
          cardElement.style.overflow = originalCardOverflow;
          contentElement.style.maxHeight = originalContentMaxHeight;
          contentElement.style.overflow = originalContentOverflow;
        })
        .catch((error) => {
          console.error('Error generating PDF:', error);
          // Restore original styles even on error
          cardElement.style.maxHeight = originalCardMaxHeight;
          cardElement.style.overflow = originalCardOverflow;
          contentElement.style.maxHeight = originalContentMaxHeight;
          contentElement.style.overflow = originalContentOverflow;
        });
    }, 100);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card ref={cardRef} className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-primary-green-50 to-primary-blue-50 rounded-t-lg mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Your Journey Insights
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            >
              <Download className="size-4" />
              <span>Download Insights</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-0 size-8 hover:bg-slate-100"
            >
              <X className="size-4" />
            </Button>
          </div>
          </CardHeader>
        </div>
        <CardContent id="journey-insights-content" className="space-y-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">
              Loading your insights...
            </div>
          ) : (
            <>
              {/* My Summary Portrait Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Sparkles className="size-5 text-indigo-600" />
                  My Summary Portrait
                </h3>
                {!summaryPortrait.selfStatement &&
                !summaryPortrait.settingStatement &&
                !summaryPortrait.plotDescription &&
                !summaryPortrait.plotActivities &&
                !summaryPortrait.ableToBeStatement &&
                !summaryPortrait.placesWhereStatement &&
                !summaryPortrait.soThatStatement &&
                !summaryPortrait.mottoStatement ? (
                  <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm">
                      No summary portrait available yet.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Complete the My Story-3 activity to add your summary
                      portrait.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ gridAutoRows: 'min-content' }}>
                    {/* Motto Statement - Large featured card spanning 2 columns */}
                    {summaryPortrait.mottoStatement && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="size-6 text-white shrink-0" />
                            <h4 className="text-lg font-bold text-white">
                              Motto Statement
                            </h4>
                          </div>
                          <p className="text-sm text-white/95 leading-relaxed whitespace-pre-wrap">
                            {summaryPortrait.mottoStatement}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Self Statement - Medium card */}
                    {summaryPortrait.selfStatement && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="size-5 text-blue-600 shrink-0" />
                            <h5 className="text-sm font-semibold text-blue-800">
                              Self Statement
                            </h5>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {summaryPortrait.selfStatement}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Setting Statement - Small card */}
                    {summaryPortrait.settingStatement && (
                      <Card className="md:col-span-1 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="size-4 text-emerald-600 shrink-0" />
                            <h5 className="text-xs font-semibold text-emerald-800">
                              Setting
                            </h5>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {summaryPortrait.settingStatement}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Plot Description - Small card */}
                    {summaryPortrait.plotDescription && (
                      <Card className="md:col-span-1 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="size-4 text-amber-600 shrink-0" />
                            <h5 className="text-xs font-semibold text-amber-800">
                              Plot Description
                            </h5>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {summaryPortrait.plotDescription}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Plot Activities - Medium card spanning 2 columns */}
                    {summaryPortrait.plotActivities && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="size-5 text-rose-600 shrink-0" />
                            <h5 className="text-sm font-semibold text-rose-800">
                              Plot Activities
                            </h5>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {summaryPortrait.plotActivities}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Able To Be Statement - Small card */}
                    {summaryPortrait.ableToBeStatement && (
                      <Card className="md:col-span-1 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="size-4 text-violet-600 shrink-0" />
                            <h5 className="text-xs font-semibold text-violet-800">
                              Able To Be
                            </h5>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {summaryPortrait.ableToBeStatement}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Places Where Statement - Small card */}
                    {summaryPortrait.placesWhereStatement && (
                      <Card className="md:col-span-1 bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="size-4 text-sky-600 shrink-0" />
                            <h5 className="text-xs font-semibold text-sky-800">
                              Places Where
                            </h5>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {summaryPortrait.placesWhereStatement}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* So That Statement - Medium card spanning 2 columns */}
                    {summaryPortrait.soThatStatement && (
                      <Card className="md:col-span-2 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="size-5 text-teal-600 shrink-0" />
                            <h5 className="text-sm font-semibold text-teal-800">
                              So That
                            </h5>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {summaryPortrait.soThatStatement}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>

              {/* My Story Board Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Grid3X3 className="size-5 text-indigo-600" />
                  My Story Board
                </h3>
                {!storyboard || !storyboard.cells || storyboard.cells.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm">No storyboard available yet.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Complete the My Story-5 Final activity in session 8 to add your storyboard.
                    </p>
                  </div>
                ) : (
                  <Card className="bg-slate-50 border border-slate-100 shadow-lg">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {storyboard.cells.map((cell: StoryCell) => (
                          <Card
                            key={cell.id}
                            className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                          >
                            <CardContent className="p-4">
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                                {cell.content || (
                                  <span className="text-slate-400 italic">
                                    Empty cell
                                  </span>
                                )}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* My Values Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Heart className="size-5 text-primary-green-600" />
                  My Values
                </h3>
                {values.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm">No values available yet.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Complete the My Story-1 activity to add your values.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {values.map((value) => (
                      <div
                        key={value}
                        className="flex items-center justify-center gap-2 p-2 border rounded-md bg-primary-green-50 border-primary-green-200"
                      >
                        {/* <Heart className="size-3 text-primary-green-600" /> */}
                        <span className="text-base font-medium text-slate-700">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* My Strengths Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="size-5 text-purple-600" />
                  My Strengths
                </h3>
                {strengths.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm">No strengths available yet.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Complete the My Story-2 activity to add your strengths.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {strengths.map((strength) => (
                      <div
                        key={strength}
                        className="flex items-center justify-center gap-2 p-2 border rounded-md bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                      >
                        {/* <div className="p-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                          <Zap className="size-2.5 text-white" />
                        </div> */}
                        <span className="text-base font-medium text-slate-700">
                          {strength}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* My Pros & Cons Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <ThumbsUp className="size-5 text-green-600" />
                  My Pros & Cons
                </h3>
                {!prosCons.pros &&
                !prosCons.cons.thought &&
                !prosCons.cons.emotions &&
                !prosCons.cons.behaviour ? (
                  <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm">No pros & cons available yet.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Complete the life collage activity to add your pros &
                      cons.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pros */}
                    {prosCons.pros && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="size-4 text-green-600" />
                          <span className="text-sm font-medium text-slate-700">
                            Pros
                          </span>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">
                            {prosCons.pros}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Cons */}
                    {(prosCons.cons.thought ||
                      prosCons.cons.emotions ||
                      prosCons.cons.behaviour) && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="size-4 text-red-600" />
                          <span className="text-sm font-medium text-slate-700">
                            Cons
                          </span>
                        </div>

                        {prosCons.cons.thought && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Brain className="size-3 text-slate-600" />
                              <span className="text-sm font-medium text-slate-600">
                                Thought
                              </span>
                            </div>
                            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                {prosCons.cons.thought}
                              </p>
                            </div>
                          </div>
                        )}

                        {prosCons.cons.emotions && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Heart className="size-3 text-slate-600" />
                              <span className="text-sm font-medium text-slate-600">
                                Emotions
                              </span>
                            </div>
                            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                {prosCons.cons.emotions}
                              </p>
                            </div>
                          </div>
                        )}

                        {prosCons.cons.behaviour && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Activity className="size-3 text-slate-600" />
                              <span className="text-sm font-medium text-slate-600">
                                Behaviour
                              </span>
                            </div>
                            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                {prosCons.cons.behaviour}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* My Rewritten Story Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <BookOpen className="size-5 text-blue-600" />
                  My Rewritten Story
                </h3>
                {!rewrittenStory ? (
                  <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm">No rewritten story available yet.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Complete the My Story-4 activity to add your rewritten
                      story.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                      {rewrittenStory}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
