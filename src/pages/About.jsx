import { motion } from "framer-motion";
import { Mail, Users, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
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
            About Our Project
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Making water quality testing accessible to everyone through innovative AI technology
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Target className="h-10 w-10 text-[#2563EB]" />
            <h2 className="text-3xl font-bold text-[#1E3A8A]">Our Mission</h2>
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            The AI-Integrated Heavy Metal Detection Kit is designed to democratize water quality testing. 
            By combining traditional chemical reagent testing with cutting-edge artificial intelligence, 
            we provide accurate, fast, and accessible heavy metal detection for students, researchers, 
            pharmacists, and communities worldwide.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <Lightbulb className="h-10 w-10 text-[#2563EB]" />
              <h3 className="text-2xl font-bold text-[#1E3A8A]">Innovation</h3>
            </div>
            <p className="text-base text-gray-600">
              Our AI-powered color analysis technology eliminates the need for expensive laboratory 
              equipment, making water testing affordable and accessible to everyone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-10 w-10 text-[#2563EB]" />
              <h3 className="text-2xl font-bold text-[#1E3A8A]">Community Impact</h3>
            </div>
            <p className="text-base text-gray-600">
              We empower communities to take control of their water quality, providing tools for 
              early detection of contamination and protecting public health.
            </p>
          </motion.div>
        </div>

        {/* Technology Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-3xl p-8 md:p-12 shadow-xl text-white mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">The Technology</h2>
          <div className="space-y-4">
            <p className="text-base leading-relaxed opacity-90">
              Our system uses advanced computer vision and machine learning algorithms to analyze the color 
              of chemical reagent reactions. By comparing the captured image against a comprehensive database 
              of reference colors, we can accurately identify the presence and concentration of heavy metals 
              like lead and mercury.
            </p>
            <p className="text-base leading-relaxed opacity-90">
              The detection process is simple: add reagent to your water sample, wait for the color change, 
              take a photo, and let our AI do the rest. Results are available in seconds, with detailed 
              recommendations based on contamination levels.
            </p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center"
        >
          <Mail className="h-12 w-12 text-[#2563EB] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">Get In Touch</h2>
          <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            Have questions about our technology or want to collaborate? We'd love to hear from you.
          </p>
          <Button
            data-testid="email-btn"
            onClick={() => window.location.href = 'mailto:contact@watermetal-detection.com'}
            className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white px-8 py-6 rounded-full text-lg"
          >
            <Mail className="mr-2 h-5 w-5" />
            Email Us
          </Button>
        </motion.div>
      </div>
    </div>
  );
}