import { motion } from "framer-motion";
import { Beaker, Droplets, Upload, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    {
      number: "01",
      icon: <Beaker className="h-12 w-12" />,
      title: t("howItWorks.steps.addWaterSample.title"),
      description: t("howItWorks.steps.addWaterSample.description")
    },
    {
      number: "02",
      icon: <Droplets className="h-12 w-12" />,
      title: t("howItWorks.steps.addReagent.title"),
      description: t("howItWorks.steps.addReagent.description")
    },
    {
      number: "03",
      icon: <Upload className="h-12 w-12" />,
      title: t("howItWorks.steps.uploadPhoto.title"),
      description: t("howItWorks.steps.uploadPhoto.description")
    },
    {
      number: "04",
      icon: <Sparkles className="h-12 w-12" />,
      title: t("howItWorks.steps.getResults.title"),
      description: t("howItWorks.steps.getResults.description")
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E3A8A] mb-6">
            {t("howItWorks.title")}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl card-hover">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-2xl flex items-center justify-center text-[#1E3A8A]">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-[#1E3A8A] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-base text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-10 top-full w-1 h-8 bg-gradient-to-b from-[#2563EB] to-transparent mx-auto" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Color Reference Card */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-3xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center">
            {t("howItWorks.colorGuideTitle")}
          </h3>
          <p className="text-base text-gray-600 text-center mb-8">
            {t("howItWorks.colorGuideSubtitle")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: t("howItWorks.colors.lead1000"), color: "rgb(120, 50, 40)" },
              { name: t("howItWorks.colors.lead10"), color: "rgb(140, 70, 55)" },
              { name: t("howItWorks.colors.lead0_1"), color: "rgb(170, 100, 60)" },
              { name: t("howItWorks.colors.lead0_01"), color: "rgb(200, 160, 110)" },
              { name: t("howItWorks.colors.mercury1000"), color: "rgb(90, 60, 70)" },
              { name: t("howItWorks.colors.mercury10"), color: "rgb(170, 80, 60)" },
              { name: t("howItWorks.colors.mercury0_1"), color: "rgb(190, 120, 90)" },
              { name: t("howItWorks.colors.mercury0_01"), color: "rgb(210, 170, 120)" },
              { name: t("howItWorks.colors.mixedHigh"), color: "rgb(170, 90, 90)" },
              { name: t("howItWorks.colors.mixedMedium"), color: "rgb(200, 120, 120)" },
              { name: t("howItWorks.colors.mixedLow"), color: "rgb(210, 150, 150)" },
              { name: t("howItWorks.colors.mixedVeryLow"), color: "rgb(230, 170, 160)" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-full h-20 rounded-xl shadow-md mb-2"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-xs text-gray-600">{item.name}</p>
              </div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </div>
  );
}