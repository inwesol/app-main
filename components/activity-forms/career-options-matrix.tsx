"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Grid,
  Calculator,
  Info,
  Star,
  Target,
  HelpCircle,
  Sparkles,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Header from "@/components/form-components/header";
import { useParams, useRouter } from "next/navigation";

interface MatrixCell {
  rowId: string;
  colId: string;
  value: number;
  comment: string;
}

interface MatrixRow {
  id: string;
  name: string;
  weight: number;
}

interface MatrixColumn {
  id: string;
  name: string;
}

export default function CareerOptionsMatrix() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const router = useRouter();

  // default rows (criteria)
  const [rows, setRows] = useState<MatrixRow[]>([
    { id: "1", name: "Work-Life Balance", weight: 4 },
    { id: "2", name: "Salary Potential", weight: 3 },
    { id: "3", name: "Growth Opportunities", weight: 4 },
    { id: "4", name: "Job Security", weight: 3 },
  ]);

  // default columns (career options)
  const [columns, setColumns] = useState<MatrixColumn[]>([
    { id: "1", name: "Software Engineer" },
    { id: "2", name: "Data Scientist" },
    { id: "3", name: "Product Manager" },
  ]);

  // Matrix cell values
  const [cells, setCells] = useState<MatrixCell[]>([]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    const aId = "career-options-matrix";
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/journey/sessions/${sessionId}/a/${aId}`
      );

      if (response.ok) {
        const data = await response.json();

        // Only update state if we have actual data
        if (data.rows && data.rows.length > 0) {
          setRows(data.rows);
        }
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
  };

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

  // Add new row
  const addRow = () => {
    const newRow: MatrixRow = {
      id: Date.now().toString(),
      name: `New Criteria`,
      weight: 3,
    };
    setRows([...rows, newRow]);
    toast.success("✨ New criteria added! Click to customize it.", {
      className:
        "bg-primary-green-100 text-primary-green-600 border-primary-green-600",
    });
  };

  // Add new column
  const addColumn = () => {
    const newColumn: MatrixColumn = {
      id: Date.now().toString(),
      name: `New Option`,
    };
    setColumns([...columns, newColumn]);
    toast.success("🚀 New career option added! Click to customize it..", {
      className:
        "bg-primary-green-100 text-primary-green-600 border-primary-green-600",
    });
  };

  // Delete row
  const deleteRow = (rowId: string) => {
    if (rows.length <= 1) {
      toast.error("You need at least one criteria row!", {
        className: "bg-red-100 text-red-500 border-red-500",
      });
      return;
    }
    setRows(rows.filter((row) => row.id !== rowId));
    setCells(cells.filter((cell) => cell.rowId !== rowId));
    toast.success("🗑️ Criteria removed successfully!", {
      className:
        "bg-primary-green-100 text-primary-green-600 border-primary-green-600",
    });
  };

  // Delete column
  const deleteColumn = (colId: string) => {
    if (columns.length <= 1) {
      toast.error("You need at least one career option!", {
        className: "bg-red-100 text-red-500 border-red-500",
      });
      return;
    }
    setColumns(columns.filter((col) => col.id !== colId));
    setCells(cells.filter((cell) => cell.colId !== colId));
    toast.success("🗑️ Career option removed successfully!", {
      className:
        "bg-primary-green-100 text-primary-green-600 border-primary-green-600",
    });
  };

  // Update row name
  const updateRowName = (rowId: string, name: string) => {
    setRows(rows.map((row) => (row.id === rowId ? { ...row, name } : row)));
  };

  // Update row weight
  const updateRowWeight = (rowId: string, weight: number) => {
    setRows(rows.map((row) => (row.id === rowId ? { ...row, weight } : row)));
  };

  // Update column name
  const updateColumnName = (colId: string, name: string) => {
    setColumns(
      columns.map((col) => (col.id === colId ? { ...col, name } : col))
    );
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

  // Calculate weighted score for a column
  const calculateColumnScore = (colId: string): number => {
    let totalScore = 0;
    let totalWeight = 0;

    rows.forEach((row) => {
      const cellValue = getCellValue(row.id, colId);
      if (cellValue > 0) {
        // Only count scored cells
        totalScore += cellValue * row.weight;
        totalWeight += row.weight;
      }
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  };

  // Get completion percentage
  const getCompletionPercentage = (): number => {
    const totalCells = rows.length * columns.length;
    const filledCells = cells.filter((cell) => cell.value > 0).length;
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

  // Get best option
  const getBestOption = () => {
    let bestScore = 0;
    let bestOption = "";

    columns.forEach((column) => {
      const score = calculateColumnScore(column.id);
      if (score > bestScore) {
        bestScore = score;
        bestOption = column.name;
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
    <div className="relative min-h-screen bg-gradient-to-br from-primary-green-50 via-primary-blue-50 to-cyan-50 ">
      <div className="relative z-10 p-6 mx-auto max-w-7xl">
        <Header
          headerIcon={Grid}
          headerText="Career Options Matrix"
          headerDescription="Make data-driven career decisions using weighted criteria analysis"
        />

        {/* Save Button */}
        <div className="fixed z-50 top-6 right-6">
          <Button
            onClick={saveData}
            disabled={isSaving}
            className="px-6 py-3 text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-primary-green-500 to-emerald-500 hover:from-primary-green-600 hover:to-emerald-600 rounded-2xl hover:scale-105 hover:shadow-2xl"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Matrix
              </>
            )}
          </Button>
        </div>

        {/* instructions Card */}
        {/* how to use  */}
        <div className="p-6 mb-8 border-2 shadow-lg bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-2xl sm:p-8 border-slate-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center shadow-lg size-12 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-xl">
                <Info className="text-white size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                How to use this matrix
              </h3>
            </div>
            <div className="flex-1">
              <div className="grid gap-4 sm:grid-cols-2 text-slate-700">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Edit & Customize</span>{" "}
                      Click on any criteria or career option name to edit it
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Set Importance</span> Use
                      stars to set how important each criteria is (1-5)
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-6 bg-primary-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold">Score & Comment</span>{" "}
                      Rate each career option (1-5) and add optional notes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Soothing Progress & Stats */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card className="p-6 bg-gradient-to-br from-emerald-50/80 to-primary-green-50/80 border-emerald-200/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Calculator className="size-5 text-emerald-500" />
              <h3 className="font-bold text-emerald-800">Completion</h3>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1 text-sm text-emerald-700">
                <span>Matrix Progress</span>
                <span className="font-bold">
                  {Math.round(getCompletionPercentage())}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-emerald-200/50">
                <div
                  className="h-3 transition-all duration-700 rounded-full shadow-sm bg-gradient-to-r from-emerald-500 to-primary-green-500"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-emerald-600">
              {cells.filter((cell) => cell.value > 0).length} of{" "}
              {rows.length * columns.length} cells completed
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary-blue-50/80 to-cyan-50/80 border-primary-blue-200/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Target className="size-5 text-primary-blue-500" />
              <h3 className="font-bold text-primary-blue-800">Criteria</h3>
            </div>
            <div className="mb-1 text-2xl font-bold text-primary-blue-700">
              {rows.length}
            </div>
            <p className="text-sm text-primary-blue-600">Evaluation criteria</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-teal-50/80 to-primary-green-50/80 border-teal-200/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="size-5 text-primary-green-500" />
              <h3 className="font-bold text-teal-800">Options</h3>
            </div>
            <div className="mb-1 text-2xl font-bold text-teal-700">
              {columns.length}
            </div>
            <p className="text-sm text-teal-600">Career options</p>
          </Card>
        </div>

        {/* matrix container with floating buttons */}
        <div className="relative mb-8">
          {/* add column button */}
          <div className="absolute z-30 -top-6 -right-6 group">
            <Button
              onClick={addColumn}
              className="p-0 text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-emerald-500 to-primary-green-500 hover:from-emerald-600 hover:to-primary-green-600 rounded-2xl size-14 hover:scale-110 hover:shadow-2xl hover:shadow-emerald-200/50"
              title="Add new career option column"
            >
              <Plus className="transition-transform duration-300 size-6 group-hover:rotate-90" />
            </Button>
            <div className="absolute px-3 py-1 text-xs text-white transition-all duration-300 -translate-x-1/2 rounded-lg shadow-lg opacity-0 -bottom-10 left-1/2 bg-emerald-800 whitespace-nowrap group-hover:opacity-100">
              Add Career Option
              <div className="absolute rotate-45 -translate-x-1/2 -top-1 left-1/2 size-2 bg-emerald-800" />
            </div>
          </div>

          {/* add row button */}
          <div className="absolute z-30 -bottom-6 -left-6 group">
            <Button
              onClick={addRow}
              className="p-0 text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-primary-blue-500 to-cyan-500 hover:from-primary-blue-600 hover:to-cyan-600 rounded-2xl size-14 hover:scale-110 hover:shadow-2xl hover:shadow-primary-blue-200/50"
              title="Add new criteria row"
            >
              <Plus className="transition-transform duration-300 size-6 group-hover:rotate-90" />
            </Button>
            <div className="absolute px-3 py-1 text-xs text-white transition-all duration-300 -translate-x-1/2 rounded-lg shadow-lg opacity-0 -top-10 left-1/2 bg-primary-blue-800 whitespace-nowrap group-hover:opacity-100">
              Add Criteria
              <div className="absolute rotate-45 -translate-x-1/2 -bottom-1 left-1/2 size-2 bg-primary-blue-800" />
            </div>
          </div>

          {/* matrix Table */}
          <Card className="overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <div className="overflow-x-auto ">
              <table className="w-full min-w-max">
                {/* table Header */}
                <thead>
                  <tr className="border-b-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-slate-500">
                    <th className=" bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 p-4 text-left font-bold text-white border-r-4 border-slate-500 min-w-[280px] z-10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                          <Target className="text-white size-4" />
                        </div>
                        <div>
                          <div className="text-base">Evaluation Criteria</div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-300">
                            <Star className="size-2" />
                            <span>Importance Weight</span>
                          </div>
                        </div>
                      </div>
                    </th>
                    {columns.map((column, index) => (
                      <th
                        key={column.id}
                        className="p-4 text-center font-bold text-white border-r-2 border-slate-500 min-w-[140px] relative group bg-gradient-to-b from-slate-600 to-slate-700"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-primary-green-400 to-emerald-400 size-6 shrink-0">
                              {index + 1}
                            </div>
                            <Input
                              value={column.name}
                              onChange={(e) =>
                                updateColumnName(column.id, e.target.value)
                              }
                              className="text-sm font-semibold text-center text-white transition-all duration-300 border-2 border-dashed border-slate-400 bg-white/10 backdrop-blur-sm placeholder:text-slate-300 focus-visible:ring-0"
                              placeholder="Career Option"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteColumn(column.id)}
                            className="absolute p-0 text-red-400 transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 top-1 right-1 size-6"
                            title="Delete this career option"
                          >
                            <X className="size-3" />
                          </Button>
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
                      {/* Beautiful Row Header */}
                      <td className="z-10 p-4 border-r-4 bg-inherit border-slate-200">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col items-center gap-1">
                            {/* grouping number and input in the same div*/}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-slate-600 to-slate-700 size-6 shrink-0">
                                {rowIndex + 1}
                              </div>
                              <Input
                                value={row.name}
                                onChange={(e) =>
                                  updateRowName(row.id, e.target.value)
                                }
                                className="text-sm font-semibold transition-all duration-300 bg-transparent border-2 border-dashed border-slate-300 text-slate-800"
                                placeholder="Criteria Name"
                              />
                            </div>
                            {/* weight Selector */}
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-slate-600">
                                Weight:
                              </span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((weight) => (
                                  <button
                                    type="button"
                                    key={weight}
                                    onClick={() =>
                                      updateRowWeight(row.id, weight)
                                    }
                                    className={`transition-all duration-300 hover:scale-125 ${
                                      row.weight >= weight
                                        ? "text-primary-green-500 hover:text-primary-green-600 drop-shadow-lg"
                                        : "text-slate-300 hover:text-slate-400"
                                    }`}
                                    title={`Set importance to ${weight}/5`}
                                  >
                                    <Star className="fill-current size-3" />
                                  </button>
                                ))}
                              </div>
                              <span className="text-xs text-slate-500 bg-slate-100 px-1 py-0.5 rounded-full font-medium">
                                {row.weight}/5
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Beautiful Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRow(row.id)}
                              className="p-0 text-red-600 transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-700 size-6"
                              title="Delete this criteria"
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </td>

                      {/* matrix Cells */}
                      {columns.map((column) => {
                        const cellValue = getCellValue(row.id, column.id);
                        const cellComment = getCellComment(row.id, column.id);
                        return (
                          <td
                            key={column.id}
                            className="relative p-3 text-center border-r-2 border-slate-100"
                          >
                            <div className="flex flex-col items-center gap-2">
                              {/* score Buttons */}
                              <div className="flex flex-col gap-1 ">
                                <div className="flex justify-center gap-1">
                                  {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                      type="button"
                                      key={score}
                                      onClick={() =>
                                        updateCellValue(
                                          row.id,
                                          column.id,
                                          score
                                        )
                                      }
                                      className={`size-7 rounded-lg text-xs font-bold transition-all duration-300 border shadow-sm hover:shadow-md hover:scale-110 ${
                                        cellValue >= score
                                          ? "bg-gradient-to-r from-primary-green-500 to-emerald-500 text-white border-primary-green-600"
                                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                                      }`}
                                      title={`Rate as ${score}/5`}
                                    >
                                      {score}
                                    </button>
                                  ))}
                                </div>
                                {/* Comment input */}
                                <Input
                                  className="text-xs border-slate-200 bg-white/80 backdrop-blur-sm placeholder:text-slate-400 text-slate-700 h-7 focus-visible:ring-primary-green-200 focus-visible:ring-1"
                                  placeholder="Add a comment..."
                                  value={cellComment}
                                  onChange={(e) =>
                                    updateCellComment(
                                      row.id,
                                      column.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              {/* Beautiful Score Display */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-semibold border transition-all duration-300 ${
                                    cellValue > 0
                                      ? "bg-gradient-to-r from-primary-green-100 to-emerald-100 text-primary-green-700 border-primary-green-300"
                                      : "bg-slate-100 text-slate-500 border-slate-200"
                                  }`}
                                >
                                  {cellValue > 0
                                    ? `${cellValue}/5`
                                    : "Not rated"}
                                </span>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Beautiful Results Row */}
                  <tr className="border-t-4 bg-gradient-to-r from-primary-green-600 via-teal-600 to-primary-blue-600 border-slate-200">
                    <td className="z-10 p-4 font-bold text-white border-r-4  bg-gradient-to-r from-primary-green-600 via-teal-600 to-primary-blue-600 border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                          <Calculator className="size-4" />
                        </div>
                        <div>
                          <div className="text-base">Final Score</div>
                          <div className="text-xs text-primary-green-100 flex items-center gap-0.5">
                            <HelpCircle className="size-2" />
                            <span>Weighted average</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    {columns.map((column) => {
                      const score = calculateColumnScore(column.id);
                      return (
                        <td
                          key={column.id}
                          className="p-3 text-center border-r-2 border-slate-200"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={`text-xl font-bold px-3 py-1 rounded-lg border shadow-md ${getScoreColor(
                                score
                              )}`}
                            >
                              {score > 0 ? score.toFixed(2) : "—"}
                            </div>
                            <div className="text-xs text-center text-primary-green-100">
                              {score > 0 ? (
                                <div className="flex flex-col items-center gap-0.5">
                                  <span>out of 5.0</span>
                                  <span className="bg-white/20 px-1 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm">
                                    {getScoreLabel(score)}
                                  </span>
                                </div>
                              ) : (
                                "No scores yet"
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Beautiful Legend and Tips */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Beautiful Scoring Legend */}
          <Card className="p-8 shadow-xl bg-gradient-to-br from-emerald-50/80 to-primary-green-50/80 border-emerald-200/60 backdrop-blur-sm">
            <h3 className="flex items-center gap-3 mb-6 text-xl font-bold text-emerald-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-primary-green-500">
                <Star className="text-white size-5" />
              </div>
              Scoring Guide
            </h3>
            <div className="space-y-4">
              {[
                {
                  score: 5,
                  gradient: "from-emerald-500 to-primary-green-500",
                  textColor: "emerald-700",
                  label: "Excellent",
                  desc: "Perfect fit for your needs",
                },
                {
                  score: 4,
                  gradient: "from-primary-blue-500 to-cyan-500",
                  textColor: "primary-blue-700",
                  label: "Good",
                  desc: "Strong match with minor concerns",
                },
                {
                  score: 3,
                  gradient: "from-teal-500 to-cyan-500",
                  textColor: "teal-700",
                  label: "Average",
                  desc: "Acceptable but room for improvement",
                },
                {
                  score: 2,
                  gradient: "from-slate-500 to-gray-500",
                  textColor: "slate-700",
                  label: "Below Average",
                  desc: "Some significant concerns",
                },
                {
                  score: 1,
                  gradient: "from-slate-400 to-gray-400",
                  textColor: "slate-600",
                  label: "Poor",
                  desc: "Major issues or poor fit",
                },
              ].map((item) => (
                <div
                  key={item.score}
                  className="flex items-center gap-4 p-3 rounded-lg shadow-sm bg-white/80 backdrop-blur-sm"
                >
                  <span
                    className={`bg-gradient-to-r ${item.gradient} text-white rounded-xl size-10 flex items-center justify-center font-bold shadow-lg`}
                  >
                    {item.score}
                  </span>
                  <div className="">
                    <div className={`font-semibold text-${item.textColor}`}>
                      {item.label}
                    </div>
                    <div className="text-sm text-slate-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Beautiful Tips */}
          <Card className="p-8 shadow-xl bg-gradient-to-br from-primary-blue-50/80 to-cyan-50/80 border-primary-blue-200/60 backdrop-blur-sm">
            <h3 className="flex items-center gap-3 mb-6 text-xl font-bold text-primary-blue-800">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary-blue-500 to-cyan-500">
                <HelpCircle className="text-white size-5" />
              </div>
              Pro Tips
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: "🌟",
                  title: "Weight Wisely",
                  desc: "Set higher weights for criteria that matter most to your career goals",
                },
                {
                  icon: "🎯",
                  title: "Be Honest",
                  desc: "Accurate scoring leads to better decision-making",
                },
                {
                  icon: "💬",
                  title: "Add Comments",
                  desc: "Use comment boxes to capture important notes and reasoning",
                },
                {
                  icon: "📊",
                  title: "Weighted Scores",
                  desc: "Final scores use weighted averages based on your importance ratings",
                },
                {
                  icon: "➕",
                  title: "Customize",
                  desc: "Add more criteria or career options using the floating + buttons",
                },
                {
                  icon: "🔄",
                  title: "Iterate",
                  desc: "Review and adjust your scores as you learn more about each option",
                },
              ].map((tip, index) => (
                <div
                  key={tip.icon}
                  className="flex items-start gap-3 p-3 rounded-lg shadow-sm bg-white/80 backdrop-blur-sm"
                >
                  <span className="text-xl shrink-0">{tip.icon}</span>
                  <div>
                    <div className="mb-1 font-semibold text-primary-blue-800">
                      {tip.title}
                    </div>
                    <div className="text-sm text-primary-blue-700">
                      {tip.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
