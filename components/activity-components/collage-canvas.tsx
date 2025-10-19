// components/activity-components/collage-canvas.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Image as ImageIcon,
  Type,
  Loader2,
  RotateCw,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for elements
  const generateId = () =>
    `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Handle drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragOver to false if we're leaving the canvas entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Validate file type and size
  const validateFile = (file: File): boolean => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error(
        `Invalid file type: ${file.name}. Please upload JPEG, PNG, GIF, or WebP images.`
      );
      return false;
    }

    if (file.size > maxSize) {
      toast.error(
        `File too large: ${file.name}. Please upload images smaller than 10MB.`
      );
      return false;
    }

    return true;
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Validate all files first
    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];

        // Optimize the image on client side before upload
        let optimizedFile = file;
        try {
          const { optimizeImage } = await import(
            "@/lib/utils/image-optimization"
          );
          const optimizationResult = await optimizeImage(file);
          optimizedFile = optimizationResult.optimizedFile;

          // Log optimization info
          if (optimizationResult.compressionRatio > 0) {
            console.log(
              `Image optimized: ${optimizationResult.compressionRatio.toFixed(
                1
              )}% size reduction`
            );
          }
        } catch (error) {
          console.warn(
            "Image optimization failed, using original file:",
            error
          );
          // Continue with original file if optimization fails
        }

        // Create form data
        const formData = new FormData();
        formData.append("file", optimizedFile);
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
  const deleteElement = async (elementId: string) => {
    const element = elements.find((el) => el.id === elementId);
    if (!element) return;

    setIsDeleting(true);

    try {
      // If it's an image element, delete it from storage first
      if (element.type === "image" && element.content) {
        try {
          const response = await fetch(
            `/api/journey/sessions/${sessionId}/a/my-life-collage/upload-image`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageUrl: element.content }),
            }
          );

          if (!response.ok) {
            console.error("Failed to delete image from storage and database");
            toast.error(
              "Failed to delete image from storage, but removed from canvas"
            );
          } else {
            toast.success(
              "Image deleted successfully from storage and database"
            );
          }
        } catch (error) {
          console.error(
            "Error deleting image from storage and database:",
            error
          );
          toast.error(
            "Failed to delete image from storage, but removed from canvas"
          );
        }
      }

      // Remove element from UI
      const updatedElements = elements.filter((el) => el.id !== elementId);
      onElementsChange(updatedElements);
      setSelectedElement(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle element selection
  const selectElement = (elementId: string) => {
    setSelectedElement(elementId);
  };

  // Enhanced drag functionality
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const element = elements.find((el) => el.id === elementId);
    if (!element) return;

    setDraggedElement(elementId);
    setSelectedElement(elementId);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setElementStart({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedElement || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (isResizing && resizeHandle) {
        // Handle resizing
        const deltaX = currentX - dragStart.x;
        const deltaY = currentY - dragStart.y;

        let newWidth = elementStart.width;
        let newHeight = elementStart.height;
        let newX = elementStart.x;
        let newY = elementStart.y;

        switch (resizeHandle) {
          case "se": // Southeast
            newWidth = Math.max(50, elementStart.width + deltaX);
            newHeight = Math.max(50, elementStart.height + deltaY);
            break;
          case "sw": // Southwest
            newWidth = Math.max(50, elementStart.width - deltaX);
            newHeight = Math.max(50, elementStart.height + deltaY);
            newX = elementStart.x + (elementStart.width - newWidth);
            break;
          case "ne": // Northeast
            newWidth = Math.max(50, elementStart.width + deltaX);
            newHeight = Math.max(50, elementStart.height - deltaY);
            newY = elementStart.y + (elementStart.height - newHeight);
            break;
          case "nw": // Northwest
            newWidth = Math.max(50, elementStart.width - deltaX);
            newHeight = Math.max(50, elementStart.height - deltaY);
            newX = elementStart.x + (elementStart.width - newWidth);
            newY = elementStart.y + (elementStart.height - newHeight);
            break;
        }

        const updatedElements = elements.map((el) =>
          el.id === draggedElement
            ? { ...el, x: newX, y: newY, width: newWidth, height: newHeight }
            : el
        );
        onElementsChange(updatedElements);
      } else if (isRotating) {
        // Handle rotation
        const element = elements.find((el) => el.id === draggedElement);
        if (element) {
          const centerX = element.x + element.width / 2;
          const centerY = element.y + element.height / 2;
          const angle =
            Math.atan2(currentY - centerY, currentX - centerX) *
            (180 / Math.PI);
          const newRotation = (angle + 90) % 360;

          const updatedElements = elements.map((el) =>
            el.id === draggedElement ? { ...el, rotation: newRotation } : el
          );
          onElementsChange(updatedElements);
        }
      } else {
        // Handle dragging
        const deltaX = currentX - dragStart.x;
        const deltaY = currentY - dragStart.y;

        const newX = Math.max(
          0,
          Math.min(
            canvas.offsetWidth - elementStart.width,
            elementStart.x + deltaX
          )
        );
        const newY = Math.max(
          0,
          Math.min(
            canvas.offsetHeight - elementStart.height,
            elementStart.y + deltaY
          )
        );

        const updatedElements = elements.map((el) =>
          el.id === draggedElement ? { ...el, x: newX, y: newY } : el
        );
        onElementsChange(updatedElements);
      }
    },
    [
      draggedElement,
      elements,
      onElementsChange,
      isResizing,
      resizeHandle,
      isRotating,
      dragStart,
      elementStart,
    ]
  );

  const handleMouseUp = () => {
    setDraggedElement(null);
    setIsResizing(false);
    setResizeHandle(null);
    setIsRotating(false);
  };

  // Handle resize handle mouse down
  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const element = elements.find((el) => el.id === selectedElement);
    if (!element) return;

    setIsResizing(true);
    setResizeHandle(handle);
    setDraggedElement(selectedElement);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setElementStart({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    });
  };

  // Handle rotation handle mouse down
  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const element = elements.find((el) => el.id === selectedElement);
    if (!element) return;

    setIsRotating(true);
    setDraggedElement(selectedElement);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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
          <>
            <div className="w-px h-8 bg-gray-300 mx-1" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => await deleteElement(selectedElement)}
              disabled={isDeleting}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        role="application"
        className={cn(
          "relative bg-white border-2 border-dashed rounded-lg overflow-hidden min-h-[400px] h-[600px] cursor-crosshair transition-all duration-200",
          isDragOver
            ? "border-blue-500 bg-blue-50/50 border-solid"
            : "border-gray-300"
        )}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          // Deselect element when clicking on canvas background
          if (e.target === e.currentTarget) {
            setSelectedElement(null);
          }
        }}
      >
        {/* Canvas Title */}
        <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-700 z-10">
          {title}
        </div>

        {/* Drag and Drop Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-20">
            <div className="text-center">
              <Upload className="size-12 mx-auto mb-3 text-blue-500" />
              <p className="text-lg font-medium text-blue-600">
                Drop images here
              </p>
              <p className="text-sm text-blue-500">
                Release to upload your images
              </p>
            </div>
          </div>
        )}

        {/* Elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            role="button"
            tabIndex={0}
            className={cn(
              "absolute cursor-move select-none group",
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
            {/* Element Content */}
            <div className="size-full relative">
              {element.type === "image" ? (
                <Image
                  src={element.content}
                  alt="Collage element"
                  fill
                  className="object-cover rounded shadow-sm"
                  draggable={false}
                />
              ) : element.type === "text" ? (
                <div
                  role="textbox"
                  tabIndex={0}
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

              {/* Selection Controls - Only show when element is selected */}
              {selectedElement === element.id && (
                <>
                  {/* Resize Handles */}
                  <button
                    type="button"
                    className="absolute -top-1 -left-1 size-3 bg-blue-500 border border-white rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
                    aria-label="Resize northwest"
                  />
                  <button
                    type="button"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 size-3 bg-blue-500 border border-white rounded-full cursor-n-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeMouseDown(e, "n")}
                    aria-label="Resize north"
                  />
                  <button
                    type="button"
                    className="absolute -top-1 -right-1 size-3 bg-blue-500 border border-white rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
                    aria-label="Resize northeast"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 -left-1 size-3 bg-blue-500 border border-white rounded-full cursor-w-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeMouseDown(e, "w")}
                    aria-label="Resize west"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 -right-1 size-3 bg-blue-500 border border-white rounded-full cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeMouseDown(e, "e")}
                    aria-label="Resize east"
                  />
                  <button
                    type="button"
                    className="absolute -bottom-1 -left-1 size-3 bg-blue-500 border border-white rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
                    aria-label="Resize southwest"
                  />
                  <button
                    type="button"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-3 bg-blue-500 border border-white rounded-full cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeMouseDown(e, "s")}
                    aria-label="Resize south"
                  />
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 size-3 bg-blue-500 border border-white rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeMouseDown(e, "se")}
                    aria-label="Resize southeast"
                  />

                  {/* Rotation Handle */}
                  <button
                    type="button"
                    className="absolute -top-8 left-1/2 -translate-x-1/2 size-6 bg-green-500 border border-white rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={handleRotateMouseDown}
                    title="Rotate"
                    aria-label="Rotate element"
                  >
                    <RotateCw className="size-3 text-white" />
                  </button>

                  {/* Move Handle */}
                  <button
                    type="button"
                    className="absolute -top-8 -right-1 size-6 bg-gray-500 border border-white rounded-full cursor-move flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Move"
                    aria-label="Move element"
                  >
                    <Move className="size-3 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {elements.length === 0 && !isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ImageIcon className="size-12 mx-auto mb-3" />
              <p className="text-lg font-medium">Start creating your collage</p>
              <p className="text-sm">
                Drag & drop images here or use the upload button
              </p>
              <p className="text-xs mt-1 text-gray-300">
                Supports JPEG, PNG, GIF, WebP (max 10MB)
              </p>
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
