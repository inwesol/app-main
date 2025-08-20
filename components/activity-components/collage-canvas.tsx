// components/activity-components/collage-canvas.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Type,
  Palette,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface CollageElement {
  id: string;
  type: "image" | "text" | "shape";
  content: string; // URL for images, text for text elements
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  style?: {
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    backgroundColor?: string;
    borderRadius?: number;
    opacity?: number;
  };
}

interface CollageCanvasProps {
  elements: CollageElement[];
  onElementsChange: (elements: CollageElement[]) => void;
  title: string;
  className?: string;
  sessionId?: string;
}

export const CollageCanvas: React.FC<CollageCanvasProps> = ({
  elements,
  onElementsChange,
  title,
  className,
  sessionId,
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for elements
  const generateId = () =>
    `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "imageType",
          title.toLowerCase().includes("present") ? "present" : "future"
        );

        // Upload to API
        const response = await fetch(
          `/api/journey/sessions/${sessionId}/a/my-life-collage/upload-image`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const { data } = await response.json();

        // Add image element to canvas
        const newElement: CollageElement = {
          id: generateId(),
          type: "image",
          content: data.url,
          x: Math.random() * 200 + 50,
          y: Math.random() * 200 + 50,
          width: 150,
          height: 150,
          rotation: 0,
          zIndex: elements.length + 1,
        };

        onElementsChange([...elements, newElement]);
      }

      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle text addition
  const addTextElement = () => {
    const newElement: CollageElement = {
      id: generateId(),
      type: "text",
      content: "Double click to edit",
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      width: 200,
      height: 40,
      rotation: 0,
      zIndex: elements.length + 1,
      style: {
        fontSize: 16,
        fontWeight: "normal",
        color: "#000000",
      },
    };

    onElementsChange([...elements, newElement]);
  };

  // Handle element deletion
  const deleteElement = (elementId: string) => {
    const updatedElements = elements.filter((el) => el.id !== elementId);
    onElementsChange(updatedElements);
    setSelectedElement(null);
  };

  // Handle element selection
  const selectElement = (elementId: string) => {
    setSelectedElement(elementId);
  };

  // Handle element drag
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setDraggedElement(elementId);
    setSelectedElement(elementId);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedElement || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const updatedElements = elements.map((el) =>
        el.id === draggedElement
          ? { ...el, x: x - el.width / 2, y: y - el.height / 2 }
          : el
      );

      onElementsChange(updatedElements);
    },
    [draggedElement, elements, onElementsChange]
  );

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  // Handle text editing
  const handleTextEdit = (elementId: string, newText: string) => {
    const updatedElements = elements.map((el) =>
      el.id === elementId ? { ...el, content: newText } : el
    );
    onElementsChange(updatedElements);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-4 bg-white/50 rounded-lg border border-gray-200">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          {isUploading ? "Uploading..." : "Add Images"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTextElement}
          className="flex items-center gap-2"
        >
          <Type className="size-4" />
          Add Text
        </Button>

        {selectedElement && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => deleteElement(selectedElement)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <X className="size-4" />
            Delete
          </Button>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
        style={{ minHeight: "400px", height: "600px" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Canvas Title */}
        <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700 z-10">
          {title}
        </div>

        {/* Elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            className={cn(
              "absolute cursor-move select-none",
              selectedElement === element.id &&
                "ring-2 ring-blue-500 ring-offset-1"
            )}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              transform: `rotate(${element.rotation}deg)`,
              zIndex: element.zIndex,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={() => selectElement(element.id)}
          >
            {element.type === "image" ? (
              <img
                src={element.content}
                alt="Collage element"
                className="size-full object-cover rounded shadow-sm"
                draggable={false}
              />
            ) : element.type === "text" ? (
              <div
                className="size-full flex items-center justify-center bg-transparent border-2 border-transparent hover:border-gray-300 rounded px-2"
                style={{
                  fontSize: element.style?.fontSize || 16,
                  fontWeight: element.style?.fontWeight || "normal",
                  color: element.style?.color || "#000000",
                  backgroundColor:
                    element.style?.backgroundColor || "transparent",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  const newText = prompt("Edit text:", element.content);
                  if (newText !== null) {
                    handleTextEdit(element.id, newText);
                  }
                }}
              >
                {element.content}
              </div>
            ) : null}
          </div>
        ))}

        {/* Empty state */}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ImageIcon className="size-12 mx-auto mb-3" />
              <p className="text-lg font-medium">Start creating your collage</p>
              <p className="text-sm">Upload images or add text to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Element count info */}
      <div className="text-sm text-gray-500 text-center">
        {elements.length} element{elements.length !== 1 ? "s" : ""} in your
        collage
      </div>
    </div>
  );
};
