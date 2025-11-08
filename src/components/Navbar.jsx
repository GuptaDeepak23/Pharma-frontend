import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navLinks = [
    { path: "/", label: t("navbar.home") },
    { path: "/how-it-works", label: t("navbar.howItWorks") },
    { path: "/detection", label: t("navbar.detection") },
    { path: "/results", label: t("navbar.results") },
    { path: "/about", label: t("navbar.about") }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Beaker className="h-8 w-8 text-[#2563EB] group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold text-[#1E3A8A] hidden sm:block">
            {t("app.name")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  variant="ghost"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`relative ${
                    location.pathname === link.path
                      ? "text-[#2563EB] font-semibold"
                      : "text-gray-700 hover:text-[#2563EB]"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Language Switcher + Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Language"
              className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white"
              value={i18n.language?.slice(0,2) || "en"}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="hi">HI</option>
              <option value="ta">TA</option>
              <option value="ml">ML</option>
              <option value="mr">MR</option>
              <option value="gu">GU</option>
            </select>
          <button
            data-testid="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-[#1E3A8A]" />
            ) : (
              <Menu className="h-6 w-6 text-[#1E3A8A]" />
            )}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    location.pathname === link.path
                      ? "bg-blue-50 text-[#2563EB] font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;