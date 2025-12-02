import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, MousePointer, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const ColorPicker = ({ imageSrc, onColorSelect, selectedColor, onReset }) => {
  const [isActive, setIsActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [pickedColor, setPickedColor] = useState(null);
  const [sampleSize, setSampleSize] = useState(20); // Default 20x20 pixels
  const [useMedian, setUseMedian] = useState(false); // Toggle between average and median
  const [displaySampleSize, setDisplaySampleSize] = useState(20); // Scaled size for display
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas size to match image display size
        const rect = imageRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      
      img.src = imageSrc;
    }
  }, [imageSrc]);

  /**
   * Calculate brightness of an RGB pixel
   */
  const calculateBrightness = (r, g, b) => {
    // Using relative luminance formula
    return (r * 0.299 + g * 0.587 + b * 0.114);
  };

  /**
   * Sample a region around the tap point and calculate average/median RGB
   */
  const sampleRegionRGB = (ctx, centerX, centerY, size, useMedian = false) => {
    const halfSize = Math.floor(size / 2);
    
    // Calculate bounds, ensuring we don't go outside canvas
    const startX = Math.max(0, Math.floor(centerX - halfSize));
    const startY = Math.max(0, Math.floor(centerY - halfSize));
    const endX = Math.min(ctx.canvas.width, Math.floor(centerX + halfSize));
    const endY = Math.min(ctx.canvas.height, Math.floor(centerY + halfSize));
    
    const width = endX - startX;
    const height = endY - startY;
    
    // Get image data for the region
    const imageData = ctx.getImageData(startX, startY, width, height);
    const data = imageData.data;
    
    // Collect valid pixels (non-transparent and not too bright)
    const validPixels = [];
    const brightnessThreshold = 250; // Ignore extremely bright glare pixels
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3]; // Alpha channel
      
      // Skip transparent pixels (alpha < 255)
      if (a < 255) continue;
      
      // Skip extremely bright pixels (glare)
      const brightness = calculateBrightness(r, g, b);
      if (brightness > brightnessThreshold) continue;
      
      validPixels.push({ r, g, b });
    }
    
    if (validPixels.length === 0) {
      // Fallback: if no valid pixels, use all non-transparent pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a >= 255) {
          validPixels.push({ r, g, b });
        }
      }
    }
    
    if (validPixels.length === 0) {
      // Last resort: use center pixel
      const centerIdx = Math.floor((width * height) / 2) * 4;
      return [
        Math.round(data[centerIdx]),
        Math.round(data[centerIdx + 1]),
        Math.round(data[centerIdx + 2])
      ];
    }
    
    if (useMedian) {
      // Calculate median RGB
      const sortedR = validPixels.map(p => p.r).sort((a, b) => a - b);
      const sortedG = validPixels.map(p => p.g).sort((a, b) => a - b);
      const sortedB = validPixels.map(p => p.b).sort((a, b) => a - b);
      
      const mid = Math.floor(sortedR.length / 2);
      return [
        sortedR.length % 2 === 0 
          ? Math.round((sortedR[mid - 1] + sortedR[mid]) / 2)
          : sortedR[mid],
        sortedG.length % 2 === 0 
          ? Math.round((sortedG[mid - 1] + sortedG[mid]) / 2)
          : sortedG[mid],
        sortedB.length % 2 === 0 
          ? Math.round((sortedB[mid - 1] + sortedB[mid]) / 2)
          : sortedB[mid]
      ];
    } else {
      // Calculate average RGB
      const sum = validPixels.reduce(
        (acc, pixel) => ({
          r: acc.r + pixel.r,
          g: acc.g + pixel.g,
          b: acc.b + pixel.b
        }),
        { r: 0, g: 0, b: 0 }
      );
      
      return [
        Math.round(sum.r / validPixels.length),
        Math.round(sum.g / validPixels.length),
        Math.round(sum.b / validPixels.length)
      ];
    }
  };

  const handleImageClick = (e) => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    
    // Sample region around tap point
    const color = sampleRegionRGB(ctx, x, y, sampleSize, useMedian);
    
    setPickedColor(color);
    onColorSelect(color);
    setIsActive(false);
  };

  const handleMouseMove = (e) => {
    if (!isActive) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCursorPosition({ x, y });
    
    // Calculate display size for the sampling region indicator
    if (canvasRef.current && imageRef.current) {
      const scaleX = rect.width / canvasRef.current.width;
      const scaleY = rect.height / canvasRef.current.height;
      const scaledSize = sampleSize * Math.min(scaleX, scaleY);
      setDisplaySampleSize(scaledSize);
    }
  };

  const toggleColorPicker = () => {
    setIsActive(!isActive);
  };

  const resetColor = () => {
    setPickedColor(null);
    onReset();
  };

  return (
    <div className="space-y-4">
      {/* Image Display */}
      <div className="relative">
        <img
          ref={imageRef}
          data-testid="image-preview"
          src={imageSrc}
          alt="Preview"
          className={`w-full max-h-96 object-contain rounded-2xl ${
            isActive ? 'cursor-crosshair' : 'cursor-default'
          }`}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
        />
        
        {/* Click indicator when active - show three circles in triangle shape */}
        {isActive && (
          <>
            {/* Triangle sampling circles */}
            <div className="absolute pointer-events-none z-10" style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: 'translate(-50%, -50%)',
              width: displaySampleSize,
              height: displaySampleSize,
            }}>
              {/* Top circle */}
              <div
                className="absolute w-full h-full rounded-full border-2 border-blue-500 shadow-lg"
                style={{
                  top: `-${displaySampleSize / 2}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: displaySampleSize,
                  height: displaySampleSize,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                }}
              />
              {/* Bottom-left circle */}
              <div
                className="absolute w-full h-full rounded-full border-2 border-green-500 shadow-lg"
                style={{
                  bottom: `-${displaySampleSize / 2}px`,
                  left: `-${10}px`,
                  width: displaySampleSize,
                  height: displaySampleSize,
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                }}
              />
              {/* Bottom-right circle */}
              <div
                className="absolute w-full h-full rounded-full border-2 border-red-500 shadow-lg"
                style={{
                  bottom: `-${displaySampleSize / 2}px`,
                  right: `-${20}px`,
                  width: displaySampleSize,
                  height: displaySampleSize,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Color Picker Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button
            onClick={toggleColorPicker}
            variant={isActive ? "default" : "outline"}
            className={`${
              isActive 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Palette className="mr-2 h-4 w-4" />
            {isActive ? "Click on Image to Pick Color" : "Pick Color Manually"}
          </Button>
          
          {(pickedColor || selectedColor) && (
            <Button
              onClick={resetColor}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Auto
            </Button>
          )}
        </div>

        {/* Sampling Settings */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-gray-50 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Settings className="h-4 w-4" />
              Sampling Settings
            </div>
            
            {/* Sample Size Control */}
            <div className="space-y-2">
              <label className="text-xs text-gray-600">
                Sample Size: {sampleSize}×{sampleSize} pixels
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-12 text-right">
                  {sampleSize}px
                </span>
              </div>
              <div className="flex gap-2 text-xs text-gray-500">
                <button
                  onClick={() => setSampleSize(10)}
                  className={`px-2 py-1 rounded ${sampleSize === 10 ? 'bg-blue-100 text-blue-700' : ''}`}
                >
                  10×10
                </button>
                <button
                  onClick={() => setSampleSize(20)}
                  className={`px-2 py-1 rounded ${sampleSize === 20 ? 'bg-blue-100 text-blue-700' : ''}`}
                >
                  20×20
                </button>
                <button
                  onClick={() => setSampleSize(30)}
                  className={`px-2 py-1 rounded ${sampleSize === 30 ? 'bg-blue-100 text-blue-700' : ''}`}
                >
                  30×30
                </button>
              </div>
            </div>

            {/* Average vs Median Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Calculation Method:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUseMedian(false)}
                  className={`px-3 py-1 rounded text-xs ${
                    !useMedian 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Average
                </button>
                <button
                  onClick={() => setUseMedian(true)}
                  className={`px-3 py-1 rounded text-xs ${
                    useMedian 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Median
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
        >
            <div className="flex items-center justify-center gap-2 text-blue-700">
            <MousePointer className="h-4 w-4" />
            <span className="text-sm font-medium">
              Click on the test tube to sample a {sampleSize}×{sampleSize} region ({useMedian ? 'median' : 'average'} RGB)
            </span>
          </div>
        </motion.div>
      )}

      {/* Selected Color Display */}
      {(pickedColor || selectedColor) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Selected Color</p>
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                style={{
                  backgroundColor: `rgb(${pickedColor?.[0] || selectedColor?.[0]}, ${pickedColor?.[1] || selectedColor?.[1]}, ${pickedColor?.[2] || selectedColor?.[2]})`
                }}
              />
              <div className="text-left">
                <p className="text-sm font-mono text-gray-700">
                  R: {pickedColor?.[0] || selectedColor?.[0]}
                </p>
                <p className="text-sm font-mono text-gray-700">
                  G: {pickedColor?.[1] || selectedColor?.[1]}
                </p>
                <p className="text-sm font-mono text-gray-700">
                  B: {pickedColor?.[2] || selectedColor?.[2]}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hidden Canvas for Color Detection */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
};

export default ColorPicker;
