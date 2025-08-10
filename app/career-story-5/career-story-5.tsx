"use client";
import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Sticker as Sticky,
  Grid3X3,
  Palette,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/form-components/header";

interface StickyNote {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  createdAt: Date;
}

interface CareerStoryFiveProps {
  className?: string;
}

const STICKY_COLORS = [
  {
    name: "Soft Yellow",
    value: "bg-yellow-100",
    border: "border-yellow-200",
    text: "text-yellow-800",
    shadow: "shadow-yellow-200/50",
  },
  {
    name: "Gentle Pink",
    value: "bg-pink-100",
    border: "border-pink-200",
    text: "text-pink-800",
    shadow: "shadow-pink-200/50",
  },
  {
    name: "Sky Blue",
    value: "bg-blue-100",
    border: "border-blue-200",
    text: "text-blue-800",
    shadow: "shadow-blue-200/50",
  },
  {
    name: "Mint Green",
    value: "bg-green-100",
    border: "border-green-200",
    text: "text-green-800",
    shadow: "shadow-green-200/50",
  },
  {
    name: "Lavender",
    value: "bg-purple-100",
    border: "border-purple-200",
    text: "text-purple-800",
    shadow: "shadow-purple-200/50",
  },
  {
    name: "Peach",
    value: "bg-orange-100",
    border: "border-orange-200",
    text: "text-orange-800",
    shadow: "shadow-orange-200/50",
  },
];

// Default sticky notes with dummy content
const DEFAULT_STICKY_NOTES: StickyNote[] = [
  {
    id: "default-1",
    content:
      "My core values include integrity, creativity, and helping others achieve their potential.",
    color: "bg-yellow-100",
    position: { x: 50, y: 100 },
    createdAt: new Date(),
  },
  {
    id: "default-2",
    content:
      "I thrive in collaborative environments where innovation and teamwork are valued.",
    color: "bg-green-100",
    position: { x: 300, y: 150 },
    createdAt: new Date(),
  },
  {
    id: "default-3",
    content:
      "My ideal career combines analytical thinking with meaningful human connections.",
    color: "bg-blue-100",
    position: { x: 550, y: 120 },
    createdAt: new Date(),
  },
];

export function CareerStoryFive({ className = "" }: CareerStoryFiveProps) {
  const [stickyNotes, setStickyNotes] =
    useState<StickyNote[]>(DEFAULT_STICKY_NOTES);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(STICKY_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const addStickyNote = () => {
    const newNote: StickyNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: "",
      color: selectedColor.value,
      position: {
        x: Math.random() * 500 + 50,
        y: Math.random() * 300 + 100,
      },
      createdAt: new Date(),
    };

    setStickyNotes((prev) => [...prev, newNote]);
    setEditingNote(newNote.id);
    setEditContent("");
  };

  const updateStickyNote = (id: string, content: string) => {
    setStickyNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, content } : note))
    );
  };

  const updateStickyNotePosition = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setStickyNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, position } : note))
    );
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const startEditing = (note: StickyNote) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingNote) {
      updateStickyNote(editingNote, editContent);
      setEditingNote(null);
      setEditContent("");
    }
  };

  const cancelEdit = () => {
    if (editingNote) {
      const note = stickyNotes.find((n) => n.id === editingNote);
      if (note && !note.content) {
        deleteStickyNote(editingNote);
      }
    }
    setEditingNote(null);
    setEditContent("");
  };

  const getColorClasses = (colorValue: string) => {
    const colorObj = STICKY_COLORS.find((c) => c.value === colorValue);
    return colorObj || STICKY_COLORS[0];
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, noteId: string) => {
      if (editingNote) return; // Don't drag while editing

      const rect = e.currentTarget.getBoundingClientRect();
      const note = stickyNotes.find((n) => n.id === noteId);
      if (!note) return;

      setDraggedNote(noteId);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      e.preventDefault();
    },
    [editingNote, stickyNotes]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedNote || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - dragOffset.x;
      const y = e.clientY - canvasRect.top - dragOffset.y;

      // Constrain to canvas bounds
      const maxX = canvasRect.width - 192; // 192px is sticky note width
      const maxY = canvasRect.height - 192; // 192px is sticky note height

      const constrainedX = Math.max(0, Math.min(x, maxX));
      const constrainedY = Math.max(0, Math.min(y, maxY));

      updateStickyNotePosition(draggedNote, {
        x: constrainedX,
        y: constrainedY,
      });
    },
    [draggedNote, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedNote(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Close color picker when clicking outside
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (showColorPicker) {
        setShowColorPicker(false);
      }
    },
    [showColorPicker]
  );

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-primary-blue-25 via-white to-primary-green-25 p-4 sm:py-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <Header
          headerIcon={Sparkles}
          headerText="Story Boarding"
          headerDescription="Create and organize your story elements using beautiful interactive sticky notes"
        />

        {/* Controls */}
        <Card className="mb-8 bg-white/90 backdrop-blur-xl border border-slate-300 shadow-2xl shadow-primary-blue-100/20 rounded-3xl overflow-hidden relative ">
          <CardHeader className="bg-gradient-to-r from-primary-blue-50/80 to-primary-green-50/80 border-b border-primary-blue-100/30">
            <CardTitle className="flex items-center gap-4 text-primary-blue-800">
              <div className="p-3 bg-gradient-to-br from-primary-blue-500 to-primary-green-500 rounded-2xl shadow-lg">
                <Palette className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text text-transparent">
                  Story Board Controls
                </h3>
                <p className="text-sm text-primary-blue-600/80 font-medium mt-1">
                  Customize your creative workspace
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary-blue-700">
                    Sticky Note Color:
                  </span>
                  <div className="relative z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(!showColorPicker);
                      }}
                      className={`size-12 rounded-2xl border-3 ${selectedColor.border} ${selectedColor.value} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-3`}
                    />
                    {showColorPicker && (
                      <div className="absolute -top-16 left-0 z-20 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary-blue-200/50 p-4 min-w-[200px]">
                        <div className="grid grid-cols-3 gap-3">
                          {STICKY_COLORS.map((color) => (
                            <button
                              key={color.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColor(color);
                                setShowColorPicker(false);
                              }}
                              className={`size-12 rounded-xl border-2 ${
                                color.border
                              } ${
                                color.value
                              } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-3 ${
                                selectedColor.name === color.name
                                  ? "ring-3 ring-primary-blue-400 ring-offset-2 scale-110"
                                  : ""
                              }`}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gradient-to-r from-primary-blue-50 to-primary-green-50 rounded-2xl px-4 py-2 border border-primary-blue-200/50">
                  <Sticky className="size-5 text-primary-blue-600" />
                  <span className="text-sm font-semibold text-primary-blue-700">
                    {stickyNotes.length} sticky notes
                  </span>
                </div>
              </div>

              <Button
                onClick={addStickyNote}
                className="group bg-gradient-to-r from-primary-blue-500 to-primary-green-500 hover:from-primary-blue-600 hover:to-primary-green-600 text-white rounded-2xl px-6 py-3 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2">
                  <Plus className="size-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Add Sticky Note</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Story Board Canvas */}
        <Card className="bg-white/90 backdrop-blur-xl border border-slate-300 shadow-2xl shadow-primary-blue-100/20 rounded-3xl overflow-hidden relative ">
          <CardHeader className="bg-gradient-to-r from-primary-blue-50/80 to-primary-green-50/80 border-b border-primary-blue-100/30">
            <CardTitle className="flex items-center gap-4 text-primary-blue-800">
              <div className="p-3 bg-gradient-to-br from-primary-blue-500 to-primary-green-500 rounded-2xl shadow-lg">
                <Grid3X3 className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text text-transparent">
                  Story Board Canvas
                </h3>
                <p className="text-sm text-primary-blue-600/80 font-medium mt-1">
                  Drag and arrange your story elements freely
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div
              ref={canvasRef}
              className="relative min-h-[700px] bg-gradient-to-br from-primary-blue-25/30 to-primary-green-25/30 rounded-2xl border-2 border-dashed border-primary-blue-200/50 overflow-hidden select-none"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleCanvasClick}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
                    backgroundSize: "30px 30px",
                  }}
                />
              </div>

              {/* Sticky Notes */}
              {stickyNotes.map((note) => {
                const colorClasses = getColorClasses(note.color);
                const isEditing = editingNote === note.id;
                const isDragging = draggedNote === note.id;

                return (
                  <div
                    key={note.id}
                    className={`absolute size-48 ${note.color} ${
                      colorClasses.border
                    } border-2 rounded-2xl shadow-xl ${
                      colorClasses.shadow
                    } transition-all duration-200 group/note ${
                      isDragging
                        ? "scale-105 rotate-2 shadow-2xl z-50 cursor-grabbing"
                        : isEditing
                        ? "z-40"
                        : "hover:shadow-2xl hover:scale-105 hover:-rotate-1 cursor-grab z-30"
                    }`}
                    style={{
                      left: `${note.position.x}px`,
                      top: `${note.position.y}px`,
                      userSelect: "none",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, note.id)}
                  >
                    {isEditing ? (
                      <div className="size-full p-4 flex flex-col">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className={`flex-1 bg-transparent border-none outline-none resize-none text-sm ${colorClasses.text} placeholder:text-gray-500 font-medium leading-relaxed`}
                          placeholder="Enter your story element..."
                          autoFocus
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEdit();
                            }}
                            className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                          >
                            <Save className="size-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEdit();
                            }}
                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="size-full p-4 overflow-hidden pointer-events-none">
                          <p
                            className={`text-sm ${colorClasses.text} leading-relaxed font-medium break-words`}
                          >
                            {note.content || "Click to edit..."}
                          </p>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover/note:opacity-100 transition-all duration-300 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(note);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="p-2 bg-primary-blue-500 text-white rounded-xl hover:bg-primary-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                          >
                            <Edit3 className="size-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStickyNote(note.id);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Empty State Message */}
              {stickyNotes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="p-6 bg-gradient-to-br from-primary-blue-100 to-primary-green-100 rounded-3xl shadow-xl mb-4 inline-block">
                      <Sticky className="size-12 text-primary-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-blue-700 mb-2">
                      Start Your Story Board
                    </h3>
                    <p className="text-primary-blue-600/80 font-medium">
                      Click "Add Sticky Note" to begin organizing your ideas
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 bg-white/90 backdrop-blur-xl border border-slate-300 shadow-2xl shadow-primary-blue-100/20 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary-blue-500 to-primary-green-500 rounded-2xl shadow-lg">
                  <Sparkles className="size-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text text-transparent">
                  How to Use Story Boarding
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-primary-blue-25 to-primary-blue-50 rounded-2xl border border-primary-blue-100/50">
                  <div className="p-2 bg-primary-blue-500 rounded-xl shadow-lg">
                    <Plus className="size-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary-blue-800 mb-2">
                      Add Sticky Notes
                    </p>
                    <p className="text-primary-blue-700 leading-relaxed">
                      Click "Add Sticky Note" to create new story elements
                      anywhere on the canvas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-primary-green-25 to-primary-green-50 rounded-2xl border border-primary-green-100/50">
                  <div className="p-2 bg-primary-green-500 rounded-xl shadow-lg">
                    <Edit3 className="size-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary-green-800 mb-2">
                      Edit Content
                    </p>
                    <p className="text-primary-green-700 leading-relaxed">
                      Click the edit button on any sticky note to modify its
                      content
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-primary-blue-25 to-primary-blue-50 rounded-2xl border border-primary-blue-100/50">
                  <div className="p-2 bg-primary-blue-500 rounded-xl shadow-lg">
                    <Palette className="size-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary-blue-800 mb-2">
                      Choose Colors
                    </p>
                    <p className="text-primary-blue-700 leading-relaxed">
                      Select different colors for your sticky notes to organize
                      by themes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-primary-green-25 to-primary-green-50 rounded-2xl border border-primary-green-100/50">
                  <div className="p-2 bg-primary-green-500 rounded-xl shadow-lg">
                    <Grid3X3 className="size-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary-green-800 mb-2">
                      Drag & Arrange
                    </p>
                    <p className="text-primary-green-700 leading-relaxed">
                      Drag sticky notes around the canvas to organize your story
                      elements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Progress Button */}
        <div className="flex justify-center mt-8">
          <Button className="group relative px-10 py-6 bg-gradient-to-r from-primary-green-500 to-primary-blue-500 text-white rounded-2xl font-bold text-lg hover:from-primary-green-600 hover:to-primary-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green-400 to-primary-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <span>Save Progress</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
