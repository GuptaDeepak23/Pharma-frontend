import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Detection from "@/pages/Detection";
import ResultHistory from "@/pages/ResultHistory";
import About from "@/pages/About";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadAloud from "@/components/ReadAloud";
import { Toaster } from "@/components/ui/sonner";
import "@/App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/results" element={<ResultHistory />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
        <ReadAloud />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;