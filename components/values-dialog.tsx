"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ValuesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  formId: string;
  onSave?: (values: string[]) => void;
}

export function ValuesDialog({
  isOpen,
  onClose,
  sessionId,
  formId,
  onSave,
}: ValuesDialogProps) {
  const [values, setValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadValues = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${formId}/insights`
      );
      if (response.ok) {
        const data = await response.json();
        setValues(data.values || []);
      }
    } catch (error) {
      console.error("Error loading values:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, formId]);

  // Load existing values when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadValues();
    }
  }, [isOpen, loadValues]);

  const addValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addValue();
    }
  };

  const saveValues = async () => {
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
            values,
          }),
        }
      );

      if (response.ok) {
        onSave?.(values);
        onClose();
      } else {
        throw new Error("Failed to save values");
      }
    } catch (error) {
      console.error("Error saving values:", error);
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
            My Values
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
          {/* Add new value input */}
          <div className="flex gap-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new value..."
              className="flex-1"
            />
            <Button
              onClick={addValue}
              disabled={!newValue.trim() || values.includes(newValue.trim())}
              className="px-4"
            >
              <Plus className="mr-2 size-4" />
              Add
            </Button>
          </div>

          {/* Values list */}
          <div className="space-y-3 overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="py-8 text-center text-slate-500">
                Loading your values...
              </div>
            ) : values.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <p className="text-sm">No values added yet.</p>
                <p className="mt-1 text-xs text-slate-400">
                  Add your first value above to get started.
                </p>
              </div>
            ) : (
              values.map((value, index) => (
                <div
                  key={`${value}-${Math.random()}`}
                  className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 border-slate-200"
                >
                  <span className="font-medium text-slate-700">{value}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeValue(index)}
                    className="p-0 text-red-500 size-8 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={saveValues}
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
                  Save Values
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
