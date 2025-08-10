import React, { useRef, useCallback } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollageElement } from "@/lib/schemas/questionnaire-schemas/collage-schema";

interface CollageCanvasProps {
  elements: CollageElement[];
  onElementsChange: (elements: CollageElement[]) => void;
  title: string;
  className?: string;
}

export const CollageCanvas: React.FC<CollageCanvasProps> = ({
  elements,
  onElementsChange,
  title,
  className = "",
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateCollageLayout = useCallback((imageCount: number) => {
    const canvasWidth = 1200;
    const canvasHeight = 400;

    if (imageCount === 0) return [];

    let cols, rows;

    // Determine grid layout based on number of images
    if (imageCount === 1) {
      cols = 1;
      rows = 1;
    } else if (imageCount === 2) {
      cols = 2;
      rows = 1;
    } else if (imageCount <= 4) {
      cols = 2;
      rows = 2;
    } else if (imageCount <= 6) {
      cols = 3;
      rows = 2;
    } else if (imageCount <= 9) {
      cols = 3;
      rows = 3;
    } else if (imageCount <= 12) {
      cols = 4;
      rows = 3;
    } else {
      cols = 4;
      rows = 4;
    }

    // Calculate cell dimensions to fill entire canvas
    const cellWidth = canvasWidth / cols;
    const cellHeight = canvasHeight / rows;

    const positions = [];
    for (let i = 0; i < Math.min(imageCount, cols * rows); i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      positions.push({
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
      });
    }

    return positions;
  }, []);

  const addImages = useCallback(
    (imageUrls: string[]) => {
      const newElements: CollageElement[] = [];
      const positions = calculateCollageLayout(
        elements.length + imageUrls.length
      );

      // Keep existing elements with updated positions
      elements.forEach((element, index) => {
        if (positions[index]) {
          newElements.push({
            ...element,
            ...positions[index],
          });
        }
      });

      // Add new images
      imageUrls.forEach((imageUrl, index) => {
        const positionIndex = elements.length + index;
        if (positions[positionIndex]) {
          newElements.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            type: "image",
            content: imageUrl,
            zIndex: positionIndex + 1,
            ...positions[positionIndex],
          });
        }
      });

      onElementsChange(newElements);
    },
    [elements, onElementsChange, calculateCollageLayout]
  );

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      const imageUrls: string[] = [];
      let loadedCount = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          imageUrls.push(imageUrl);
          loadedCount++;

          if (loadedCount === files.length) {
            addImages(imageUrls);
          }
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      event.target.value = "";
    },
    [addImages]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length === 0) return;

      const imageUrls: string[] = [];
      let loadedCount = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          imageUrls.push(imageUrl);
          loadedCount++;

          if (loadedCount === files.length) {
            addImages(imageUrls);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [addImages]
  );

  const clearCollage = useCallback(() => {
    onElementsChange([]);
  }, [onElementsChange]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Simple Toolbar */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/60">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Upload className="size-4" />
              Upload Photos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <span className="text-sm text-slate-600">
              {elements.length} photo{elements.length !== 1 ? "s" : ""} added
            </span>
          </div>

          {elements.length > 0 && (
            <Button
              onClick={clearCollage}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="size-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </Card>

      {/* Canvas */}
      <Card className="relative overflow-hidden bg-white border-2 border-dashed border-slate-300">
        <div className="absolute top-4 left-4 z-10">
          <span className="text-sm font-medium text-slate-600 bg-white/80 px-2 py-1 rounded">
            {title}
          </span>
        </div>

        <div
          ref={canvasRef}
          className="relative w-full h-96 cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {elements.map((element) => (
            <div
              key={element.id}
              className="absolute overflow-hidden"
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                zIndex: element.zIndex,
              }}
            >
              <img
                src={element.content}
                alt="Collage element"
                className="size-full object-cover"
                draggable={false}
              />
            </div>
          ))}

          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Upload className="size-16 mx-auto mb-4 text-slate-300" />
                <p className="text-xl font-medium mb-2">Create Your Collage</p>
                <p className="text-sm mb-4">
                  Click here or drag and drop photos to automatically create a
                  collage
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>• Upload multiple photos at once</p>
                  <p>• Photos will fill the entire canvas space</p>
                  <p>• Supports JPG, PNG, and other image formats</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {elements.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Your collage fills the entire canvas. Upload more photos to create a
            denser grid!
          </p>
        </div>
      )}
    </div>
  );
};
