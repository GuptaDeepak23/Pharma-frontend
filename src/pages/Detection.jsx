import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, Loader2, AlertCircle, CheckCircle2, Palette, Brain, Lightbulb, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ColorPicker";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL ='https://pharmacy-project-lh5x.onrender.com';
const API = `${BACKEND_URL}/api`;

export default function Detection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [manualColor, setManualColor] = useState(null);
  const [useManualColor, setUseManualColor] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setManualColor(null);
      setUseManualColor(false);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      // Add manual color if user selected one
      if (useManualColor && manualColor) {
        console.log("🎨 Sending manual color:", manualColor);
        formData.append("manual_color", JSON.stringify(manualColor));
      } else {
        console.log("🔄 Using automatic detection");
      }

      const response = await axios.post(`${API}/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setResult(response.data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error.response?.data?.detail || "Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (color) => {
    setManualColor(color);
    setUseManualColor(true);
  };

  const handleColorReset = () => {
    setManualColor(null);
    setUseManualColor(false);
  };

  const getStatusColor = (status) => {
    if (status === "Safe") return "text-green-600 bg-green-50";
    if (status.includes("Slight")) return "text-yellow-600 bg-yellow-50";
    if (status === "Contaminated") return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusIcon = (status) => {
    if (status === "Safe") return <CheckCircle2 className="h-6 w-6" />;
    return <AlertCircle className="h-6 w-6" />;
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getConfidenceIcon = (score) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E3A8A] mb-4">
            Heavy Metal Detection with AI Recommendations
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Upload a test tube image for color-based detection and AI-powered safety recommendations
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-8"
        >
          {!preview ? (
            <div className="space-y-6">
              <div
                data-testid="upload-zone"
                className="border-3 border-dashed border-[#2563EB] rounded-2xl p-12 text-center hover:bg-blue-50/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-input').click()}
              >
                <Upload className="h-16 w-16 text-[#2563EB] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                  Click to Upload Image
                </h3>
                <p className="text-sm text-gray-500">
                  Support: JPG, PNG, JPEG
                </p>
              </div>

              <input
                id="file-input"
                data-testid="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Or capture directly</p>
                <Button
                  data-testid="camera-btn"
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Use Camera
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview with Color Picker */}
              <div className="relative">
                <ColorPicker
                  imageSrc={preview}
                  onColorSelect={handleColorSelect}
                  selectedColor={manualColor}
                  onReset={handleColorReset}
                />
              </div>

              {/* Detection Method Indicator */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-600">
                  {useManualColor ? (
                    <>
                      <Palette className="h-4 w-4" />
                      Using Manual Color Selection
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4" />
                      Using Automatic Detection
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <Button
                  data-testid="change-image-btn"
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setResult(null);
                    setManualColor(null);
                    setUseManualColor(false);
                  }}
                  className="border-gray-300"
                >
                  Change Image
                </Button>
                <Button
                  data-testid="start-analysis-btn"
                  onClick={()=>{
                    handleAnalysis();
                     window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                    }}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white px-8"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Start Analysis"
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl p-12 shadow-xl text-center"
          >
            <Loader2 className="h-16 w-16 text-[#2563EB] mx-auto mb-4 animate-spin" />
            <p className="text-lg text-gray-600">Analyzing sample and generating AI recommendations, please wait…</p>
          </motion.div>
        )}

        {/* Result Card */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            data-testid="result-card"
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#1E3A8A] mb-2">
                Analysis Results
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-sm text-[#1E3A8A]">
                <Brain className="h-4 w-4" />
                AI-Powered Safety Recommendations
              </div>
            </div>

            <div className="space-y-6">
              {/* Metal Name */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Detected Metal
                </label>
                <div
                  data-testid="metal-name"
                  className="text-2xl font-bold text-[#1E3A8A]"
                >
                  {result.metal}
                </div>
              </div>

              {/* Concentration */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Concentration
                </label>
                <div
                  data-testid="concentration"
                  className="text-2xl font-bold text-[#2563EB]"
                >
                  {result.concentration}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Status
                </label>
                <div
                  data-testid="status"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${getStatusColor(result.status)}`}
                >
                  {getStatusIcon(result.status)}
                  {result.status}
                </div>
              </div>


              {/* Detected Color */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Detected Color (RGB)
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl shadow-md"
                    style={{
                      backgroundColor: `rgb(${result.detected_rgb[0]}, ${result.detected_rgb[1]}, ${result.detected_rgb[2]})`
                    }}
                  />
                  <span className="text-lg text-gray-700">
                    R: {result.detected_rgb[0]}, G: {result.detected_rgb[1]}, B: {result.detected_rgb[2]}
                  </span>
                </div>
              </div>

              {/* Basic Recommendation */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <label className="text-sm font-medium text-[#1E3A8A] block mb-2">
                  Basic Recommendation
                </label>
                <p
                  data-testid="recommendation"
                  className="text-base text-gray-700"
                >
                  {result.recommendation}
                </p>
              </div>

              {/* AI-Powered Recommendations and Precautions */}
              {result.ai_recommendations && Object.keys(result.ai_recommendations).length > 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 text-sm text-[#1E3A8A] mb-4">
                      <Brain className="h-4 w-4" />
                      AI-Powered Safety Recommendations
                    </div>
                  </div>

                  {/* Immediate Actions */}
                  {result.ai_recommendations.immediate_actions && (
                    <div className="bg-red-50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <label className="text-sm font-medium text-red-800">
                          Immediate Actions
                        </label>
                      </div>
                      <ul className="space-y-2">
                        {result.ai_recommendations.immediate_actions.map((action, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Treatment Options */}
                  {result.ai_recommendations.treatment_options && (
                    <div className="bg-green-50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <label className="text-sm font-medium text-green-800">
                          Treatment Options
                        </label>
                      </div>
                      <ul className="space-y-2">
                        {result.ai_recommendations.treatment_options.map((option, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Health Risks */}
                  {result.ai_recommendations.health_risks && (
                    <div className="bg-orange-50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <label className="text-sm font-medium text-orange-800">
                          Health Considerations
                        </label>
                      </div>
                      <p className="text-sm text-gray-700">
                        {result.ai_recommendations.health_risks}
                      </p>
                    </div>
                  )}

                  {/* Prevention Tips */}
                  {result.ai_recommendations.prevention_tips && (
                    <div className="bg-blue-50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                        <label className="text-sm font-medium text-blue-800">
                          Prevention Tips
                        </label>
                      </div>
                      <ul className="space-y-2">
                        {result.ai_recommendations.prevention_tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Professional Help */}
                  {result.ai_recommendations.professional_help && (
                    <div className="bg-purple-50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <label className="text-sm font-medium text-purple-800">
                          Professional Help
                        </label>
                      </div>
                      <p className="text-sm text-gray-700">
                        {result.ai_recommendations.professional_help}
                      </p>
                    </div>
                  )}

                  {/* Additional Precautions */}
                  {result.ai_recommendations.additional_precautions && (
                    <div className="bg-yellow-50 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-yellow-600" />
                        <label className="text-sm font-medium text-yellow-800">
                          Additional Precautions
                        </label>
                      </div>
                      <p className="text-sm text-gray-700">
                        {result.ai_recommendations.additional_precautions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}