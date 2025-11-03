"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  X,
  Grid3X3,
  Loader2,
  Edit3,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
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

interface CareerStory5Props {
  className?: string;
}

export default function CareerStory5({ className = "" }: CareerStory5Props) {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [currentStoryboardId, setCurrentStoryboardId] = useState<string | null>(
    null
  );
  const [editingStoryboardName, setEditingStoryboardName] = useState<
    string | null
  >(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [nextStoryboardNumber, setNextStoryboardNumber] = useState(1);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "My Story-5 Activity");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  const createDefaultCells = useCallback((): StoryCell[] => {
    return Array.from({ length: 4 }, (_, index) => ({
      id: `cell-${Date.now()}-${index}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      content: "",
      createdAt: new Date(),
    }));
  }, []);

  const createNewStoryboard = useCallback(() => {
    const newStoryboard: Storyboard = {
      id: `storyboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Storyboard ${nextStoryboardNumber}`,
      cells: createDefaultCells(),
      createdAt: new Date(),
    };

    setStoryboards((prev) => [...prev, newStoryboard]);
    setCurrentStoryboardId(newStoryboard.id);
    setNextStoryboardNumber((prev) => prev + 1);
  }, [nextStoryboardNumber, createDefaultCells]);

  const loadStoryboards = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/career-story-5`
      );

      if (response.ok) {
        const data = await response.json();
        // Parse dates back from string format
        const parsedStoryboards =
          data.storyboards?.map((sb: any) => ({
            ...sb,
            createdAt: new Date(sb.createdAt),
            cells:
              sb.cells?.map((cell: any) => ({
                ...cell,
                createdAt: new Date(cell.createdAt),
              })) || [],
          })) || [];

        // Batch state updates to prevent flickering
        if (parsedStoryboards.length > 0) {
          setStoryboards(parsedStoryboards);
          setCurrentStoryboardId(parsedStoryboards[0].id);
          toast({
            type: "success",
            description: "Your storyboards have been loaded successfully.",
          });
        } else {
          // Create default storyboard if none exist
          const defaultStoryboard: Storyboard = {
            id: `storyboard-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            name: `Storyboard 1`,
            cells: createDefaultCells(),
            createdAt: new Date(),
          };
          setStoryboards([defaultStoryboard]);
          setCurrentStoryboardId(defaultStoryboard.id);
          setNextStoryboardNumber(2);
        }
      } else if (response.status === 404) {
        // No saved data, create default storyboard
        const defaultStoryboard: Storyboard = {
          id: `storyboard-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          name: `Storyboard 1`,
          cells: createDefaultCells(),
          createdAt: new Date(),
        };
        setStoryboards([defaultStoryboard]);
        setCurrentStoryboardId(defaultStoryboard.id);
        setNextStoryboardNumber(2);
      } else {
        throw new Error("Failed to load storyboards");
      }
    } catch (error) {
      console.error("Error loading storyboards:", error);
      const defaultStoryboard: Storyboard = {
        id: `storyboard-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        name: `Storyboard 1`,
        cells: createDefaultCells(),
        createdAt: new Date(),
      };
      setStoryboards([defaultStoryboard]);
      setCurrentStoryboardId(defaultStoryboard.id);
      setNextStoryboardNumber(2);
      toast({
        type: "error",
        description:
          "Using default storyboard. Your previous work may not be available.",
      });
    } finally {
      setLoading(false);
    }
  }, [sessionId, createDefaultCells]);

  // Load data on component mount
  useEffect(() => {
    loadStoryboards();
  }, [loadStoryboards]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const saveStoryboards = useCallback(async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/career-story-5`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storyboards: storyboards,
          }),
        }
      );

      if (response.ok) {
        toast({
          type: "success",
          description: "Your storyboards have been saved successfully.",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.errors ? "Validation failed" : "Failed to save"
        );
      }
    } catch (error) {
      console.error("Error saving storyboards:", error);
      toast({
        type: "error",
        description: "Please try again. Check your internet connection.",
      });
    } finally {
      setSaving(false);
    }
  }, [sessionId, storyboards]);

  const addCell = useCallback((storyboardId: string) => {
    const newCell: StoryCell = {
      id: `cell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: "",
      createdAt: new Date(),
    };

    setStoryboards((prev) =>
      prev.map((sb) =>
        sb.id === storyboardId ? { ...sb, cells: [...sb.cells, newCell] } : sb
      )
    );
  }, []);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveStoryboards();
    }, 5000); // Save after 1 second of inactivity
  }, [saveStoryboards]);

  const updateCellContent = useCallback(
    (storyboardId: string, cellId: string, content: string) => {
      setStoryboards((prev) => {
        const storyboard = prev.find((sb) => sb.id === storyboardId);
        if (!storyboard) return prev;

        const cell = storyboard.cells.find((cell) => cell.id === cellId);
        if (!cell || cell.content === content) return prev;

        return prev.map((sb) =>
          sb.id === storyboardId
            ? {
                ...sb,
                cells: sb.cells.map((cell) =>
                  cell.id === cellId ? { ...cell, content } : cell
                ),
              }
            : sb
        );
      });

      // Trigger debounced save
      debouncedSave();
    },
    [debouncedSave]
  );

  const deleteCell = useCallback((storyboardId: string, cellId: string) => {
    setStoryboards((prev) =>
      prev.map((sb) =>
        sb.id === storyboardId
          ? { ...sb, cells: sb.cells.filter((cell) => cell.id !== cellId) }
          : sb
      )
    );
  }, []);

  const updateStoryboardName = (storyboardId: string, newName: string) => {
    setStoryboards((prev) =>
      prev.map((sb) => (sb.id === storyboardId ? { ...sb, name: newName } : sb))
    );
  };

  const deleteStoryboard = (storyboardId: string) => {
    if (storyboards.length <= 1) {
      toast({
        type: "error",
        description: "You must have at least one storyboard.",
      });
      return;
    }

    setStoryboards((prev) => prev.filter((sb) => sb.id !== storyboardId));

    if (currentStoryboardId === storyboardId) {
      const remainingStoryboards = storyboards.filter(
        (sb) => sb.id !== storyboardId
      );
      setCurrentStoryboardId(remainingStoryboards[0]?.id || null);
    }

    setShowDeleteConfirm(null);
    toast({
      type: "success",
      description: "Storyboard deleted successfully.",
    });
  };

  const startEditingName = (storyboard: Storyboard) => {
    setEditingStoryboardName(storyboard.id);
    setEditingName(storyboard.name);
  };

  const saveNameEdit = () => {
    if (editingStoryboardName && editingName.trim()) {
      updateStoryboardName(editingStoryboardName, editingName.trim());
    }
    setEditingStoryboardName(null);
    setEditingName("");
  };

  const cancelNameEdit = () => {
    setEditingStoryboardName(null);
    setEditingName("");
  };

  const currentStoryboard = useMemo(() => {
    return storyboards.find((sb) => sb.id === currentStoryboardId);
  }, [storyboards, currentStoryboardId]);

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
                <p className="text-primary-blue-600/80">
                  Create and organize your story elements using interactive
                  storyboards
                </p>
              </div>
            </div>
          </div>

          {/* Storyboard Grid */}
          {currentStoryboard && (
            <Card className="overflow-hidden border shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-2xl">
              <CardHeader className="border-b bg-gradient-to-r from-primary-blue-50/80 to-primary-green-50/80 border-primary-blue-100/30">
                <div className="space-y-4">
                  {/* Navigation Tabs */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {storyboards.map((storyboard) => (
                        <div key={storyboard.id} className="relative group">
                          {editingStoryboardName === storyboard.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveNameEdit();
                                  if (e.key === "Escape") cancelNameEdit();
                                }}
                                className="px-4 py-2 text-sm border rounded-lg border-primary-blue-300 focus:outline-none focus:ring-2 focus:ring-primary-blue-500"
                                autoFocus
                              />

                              <Button
                                size="sm"
                                onClick={saveNameEdit}
                                className="size-6 p-1 text-xs text-white hover:text-white bg-green-500 hover:bg-green-600 rounded-full"
                              >
                                <CheckCircle className="size-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={cancelNameEdit}
                                className="size-6 p-1 text-xs text-white hover:text-white bg-red-500 hover:bg-red-600 rounded-full"
                              >
                                <X className="size-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() =>
                                setCurrentStoryboardId(storyboard.id)
                              }
                              className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                                currentStoryboardId === storyboard.id
                                  ? "bg-gradient-to-r from-primary-blue-500 to-primary-green-500 text-white shadow-md"
                                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300"
                              }`}
                            >
                              {storyboard.name}
                            </Button>
                          )}

                          {/* Storyboard Actions */}
                          {editingStoryboardName !== storyboard.id && (
                            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditingName(storyboard)}
                                  className="size-6 p-1 text-xs text-white hover:text-white bg-blue-500 hover:bg-blue-600 rounded-full"
                                >
                                  <Edit3 className="size-5" />
                                </Button>
                                {storyboards.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      setShowDeleteConfirm(storyboard.id)
                                    }
                                    className="size-6 p-1 text-xs text-white hover:text-white bg-red-500 hover:bg-red-600 rounded-full"
                                  >
                                    <Trash2 className="size-5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={createNewStoryboard}
                        className="px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-gradient-to-r from-primary-green-500 to-primary-blue-500 hover:from-primary-green-600 hover:to-primary-blue-600 rounded-lg shadow-md hover:shadow-lg"
                      >
                        <Plus className="size-4 mr-2" />
                        New Storyboard
                      </Button>
                    </div>
                  </div>

                  {/* Current Storyboard Info */}
                  {/* <div className="flex items-center gap-3">
                    <div className="p-2 shadow-md bg-gradient-to-br from-primary-blue-500 to-primary-green-500 rounded-lg">
                      <Grid3X3 className="text-white size-5" />
              </div>
              <div>
                      <h3 className="text-lg font-bold text-primary-blue-800">
                        {currentStoryboard.name}
                </h3>
                      <p className="text-sm text-primary-blue-600/80">
                        {currentStoryboard.cells.length} cells
                </p>
              </div>
                  </div> */}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentStoryboard.cells.map((cell) => (
                    <div
                      key={cell.id}
                      className="relative group p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-md transition-all duration-200"
                    >
                      <Textarea
                        value={cell.content}
                        onChange={(e) =>
                          updateCellContent(
                            currentStoryboard.id,
                            cell.id,
                            e.target.value
                          )
                        }
                        placeholder="Enter your story element..."
                        className="min-h-[150px] resize-y border-none bg-transparent focus:ring-0 focus:outline-none text-sm"
                        rows={5}
                      />

                      {/* Delete Cell Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          deleteCell(currentStoryboard.id, cell.id)
                        }
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
                    onClick={() => addCell(currentStoryboard.id)}
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

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={saveStoryboards}
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
        </JourneyBreadcrumbLayout>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="max-w-md mx-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="size-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Delete Storyboard
                </h3>
              </div>
              <p className="mb-6 text-slate-600">
                Are you sure you want to delete this storyboard? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-slate-500 hover:bg-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteStoryboard(showDeleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
