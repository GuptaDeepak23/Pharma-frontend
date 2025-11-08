import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// const BACKEND_URL = 'https://pharmacy-project-lh5x.onrender.com';
const BACKEND_URL = 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

export default function ResultHistory() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API}/results`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error(t("results.emptyTitle"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Safe") return "text-green-600 bg-green-50";
    if (status.includes("Slight")) return "text-yellow-600 bg-yellow-50";
    if (status === "Contaminated") return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusIcon = (status) => {
    if (status === "Safe") return <CheckCircle2 className="h-5 w-5" />;
    return <AlertCircle className="h-5 w-5" />;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <History className="h-12 w-12 text-[#2563EB]" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E3A8A]">{t("results.title")}</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600">{t("results.subtitle")}</p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-[#2563EB] animate-spin" />
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl p-12 shadow-xl text-center"
          >
            <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600">{t("results.emptyTitle")}</p>
            <p className="text-sm text-gray-500 mt-2">{t("results.emptySubtitle")}</p>
          </motion.div>
        )}

        {/* Results List */}
        {!loading && results.length > 0 && (
          <div className="space-y-6">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                data-testid={`result-item-${index}`}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl card-hover"
              >
                <div className="grid md:grid-cols-4 gap-6">
                  {/* Metal & Concentration */}
                  <div className="md:col-span-1">
                    <div className="text-sm text-gray-500 mb-1">{t("results.labels.metal")}</div>
                    <div className="text-xl font-bold text-[#1E3A8A]">
                      {result.metal}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">{t("results.labels.concentration")}</div>
                    <div className="text-lg font-semibold text-[#2563EB]">
                      {result.concentration}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-1">
                    <div className="text-sm text-gray-500 mb-2">{t("results.labels.status")}</div>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(result.status)}`}
                    >
                      {getStatusIcon(result.status)}
                      {result.status}
                    </div>
                  </div>

                  {/* Color */}
                  <div className="md:col-span-1">
                    <div className="text-sm text-gray-500 mb-2">{t("results.labels.detectedColor")}</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg shadow-md"
                        style={{
                          backgroundColor: `rgb(${result.detected_rgb[0]}, ${result.detected_rgb[1]}, ${result.detected_rgb[2]})`
                        }}
                      />
                      <span className="text-xs text-gray-600">
                        RGB({result.detected_rgb[0]}, {result.detected_rgb[1]}, {result.detected_rgb[2]})
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-1">
                    <div className="text-sm text-gray-500 mb-1">{t("results.labels.analyzedOn")}</div>
                    <div className="text-sm text-gray-700">
                      {formatDate(result.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-500 mb-2">{t("results.labels.recommendation")}</div>
                  <p className="text-sm text-gray-700">{result.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}