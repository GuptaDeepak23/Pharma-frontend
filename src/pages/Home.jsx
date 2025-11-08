import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Beaker, Droplet, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">

<span className="text-xl pt-2 text-center font-bold text-[#1E3A8A] block sm:hidden">
            {t("app.tagline")}
            </span>
      {/* Hero Section */}
     
      <section className="relative overflow-hidden pt-10 sm:pt-20 pb-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E3A8A] leading-tight">
                {t("home.heroTitle")}
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                {t("home.heroSubtitle")}
              </p>
              <Button
                data-testid="start-detection-btn"
                onClick={() => navigate("/detection")}
                className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg"
              >
                {t("home.startDetection")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white">
                <div className="flex justify-center items-center space-x-8">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Beaker className="h-24 w-24 text-[#2563EB]" strokeWidth={1.5} />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Brain className="h-24 w-24 text-[#1E3A8A]" strokeWidth={1.5} />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute top-1/4 -left-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Droplet className="h-12 w-12 text-[#60A5FA] opacity-40" />
                </motion.div>
                <motion.div
                  className="absolute bottom-1/4 -right-4"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <Droplet className="h-16 w-16 text-[#93C5FD] opacity-40" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A8A] mb-4">
              {t("home.featuresTitle")}
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {t("home.featuresSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-10 w-10" />,
                title: t("home.features.aiSafety.title"),
                description: t("home.features.aiSafety.description")
              },
              {
                icon: <Beaker className="h-10 w-10" />,
                title: t("home.features.reliableColor.title"),
                description: t("home.features.reliableColor.description")
              },
              {
                icon: <Droplet className="h-10 w-10" />,
                title: t("home.features.comprehensive.title"),
                description: t("home.features.comprehensive.description")
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl card-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-xl flex items-center justify-center mb-6 text-[#1E3A8A]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}