/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Download, 
  Award, 
  Check, 
  Sliders, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Info,
  Calendar
} from "lucide-react";
import { AhomWord } from "../types";
import { jsPDF } from "jspdf";

interface ManuscriptExporterProps {
  isOpen: boolean;
  onClose: () => void;
  words: AhomWord[];
  activeTheme?: "onyx" | "muga";
}

// Visual themes for the 1795 AD Bark Manuscript Exporter
interface PaperShade {
  id: string;
  name: string;
  cssBg: string;
  cssCardBg: string;
  cssBorder: string;
  cssTextPrimary: string;
  cssTextSecondary: string;
  cssScribeInk: string;
  canvasBgStart: string;
  canvasBgEnd: string;
  canvasBorder: string;
  canvasCardBg: string;
}

interface InkProfile {
  id: string;
  name: string;
  cssHex: string;
  cssSeal: string;
  canvasHex: string;
  canvasSealHex: string;
}

const PAPER_SHADES: PaperShade[] = [
  {
    id: "sanchipat",
    name: "Sanchipat Golden (Dry Bark)",
    cssBg: "bg-gradient-to-r from-[#cfb26a] via-[#eedea3] to-[#cfb26a]",
    cssCardBg: "bg-white/35 backdrop-blur-[1px] border-[#8a6828]/25",
    cssBorder: "border-double border-4 border-[#801313]",
    cssTextPrimary: "text-[#2e1d08]",
    cssTextSecondary: "text-[#5e4125]",
    cssScribeInk: "text-[#801313]",
    canvasBgStart: "#eedda0",
    canvasBgEnd: "#cfae60",
    canvasBorder: "#801313",
    canvasCardBg: "rgba(255, 255, 245, 0.4)"
  },
  {
    id: "muga",
    name: "Muga Royal Silk (Rich Ochre)",
    cssBg: "bg-gradient-to-r from-[#b48522] via-[#ebd39b] to-[#b48522]",
    cssCardBg: "bg-[#fffaf0]/40 border-[#6a4203]/20",
    cssBorder: "border-double border-4 border-[#301602]",
    cssTextPrimary: "text-[#2a1301]",
    cssTextSecondary: "text-[#4d2d14]",
    cssScribeInk: "text-[#301602]",
    canvasBgStart: "#ebd39b",
    canvasBgEnd: "#b48522",
    canvasBorder: "#301602",
    canvasCardBg: "rgba(255, 252, 240, 0.5)"
  },
  {
    id: "scorched",
    name: "Aged Weathered (Deep Sepia)",
    cssBg: "bg-gradient-to-r from-[#5c3e21] via-[#aa8e6b] to-[#5c3e21]",
    cssCardBg: "bg-[#0c0805]/20 border-[#ecdabc]/15",
    cssBorder: "border-double border-4 border-[#ebd1ab]",
    cssTextPrimary: "text-[#ebd1ab]",
    cssTextSecondary: "text-[#d2bfa6]/80",
    cssScribeInk: "text-[#ebd1ab]",
    canvasBgStart: "#aa8e6b",
    canvasBgEnd: "#4f341a",
    canvasBorder: "#ebd1ab",
    canvasCardBg: "rgba(20, 15, 10, 0.3)"
  },
  {
    id: "onyx",
    name: "Onyx Dynasty (Chronicle Dark)",
    cssBg: "bg-gradient-to-r from-[#0d121c] via-[#1f293b] to-[#0d121c]",
    cssCardBg: "bg-[#020617]/55 border-gold-500/20",
    cssBorder: "border-double border-4 border-[#b48522]",
    cssTextPrimary: "text-[#f3edd0]",
    cssTextSecondary: "text-[#a2afc2]",
    cssScribeInk: "text-gold-450",
    canvasBgStart: "#1e293b",
    canvasBgEnd: "#080c12",
    canvasBorder: "#b48522",
    canvasCardBg: "rgba(5, 8, 16, 0.6)"
  }
];

const INK_PROFILES: InkProfile[] = [
  {
    id: "carbon",
    name: "Royal Carbon (Deep Obsidian)",
    cssHex: "#151310",
    cssSeal: "#aa3838",
    canvasHex: "#151310",
    canvasSealHex: "#aa3838"
  },
  {
    id: "cinnabar",
    name: "Vermillion Seal (Cinnabar Red)",
    cssHex: "#99181c",
    cssSeal: "#222222",
    canvasHex: "#99181c",
    canvasSealHex: "#222222"
  },
  {
    id: "sepia",
    name: "Archival Sepia (Walnut Ink)",
    cssHex: "#452402",
    cssSeal: "#a03030",
    canvasHex: "#452402",
    canvasSealHex: "#a03030"
  },
  {
    id: "indigo",
    name: "Monastic Indigo (Sacred Blue)",
    cssHex: "#132b50",
    cssSeal: "#c69d30",
    canvasHex: "#132b50",
    canvasSealHex: "#c69d30"
  }
];

// Map normal numbers to traditional Ahom numerals for page markings 
function getAhomNumerals(num: number): string {
  const digits = ["𑜰", "𑜱", "𑜲", "𑜳", "𑜴", "𑜵", "𑜶", "𑜷", "𑜸", "𑜹"];
  if (num === 0) return digits[0];
  let res = "";
  let temp = num;
  while (temp > 0) {
    const d = temp % 10;
    res = digits[d] + res;
    temp = Math.floor(temp / 10);
  }
  return res;
}

export default function ManuscriptExporter({ 
  isOpen, 
  onClose, 
  words,
  activeTheme = "onyx"
}: ManuscriptExporterProps) {
  
  // Custom states
  const [selectedPaper, setSelectedPaper] = useState<string>("sanchipat");
  const [selectedInk, setSelectedInk] = useState<string>("carbon");
  const [itemsPerPage, setItemsPerPage] = useState<number>(2);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "ROYAL" | "SACRED" | "COMMON">("ALL");
  
  // Toggle states
  const [includeContext, setIncludeContext] = useState<boolean>(true);
  const [includeAssamese, setIncludeAssamese] = useState<boolean>(true);
  const [includeEnglish, setIncludeEnglish] = useState<boolean>(true);
  
  // Preview pagination
  const [previewPage, setPreviewPage] = useState<number>(1);
  
  // PDF processing states
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [processStatus, setProcessStatus] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  
  // Filter words inside the exporter so the user is in full control
  const filteredWords = words.filter(word => {
    if (categoryFilter === "ALL") return true;
    
    // Exact same categorization helper inside App.tsx
    const getCat = (id: string) => {
      switch (id) {
        case "BA_001": case "BA_002": case "BA_003": case "BA_004": case "BA_009": return "ROYAL";
        case "BA_005": case "BA_006": case "BA_010": return "SACRED";
        case "BA_007": case "BA_008": case "BA_011": return "COMMON";
        default: return "COMMON";
      }
    };
    return getCat(word.word_id) === categoryFilter;
  });

  // Recalculate leaves (pages) of our manuscript
  const totalPages = Math.max(1, Math.ceil(filteredWords.length / itemsPerPage));

  // Reset pagination if total pages shifts
  useEffect(() => {
    if (previewPage > totalPages) {
      setPreviewPage(totalPages);
    }
  }, [totalPages]);

  const activePaper = PAPER_SHADES.find(p => p.id === selectedPaper) || PAPER_SHADES[0];
  const activeInk = INK_PROFILES.find(i => i.id === selectedInk) || INK_PROFILES[0];

  // Slice filtered words for the active preview leaf
  const startIndex = (previewPage - 1) * itemsPerPage;
  const previewWords = filteredWords.slice(startIndex, startIndex + itemsPerPage);

  // Ahom helper icon
  const getBadgeSymbol = (id: string) => {
    switch (id) {
      case "BA_001": return "👑";
      case "BA_002": return "🦁";
      case "BA_003": return "⚔️";
      case "BA_004": return "🗺️";
      case "BA_005": return "🌅";
      case "BA_006": return "💎";
      case "BA_007": return "🐟";
      case "BA_008": return "🌾";
      case "BA_009": return "👂";
      case "BA_010": return "📜";
      case "BA_011": return "🐛";
      default: return "✍️";
    }
  };

  // Helper routine to wrap text for standard Canvas2D context (used during compile)
  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 3
  ): number => {
    const paragraphs = text.split("\n");
    let currentY = y;
    let linesDrawn = 0;

    for (const para of paragraphs) {
      const wordsList = para.split(" ");
      let line = "";

      for (let n = 0; n < wordsList.length; n++) {
        const testLine = line + wordsList[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = wordsList[n] + " ";
          currentY += lineHeight;
          linesDrawn++;
          if (linesDrawn >= maxLines) return currentY;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
      linesDrawn++;
      if (linesDrawn >= maxLines) return currentY;
    }
    return currentY;
  };

  // Main Canvas PDF compiler loop
  const compilePDF = async () => {
    if (filteredWords.length === 0) return;
    setIsCompiling(true);
    setProgressPercent(5);
    setProcessStatus("Initializing 1795 Sanchipat compiler...");

    try {
      // 3:1 manuscript aspect ratio standard leaf size (420 x 140 mm)
      // Custom landscape orientation dimensions
      const lWidth = 420;
      const lHeight = 140;

      const pdf = new jsPDF({
        orientation: "l",
        unit: "mm",
        format: [lWidth, lHeight]
      });

      // Canvas dimensions for drawing high-DPI folios
      const canvasWidth = 2100;
      const canvasHeight = 700;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setProgressPercent(Math.round((pageNum / totalPages) * 80) + 10);
        setProcessStatus(`Varnishing leaf ${pageNum} of ${totalPages} in ancient ink...`);

        // Create browser-native offscreen canvas
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Could not construct 2D context");

        // 1. Draw organic wood/bark grain background
        const bgGrad = ctx.createRadialGradient(
          canvasWidth / 2, canvasHeight / 2, 200, 
          canvasWidth / 2, canvasHeight / 2, canvasWidth / 1.5
        );
        bgGrad.addColorStop(0, activePaper.canvasBgStart);
        bgGrad.addColorStop(1, activePaper.canvasBgEnd);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw vintage wood fibers / organic grain
        ctx.strokeStyle = activeInk.canvasSealHex;
        for (let j = 0; j < 50; j++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
          ctx.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
          ctx.strokeStyle = `rgba(107, 72, 33, ${0.01 + Math.random() * 0.02})`;
          ctx.lineWidth = 1 + Math.random() * 2;
          ctx.stroke();
        }

        // 2. Draw dual fine-art borders
        const padOuter = 24;
        const padInner = 32;

        ctx.strokeStyle = activePaper.canvasBorder;
        ctx.lineWidth = 4;
        ctx.strokeRect(padOuter, padOuter, canvasWidth - padOuter * 2, canvasHeight - padOuter * 2);

        ctx.strokeStyle = activePaper.canvasBorder;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(padInner, padInner, canvasWidth - padInner * 2, canvasHeight - padInner * 2);

        // 3. Draw Left-binding hole setup & seals in margins
        const holeX = 140;
        const holeY = canvasHeight / 2;

        // Outer stamping circles
        ctx.beginPath();
        ctx.arc(holeX, holeY, 26, 0, 2 * Math.PI);
        ctx.strokeStyle = activeInk.canvasSealHex;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(holeX, holeY, 18, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(43, 27, 10, 0.08)";
        ctx.fill();
        ctx.stroke();

        // Authentic binding cord opening (punched inner circle)
        ctx.beginPath();
        ctx.arc(holeX, holeY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#12151c"; // represents physical hole depth
        ctx.fill();

        // 4. Draw Right-binding seal indicator
        const sealX = canvasWidth - 140;
        ctx.beginPath();
        ctx.arc(sealX, holeY, 26, 0, 2 * Math.PI);
        ctx.strokeStyle = activeInk.canvasSealHex;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sealX, holeY, 18, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(43, 27, 10, 0.08)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sealX, holeY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "#12151c";
        ctx.fill();

        // Decorative tribal/court stars in the borders
        ctx.fillStyle = activeInk.canvasSealHex;
        ctx.font = "italic bold 18px 'Cinzel', serif";
        ctx.fillText("✦ ROYAL SEALS • 𑜏𑜢𑜂𑜫 ✦", canvasWidth / 2 - 120, canvasHeight - 48);

        // 5. Draw Top Leaf Header Banner
        ctx.fillStyle = activeInk.canvasHex;
        ctx.textAlign = "center";
        
        ctx.font = "bold italic 22px 'Cinzel', 'Georgia', serif";
        const yearNotation = `— 𑜎𑜢𑜀𑜫 𑜏𑜢𑜂𑜫 𑜆𑜥 𑜎𑜃𑜫 • DIGITAL BAR AMRA MANUSCRIPT (1795 AD) • FOLIO ${getAhomNumerals(pageNum)} —`;
        ctx.fillText(yearNotation, canvasWidth / 2, 58);

        // Draw thin horizontal banner divider line
        ctx.beginPath();
        ctx.moveTo(200, 72);
        ctx.lineTo(canvasWidth - 200, 72);
        ctx.strokeStyle = activePaper.canvasBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 6. Partition words list into Column panels
        const pageWords = filteredWords.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage);
        const colCount = Math.min(itemsPerPage, pageWords.length);
        const colStartX = 220;
        const colWidth = (canvasWidth - colStartX - 220 - (colCount - 1) * 60) / colCount;

        for (let c = 0; c < colCount; c++) {
          const word = pageWords[c];
          const xPos = colStartX + c * (colWidth + 60);
          const yPos = 100;
          const colHeight = 520;

          // Draw ornamental column separator line on previous iteration
          if (c > 0) {
            ctx.beginPath();
            ctx.moveTo(xPos - 30, yPos + 10);
            ctx.lineTo(xPos - 30, yPos + colHeight - 20);
            ctx.strokeStyle = `rgba(139, 90, 43, 0.25)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Card inner frame background
          ctx.fillStyle = activePaper.canvasCardBg;
          ctx.beginPath();
          ctx.roundRect(xPos, yPos, colWidth, colHeight, 16);
          ctx.fill();
          ctx.strokeStyle = `rgba(200, 160, 50, 0.15)`;
          ctx.stroke();

          // Left sidebar box in card: contains huge Ahom Glyph
          const glyphBoxWidth = 160;
          const glyphBoxX = xPos + 25;
          const glyphBoxY = yPos + 40;
          const glyphBoxHeight = colHeight - 80;

          // Drawing circles & curves around big glyph (ancient seal design)
          const sealCenterX = glyphBoxX + glyphBoxWidth / 2;
          const sealCenterY = glyphBoxY + glyphBoxHeight / 2;

          ctx.strokeStyle = activeInk.canvasHex;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(sealCenterX, sealCenterY, 65, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.strokeStyle = activeInk.canvasSealHex;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sealCenterX, sealCenterY, 71, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.fillStyle = `${activeInk.canvasHex}15`;
          ctx.beginPath();
          ctx.arc(sealCenterX, sealCenterY, 65, 0, 2 * Math.PI);
          ctx.fill();

          // Render Unicode Ahom characters in center of circular seal
          ctx.fillStyle = activeInk.canvasHex;
          ctx.font = "bold 58px 'Cinzel', 'Noto Sans Ahom', serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(word.ahom_script, sealCenterX, sealCenterY);

          // Draw Ahom word metadata labels
          const textStartX = xPos + 215;
          const textWidthLimit = colWidth - 245;

          ctx.textAlign = "left";
          ctx.textBaseline = "alphabetic";

          // Entry index identifier header
          ctx.fillStyle = activeInk.canvasSealHex;
          ctx.font = "bold 14px 'Space Grotesk', 'Courier', monospace";
          ctx.fillText(`CODEX #${word.word_id} • 1795 AD BARK`, textStartX, yPos + 55);

          // Word title: Phonetic spellings
          ctx.fillStyle = activeInk.canvasHex;
          ctx.font = "bold 28px 'Cinzel', 'Georgia', serif";
          ctx.fillText(word.phonetic_spelling, textStartX, yPos + 95);

          let currentY = yPos + 130;

          // Assamese meaning section
          if (includeAssamese) {
            ctx.fillStyle = activeInk.canvasHex;
            ctx.font = "bold 17px 'Inter', sans-serif";
            ctx.fillText(`বৰ্ণনা: ${word.assamese_meaning}`, textStartX, currentY);
            currentY += 25;
          }

          // English meaning section
          if (includeEnglish) {
            ctx.fillStyle = activeInk.canvasHex;
            ctx.font = "bold 17px 'Inter', sans-serif";
            ctx.fillText(`Gloss: ${word.english_meaning}`, textStartX, currentY);
            currentY += 32;
          }

          // Historical / courtly usage description box
          if (includeContext && word.historical_context) {
            ctx.fillStyle = `rgba(139, 90, 43, 0.15)`;
            ctx.fillRect(textStartX - 5, currentY - 18, textWidthLimit + 10, 2);

            ctx.fillStyle = activeInk.canvasHex;
            ctx.font = "italic 15px 'Georgia', 'Inter', sans-serif";
            ctx.fillText("Royal Chronicle & Scribe Notes:", textStartX, currentY + 12);
            
            ctx.fillStyle = ctx.strokeStyle === "#ebd1ab" ? "rgba(235, 209, 171, 0.85)" : "rgba(40, 30, 20, 0.75)";
            ctx.font = "14.5px 'Inter', sans-serif";
            drawWrappedText(
              ctx,
              word.historical_context,
              textStartX,
              currentY + 34,
              textWidthLimit,
              23,
              4
            );
          }
        }

        // Convert the Canvas page to JPEG data 
        const pageData = canvas.toDataURL("image/jpeg", 0.96);

        // Add page to PDF document structure
        if (pageNum > 1) {
          pdf.addPage([lWidth, lHeight], "l");
        }
        pdf.addImage(pageData, "JPEG", 0, 0, lWidth, lHeight, undefined, "FAST");
      }

      setProgressPercent(95);
      setProcessStatus("Varnishing manuscript fibers...");
      
      pdf.save(`ahom_bar_amra_lexicon_manuscript_${selectedPaper}.pdf`);
      
      setProgressPercent(100);
      setProcessStatus("Success! Your 1795 Bark Manuscript PDF has been exported.");
      
      setTimeout(() => {
        setIsCompiling(false);
      }, 1500);

    } catch (error) {
      console.error("PDF generation failed:", error);
      setProcessStatus("Compilation fell through. Reset configurations and try again.");
      setTimeout(() => setIsCompiling(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Glass overlay back panel */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs"
        />

        {/* Outer Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-5.5xl bg-[#0f131c] border border-gold-500/15 rounded-2xl shadow-3xl text-slate-100 flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
        >
          {/* Close trigger button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-slate-950/50 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-full z-20 border border-slate-800/40 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* LEFT: LIVE SCROLLING VISUAL PREVIEW AREA */}
          <div className="flex-1 bg-slate-950/50 p-6 md:p-8 flex flex-col justify-between border-r border-[#1a2130] min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-mono border border-gold-800 bg-gold-950/20 px-2.5 py-0.5 rounded text-gold-450 uppercase tracking-widest font-bold">
                  Sanchipat Leaf Folios
                </span>
                <span className="text-slate-500 text-xs font-mono">• 1795 AD Aspect Ratio</span>
              </div>
              
              <h3 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-gold-500" /> Live Manuscript Preview
              </h3>

              {filteredWords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
                  <span className="text-3xl mb-2">🤷‍♂️</span>
                  <p className="text-sm font-space text-slate-400 text-center">No words in this category to parse.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Virtual parchment strip on preview */}
                  <div className={`w-full overflow-hidden rounded-xl border border-gold-950/20 transition-all duration-500 ${activePaper.cssBg} p-2 relative shadow-2xl`}>
                    
                    {/* Dark radial aging cover on parchment borders and sides */}
                    <div className="absolute inset-0 bg-radial-vignette pointer-events-none mix-blend-multiply opacity-25" />
                    
                    {/* The double decorative manuscript margin borders */}
                    <div className={`w-full h-full ${activePaper.cssBorder} p-4 md:p-6 flex flex-col justify-between min-h-[220px] md:min-h-[260px] relative z-10`}>
                      
                      {/* Left circular twine hole indicia  */}
                      <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border border-[#801313]/40 bg-slate-950/5 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-[#12151c] shadow-inner" />
                        </div>
                      </div>

                      {/* Right stamp binding layout */}
                      <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border border-[#801313]/40 bg-slate-950/5 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-[#12151c]" />
                        </div>
                      </div>

                      {/* Title ribbon at the top of the leaf */}
                      <div className="text-center pb-2 border-b border-[#2b1b0a]/10 mb-2">
                        <p className={`text-[10px] md:text-xs font-serif italic ${activePaper.cssTextSecondary} tracking-widest font-bold`}>
                          — 𑜎𑜢𑜀𑜫 𑜏𑜢𑜂𑜫 𑜆𑜥 𑜎𑜃𑜫 • Digital Bar Amra Codex • Folio {getAhomNumerals(previewPage)} —
                        </p>
                      </div>

                      {/* Inner words list panels */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch px-10 md:px-12 flex-grow">
                        {previewWords.map((word) => (
                          <div 
                            key={word.word_id} 
                            className={`p-3.5 rounded-lg border flex gap-4 ${activePaper.cssCardBg} transition-colors duration-300`}
                          >
                            {/* Royal Circle Stamp block: giant glyph inside */}
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-double border-[#801313]/70 bg-white/20 flex flex-col items-center justify-center shrink-0 shadow-inner">
                              <span className={`text-2xl md:text-3.5xl font-serif font-bold ${activePaper.cssTextPrimary}`}>
                                {word.ahom_script}
                              </span>
                            </div>

                            {/* Details text list inside columns */}
                            <div className="min-w-0 flex-grow text-left flex flex-col justify-between">
                              <div>
                                <span className="text-[8px] md:text-[9px] font-mono tracking-widest uppercase block text-[#801313] font-bold">
                                  CODEX #{word.word_id} {getBadgeSymbol(word.word_id)}
                                </span>
                                <h4 className={`text-sm md:text-base font-serif font-bold block truncate leading-tight ${activePaper.cssTextPrimary}`}>
                                  {word.phonetic_spelling}
                                </h4>
                              </div>

                              <div className="space-y-0.5 mt-1">
                                {includeAssamese && (
                                  <p className={`text-[10px] md:text-xs block leading-normal truncate ${activePaper.cssTextPrimary}`}>
                                    <strong>বৰ্ণনা:</strong> {word.assamese_meaning}
                                  </p>
                                )}
                                {includeEnglish && (
                                  <p className={`text-[10px] md:text-xs block leading-normal truncate ${activePaper.cssTextSecondary}`}>
                                    <strong>Gloss:</strong> {word.english_meaning}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Ornate foot credit tag */}
                      <div className="text-center pt-1.5 text-[8px] uppercase tracking-widest opacity-80 mt-2">
                        <span className={`${activePaper.cssTextSecondary}`}>✦ Royal Court Archives • Pandit Tengai Mohon Guide • 1795 ✦</span>
                      </div>

                    </div>
                  </div>

                  {/* Leaf carousel controls */}
                  <div className="flex items-center justify-between font-mono text-xs bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40">
                    <button
                      onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                      disabled={previewPage === 1}
                      className="px-3 py-1 bg-[#121622] text-[#c6a43b] hover:text-white disabled:opacity-40 rounded border border-gold-950/30 flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous Leaf
                    </button>
                    
                    <span className="text-slate-400 font-space">
                      Leaf <span className="text-gold-500 font-bold">{previewPage}</span> of <span className="font-bold">{totalPages}</span>
                    </span>

                    <button
                      onClick={() => setPreviewPage(p => Math.min(totalPages, p + 1))}
                      disabled={previewPage === totalPages}
                      className="px-3 py-1 bg-[#121622] text-[#c6a43b] hover:text-white disabled:opacity-40 rounded border border-gold-950/30 flex items-center gap-1 transition-colors"
                    >
                      Next Leaf <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Explanatory footer on historical aspects */}
            <div className="mt-6 flex gap-3 p-3.5 bg-gold-950/10 border border-gold-900/10 rounded-xl text-[11px] leading-relaxed text-slate-400 font-space">
              <Calendar className="h-4.5 w-4.5 text-[#cfb26a] shrink-0" />
              <div>
                <strong>Ahom Paleography Directive:</strong> Sanchipat leaves use a characteristic horizontal format with single-cord binding openings on margins. Each folio was strictly preserved by <em>Chiring Phukans</em> (royal chroniclers). The PDF export will produce the exact digital equivalent at high vector resolution.
              </div>
            </div>
          </div>

          {/* RIGHT: PARAMETERS & COMPILER ACTION CONTROLS */}
          <div className="w-full md:w-[350px] bg-[#0c0e14] p-6 md:p-8 flex flex-col justify-between overflow-y-auto min-h-0">
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Sliders className="h-4 w-4 text-gold-500" />
                <h4 className="text-sm font-space font-bold tracking-wider text-slate-200">
                  Manuscript Settings
                </h4>
              </div>

              {/* 1. Category Filter option */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
                  Lexicon Chapter Filter
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value as any);
                    setPreviewPage(1);
                  }}
                  className="w-full bg-[#151924] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500/40"
                >
                  <option value="ALL">All Codex Chapters ({words.length} words)</option>
                  <option value="ROYAL">Crown Sovereign (Royal & Court)</option>
                  <option value="SACRED">Solar Liturgy (Priest Chronicles)</option>
                  <option value="COMMON">Agrarian Ecology (Common Life)</option>
                </select>
              </div>

              {/* 2. Paper selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
                  Sanchipat Paper Finish
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAPER_SHADES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPaper(p.id)}
                      className={`text-[10px] p-2 rounded-lg border text-left transition-all ${
                        selectedPaper === p.id 
                          ? "bg-[#181e2b] border-[#cfb26a] text-gold-400 font-bold" 
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400"
                      }`}
                    >
                      <span className="block truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Ink Profile selections */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
                  Ancient Ink Profile
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {INK_PROFILES.map((ink) => (
                    <button
                      key={ink.id}
                      onClick={() => setSelectedInk(ink.id)}
                      className={`text-[10px] p-2 rounded-lg border text-left transition-all ${
                        selectedInk === ink.id 
                          ? "bg-[#181e2b] border-[#cfb26a] text-gold-400 font-bold" 
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400"
                      }`}
                    >
                      <span className="block truncate">{ink.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Density selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
                  Glyph Density Per Folio
                </label>
                <div className="flex bg-[#151924] p-1 rounded-lg border border-slate-800">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        setItemsPerPage(val);
                        setPreviewPage(1);
                      }}
                      className={`flex-1 text-center text-xs py-1.5 rounded transition-all font-mono font-bold ${
                        itemsPerPage === val 
                          ? "bg-gold-500 text-slate-950 shadow" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {val} {val === 1 ? "Word" : "Words"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Toggles for data properties */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold mb-1">
                  Chronicle Inset Fields
                </label>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-350">Page Assamese Meanings</span>
                  <input
                    type="checkbox"
                    checked={includeAssamese}
                    onChange={(e) => setIncludeAssamese(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded border-slate-800 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-350">Page English Translations</span>
                  <input
                    type="checkbox"
                    checked={includeEnglish}
                    onChange={(e) => setIncludeEnglish(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded border-slate-800 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-350">Royal Paik Historiography</span>
                  <input
                    type="checkbox"
                    checked={includeContext}
                    onChange={(e) => setIncludeContext(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded border-slate-850 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* PDF Generation Action button */}
            <div className="mt-8 pt-4 border-t border-slate-800 space-y-3.5">
              {isCompiling ? (
                <div className="bg-[#121622] rounded-xl p-4 border border-gold-950/30 text-center space-y-2">
                  <div className="relative w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-gold-500"
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ ease: "easeInOut", duration: 0.2 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>{progressPercent}%</span>
                    <span className="animate-pulse text-gold-550 font-bold">Compiling...</span>
                  </div>
                  <p className="text-[10px] font-sans text-[#cfb26a] leading-relaxed truncate">
                    {processStatus}
                  </p>
                </div>
              ) : (
                <button
                  onClick={compilePDF}
                  disabled={filteredWords.length === 0}
                  className="w-full bg-gold-500 hover:bg-gold-600 active:scale-[0.98] text-[#121620] font-mono font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-gold-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>Download Vintage PDF</span>
                </button>
              )}

              <p className="text-[10px] font-space text-slate-500 text-center leading-relaxed">
                Rendered vector and pixel folios are optimized for 1795 AD royal compliance. Font sizes adapt beautifully.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
