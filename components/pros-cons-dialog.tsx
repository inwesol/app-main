"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Save,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Heart,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProsConsData {
  pros: string;
  cons: {
    thought: string;
    emotions: string;
    behaviour: string;
  };
}

interface ProsConsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  formId: string;
  onSave?: (data: ProsConsData) => void;
}

export function ProsConsDialog({
  isOpen,
  onClose,
  sessionId,
  formId,
  onSave,
}: ProsConsDialogProps) {
  const [data, setData] = useState<ProsConsData>({
    pros: "",
    cons: {
      thought: "",
      emotions: "",
      behaviour: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${formId}/insights`
      );
      if (response.ok) {
        const result = await response.json();
        const insights = result.insights || {};
        setData({
          pros: insights.pros || "",
          cons: {
            thought: insights.cons?.thought || "",
            emotions: insights.cons?.emotions || "",
            behaviour: insights.cons?.behaviour || "",
          },
        });
      }
    } catch (error) {
      console.error("Error loading pros & cons data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, formId]);

  // Load existing data when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  const updatePros = (value: string) => {
    setData((prev) => ({ ...prev, pros: value }));
  };

  const updateCons = (field: keyof ProsConsData["cons"], value: string) => {
    setData((prev) => ({
      ...prev,
      cons: { ...prev.cons, [field]: value },
    }));
  };

  const saveData = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${formId}/insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            insights: data,
          }),
        }
      );

      if (response.ok) {
        onSave?.(data);
        onClose();
      } else {
        throw new Error("Failed to save pros & cons data");
      }
    } catch (error) {
      console.error("Error saving pros & cons data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="text-xl font-semibold text-slate-800">
            My Pros & Cons
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
        <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">
              Loading your pros & cons...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pros Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ThumbsUp className="size-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Pros</h3>
                </div>
                <Textarea
                  id="pros-textarea"
                  value={data.pros}
                  onChange={(e) => updatePros(e.target.value)}
                  placeholder="What are the positive aspects of your current situation or decision?"
                  className="min-h-[356px] resize-y"
                />
              </div>

              {/* Cons Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ThumbsDown className="size-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Cons</h3>
                </div>

                <div className="space-y-4">
                  {/* Thought */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="size-4 text-slate-600" />
                      <label
                        htmlFor="cons-thought"
                        className="text-sm font-medium text-slate-700"
                      >
                        Thought
                      </label>
                    </div>
                    <Textarea
                      id="cons-thought"
                      value={data.cons.thought}
                      onChange={(e) => updateCons("thought", e.target.value)}
                      placeholder="What thoughts or concerns do you have?"
                      className="min-h-[80px] resize-y"
                    />
                  </div>

                  {/* Emotions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="size-4 text-slate-600" />
                      <label
                        htmlFor="cons-emotions"
                        className="text-sm font-medium text-slate-700"
                      >
                        Emotions
                      </label>
                    </div>
                    <Textarea
                      id="cons-emotions"
                      value={data.cons.emotions}
                      onChange={(e) => updateCons("emotions", e.target.value)}
                      placeholder="What emotions are you experiencing?"
                      className="min-h-[80px] resize-y"
                    />
                  </div>

                  {/* Behaviour */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-slate-600" />
                      <label
                        htmlFor="cons-behaviour"
                        className="text-sm font-medium text-slate-700"
                      >
                        Behaviour
                      </label>
                    </div>
                    <Textarea
                      id="cons-behaviour"
                      value={data.cons.behaviour}
                      onChange={(e) => updateCons("behaviour", e.target.value)}
                      placeholder="How is this affecting your behavior or actions?"
                      className="min-h-[80px] resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={saveData}
              disabled={isSaving}
              className="bg-gradient-to-r from-primary-blue-500 to-primary-green-500 hover:from-primary-blue-600 hover:to-primary-green-600"
            >
              {isSaving ? (
                <>
                  <svg
                    className="mr-2 size-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Pros & Cons
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
