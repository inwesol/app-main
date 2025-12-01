"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, Target, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface MatrixCell {
  rowId: string;
  colId: string;
  value: number;
  comment: string;
}

interface MatrixRow {
  id: string;
  name: string;
}

interface MatrixColumn {
  id: string;
  name: string;
  disabled: boolean;
}

export default function CareerOptionsMatrix() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMatrixScoringEnabled, setIsMatrixScoringEnabled] = useState(false);
  const [isCheckingScoringEnabled, setIsCheckingScoringEnabled] =
    useState(true);
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const router = useRouter();
  const { setQuestionnaireBreadcrumbs } = useBreadcrumb();

  // rows = career options
  const [rows, setRows] = useState<MatrixRow[]>([
    { id: "1", name: "Software Engineer" },
    { id: "2", name: "Data Scientist" },
    { id: "3", name: "Product Manager" },
  ]);

  // columns = criteria
  const [columns, setColumns] = useState<MatrixColumn[]>([
    { id: "1", name: "Work-Life Balance", disabled: false },
    { id: "2", name: "Salary Potential", disabled: false },
    { id: "3", name: "Growth Opportunities", disabled: false },
    { id: "4", name: "Job Security", disabled: false },
  ]);

  // Matrix cell values
  const [cells, setCells] = useState<MatrixCell[]>([]);

  // Function to load career options from career story three
  const loadCareerOptions = useCallback(async () => {
    try {
      const response = await fetch(`/api/journey/sessions/4/a/career-story-3`);

      if (response.ok) {
        const data = await response.json();
        if (
          data.selectedOccupations &&
          Array.isArray(data.selectedOccupations) &&
          data.selectedOccupations.length > 0
        ) {
          // Convert selected occupations to matrix rows (career options)
          const careerOptions = data.selectedOccupations.map(
            (occupation: string, index: number) => ({
              id: (index + 1).toString(),
              name: occupation,
            })
          );
          setRows(careerOptions);
          return true; // Successfully loaded career options
        }
      }
    } catch (error) {
      console.error("Error loading career options from My Story 3:", error);
    }
    return false; // Failed to load career options
  }, []);

  const loadData = useCallback(async () => {
    const aId = "career-options-matrix";
    try {
      setIsLoading(true);

      // First, try to load career options from career story three
      const careerOptionsLoaded = await loadCareerOptions();

      // Then load matrix data
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${aId}`
      );

      if (response.ok) {
        const data = await response.json();

        // Only update state if we have actual data
        // Only update rows (career options) if we didn't load from career story three
        if (!careerOptionsLoaded && data.rows && data.rows.length > 0) {
          setRows(data.rows);
        }
        // Load columns (criteria) from saved data to preserve disabled state
        if (data.columns && data.columns.length > 0) {
          setColumns(data.columns);
        }
        if (data.cells && data.cells.length > 0) {
          setCells(data.cells);
        }
      }
    } catch (error) {
      console.error("Error loading matrix data:", error);
      toast.error("Failed to load matrix data");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, loadCareerOptions]);

  // Set breadcrumbs on component mount
  useEffect(() => {
    setQuestionnaireBreadcrumbs(sessionId, "Matrix Activity");
  }, [sessionId, setQuestionnaireBreadcrumbs]);

  // Check if matrix scoring is enabled
  useEffect(() => {
    const checkScoringEnabled = async () => {
      try {
        const journeyResponse = await fetch("/api/journey");
        if (journeyResponse.ok) {
          const journeyData = await journeyResponse.json();
          const enableByCoach = journeyData.enableByCoach as any;
          setIsMatrixScoringEnabled(enableByCoach?.["mtrx:scores"] === true);
        }
      } catch (error) {
        console.error("Error checking matrix scoring enablement:", error);
        // Default to disabled if API call fails
        setIsMatrixScoringEnabled(false);
      } finally {
        setIsCheckingScoringEnabled(false);
      }
    };

    checkScoringEnabled();
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveData = async () => {
    const aId = "career-options-matrix";
    try {
      setIsSaving(true);

      const dataToSave = {
        rows,
        columns,
        cells,
      };

      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${aId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        }
      );

      if (response.ok) {
        toast.success("✅ Matrix saved successfully!", {
          className:
            "bg-primary-green-100 text-primary-green-600 border-primary-green-600",
        });

        // Add redirect after successful save
        setTimeout(() => {
          router.push(`/journey/sessions/${sessionId}`);
        }, 1000); // 1 second delay to show the success message
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving matrix data:", error);
      toast.error("Failed to save matrix data");
    } finally {
      setIsSaving(false);
    }
  };

  // Add new column (criteria)
  const addColumn = () => {
    const newColumn: MatrixColumn = {
      id: Date.now().toString(),
      name: `New Criteria`,
      disabled: false,
    };
    setColumns([...columns, newColumn]);
    toast.success("✨ New criteria added! Click to customize it.", {
      className:
        "bg-primary-green-100 text-primary-green-600 border-primary-green-600",
    });
  };

  // Delete column (criteria)
  const deleteColumn = (colId: string) => {
    if (columns.length <= 1) {
      toast.error("You need at least one criteria!", {
        className: "bg-red-100 text-red-500 border-red-500",
      });
      return;
    }
    setColumns(columns.filter((col) => col.id !== colId));
    setCells(cells.filter((cell) => cell.colId !== colId));
    toast.success("🗑️ Criteria removed successfully!", {
      className:
        "bg-primary-green-100 text-primary-green-600 border-primary-green-600",
    });
  };

  // Update column name (criteria)
  const updateColumnName = (colId: string, name: string) => {
    setColumns(
      columns.map((col) => (col.id === colId ? { ...col, name } : col))
    );
  };

  // Toggle column disabled state
  const toggleColumnDisabled = (colId: string) => {
    setColumns(
      columns.map((col) =>
        col.id === colId ? { ...col, disabled: !col.disabled } : col
      )
    );
    const column = columns.find((col) => col.id === colId);
    if (column) {
      toast.success(
        `✨ Criteria "${column.name}" ${
          !column.disabled ? "disabled" : "enabled"
        }!`,
        {
          className:
            "bg-primary-green-100 text-primary-green-600 border-primary-green-600",
        }
      );
    }
  };

  // Update cell value
  const updateCellValue = (
    rowId: string,
    colId: string,
    value: number,
    comment?: string
  ) => {
    const existingCell = cells.find(
      (cell) => cell.rowId === rowId && cell.colId === colId
    );

    if (existingCell) {
      setCells(
        cells.map((cell) =>
          cell.rowId === rowId && cell.colId === colId
            ? {
                ...cell,
                value,
                comment: comment !== undefined ? comment : cell.comment,
              }
            : cell
        )
      );
    } else {
      setCells([...cells, { rowId, colId, value, comment: comment || "" }]);
    }
  };

  // Update cell comment
  const updateCellComment = (rowId: string, colId: string, comment: string) => {
    const existingCell = cells.find(
      (cell) => cell.rowId === rowId && cell.colId === colId
    );

    if (existingCell) {
      setCells(
        cells.map((cell) =>
          cell.rowId === rowId && cell.colId === colId
            ? { ...cell, comment }
            : cell
        )
      );
    } else {
      setCells([...cells, { rowId, colId, value: 0, comment }]);
    }
  };

  // Get cell value
  const getCellValue = (rowId: string, colId: string): number => {
    const cell = cells.find(
      (cell) => cell.rowId === rowId && cell.colId === colId
    );
    return cell?.value || 0;
  };

  // Get cell comment
  const getCellComment = (rowId: string, colId: string): string => {
    const cell = cells.find(
      (cell) => cell.rowId === rowId && cell.colId === colId
    );
    return cell?.comment || "";
  };

  // Calculate average score for a row (career option)
  const calculateRowScore = (rowId: string): number => {
    // Only calculate scores if scoring is enabled
    if (!isMatrixScoringEnabled) {
      return 0;
    }

    let totalScore = 0;
    let scoredCells = 0;

    columns.forEach((column) => {
      // Skip disabled columns
      if (column.disabled) return;

      const cellValue = getCellValue(rowId, column.id);
      if (cellValue > 0) {
        // Only count scored cells
        totalScore += cellValue;
        scoredCells++;
      }
    });

    return scoredCells > 0 ? totalScore / scoredCells : 0;
  };

  // Get completion percentage
  const getCompletionPercentage = (): number => {
    // Only count enabled columns for completion percentage
    const enabledColumns = columns.filter((col) => !col.disabled);
    const totalCells = rows.length * enabledColumns.length;
    const filledCells = cells.filter((cell) => {
      const column = columns.find((col) => col.id === cell.colId);
      return cell.value > 0 && column && !column.disabled;
    }).length;
    return totalCells > 0 ? (filledCells / totalCells) * 100 : 0;
  };

  // Get score color and label with primary-green/primary-blue theme
  const getScoreColor = (score: number) => {
    if (score >= 4.5)
      return "text-emerald-800 bg-gradient-to-r from-emerald-100 to-primary-green-100 border-emerald-300";
    if (score >= 3.5)
      return "text-primary-blue-800 bg-gradient-to-r from-primary-blue-100 to-cyan-100 border-primary-blue-300";
    if (score >= 2.5)
      return "text-teal-800 bg-gradient-to-r from-teal-100 to-cyan-100 border-teal-300";
    if (score >= 1.5)
      return "text-slate-700 bg-gradient-to-r from-slate-100 to-gray-100 border-slate-300";
    return "text-slate-600 bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Average";
    if (score >= 1.5) return "Below Average";
    return "Poor";
  };

  // Get response counts for a specific career option
  const getResponseCounts = (rowId: string) => {
    // Only calculate counts if scoring is enabled
    if (!isMatrixScoringEnabled) {
      return { yes: 0, maybe: 0, no: 0 };
    }

    let yesCount = 0;
    let maybeCount = 0;
    let noCount = 0;

    columns.forEach((column) => {
      // Only count enabled columns
      if (column.disabled) return;

      const cellValue = getCellValue(rowId, column.id);
      if (cellValue === 3) yesCount++;
      else if (cellValue === 2) maybeCount++;
      else if (cellValue === 1) noCount++;
    });

    return { yes: yesCount, maybe: maybeCount, no: noCount };
  };

  // Get best option
  const getBestOption = () => {
    let bestScore = 0;
    let bestOption = "";

    rows.forEach((row) => {
      const score = calculateRowScore(row.id);
      if (score > bestScore) {
        bestScore = score;
        bestOption = row.name;
      }
    });

    return { name: bestOption, score: bestScore };
  };

  const bestOption = getBestOption();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-green-50 via-primary-blue-50 to-cyan-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="size-6 animate-spin" />
          <span>Loading your matrix...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative ">
      <div className="relative z-10 p-3 mx-auto max-w-7xl">
        <JourneyBreadcrumbLayout>
          {/* matrix container with add criteria button */}
          <div className="relative mb-4">
            {/* add column button - Add Criteria */}
            <div className="absolute z-30 -top-4 -right-10 group">
              <Button
                onClick={addColumn}
                className="p-0 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-emerald-500 to-primary-green-500 hover:from-emerald-600 hover:to-primary-green-600 rounded-lg size-10 hover:scale-110 hover:shadow-xl hover:shadow-emerald-200/50"
                title="Add new criteria column"
              >
                <Plus className="transition-transform duration-300 size-4 group-hover:rotate-90" />
              </Button>
              <div className="absolute px-2 py-1 text-xs text-white transition-all duration-300 -translate-x-1/2 rounded shadow-lg opacity-0 -bottom-8 left-1/2 bg-emerald-800 whitespace-nowrap group-hover:opacity-100">
                Add Criteria
                <div className="absolute rotate-45 -translate-x-1/2 -top-1 left-1/2 size-1.5 bg-emerald-800" />
              </div>
            </div>

            {/* matrix Table */}
            <Card className="overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm relative">
                  {/* table Header */}
                  <thead>
                    <tr className="border-b-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-slate-500">
                      <th className="sticky left-0 z-20 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 p-2 text-left font-bold text-white border-r-2 border-slate-500 min-w-[200px]">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 rounded-full bg-white/20 backdrop-blur-sm">
                            <Target className="text-white size-3" />
                          </div>
                          <div>
                            <div className="text-sm">Career Options</div>
                          </div>
                        </div>
                      </th>
                      {columns.map((column, index) => (
                        <th
                          key={column.id}
                          className={`p-2 text-center font-bold text-white border-r border-slate-500 min-w-[120px] relative group bg-gradient-to-b from-slate-600 to-slate-700 ${
                            column.disabled ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {/* Input area with delete button */}
                            <div className="flex items-center gap-1 relative w-full pt-2">
                              <Input
                                value={column.name}
                                onChange={(e) =>
                                  updateColumnName(column.id, e.target.value)
                                }
                                disabled={column.disabled}
                                className={`text-xs font-semibold text-center text-white transition-all duration-300 border border-dashed border-slate-400 bg-white/10 backdrop-blur-sm placeholder:text-slate-300 focus-visible:ring-0 h-8 flex-1 ${
                                  column.disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                placeholder="Criteria"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteColumn(column.id)}
                                className="p-0 text-red-400 transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 size-4 absolute -right-2 -top-0.5"
                                title="Delete this criteria"
                              >
                                <X className="size-2.5" />
                              </Button>
                            </div>

                            {/* Switch for enable/disable */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-300">
                                {column.disabled ? "Disabled" : "Enabled"}
                              </span>
                              <Switch
                                checked={!column.disabled}
                                onCheckedChange={() =>
                                  toggleColumnDisabled(column.id)
                                }
                                className="data-[state=checked]:bg-primary-green-500"
                              />
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* table Body */}
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr
                        key={row.id}
                        className={`border-b-2 border-slate-100 group hover:bg-gradient-to-r hover:from-primary-green-50/30 hover:to-primary-blue-50/30 transition-all duration-300 ${
                          rowIndex % 2 === 0 ? "bg-white/80" : "bg-slate-50/50"
                        }`}
                      >
                        {/* Row Header - Career Option (Non-editable) */}
                        <td className="sticky left-0 z-10 p-2 border-r-2 bg-white border-slate-200">
                          <div className="flex flex-col items-center h-full min-h-[140px]">
                            <div className="flex-1 flex items-center justify-center">
                              <div className="text-sm font-semibold text-slate-800 text-center">
                                {row.name}
                              </div>
                            </div>

                            {/* Response Count Display - At the bottom - Only show if scoring is enabled */}
                            {!isCheckingScoringEnabled &&
                              isMatrixScoringEnabled && (
                                <div className="mt-auto">
                                  {(() => {
                                    const counts = getResponseCounts(row.id);
                                    const total =
                                      counts.yes + counts.maybe + counts.no;

                                    return total > 0 ? (
                                      <div className="flex items-center gap-1 text-xs">
                                        {counts.yes > 0 && (
                                          <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                            Yes: {counts.yes}
                                          </span>
                                        )}
                                        {counts.maybe > 0 && (
                                          <span className="px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                                            Maybe: {counts.maybe}
                                          </span>
                                        )}
                                        {counts.no > 0 && (
                                          <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                                            No: {counts.no}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-slate-400 italic">
                                        No responses yet
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                          </div>
                        </td>

                        {/* matrix Cells - Rate career option against criteria */}
                        {columns.map((column) => {
                          const cellValue = getCellValue(row.id, column.id);
                          const cellComment = getCellComment(row.id, column.id);
                          return (
                            <td
                              key={column.id}
                              className={`relative p-1.5 text-center border-r border-slate-100 ${
                                column.disabled
                                  ? "bg-slate-100/50 opacity-60"
                                  : ""
                              }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                {/* Disabled overlay */}
                                {column.disabled && (
                                  <div className="absolute inset-0 bg-slate-200/30 rounded-md z-10 flex items-center justify-center">
                                    <div className="bg-slate-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                      DISABLED
                                    </div>
                                  </div>
                                )}

                                {/* Comment textarea - larger size for detailed thoughts */}
                                <Textarea
                                  className={`text-xs border-slate-200 bg-white/80 backdrop-blur-sm placeholder:text-slate-400 text-slate-700 min-h-[120px] focus-visible:ring-primary-green-200 focus-visible:ring-1 w-full resize-y ${
                                    column.disabled
                                      ? "opacity-50 cursor-not-allowed bg-slate-100"
                                      : ""
                                  }`}
                                  placeholder={
                                    column.disabled
                                      ? "This criteria is disabled"
                                      : "Add your detailed thoughts and analysis..."
                                  }
                                  value={cellComment}
                                  onChange={(e) =>
                                    updateCellComment(
                                      row.id,
                                      column.id,
                                      e.target.value
                                    )
                                  }
                                  disabled={column.disabled}
                                  rows={3}
                                />

                                {/* Yes/Maybe/No Buttons - Only show if scoring is enabled */}
                                {!isCheckingScoringEnabled &&
                                  isMatrixScoringEnabled && (
                                    <div className="flex justify-center gap-1">
                                      {[
                                        {
                                          value: 3,
                                          label: "Yes",
                                          color:
                                            "from-green-500 to-emerald-500",
                                        },
                                        {
                                          value: 2,
                                          label: "Maybe",
                                          color:
                                            "from-yellow-500 to-orange-500",
                                        },
                                        {
                                          value: 1,
                                          label: "No",
                                          color: "from-red-500 to-pink-500",
                                        },
                                      ].map((option) => (
                                        <button
                                          type="button"
                                          key={option.value}
                                          onClick={() =>
                                            !column.disabled &&
                                            updateCellValue(
                                              row.id,
                                              column.id,
                                              option.value
                                            )
                                          }
                                          disabled={column.disabled}
                                          className={`px-2 py-1 rounded text-xs font-bold transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-105 ${
                                            column.disabled
                                              ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                                              : cellValue === option.value
                                              ? `bg-gradient-to-r ${option.color} text-white border-transparent`
                                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                                          }`}
                                          title={
                                            column.disabled
                                              ? "This criteria is disabled"
                                              : `${option.label} for ${row.name} on ${column.name}`
                                          }
                                        >
                                          {option.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={saveData}
              disabled={isSaving}
              className="px-6 py-3 text-sm text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-primary-green-500 to-emerald-500 hover:from-primary-green-600 hover:to-emerald-600 rounded-lg hover:scale-105 hover:shadow-xl"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving Matrix Activity...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Matrix Activity
                </>
              )}
            </Button>
          </div>
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
