"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Plus, Trash2, Save, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StrengthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  formId: string;
  onSave?: (strengths: string[]) => void;
}

export function StrengthDialog({
  isOpen,
  onClose,
  sessionId,
  formId,
  onSave,
}: StrengthDialogProps) {
  const [strengths, setStrengths] = useState<string[]>([]);
  const [newStrength, setNewStrength] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadStrengths = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${formId}/insights`
      );
      if (response.ok) {
        const data = await response.json();
        setStrengths(data.values || []);
      }
    } catch (error) {
      console.error("Error loading strengths:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, formId]);

  // Load existing strengths when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadStrengths();
    }
  }, [isOpen, loadStrengths]);

  const addStrength = () => {
    if (newStrength.trim() && !strengths.includes(newStrength.trim())) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength("");
    }
  };

  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addStrength();
    }
  };

  const saveStrengths = async () => {
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
            values: strengths,
          }),
        }
      );

      if (response.ok) {
        onSave?.(strengths);
        onClose();
      } else {
        throw new Error("Failed to save strengths");
      }
    } catch (error) {
      console.error("Error saving strengths:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="text-xl font-semibold text-slate-800">
            My Strengths
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
        <CardContent className="space-y-6">
          {/* Add new strength input */}
          <div className="flex gap-2">
            <Input
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new strength..."
              className="flex-1"
            />
            <Button
              onClick={addStrength}
              disabled={
                !newStrength.trim() || strengths.includes(newStrength.trim())
              }
              className="px-4"
            >
              <Plus className="mr-2 size-4" />
              Add
            </Button>
          </div>

          {/* Strengths list */}
          <div className="space-y-3 overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="mx-auto mb-2 border-b-2 rounded-full animate-spin size-8 border-primary-blue-600" />
                  <p className="text-sm text-slate-600">Loading strengths...</p>
                </div>
              </div>
            ) : strengths.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Zap className="mx-auto mb-2 size-8 text-slate-300" />
                <p>No strengths added yet. Add your first strength above!</p>
              </div>
            ) : (
              strengths.map((strength, index) => (
                <div
                  key={`strength-${strength
                    .replace(/\s+/g, "-")
                    .toLowerCase()}-${index}`}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                      <Zap className="size-3 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">
                      {strength}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStrength(index)}
                    className="p-1 size-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button
              onClick={saveStrengths}
              disabled={isSaving}
              className="px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isSaving ? (
                <>
                  <svg
                    className="mr-2 text-white animate-spin size-4"
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
                  Save Strengths
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
