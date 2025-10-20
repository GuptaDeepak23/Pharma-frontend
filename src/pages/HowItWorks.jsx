import { motion } from "framer-motion";
import { Beaker, Droplets, Upload, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <Beaker className="h-12 w-12" />,
      title: "Add Water Sample",
      description: "Collect your water sample in a clean test tube"
    },
    {
      number: "02",
      icon: <Droplets className="h-12 w-12" />,
      title: "Add Reagent",
      description: "Add the provided reagent and wait for color change (2-3 minutes)"
    },
    {
      number: "03",
      icon: <Upload className="h-12 w-12" />,
      title: "Upload Photo",
      description: "Take a clear photo of the test tube and upload it to our platform"
    },
    {
      number: "04",
      icon: <Sparkles className="h-12 w-12" />,
      title: "Get Results",
      description: "AI analyzes the color and provides instant contamination results"
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
            How It Works
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to test your water sample for heavy metal contamination
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-3xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center">
            Color Reference Guide
          </h3>
          <p className="text-base text-gray-600 text-center mb-8">
            Our AI system compares your sample against these reference colors to detect heavy metals
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Lead 1000ppm", color: "rgb(120, 50, 40)" },
              { name: "Lead 10ppm", color: "rgb(140, 70, 55)" },
              { name: "Lead 0.1ppm", color: "rgb(170, 100, 60)" },
              { name: "Lead 0.01ppm", color: "rgb(200, 160, 110)" },
              { name: "Mercury 1000ppm", color: "rgb(90, 60, 70)" },
              { name: "Mercury 10ppm", color: "rgb(170, 80, 60)" },
              { name: "Mercury 0.1ppm", color: "rgb(190, 120, 90)" },
              { name: "Mercury 0.01ppm", color: "rgb(210, 170, 120)" },
              { name: "Mixed High", color: "rgb(170, 90, 90)" },
              { name: "Mixed Medium", color: "rgb(200, 120, 120)" },
              { name: "Mixed Low", color: "rgb(210, 150, 150)" },
              { name: "Mixed Very Low", color: "rgb(230, 170, 160)" }
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
        </motion.div>
      </div>
    </div>
  );
}