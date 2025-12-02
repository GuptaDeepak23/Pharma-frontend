import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ReadAloud = () => {
  const { i18n } = useTranslation();
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUtteranceRef = useRef(null);
  const queueRef = useRef([]);
  const isProcessingRef = useRef(false);
  const voiceWarningShownRef = useRef(false);

  // Language code to voice locale mapping
  const langToLocale = {
    en: "en-IN",
    es: "es-ES", // Spanish fallback
    hi: "hi-IN",
    ta: "ta-IN",
    ml: "ml-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    raj: "hi-IN", // Rajasthani fallback to Hindi
  };

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Log available voices for debugging
      console.log("Available voices:", availableVoices.map(v => ({ name: v.name, lang: v.lang })));
    };

    // Load voices immediately if available
    loadVoices();

    // Some browsers load voices asynchronously - trigger a reload
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Force voice loading on Chrome/Edge (they load voices asynchronously)
    // Trigger onvoiceschanged event by calling getVoices multiple times
    let attempts = 0;
    const checkVoices = setInterval(() => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0 || attempts > 10) {
        setVoices(availableVoices);
        clearInterval(checkVoices);
        if (availableVoices.length > 0) {
          console.log("Voices loaded:", availableVoices.length);
        }
      }
      attempts++;
    }, 100);

    // Cleanup: stop any ongoing speech when component unmounts
    return () => {
      clearInterval(checkVoices);
      if (currentUtteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Find the best matching voice for a given locale
  const findVoice = (locale) => {
    // Reload voices to ensure we have the latest list
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length === 0) {
      console.warn("No voices available");
      return null;
    }

    const langCode = locale.split("-")[0];
    console.log(`Looking for voice for locale: ${locale}, lang code: ${langCode}`);
    console.log(`Available voices:`, availableVoices.map(v => `${v.name} (${v.lang})`));

    // First, try to find an exact match
    let voice = availableVoices.find((v) => v.lang === locale);
    if (voice) {
      console.log(`Found exact match: ${voice.name} (${voice.lang})`);
      return voice;
    }

    // If no exact match, try to find a voice with the same language code (case insensitive)
    // IMPORTANT: Only match if the language code matches, not just any Indian voice
    voice = availableVoices.find((v) => {
      const voiceLangCode = v.lang.split("-")[0].toLowerCase();
      return voiceLangCode === langCode.toLowerCase();
    });
    if (voice) {
      console.log(`Found language match: ${voice.name} (${voice.lang})`);
      return voice;
    }

    // Try to find any voice with the language code anywhere in the lang string
    // But be more strict - check if lang code appears at the start or after a separator
    voice = availableVoices.find((v) => {
      const voiceLang = v.lang.toLowerCase();
      const langCodeLower = langCode.toLowerCase();
      // Match if lang code is at start, or after a dash/underscore
      return voiceLang === langCodeLower || 
             voiceLang.startsWith(langCodeLower + "-") ||
             voiceLang.startsWith(langCodeLower + "_");
    });
    if (voice) {
      console.log(`Found partial match: ${voice.name} (${voice.lang})`);
      return voice;
    }

    // DO NOT fall back to other languages - return null if no matching voice found
    // This allows the browser to use its default behavior with just the lang attribute
    console.warn(`No voice found matching language code: ${langCode}`);
    return null;
  };

  // Extract text content from the page, excluding navigation, footer, and buttons
  const extractPageContent = () => {
    // Selectors to exclude
    const excludeSelectors = [
      "nav",
      
      "footer",
      "button",
      "[role='button']",
      "[role='navigation']",
      ".read-aloud-button", // Exclude the read-aloud button itself
      "script",
      "style",
      "noscript",
      "svg", // Exclude SVG icons
      "[aria-hidden='true']", // Exclude hidden elements
    ];

    // Get the main content area (usually main, article, or the main div)
    const mainContent =
      document.querySelector("main") ||
      document.querySelector("article") ||
      document.querySelector('[role="main"]') ||
      document.querySelector(".App > div:not(nav):not(footer)") ||
      document.body;

    // Clone the element to avoid modifying the original
    const clone = mainContent.cloneNode(true);

    // Remove excluded elements from clone
    excludeSelectors.forEach((selector) => {
      try {
        const elements = clone.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      } catch (e) {
        // Ignore selector errors
      }
    });

    // Extract text from semantic elements (headings, paragraphs, list items, etc.)
    const textElements = [];
    const contentSelectors = "h1, h2, h3, h4, h5, h6, p, li, td, th, label, span, div, blockquote, figcaption";
    
    // Get all content elements from the original DOM (not clone) to preserve structure
    const allElements = mainContent.querySelectorAll(contentSelectors);
    
    allElements.forEach((el) => {
      // Skip if element is in excluded areas
      if (
        el.closest("nav") ||
        el.closest("header") ||
        el.closest("footer") ||
        el.closest("button") ||
        el.closest(".read-aloud-button") ||
        el.closest("[role='button']") ||
        el.closest("[aria-hidden='true']")
      ) {
        return;
      }

      const text = el.textContent.trim();
      
      // Filter out very short texts, very long texts, and non-meaningful content
      if (
        text.length >= 10 &&
        text.length <= 2000 &&
        !/^[0-9\s\-_\.]+$/.test(text) && // Exclude pure numbers/symbols
        !text.match(/^(EN|ES|HI|TA|ML|MR|GU)$/i) // Exclude language codes
      ) {
        // Check if this text is not a duplicate or substring of another
        const isDuplicate = textElements.some(
          (existing) =>
            existing === text ||
            existing.includes(text) ||
            text.includes(existing)
        );

        if (!isDuplicate) {
          textElements.push(text);
        }
      }
    });

    // If we didn't get enough content, try a more aggressive approach
    if (textElements.length < 3) {
      const walker = document.createTreeWalker(
        mainContent,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while ((node = walker.nextNode())) {
        // Skip if in excluded areas
        let parent = node.parentElement;
        let shouldSkip = false;
        while (parent && parent !== mainContent) {
          if (
            parent.tagName === "NAV" ||
            parent.tagName === "HEADER" ||
            parent.tagName === "FOOTER" ||
            parent.tagName === "BUTTON" ||
            parent.closest(".read-aloud-button") ||
            parent.getAttribute("aria-hidden") === "true"
          ) {
            shouldSkip = true;
            break;
          }
          parent = parent.parentElement;
        }

        if (shouldSkip) continue;

        const text = node.textContent.trim();
        if (
          text.length >= 10 &&
          text.length <= 2000 &&
          !/^[0-9\s\-_\.]+$/.test(text)
        ) {
          const isDuplicate = textElements.some(
            (existing) =>
              existing === text ||
              existing.includes(text) ||
              text.includes(existing)
          );

          if (!isDuplicate) {
            textElements.push(text);
          }
        }
      }
    }

    // Filter and return unique texts, limit to reasonable amount
    return textElements
      .filter((text, index, self) => self.indexOf(text) === index)
      .slice(0, 100); // Limit to first 100 text chunks
  };

  // Process the speech queue
  const processQueue = () => {
    if (isProcessingRef.current || queueRef.current.length === 0) {
      if (queueRef.current.length === 0) {
        setIsSpeaking(false);
        setIsLoading(false);
      }
      return;
    }

    // Ensure voices are loaded
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length === 0) {
      console.warn("Voices not loaded yet, retrying...");
      setTimeout(() => processQueue(), 500);
      return;
    }

    isProcessingRef.current = true;
    const text = queueRef.current.shift();
    const currentLang = i18n.language?.split("-")[0] || "en";
    const locale = langToLocale[currentLang] || langToLocale["en"];

    console.log(`Speaking in language: ${currentLang}, locale: ${locale}`);

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Find and set the voice
    const voice = findVoice(locale);
    if (voice) {
      utterance.voice = voice;
      console.log(`Using voice: ${voice.name} (${voice.lang})`);
    } else {
      console.warn(`No voice found for ${locale}, using lang attribute only`);
      // Show warning toast only once per session
      if (!voiceWarningShownRef.current) {
        voiceWarningShownRef.current = true;
        toast.warning(
          `Voice for ${currentLang.toUpperCase()} not found`,
          {
            description: "The browser will attempt to use the best available voice. You may need to install language packs in your system settings (Windows: Settings → Time & Language → Language).",
            duration: 6000,
          }
        );
      }
      // Don't set a voice - let the browser use the lang attribute to find the best match
      // This is better than forcing an English voice
    }

    // Handle speech events
    utterance.onstart = () => {
      console.log("Speech started");
    };

    utterance.onend = () => {
      console.log("Speech ended");
      isProcessingRef.current = false;
      currentUtteranceRef.current = null;
      // Process next item in queue
      setTimeout(() => processQueue(), 100);
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      console.error("Error details:", {
        error: error.error,
        type: error.type,
        charIndex: error.charIndex,
        utterance: error.utterance?.text
      });
      isProcessingRef.current = false;
      currentUtteranceRef.current = null;
      // Continue with next item even on error
      setTimeout(() => processQueue(), 100);
    };

    // Store reference and speak
    currentUtteranceRef.current = utterance;
    
    // Cancel any ongoing speech before starting new one
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Handle read aloud functionality
  const handleReadAloud = () => {
    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      queueRef.current = [];
      isProcessingRef.current = false;
      setIsSpeaking(false);
      setIsLoading(false);
      currentUtteranceRef.current = null;
      voiceWarningShownRef.current = false; // Reset warning flag
      return;
    }

    // Start reading
    setIsLoading(true);
    voiceWarningShownRef.current = false; // Reset warning flag for new session
    const texts = extractPageContent();

    if (texts.length === 0) {
      alert("No readable content found on this page.");
      setIsLoading(false);
      return;
    }

    // Build queue
    queueRef.current = texts;
    setIsSpeaking(true);
    setIsLoading(false);

    // Start processing
    processQueue();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleReadAloud}
        className="read-aloud-button bg-[#2563EB] hover:bg-[#1E3A8A] text-white rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center transition-all hover:scale-110"
        aria-label={isSpeaking ? "Stop reading" : "Read page aloud"}
        title={isSpeaking ? "Stop reading" : "Read page aloud"}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isSpeaking ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default ReadAloud;

