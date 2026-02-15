"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  X,
  Grid3X3,
  Loader2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "@/components/toast";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface StoryCell {
  id: string;
  content: string;
  createdAt: Date;
}

interface Storyboard {
  id: string;
  name: string;
  cells: StoryCell[];
  createdAt: Date;
}

interface CareerStory6Props {
  className?: string;
}

export default function CareerStory6({ className = "" }: CareerStory6Props) {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  const [availableStoryboards, setAvailableStoryboards] = useState<
    Storyboard[]
  >([]);
  const [selectedStoryboardId, setSelectedStoryboardId] = useState<
    string | null
  >(null);
  const [currentStoryboard, setCurrentStoryboard] = useState<Storyboard | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [hasSelectedStoryboard, setHasSelectedStoryboard] = useState(false);
  const [previewStoryboardId, setPreviewStoryboardId] = useState<string | null>(
    null,
  );
  const currentStoryboardRef = useRef<Storyboard | null>(null);
  const selectedStoryboardIdRef = useRef<string | null>(null);
  const isLoadingDataRef = useRef<boolean>(false);
  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "My Story-5 Activity [Final]");
  }, [sessionId, setQuestionnaireBreadcrumbs]);
  const handleStoryboardPreview = useCallback(
    (storyboardId: string) => {
      const previewStoryboard = availableStoryboards.find(
        (sb) => sb.id === storyboardId,
      );
      if (previewStoryboard) {
        setPreviewStoryboardId(storyboardId);
        setCurrentStoryboard(previewStoryboard);
        setShowDropdown(false);
      }
    },
    [availableStoryboards],
  );

  const handleConfirmSelection = useCallback(() => {
    if (!previewStoryboardId) return;

    const selectedStoryboard = availableStoryboards.find(
      (sb) => sb.id === previewStoryboardId,
    );
    if (selectedStoryboard) {
      setSelectedStoryboardId(previewStoryboardId);
      setHasSelectedStoryboard(true);

      // Update refs
      selectedStoryboardIdRef.current = previewStoryboardId;
      currentStoryboardRef.current = selectedStoryboard;
      setPreviewStoryboardId(null);
    }
  }, [previewStoryboardId, availableStoryboards]);

  // Load data on component mount - only run once when sessionId is available
  useEffect(() => {
    if (!sessionId || isLoadingDataRef.current) return;

    const loadDataOnce = async () => {
      try {
        isLoadingDataRef.current = true;
        setIsLoadingData(true);
        setLoading(true);

        // Load available session-6 storyboards from career-story-5
        const storyboardsResponse = await fetch(
          `/api/journey/sessions/6/a/career-story-5`,
        );

        let parsedStoryboards: Storyboard[] = [];
        if (storyboardsResponse.ok) {
          const storyboardsData = await storyboardsResponse.json();
          parsedStoryboards =
            storyboardsData.storyboards?.map((sb: any) => ({
              ...sb,
              createdAt: new Date(sb.createdAt),
              cells:
                sb.cells?.map((cell: any) => ({
                  ...cell,
                  createdAt: new Date(cell.createdAt),
                })) || [],
            })) || [];
        }

        // Load selected storyboard from career-story-6
        const selectedResponse = await fetch(
          `/api/journey/sessions/${sessionId}/a/career-story-6`,
        );

        let selectedStoryboardId: string | null = null;
        let currentStoryboard: Storyboard | null = null;
        let hasSelected = false;

        if (selectedResponse.ok) {
          const selectedData = await selectedResponse.json();
          selectedStoryboardId = selectedData.selected_storyboard_id;
          hasSelected = !!selectedData.selected_storyboard_id;

          if (selectedData.storyboard_data) {
            currentStoryboard = selectedData.storyboard_data;
          } else if (parsedStoryboards.length > 0) {
            // If no selected storyboard, use the first available one for preview
            const firstStoryboard = parsedStoryboards[0];
            // Don't set selectedStoryboardId here - it's just a preview
            currentStoryboard = firstStoryboard;
          }
        } else if (selectedResponse.status === 404) {
          // No selected storyboard, use first available if any for preview
          hasSelected = false;
          if (parsedStoryboards.length > 0) {
            const firstStoryboard = parsedStoryboards[0];
            // Don't set selectedStoryboardId here - it's just a preview
            currentStoryboard = firstStoryboard;
          }
        }

        // Batch all state updates together to prevent flickering
        setAvailableStoryboards(parsedStoryboards);
        setSelectedStoryboardId(selectedStoryboardId);
        setCurrentStoryboard(currentStoryboard);
        setHasSelectedStoryboard(hasSelected);
        // Initialize preview with the current storyboard if not selected yet
        if (!hasSelected && currentStoryboard) {
          setPreviewStoryboardId(currentStoryboard.id);
        }

        // Update refs
        currentStoryboardRef.current = currentStoryboard;
        selectedStoryboardIdRef.current = selectedStoryboardId;
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          type: "error",
          description: "Error loading storyboards. Please try again.",
        });
      } finally {
        isLoadingDataRef.current = false;
        setLoading(false);
        setIsLoadingData(false);
      }
    };

    loadDataOnce();
  }, [sessionId]);

  // Keep refs in sync with state changes
  useEffect(() => {
    currentStoryboardRef.current = currentStoryboard;
  }, [currentStoryboard]);

  useEffect(() => {
    selectedStoryboardIdRef.current = selectedStoryboardId;
  }, [selectedStoryboardId]);

  const saveStoryboard = useCallback(async () => {
    if (!currentStoryboard || !selectedStoryboardId) return;

    try {
      setSaving(true);
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/career-story-6`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selected_storyboard_id: selectedStoryboardId,
            storyboard_data: currentStoryboard,
          }),
        },
      );

      if (response.ok) {
        toast({
          type: "success",
          description: "Your storyboard has been saved successfully.",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.errors ? "Validation failed" : "Failed to save",
        );
      }
    } catch (error) {
      console.error("Error saving storyboard:", error);
      toast({
        type: "error",
        description: "Please try again. Check your internet connection.",
      });
    } finally {
      setSaving(false);
    }
  }, [sessionId, currentStoryboard, selectedStoryboardId]);

  const addCell = useCallback(() => {
    if (!currentStoryboard) return;

    const newCell: StoryCell = {
      id: `cell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: "",
      createdAt: new Date(),
    };

    setCurrentStoryboard((prev) => {
      if (!prev) return null;
      const updatedStoryboard = {
        ...prev,
        cells: [...prev.cells, newCell],
      };
      // Update ref immediately
      currentStoryboardRef.current = updatedStoryboard;
      return updatedStoryboard;
    });
  }, [currentStoryboard]);

  const updateCellContent = useCallback(
    (cellId: string, content: string) => {
      if (!currentStoryboard) return;

      const cell = currentStoryboard.cells.find((cell) => cell.id === cellId);
      if (!cell || cell.content === content) return;

      setCurrentStoryboard((prev) => {
        if (!prev) return null;
        const updatedStoryboard = {
          ...prev,
          cells: prev.cells.map((cell) =>
            cell.id === cellId ? { ...cell, content } : cell,
          ),
        };
        // Update ref immediately
        currentStoryboardRef.current = updatedStoryboard;
        return updatedStoryboard;
      });
    },
    [currentStoryboard],
  );

  const deleteCell = useCallback(
    (cellId: string) => {
      if (!currentStoryboard) return;

      setCurrentStoryboard((prev) => {
        if (!prev) return null;
        const updatedStoryboard = {
          ...prev,
          cells: prev.cells.filter((cell) => cell.id !== cellId),
        };
        // Update ref immediately
        currentStoryboardRef.current = updatedStoryboard;
        return updatedStoryboard;
      });
    },
    [currentStoryboard],
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Memoize current storyboard to prevent unnecessary re-renders
  const memoizedCurrentStoryboard = useMemo(
    () => currentStoryboard,
    [currentStoryboard],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 rounded-full animate-spin size-12 border-primary-blue-600" />
          <p className="text-sm text-slate-600 sm:text-base">
            Loading your storyboards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <JourneyBreadcrumbLayout>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 shadow-lg bg-gradient-to-br from-primary-blue-500 to-primary-green-500 rounded-2xl">
                <Grid3X3 className="text-white size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text">
                  Story Boarding
                </h1>
                <p className="text-slate-700">
                  Finalize your storyboard with clear, detailed steps and get
                  ready to put your plan into action to move toward your goal.
                </p>
              </div>
            </div>
          </div>

          {/* Storyboard Selection and Grid */}
          {memoizedCurrentStoryboard && (
            <Card className="overflow-hidden border shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-2xl">
              {!hasSelectedStoryboard && (
                <CardHeader className="border-b bg-gradient-to-r from-primary-blue-50/80 to-primary-green-50/80 border-primary-blue-100/30">
                  <div className="space-y-4">
                    {/* Storyboard Selection Dropdown - Only show if not selected yet */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-primary-blue-700">
                          Select Storyboard:
                        </span>
                        <div className="relative dropdown-container">
                          <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 hover:from-primary-blue-600 hover:to-primary-green-600 rounded-lg shadow-md hover:shadow-lg min-w-[200px] justify-between"
                          >
                            <span>{memoizedCurrentStoryboard.name}</span>
                            <ChevronDown
                              className={`size-4 transition-transform duration-200 ${
                                showDropdown ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {showDropdown && (
                            <div className="absolute top-full left-0 z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {availableStoryboards.map((storyboard) => (
                                <button
                                  key={storyboard.id}
                                  type="button"
                                  onClick={() =>
                                    handleStoryboardPreview(storyboard.id)
                                  }
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors duration-200 ${
                                    previewStoryboardId === storyboard.id
                                      ? "bg-primary-blue-50 text-primary-blue-700 font-medium"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {storyboard.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={handleConfirmSelection}
                          disabled={!previewStoryboardId}
                          className="px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-gradient-to-r from-primary-green-500 to-primary-green-600 hover:from-primary-green-600 hover:to-primary-green-700 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              )}
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {memoizedCurrentStoryboard.cells.map((cell) => (
                    <div
                      key={cell.id}
                      className="relative group p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-md transition-all duration-200"
                    >
                      <Textarea
                        value={cell.content}
                        onChange={(e) =>
                          updateCellContent(cell.id, e.target.value)
                        }
                        placeholder="Enter your story element..."
                        className="min-h-[150px] resize-y border-none bg-transparent focus:ring-0 focus:outline-none text-sm"
                        rows={5}
                      />

                      {/* Delete Cell Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteCell(cell.id)}
                        className="absolute size-6 -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-white hover:text-white bg-red-500 hover:bg-red-600 rounded-full"
                      >
                        <X className="size-5" />
                      </Button>
                    </div>
                  ))}

                  {/* Add Cell Button */}
                  <button
                    type="button"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-blue-400 hover:bg-gradient-to-br hover:from-primary-blue-50/80 hover:to-primary-green-50/80 transition-all duration-300 group cursor-pointer min-h-[150px]"
                    onClick={addCell}
                  >
                    <div className="p-4 mb-3 bg-gradient-to-br from-primary-blue-100 to-primary-green-100 rounded-full group-hover:from-primary-blue-200 group-hover:to-primary-green-200 group-hover:scale-110 transition-all duration-300">
                      <Plus className="size-8 text-primary-blue-600 group-hover:text-primary-blue-700" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600 group-hover:text-primary-blue-700 transition-colors duration-300">
                      Add New Cell
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button - Only show after confirming storyboard selection */}
          {hasSelectedStoryboard && (
            <div className="flex justify-end mt-8">
              <Button
                onClick={saveStoryboard}
                disabled={saving}
                className="relative px-10 py-3 font-semibold text-white transition-all duration-300 shadow-xl group bg-gradient-to-r from-primary-green-500 to-primary-blue-500 rounded-xl hover:from-primary-green-600 hover:to-primary-blue-600 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-r from-primary-green-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50" />
                <div className="relative flex items-center gap-3">
                  {saving ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>Saving Progress...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Story Board</span>
                      <ArrowRight className="transition-transform duration-200 size-5 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </Button>
            </div>
          )}
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
