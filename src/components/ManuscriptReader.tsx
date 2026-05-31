/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Sparkles, 
  Clock, 
  Award, 
  HelpCircle, 
  Volume2, 
  Copy, 
  Check, 
  RefreshCw,
  Eye, 
  FileText,
  Bookmark
} from "lucide-react";

interface Folio {
  id: number;
  folioNumber: string; // Ahom numeral
  titleAssamese: string;
  titleEnglish: string;
  mainScript: string;
  transliteration: string;
  phoneticSpelling: string;
  assameseMeaning: string;
  englishMeaning: string;
  historicalContext: string;
  illustrationType: "crest" | "consonants_row" | "scenic" | "scroll" | "administrative" | "nature";
}

const FOLIOS: Folio[] = [
  {
    id: 1,
    folioNumber: "𑜒", // 1
    titleAssamese: "মঙ্গলাচৰণ (ৰাজকীয় প্ৰাৰম্ভণি)",
    titleEnglish: "Mangalacaranam (Royal Invocation)",
    mainScript: "𑜋𑜞𑜡 𑜏𑜢𑜂𑜫",
    transliteration: "Chao Seng",
    phoneticSpelling: "Chao-Sheng",
    assameseMeaning: "ঈশ্বৰ / পবিত্ৰ ৰজা / পৰম অধিপতি",
    englishMeaning: "Blessed Lord / Sacred Sovereign Ruler",
    historicalContext: "This is the classic, mandatory starting declaration of all sovereign Tai-Ahom courtly manuscripts. Before compiling legal codes or lexical files, Pandit Tengai Mohon invoked the supreme divine ruler and the royal crest signifiers.",
    illustrationType: "crest"
  },
  {
    id: 2,
    folioNumber: "𑜀", // 2
    titleAssamese: "টাই বৰ্ণ ক্ৰম - প্ৰথম খণ্ড",
    titleEnglish: "Tai Consonants Sequence - Part I",
    mainScript: "𑜒 𑜀 𑜁 𑜂 𑜃 𑜄",
    transliteration: "A, Ka, Kha, Nga, Na, Ta",
    phoneticSpelling: "A, Ka, Kha, Nga, Na, Ta",
    assameseMeaning: "আহােমৰ প্ৰাথমিক ছয় স্বৰ আৰু ব্যঞ্জন ধবনি",
    englishMeaning: "The first six foundational glyphs of the 1795 AD Bar-Amra layout.",
    historicalContext: "Unlike the standard Tai primer order which usually places guttural plosives first, the unique 1795 AD Bar-Amra Bark Manuscript codex inexplicably begins with the vocalic root '𑜒' (A). These letters form the roots of vocal articulation in historical manuscripts.",
    illustrationType: "consonants_row"
  },
  {
    id: 3,
    folioNumber: "𑜁", // 3
    titleAssamese: "টাই বৰ্ণ ক্ৰম - দ্বিতীয় খণ্ড",
    titleEnglish: "Tai Consonants Sequence - Part II",
    mainScript: "𑜌 𑜆 𑜇 𑜈 𑜉 𑜊",
    transliteration: "Tha, Pa, Pha, Ba, Ma, Ja_Ya",
    phoneticSpelling: "Tha, Pa, Pha, Ba, Ma, Ja-Ya",
    assameseMeaning: "দ্বীতিয় ব্যঞ্জনমালাৰ ঢৌ",
    englishMeaning: "The middle consonants group enclosing bilabial plosives.",
    historicalContext: "Scribes of the Late Ahom Court used these mid-row glyphs to formulate administrative directives for the Paik guilds. Each character is hand-pressed on carefully prepared tree bark using deep indigo and charcoal pigments.",
    illustrationType: "consonants_row"
  },
  {
    id: 4,
    folioNumber: "𑜂", // 4
    titleAssamese: "টাই বৰ্ণ ক্ৰম - তৃতীয় খণ্ড",
    titleEnglish: "Tai Consonants Sequence - Part III",
    mainScript: "𑜋 𑜓 𑜍 𑜎 𑜏 𑜐",
    transliteration: "Cha, Da, Ra, La, Sa, Nya",
    phoneticSpelling: "Cha, Da, Ra, La, Sa, Nya",
    assameseMeaning: "তৃতীয় ব্যঞ্জনমালা যিকন শব্দধ্বনি নিৰ্ধাৰণ কৰে",
    englishMeaning: "Resonant alveolar sibilants and palatal liquid sounds.",
    historicalContext: "These letters represent soft sibilants, trilled liquids, and palatal nasals. In classical texts, they are critical for spelling geographical names of river tributaries and mountain ranges under sovereign rule.",
    illustrationType: "consonants_row"
  },
  {
    id: 5,
    folioNumber: "𑜃", // 5
    titleAssamese: "টাই বৰ্ণ ক্ৰম - চতুৰ্থ খণ্ড",
    titleEnglish: "Tai Consonants Sequence - Part IV",
    mainScript: "𑜑 𑜕 𑜗 𑜔 𑜘 𑜙",
    transliteration: "Ha, Ga, Gha, Dha, Bha, Jha",
    phoneticSpelling: "Ha, Ga, Gha, Dha, Bha, Jha",
    assameseMeaning: "শেষ ছয় ব্যঞ্জন আৰু গভীৰ উচ্চাৰণৰ বৰ্ণ",
    englishMeaning: "Glottal fricatives and aspirates closing the 24 consonant structure.",
    historicalContext: "These final six glyphs represent mostly voiced and aspirated plosives influenced by early regional contacts. Scribes documented them to preserve phonemic distinction from neighboring Tai kingdoms.",
    illustrationType: "consonants_row"
  },
  {
    id: 6,
    folioNumber: "𑜄", // 6
    titleAssamese: "ৰাজকীয় বিষয়া আৰু প্ৰশাসন",
    titleEnglish: "Sovereign Ranks & Administration",
    mainScript: "𑜆𑜥𑜀𑜃𑜫 • 𑜉𑜥𑜂𑜫",
    transliteration: "Phukan • Mung",
    phoneticSpelling: "Phu-kan • Mung",
    assameseMeaning: "ফুকন (সামৰিক মন্ত্ৰী) আৰু ৰাজ্য / সাম্ৰাজ্য",
    englishMeaning: "High Military Commander and Territorial Statehood",
    historicalContext: "This folio describes the hierarchical administrative structure. The 'Mung' (State) represents sovereign boundaries, defended by a 'Phukan' coordinating thousands of armed soldiers under the decree of the 'Chao' (King).",
    illustrationType: "administrative"
  },
  {
    id: 7,
    folioNumber: "𑜆", // 7
    titleAssamese: "ৰাতি পুৱাৰ সূৰ্য্য আৰু বৰ্ণালী",
    titleEnglish: "The Golden Dawn & Renewal",
    mainScript: "𑜇𑜞𑜂𑜫 𑜏𑜢𑜂𑜫",
    transliteration: "Phrang Seng",
    phoneticSpelling: "Phrang Sheng",
    assameseMeaning: "পূৱাৰ উজ্জ্বল কিৰণ / পবিত্ৰ পোহৰ",
    englishMeaning: "Primal Light of Dawn / Divine Daybreak Radiance",
    historicalContext: "Liturgical texts utilize 'Phrang Seng' to mark the daily solar renewal rituals. In early agrarian chronicles, field supervisors evaluated sunlight hours to regulate cultivation calendar terms.",
    illustrationType: "scenic"
  },
  {
    id: 8,
    folioNumber: "𑜇", // 8
    titleAssamese: "কৃষি আৰু অসমৰ অৰ্থনীতি",
    titleEnglish: "Agrarian Foundations & Ecology",
    mainScript: "𑜆𑜡 𑜃𑜡",
    transliteration: "Paa Naa",
    phoneticSpelling: "Paa Naa",
    assameseMeaning: "পানীৰ মাছ আৰু সোণালী ধাননি পথাৰ",
    englishMeaning: "Sustaining Fish in waters and Paddy Fields of wet-rice crops",
    historicalContext: "This layout records the fundamental economy of early settlers. The state maintained a reliable food surplus by managing rivers ('Paa' / Fish) and sophisticated wet-rice fields ('Naa' / Crop Fields).",
    illustrationType: "nature"
  },
  {
    id: 9,
    folioNumber: "𑜉", // 9
    titleAssamese: "পবিত্ৰ সাঁচিপাত আৰু শাসন প্ৰণালী",
    titleEnglish: "Venerable Scriptures & State Chronicle",
    mainScript: "𑜎𑜢𑜀𑜫 𑜏𑜢𑜂𑜫",
    transliteration: "Lik Seng",
    phoneticSpelling: "Lik Sheng",
    assameseMeaning: "পবিত্ৰ ইতিহাস পুথি / ৰাজকীয় সাঁচিপাত নথি",
    englishMeaning: "Sacred Chronicle Manuscript / Imperial Book Records",
    historicalContext: "Under local state protocols, only trusted 'Chiring' pandits were allowed to scribe administrative and astronomical treaties on cured Sanchipat barks, keeping the records highly structured and secure.",
    illustrationType: "scroll"
  }
];

interface ManuscriptReaderProps {
  isMuga: boolean;
  themeClasses: any;
}

export default function ManuscriptReader({ isMuga, themeClasses }: ManuscriptReaderProps) {
  const [activeFolioIndex, setActiveFolioIndex] = useState(0);
  const [inkColor, setInkColor] = useState<"obsidian" | "cinnabar" | "indigo">("obsidian");
  const [foliageContrast, setFoliageContrast] = useState(65); // adjust bark weathered look
  const [gildingShine, setGildingShine] = useState(true);
  const [isAudioSimulating, setIsAudioSimulating] = useState(false);
  const [showFootnotes, setShowFootnotes] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isPlayingWord, setIsPlayingWord] = useState(false);

  const activeFolio = FOLIOS[activeFolioIndex];

  // Map ink state to CSS colors
  const getInkHex = () => {
    switch (inkColor) {
      case "cinnabar": return "#aa2222";
      case "indigo": return "#19355e";
      default: return "#101318";
    }
  };

  const getInkTailwind = () => {
    switch (inkColor) {
      case "cinnabar": return "text-[#aa2222]";
      case "indigo": return "text-[#19355e]";
      default: return "text-slate-900";
    }
  };

  // Perform quick copy
  const handleCopyText = () => {
    navigator.clipboard.writeText(`${activeFolio.mainScript} (${activeFolio.transliteration}) - ${activeFolio.englishMeaning}`);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Sound Simulation using Web Audio API
  const handleSimulateChant = () => {
    if (isPlayingWord) return;
    setIsPlayingWord(true);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) throw new Error();
      
      const ctx = new AudioCtx();
      
      // Simulate traditional bell / meditative gong gong sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Lower pitch drone chord
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5);
      
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.0);

      // Secondary higher harmonic octave for bell resonance
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(240, ctx.currentTime);
      gain2.gain.setValueAtTime(0.15, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 1.5);

    } catch (e) {
      console.warn("Audio Context not allowed or supported.");
    }

    setTimeout(() => {
      setIsPlayingWord(false);
    }, 1800);
  };

  // Simulation of background chanting atmospheric resonance
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let droneOsc: OscillatorNode | null = null;
    let droneGain: GainNode | null = null;

    if (isAudioSimulating) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtx = new AudioCtx();
          droneOsc = audioCtx.createOscillator();
          droneGain = audioCtx.createGain();
          
          droneOsc.type = "sawtooth";
          // Soft base drone at 110Hz (A2 frequency)
          droneOsc.frequency.setValueAtTime(110, audioCtx.currentTime);
          
          // Low pass filter to make it soft and meditative like humming
          const filter = audioCtx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(150, audioCtx.currentTime);
          
          droneGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
          
          droneOsc.connect(filter);
          filter.connect(droneGain);
          droneGain.connect(audioCtx.destination);
          
          droneOsc.start();
        }
      } catch (e) {
        console.warn(e);
      }
    }

    return () => {
      if (droneOsc) {
        try {
          droneOsc.stop();
        } catch (e) {}
      }
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch (e) {}
      }
    };
  }, [isAudioSimulating]);

  // Keyboard navigation for folios
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveFolioIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveFolioIndex(prev => Math.min(FOLIOS.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-8 select-text">
      {/* Introduction Card */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        isMuga ? "bg-[#FAF7EC] border-[#E8DFC5]" : "bg-[#0e1116] border-gold-950/30"
      }`}>
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-gold-550 font-bold uppercase tracking-widest block">
            Venerable Digital Scroll Room &middot; ডিজিটেল সাঁচিপাত সংগ্ৰহালয়
          </span>
          <h2 className={`font-serif text-2xl font-black ${isMuga ? "text-[#3D2511]" : "text-white"}`}>
            Active Sanchipat Codex Browser (সাঁচিপাত পুথি ক্ৰম)
          </h2>
          <p className="text-xs text-slate-500 font-light max-w-2xl leading-relaxed">
            Flip through the reconstructed, venerable 1795 AD bark pages of the <strong className="text-gold-550">Bar-Amra Codex</strong> compiled by royal lexicographer Pandit Tengai Mohon under Ahom courtly patronage. Adjust variables like aging bark contrast and scribe ink configurations live.
          </p>
        </div>

        {/* Ambient Gong Soundscape Toggle */}
        <button
          onClick={() => setIsAudioSimulating(!isAudioSimulating)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 ${
            isAudioSimulating
              ? "bg-amber-500 text-slate-950 border-amber-600 scale-[1.02]"
              : isMuga
                ? "bg-white border-[#E0D4B2] text-[#5c4a39] hover:bg-[#FAF3DF]"
                : "bg-slate-900 border-gold-950/40 text-slate-300 hover:text-white"
          }`}
        >
          <Volume2 className={`h-4.5 w-4.5 ${isAudioSimulating ? "animate-bounce" : ""}`} />
          {isAudioSimulating ? "Meditative Drone: ACTIVE" : "Meditative Drone: MUTED"}
        </button>
      </div>

      {/* Main Manuscript Sandbox Slider Row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Controls Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className={`p-5 rounded-2xl border ${isMuga ? "bg-white border-[#E3DAA8]" : "bg-[#0c0f16] border-[#1d2330]"}`}>
            <h4 className="text-xs font-mono uppercase text-gold-550 font-bold tracking-wider mb-4 pb-2 border-b border-gold-900/10 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Codex Configuration
            </h4>

            {/* Scribe Ink Selectors */}
            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block">Scribe Ink Pigment:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "obsidian", name: "Obsidian", color: "bg-[#151310] border-slate-700" },
                  { id: "cinnabar", name: "Cinnabar", color: "bg-[#aa2222] border-red-900" },
                  { id: "indigo", name: "Indigo", color: "bg-[#19355e] border-blue-900" }
                ].map(ink => (
                  <button
                    key={ink.id}
                    onClick={() => setInkColor(ink.id as any)}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      inkColor === ink.id ? "ring-2 ring-gold-500 border-transparent bg-gold-500/10" : "bg-slate-950/20 hover:bg-slate-950/40 border-slate-700/30"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${ink.color}`} />
                    <span className="text-[9px] font-mono font-medium text-slate-400">{ink.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bark Weathering age slider */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-wider uppercase text-slate-500">
                <span>Bark Sanchipat Age:</span>
                <span className="text-gold-550 font-bold">{1795 + Math.round((100 - foliageContrast) * 2.3)} AD</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={foliageContrast}
                onChange={(e) => setFoliageContrast(parseInt(e.target.value))}
                className="w-full h-1 bg-amber-950/20 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
              <span className="text-[9px] font-mono text-slate-500 block leading-tight">Controls the preservation levels of the dried tree-bark fibers.</span>
            </div>

            {/* Gilding Shine Checkbox */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gold-900/10">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block">Imperial Gilding:</span>
                <span className="text-[9px] text-slate-450 font-mono">Gold dust margin highlight</span>
              </div>
              <button
                onClick={() => setGildingShine(!gildingShine)}
                className={`w-9 h-5 rounded-full transition-all duration-300 relative border ${
                  gildingShine ? "bg-amber-500 border-amber-600" : "bg-slate-850 border-slate-700"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                  gildingShine ? "left-4.5" : "left-0.5"
                }`} />
              </button>
            </div>

            {/* Short informational guide */}
            <div className="p-3 bg-gold-950/10 border border-gold-900/15 rounded-xl space-y-1.5 text-[11px] text-slate-400 font-light select-text">
              <span className="font-semibold text-gold-550 block">Quick Tip:</span>
              Use the Left/Right Arrow keys on your physical computer keyboard to elegantly flip back and forth between virtual leaves.
            </div>
          </div>

          {/* Quick Folios Scroll list */}
          <div className={`p-4 rounded-2xl border space-y-2 ${isMuga ? "bg-white border-[#E3DAA8]" : "bg-[#0b0e14] border-gold-950/30"}`}>
            <h5 className="text-[10px] font-mono uppercase text-slate-400 tracking-widest font-bold">Folio Indexes (পুথি পৃষ্ঠা)</h5>
            <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
              {FOLIOS.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFolioIndex(i)}
                  className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                    activeFolioIndex === i
                      ? "bg-gold-500 text-slate-950 font-bold shadow"
                      : "text-slate-400 hover:text-white hover:bg-slate-950/20"
                  }`}
                >
                  <span className="truncate flex items-center gap-1.5 font-sans">
                    <span className="font-serif italic font-bold">Folio {f.folioNumber}</span>
                  </span>
                  <span className={`text-[9px] font-mono scale-95 uppercase ${activeFolioIndex === i ? "text-slate-900" : "text-amber-500"}`}>
                    {f.illustrationType === "crest" ? "Crest" : f.illustrationType === "consonants_row" ? "Lesson" : "State"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Immersive Sanchipat Leaf Leafboard */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Main Leaf Canvas Wrapper */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300">
            
            {/* Elegant Outer Wooden Board / Leather Desk Overlay */}
            <div 
              className="p-6 md:p-10 transition-all duration-500 text-center select-none"
              style={{
                background: isMuga 
                  ? "#e3d2aa bg-gradient-to-br from-[#c9b78a] via-[#ecdcb3] to-[#cba068]"
                  : "linear-gradient(135deg, #090a0f 0%, #151a24 50%, #07080a 100%)",
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.65)"
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFolio.id}
                  initial={{ opacity: 0, rotateX: -20, y: 15 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0, rotateX: 20, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mx-auto max-w-4xl relative"
                  style={{ perspective: 1000 }}
                >
                  
                  {/* Decorative Sanchipat Sheet - Long aspect ratio (3:1 or 2.7:1) representing bark script */}
                  <div 
                    className="w-full relative rounded-md border-4 border-double shadow-2xl py-8 px-6 md:px-12 text-left flex flex-col justify-between aspect-[16/6.5] min-h-[220px] transition-all"
                    style={{
                      borderColor: activeFolio.illustrationType === "crest" ? "#801313" : "#3e240b",
                      background: `radial-gradient(ellipse at center, rgba(238,221,160,0.85) 0%, rgba(${foliageContrast * 2}, ${foliageContrast * 1.6}, ${foliageContrast}, 0.95) 100%)`,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.55), inset 0 0 100px rgba(80,45,15, 0.45)"
                    }}
                  >
                    
                    {/* Real-time organic bark tree grain texture layers */}
                    <div className="absolute inset-0 z-0 opacity-25 pointer-events-none mix-blend-overlay"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                      }}
                    />

                    {/* Left Page-binding double margin line */}
                    <div className="absolute top-0 bottom-0 left-[2.5%] md:left-[4%] w-[5px] border-l border-r border-[#801313]/55" />
                    {/* Right Page-binding double margin line */}
                    <div className="absolute top-0 bottom-0 right-[2.5%] md:right-[4%] w-[5px] border-l border-r border-[#801313]/55" />

                    {/* Leaf margin page bindings circles */}
                    <div className="absolute top-1/2 -left-[0.5%] md:left-[1%] -translate-y-1/2 w-4.5 h-4.5 rounded-full border-2 border-dashed border-[#801313]/40 bg-transparent flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900/35" />
                    </div>
                    <div className="absolute top-1/2 -right-[0.5%] md:right-[1%] -translate-y-1/2 w-4.5 h-4.5 rounded-full border-2 border-dashed border-[#801313]/40 bg-transparent flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900/35" />
                    </div>

                    {/* Gilding shine border outline (if active) */}
                    {gildingShine && (
                      <div className="absolute inset-0.5 border-2 border-[#b59530]/40 rounded-sm pointer-events-none mix-blend-color-dodge animate-pulse" />
                    )}

                    {/* UPPER BANNER FLAG: Ahom Folio marker & Digital Codex stamp */}
                    <div className="flex justify-between items-center z-10 border-b border-[#301c0c]/10 pb-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#543b17]/85 font-black">
                          1795 Barker &middot; বৰ অম্ৰ সাঁচিপাত
                        </span>
                        <div className="h-1 text-slate-400">•</div>
                        <span className="text-[9px] font-mono text-emerald-900 bg-emerald-700/10 px-1.5 py-0.2 rounded border border-emerald-900/20 font-bold leading-none select-none">
                          Cured Codex
                        </span>
                      </div>
                      <div className="text-[11px] font-serif italic text-[#801313] font-bold select-text">
                        ফলি {activeFolio.folioNumber} &middot; Leaf No. {activeFolio.id}
                      </div>
                    </div>

                    {/* MIDDLE MAIN: Scribes Royal Tai-Ahom Script Lines */}
                    <div className="my-auto py-1 z-10 font-serif select-text flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      
                      {/* Left: Primal Script Text */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[9px] font-mono text-amber-900/70 select-none">[SCRIBES INK]</span>
                          <span className={`text-[11px] font-mono uppercase tracking-wider font-bold text-[#5c3e17]/80`}>
                            {inkColor === "cinnabar" ? "Vermillion Cinnabar" : inkColor === "indigo" ? "Monastic Indigo" : "Royal Carbon"}
                          </span>
                        </div>
                        
                        <h3 
                          className="text-4xl md:text-5.5xl hover:scale-[1.01] origin-left transition-all font-black select-all py-1.5 tracking-widest font-serif leading-none"
                          style={{ color: getInkHex() }}
                        >
                          {activeFolio.mainScript}
                        </h3>

                        {/* Phonetics and Gloss tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-800/80 bg-slate-900/5 px-2 py-0.5 rounded border border-slate-900/10">
                            Phonetic: <strong className="font-sans text-red-900">{activeFolio.phoneticSpelling}</strong>
                          </span>
                          <span className="text-xs font-sans font-medium text-slate-800/70 bg-slate-900/5 px-2 py-0.5 rounded border border-slate-900/10">
                            Gloss: <strong className="font-serif text-[#801313]">{activeFolio.transliteration}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Right: Immersive Hand-drawn/Crest illustration preview block */}
                      <div 
                        className={`w-28 h-20 md:w-36 md:h-24 rounded border border-[#801313]/25 p-2 flex flex-col items-center justify-center gap-1.5 ${
                          isMuga ? "bg-white/45" : "bg-white/30"
                        } shadow-inner bg-stone-100/40 relative overflow-hidden shrink-0`}
                      >
                        {/* Motif Backdrop Watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 text-3xl select-none pointer-events-none">
                          {activeFolio.illustrationType === "crest" ? "👑" : activeFolio.illustrationType === "nature" ? "🌾" : "⛩️"}
                        </div>

                        {/* Reconstructed graphical elements */}
                        {activeFolio.illustrationType === "crest" && (
                          <div className="text-center">
                            <span className="text-xl block">𑜏𑜢𑜂𑜫</span>
                            <span className="text-[8px] font-mono uppercase text-slate-600 block tracking-tighter">Imperial Crest</span>
                          </div>
                        )}
                        {activeFolio.illustrationType === "consonants_row" && (
                          <div className="text-center text-[#801313] font-serif space-y-0.5">
                            <span className="text-lg tracking-widest font-bold">𑜀 𑜁 𑜂</span>
                            <span className="text-[8px] font-mono uppercase text-slate-600 block scale-90 leading-none">Lesson Node</span>
                          </div>
                        )}
                        {activeFolio.illustrationType === "administrative" && (
                          <div className="text-center text-indigo-900 space-y-0.5">
                            <span className="text-xl block">⚔️</span>
                            <span className="text-[8px] font-mono uppercase text-slate-600 block leading-none">Paik Guard</span>
                          </div>
                        )}
                        {activeFolio.illustrationType === "scenic" && (
                          <div className="text-center text-amber-900 space-y-0.5">
                            <span className="text-xl block">🌅</span>
                            <span className="text-[8px] font-mono text-slate-600 uppercase block scale-90 leading-none">Holy Dawn</span>
                          </div>
                        )}
                        {activeFolio.illustrationType === "nature" && (
                          <div className="text-center text-emerald-900 space-y-0.5">
                            <span className="text-xl block">🐟🌾</span>
                            <span className="text-[8px] font-mono uppercase text-slate-600 block leading-none">Agrarian</span>
                          </div>
                        )}
                        {activeFolio.illustrationType === "scroll" && (
                          <div className="text-center text-rose-900 space-y-0.5">
                            <span className="text-lg font-bold block">𑜎𑜢𑜀𑜫</span>
                            <span className="text-[8px] font-mono uppercase text-slate-600 block scale-90 leading-none">Folio Codex</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* LOWER BANNER: Translations Summary */}
                    <div className="mt-2 pt-2 border-t border-[#301c0c]/10 z-10 select-text text-xs md:text-sm grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-800 leading-normal">
                      <div>
                        <strong className="text-stone-900 font-sans tracking-tight block text-[10px] uppercase font-bold text-slate-600 leading-none mb-1">অসমীয়া অৰ্থ (Assamese Gloss):</strong>
                        <span className="font-serif text-[#1e1003] font-extrabold">{activeFolio.assameseMeaning}</span>
                      </div>
                      <div>
                        <strong className="text-stone-900 font-sans tracking-tight block text-[10px] uppercase font-bold text-slate-600 leading-none mb-1">English Definition:</strong>
                        <span className="font-serif font-black">{activeFolio.englishMeaning}</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation timeline slider under the Leaf */}
              <div className="mt-8 flex justify-between items-center max-w-4xl mx-auto text-xs z-25 font-space select-none">
                <button
                  disabled={activeFolioIndex === 0}
                  onClick={() => {
                    setActiveFolioIndex(p => Math.max(0, p - 1));
                    handleSimulateChant();
                  }}
                  className={`py-2 px-3 rounded-xl border flex items-center gap-1 transition-all text-[#12161f] bg-stone-100 border-stone-300 hover:bg-stone-250 ${
                    activeFolioIndex === 0 ? "opacity-35 pointer-events-none" : ""
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev Leaf (পাছৰ পৃষ্ঠা)
                </button>

                {/* Folio indicators circles */}
                <div className="flex gap-1.5">
                  {FOLIOS.map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFolioIndex(i);
                        handleSimulateChant();
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeFolioIndex === i 
                          ? "bg-[#b48522] scale-125 border border-amber-900 shadow-md" 
                          : "bg-slate-350 hover:bg-[#b48522]/50 border border-slate-400/40"
                      }`}
                      title={`Folio ${f.folioNumber}`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeFolioIndex === FOLIOS.length - 1}
                  onClick={() => {
                    setActiveFolioIndex(p => Math.min(FOLIOS.length - 1, p + 1));
                    handleSimulateChant();
                  }}
                  className={`py-2 px-3 rounded-xl border flex items-center gap-1 transition-all text-[#12161f] bg-stone-100 border-stone-300 hover:bg-stone-250 ${
                    activeFolioIndex === FOLIOS.length - 1 ? "opacity-35 pointer-events-none" : ""
                  }`}
                >
                  Next Leaf (আগৰ পৃষ্ঠা) <ChevronRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>

          {/* BELOW THE FOLIO: Expanded Hermetic Historical Commentary Inspector */}
          <div className={`p-6 md:p-8 rounded-2xl border select-text ${
            isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#0e1116] border-gold-950/20"
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gold-900/10">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#b48522] font-black">Historic Commentary &middot; বৰ অম্ৰ সাষ্ট্ৰীয় টোকা</span>
                <h4 className={`font-serif text-lg font-extrabold ${isMuga ? "text-slate-900" : "text-white"}`}>
                  Epigraphical Context - Folio {activeFolio.folioNumber} ({activeFolio.titleEnglish})
                </h4>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSimulateChant}
                  disabled={isPlayingWord}
                  className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-all ${
                    isMuga 
                      ? "bg-[#801313]/5 hover:bg-[#801313]/10 border-[#801313]/20 text-[#801313]" 
                      : "bg-gold-500/10 hover:bg-gold-500/20 border-gold-500/20 text-gold-400"
                  }`}
                >
                  <Volume2 className={`h-4 w-4 ${isPlayingWord ? "animate-ping" : ""}`} />
                  {isPlayingWord ? "Ringing Gong..." : "Simulate Meditative Sound"}
                </button>
                <button
                  onClick={handleCopyText}
                  className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-all ${
                    isMuga 
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300" 
                      : "bg-[#181d26] hover:bg-[#1f2531] border-gold-950 text-slate-350"
                  }`}
                >
                  {copiedText ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Glossary
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs md:text-sm leading-relaxed text-[#7e8e9f] font-light">
              <p>
                {activeFolio.historicalContext}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gold-900/10 select-text">
                <div className={`p-4 rounded-xl border ${isMuga ? "bg-[#FFFDF6] border-[#E2D6AC]" : "bg-[#0b0e14]/50 border-gold-950/40"}`}>
                  <span className="text-[10px] font-mono block text-gold-550 uppercase font-black leading-none mb-1">Manuscript Title:</span>
                  <strong className={isMuga ? "text-slate-950 font-bold" : "text-[#f4efe0]"}>{activeFolio.titleEnglish}</strong>
                </div>
                <div className={`p-4 rounded-xl border ${isMuga ? "bg-[#FFFDF6] border-[#E2D6AC]" : "bg-[#0b0e14]/50 border-gold-950/40"}`}>
                  <span className="text-[10px] font-mono block text-gold-550 uppercase font-black leading-none mb-1">Pronunciation (ভাৰতীয় ক্ৰম):</span>
                  <strong className={isMuga ? "text-slate-950 font-bold" : "text-[#f4efe0]"}>{activeFolio.transliteration} [{activeFolio.phoneticSpelling}]</strong>
                </div>
                <div className={`p-4 rounded-xl border ${isMuga ? "bg-[#FFFDF6] border-[#E2D6AC]" : "bg-[#0b0e14]/50 border-gold-950/40"}`}>
                  <span className="text-[10px] font-mono block text-gold-550 uppercase font-black leading-none mb-1">Chronicle Year Record:</span>
                  <strong className={isMuga ? "text-slate-950 font-bold" : "text-[#f4efe0]"}>1795 AD (১৭৯৫ খ্ৰীষ্টাব্দ)</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
