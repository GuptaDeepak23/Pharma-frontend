import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const MultiLangRead = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef(null);

  // Language code to voice locale mapping
  const langToLocale = {
    hi: "hi-IN",
    ml: "ml-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    en: "en-IN",
    raj: "hi-IN", // fallback to Hindi
  };

  // Example texts for demo
  const exampleTexts = [
    {
      lang: "hi",
      text: "नमस्ते, हमारे वेबसाइट पर आपका स्वागत है।",
      label: "Hindi",
    },
    {
      lang: "ml",
      text: "ഹലോ, ഞങ്ങളുടെ വെബ്സൈറ്റിലേക്ക് സ്വാഗതം.",
      label: "Malayalam",
    },
    {
      lang: "gu",
      text: "હેલો, અમારી વેબસાઇટમાં આપનું સ્વાગત છે.",
      label: "Gujarati",
    },
    {
      lang: "kn",
      text: "ಹಲೋ, ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಸ್ವಾಗತ.",
      label: "Kannada",
    },
    {
      lang: "en",
      text: "Hello, welcome to our website.",
      label: "English",
    },
    {
      lang: "raj",
      text: "राम राम सा, थारो स्वागत है.",
      label: "Rajasthani",
    },
  ];

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Load voices immediately if available
    loadVoices();

    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup: stop any ongoing speech when component unmounts
    return () => {
      if (currentUtteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Find the best matching voice for a given locale
  const findVoice = (locale) => {
    // First, try to find an exact match
    let voice = voices.find((v) => v.lang === locale);
    
    // If no exact match, try to find a voice with the same language code
    if (!voice) {
      const langCode = locale.split("-")[0];
      voice = voices.find((v) => v.lang.startsWith(langCode));
    }
    
    // If still no match, try to find any Indian voice
    if (!voice) {
      voice = voices.find((v) => v.lang.includes("IN"));
    }
    
    // Fallback to default voice
    return voice || voices.find((v) => v.default) || voices[0];
  };

  // Handle read aloud functionality
  const handleReadAloud = (text, lang) => {
    // Stop any ongoing speech
    if (currentUtteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    // Get the locale for the language
    const locale = langToLocale[lang] || "en-IN";

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Find and set the voice
    const voice = findVoice(locale);
    if (voice) {
      utterance.voice = voice;
    }

    // Handle speech events
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    // Store reference and speak
    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#1E3A8A]">
            Multi-Language Read Aloud
          </h2>
          {isSpeaking && (
            <Button
              onClick={handleStop}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              ⏹ Stop
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {exampleTexts.map((example, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {example.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({langToLocale[example.lang]})
                    </span>
                  </div>
                  <p
                    lang={example.lang}
                    className="text-lg text-gray-800 mb-2"
                    dir={
                      ["hi", "gu", "kn", "raj"].includes(example.lang)
                        ? "ltr"
                        : "auto"
                    }
                  >
                    {example.text}
                  </p>
                </div>
                <Button
                  onClick={() => handleReadAloud(example.text, example.lang)}
                  disabled={isSpeaking}
                  className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  🔊 Read
                </Button>
              </div>
            </div>
          ))}
        </div>

        {voices.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Loading voices... Please wait a moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiLangRead;

