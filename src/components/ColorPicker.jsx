import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, MousePointer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ColorPicker = ({ imageSrc, onColorSelect, selectedColor, onReset }) => {
  const [isActive, setIsActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [pickedColor, setPickedColor] = useState(null);
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
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;

    const color = [r, g, b];
    setPickedColor(color);
    onColorSelect(color);
    setIsActive(false);
  };

  const handleMouseMove = (e) => {
    if (!isActive) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
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
        
        {/* Click indicator when active */}
        {isActive && (
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
            style={{
              left: cursorPosition.x - 8,
              top: cursorPosition.y - 8,
            }}
          />
        )}
      </div>

      {/* Color Picker Controls */}
      <div className="flex items-center justify-center gap-4">
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
              Click anywhere on the test tube to select the exact color
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
