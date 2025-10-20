"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Heart,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Activity,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [isLoading, setIsLoading] = useState(false);

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

  // Load existing data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        loadValues(),
        loadStrengths(),
        loadProsCons(),
        loadRewrittenStory(),
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, loadValues, loadStrengths, loadProsCons, loadRewrittenStory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Journey Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-0 size-8 hover:bg-slate-100"
          >
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">
              Loading your insights...
            </div>
          ) : (
            <>
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
                      Complete the career story activity to add your values.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {values.map((value) => (
                      <div
                        key={value}
                        className="flex items-center gap-2 p-2 border rounded-md bg-primary-green-50 border-primary-green-200"
                      >
                        <Heart className="size-3 text-primary-green-600" />
                        <span className="text-sm font-medium text-primary-green-800">
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
                      Complete the career story-2 activity to add your
                      strengths.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {strengths.map((strength) => (
                      <div
                        key={strength}
                        className="flex items-center gap-2 p-2 border rounded-md bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                      >
                        <div className="p-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                          <Zap className="size-2.5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
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
                      Complete the career story-4 activity to add your rewritten
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
