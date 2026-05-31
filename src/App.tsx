/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Copy, 
  Check, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Code, 
  FileJson, 
  Award, 
  Keyboard, 
  Download, 
  Info, 
  X, 
  RotateCcw,
  Languages,
  ArrowRight,
  TrendingUp,
  Moon,
  Sun,
  Feather,
  Send,
  PlusCircle,
  HelpCircle,
  AlertCircle,
  Bookmark,
  CheckSquare,
  Clipboard
} from "lucide-react";
import { barAmraDb } from "./wordsData";
import { AhomWord } from "./types";
import ManuscriptExporter from "./components/ManuscriptExporter";
import ManuscriptReader from "./components/ManuscriptReader";
import { Book } from "lucide-react";

// Complete database of 24 consonants from Elementary Tai Primer
const primerConsonants = [
  { glyph: "𑜀", standard_idx: 1, bar_idx: 2, name: "ka", assamese: "কা", english: "Ka", keyChar: "m", historicalNote: "First primary consonant. Unicode 11700: AHOM LETTER KA." },
  { glyph: "𑜁", standard_idx: 2, bar_idx: 3, name: "kha", assamese: "খা", english: "Kha", keyChar: "r", historicalNote: "Aspirated guttural consonant. Unicode 11701: AHOM LETTER KHA." },
  { glyph: "𑜂", standard_idx: 3, bar_idx: 4, name: "nga", assamese: "ঙা", english: "Nga", keyChar: "c", historicalNote: "Velar nasal sound. Unicode 11702: AHOM LETTER NGA." },
  { glyph: "𑜋", standard_idx: 4, bar_idx: 13, name: "cha", assamese: "চা", english: "Cha", keyChar: "w", historicalNote: "Voiceless palatal affricate. Unicode 1170B: AHOM LETTER CHA." },
  { glyph: "𑜏", standard_idx: 5, bar_idx: 17, name: "sa", assamese: "ছা", english: "Sa", keyChar: "x", historicalNote: "Voiceless alveolar sibilant. Unicode 1170F: AHOM LETTER SA." },
  { glyph: "𑜐", standard_idx: 6, bar_idx: 18, name: "nya", assamese: "ঞা", english: "Nya", keyChar: "q", historicalNote: "Palatal nasal sound. Unicode 11710: AHOM LETTER NYA." },
  { glyph: "𑜄", standard_idx: 7, bar_idx: 6, name: "ta", assamese: "টা/তা", english: "Ta", keyChar: "t", historicalNote: "Voiceless alveolar plosive. Unicode 11704: AHOM LETTER TA. (Note: 𑜅 is AHOM LETTER ALTERNATE TA)." },
  { glyph: "𑜌", standard_idx: 8, bar_idx: 7, name: "tha", assamese: "ঠা/থা", english: "Tha", keyChar: "y", historicalNote: "Aspirated dental plosive. Unicode 1170C: AHOM LETTER THA." },
  { glyph: "𑜓", standard_idx: 9, bar_idx: 14, name: "da", assamese: "ডা/দা", english: "Da", keyChar: "d", historicalNote: "Voiced alveolar plosive. Unicode 11713: AHOM LETTER DA." },
  { glyph: "𑜃", standard_idx: 10, bar_idx: 5, name: "na", assamese: "ণা/না", english: "Na", keyChar: "k", historicalNote: "Alveolar nasal. Unicode 11703: AHOM LETTER NA." },
  { glyph: "𑜆", standard_idx: 11, bar_idx: 8, name: "pa", assamese: "পা", english: "Pa", keyChar: "p", historicalNote: "Voiceless bilabial plosive. Unicode 11706: AHOM LETTER PA." },
  { glyph: "𑜇", standard_idx: 12, bar_idx: 9, name: "pha", assamese: "ফা", english: "Pha", keyChar: "f", historicalNote: "Aspirated voiceless bilabial plosive. Unicode 11707: AHOM LETTER PHA." },
  { glyph: "𑜉", standard_idx: 13, bar_idx: 11, name: "ma", assamese: "মা", english: "Ma", keyChar: "g", historicalNote: "Bilabial nasal. Unicode 11709: AHOM LETTER MA." },
  { glyph: "𑜊", standard_idx: 14, bar_idx: 12, name: "ja_ya", assamese: "যা/য়া", english: "Ja/Ya", keyChar: "j", historicalNote: "Alveolar/palatal sound. Unicode 1170A: AHOM LETTER JA." },
  { glyph: "𑜍", standard_idx: 15, bar_idx: 15, name: "ra", assamese: "ৰা", english: "Ra", keyChar: "i", historicalNote: "Alveolar trill/flap. Unicode 1170D: AHOM LETTER RA." },
  { glyph: "𑜎", standard_idx: 16, bar_idx: 16, name: "la", assamese: "লা", english: "La", keyChar: "l", historicalNote: "Alveolar lateral approximant. Unicode 1170E: AHOM LETTER LA." },
  { glyph: "𑜈", standard_idx: 17, bar_idx: 10, name: "ba_wa", assamese: "বা/ৱা", english: "Ba/Wa", keyChar: "v", historicalNote: "Bilabial approximant. Unicode 11708: AHOM LETTER BA." },
  { glyph: "𑜑", standard_idx: 18, bar_idx: 19, name: "ha", assamese: "হা", english: "Ha", keyChar: "h", historicalNote: "Glottical fricative. Unicode 11711: AHOM LETTER HA." },
  { glyph: "𑜒", standard_idx: 19, bar_idx: 1, name: "a", assamese: "আ", english: "A", keyChar: "a", historicalNote: "Starting vocalic root of the alphabet. Unicode 11712: AHOM LETTER A." },
  { glyph: "𑜕", standard_idx: 20, bar_idx: 20, name: "ga", assamese: "গা", english: "Ga", keyChar: "u", historicalNote: "Voiced velar plosive. Unicode 11715: AHOM LETTER GA. (Note: 𑜖 is AHOM LETTER ALTERNATE GA)." },
  { glyph: "𑜗", standard_idx: 21, bar_idx: 21, name: "gha", assamese: "ঘা", english: "Gha", keyChar: "z", historicalNote: "Voiced aspirated velar plosive. Unicode 11717: AHOM LETTER GHA." },
  { glyph: "𑜔", standard_idx: 22, bar_idx: 22, name: "dha", assamese: "ঢা/ধা", english: "Dha", keyChar: "b", historicalNote: "Voiced dental plosive. Unicode 11714: AHOM LETTER DHA." },
  { glyph: "𑜘", standard_idx: 23, bar_idx: 23, name: "bha", assamese: "ভা", english: "Bha", keyChar: "n", historicalNote: "Voiced aspirated bilabial plosive. Unicode 11718: AHOM LETTER BHA." },
  { glyph: "𑜙", standard_idx: 24, bar_idx: 24, name: "jha", assamese: "ঝা", english: "Jha", keyChar: "e", historicalNote: "Voiced palatal affricate. Unicode 11719: AHOM LETTER JHA." }
];

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"lexicon" | "primer" | "manuscript" | "sandbox" | "quiz" | "scribe" | "database">("lexicon");
  
  // Dynamic Words state loaded from full-stack backend
  const [words, setWords] = useState<AhomWord[]>(barAmraDb.words);
  const [loadingWords, setLoadingWords] = useState(false);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "ROYAL" | "SACRED" | "COMMON">("ALL");
  
  // Master-Detail selected word state (defaults to "BA_001")
  const [selectedWordId, setSelectedWordId] = useState<string>("BA_001");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog / Modal Form state for contributing a new word
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isManuscriptExportOpen, setIsManuscriptExportOpen] = useState(false);
  const [newWordId, setNewWordId] = useState("");
  const [newAhomScript, setNewAhomScript] = useState("");
  const [newPhonetic, setNewPhonetic] = useState("");
  const [newAssamese, setNewAssamese] = useState("");
  const [newEnglish, setNewEnglish] = useState("");
  const [newContext, setNewContext] = useState("");
  const [newCategory, setNewCategory] = useState<"ROYAL" | "SACRED" | "COMMON">("COMMON");
  const [submittingWord, setSubmittingWord] = useState(false);

  // AI Scribe interactive states
  const [scribeQuestion, setScribeQuestion] = useState("");
  const [scribeAnswer, setScribeAnswer] = useState("");
  const [scribeLoading, setScribeLoading] = useState(false);
  
  // UI states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);
  
  // Sandbox state
  const [sandboxText, setSandboxText] = useState("");
  
  // Tai Primer state
  const [primerOrder, setPrimerOrder] = useState<"standard" | "baramra">("standard");
  const [selectedPrimerGlyph, setSelectedPrimerGlyph] = useState<string>("𑜀");
  
  // Quiz states
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; selected: string } | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Fetch words list from server
  const loadWords = async (silent = false) => {
    if (!silent) setLoadingWords(true);
    try {
      const res = await fetch("/api/words");
      const data = await res.json();
      if (data.success && data.words) {
        setWords(data.words);
        // Default to first word ID if not set
        if (data.words.length > 0) {
          setSelectedWordId(prev => prev || data.words[0].word_id);
        }
      }
    } catch (err) {
      console.warn("Backend fetch failed. Operating on fallback local Bar Amra database:", err);
    } finally {
      if (!silent) setLoadingWords(false);
    }
  };

  useEffect(() => {
    loadWords();
  }, []);

  // Sync category counts on loaded words list
  const getCategoryInfo = (id: string, customCatOverride?: string) => {
    if (customCatOverride) {
      return {
        cat: customCatOverride,
        label: customCatOverride === "ROYAL" ? "Royal & Statehood" : customCatOverride === "SACRED" ? "Sacred & Liturgies" : "Commoner & Agrarian",
        badge: customCatOverride === "ROYAL" ? "Crown Sovereign" : customCatOverride === "SACRED" ? "Solar Liturgy" : "Handloom Craft",
        icon: customCatOverride === "ROYAL" ? "👑" : customCatOverride === "SACRED" ? "✨" : "🌾"
      };
    }

    switch (id) {
      case "BA_001": return { cat: "ROYAL", label: "Royal & Statehood", badge: "Crown Sovereign", icon: "👑" };
      case "BA_002": return { cat: "ROYAL", label: "Royal & Statehood", badge: "Dynastic Totem", icon: "🦁" };
      case "BA_003": return { cat: "ROYAL", label: "Admin & Military", badge: "Command Minister", icon: "⚔️" };
      case "BA_004": return { cat: "ROYAL", label: "Territorial Domain", badge: "Sovereign State", icon: "🗺️" };
      case "BA_005": return { cat: "SACRED", label: "Syllabic Prayer", badge: "Solar Liturgy", icon: "🌅" };
      case "BA_006": return { cat: "SACRED", label: "Sacred & Liturgy", badge: "Divine Radiance", icon: "💎" };
      case "BA_007": return { cat: "COMMON", label: "Commoner Life", badge: "River Resource", icon: "🐟" };
      case "BA_008": return { cat: "COMMON", label: "Agrarian Ecology", badge: "Wet-Rice culture", icon: "🌾" };
      case "BA_009": return { cat: "ROYAL", label: "Royal Precept", badge: "Sovereign Justice", icon: "👂" };
      case "BA_010": return { cat: "SACRED", label: "Sacred & Liturgy", badge: "Scripture Document", icon: "📜" };
      case "BA_011": return { cat: "COMMON", label: "Commoner Life", badge: "Muga Silk Craft", icon: "🐛" };
      default: return { cat: "COMMON", label: "Lexical Unit", badge: "Standard Word", icon: "✍️" };
    }
  };

  // Pre-generate dynamic ID suggestions for contributed word
  useEffect(() => {
    if (isContributeOpen) {
      const numericIds = words
        .map(w => parseInt(w.word_id.replace("BA_", "")))
        .filter(num => !isNaN(num));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 12;
      setNewWordId(`BA_${String(nextNum).padStart(3, "0")}`);
    }
  }, [isContributeOpen, words]);

  // Toast notifier helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sound generator using Web Audio API (creates custom harmonic chimes for each word)
  const playSynthesizedWord = (word: AhomWord) => {
    setIsPlayingId(word.word_id);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        triggerToast("Audio Web-synth not supported in preview frame.");
        setIsPlayingId(null);
        return;
      }
      const ctx = new AudioCtx();
      
      let seed = 0;
      for (let i = 0; i < word.phonetic_spelling.length; i++) {
        seed += word.phonetic_spelling.charCodeAt(i);
      }
      
      const notes = [
        180 + (seed % 120),       
        240 + ((seed * 1.5) % 180), 
        360 + ((seed * 2) % 240)    
      ];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + idx * 0.16);
        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.16 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.16 + 0.55);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.16);
        osc.stop(ctx.currentTime + idx * 0.16 + 0.6);
      });

      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(word.phonetic_spelling);
        u.volume = 0.4;
        u.rate = 0.8;
        window.speechSynthesis.speak(u);
      }

      setTimeout(() => {
        setIsPlayingId(null);
      }, 800);
    } catch (e) {
      console.error(e);
      setIsPlayingId(null);
    }
  };

  // Copy helper
  const copyText = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Virtual Keyboard letters for Sandbox
  const ahomConsonants = [
    { glyph: "𑜀", name: "ka", assamese: "কা", english: "Ka" },
    { glyph: "𑜁", name: "kha", assamese: "খা", english: "Kha" },
    { glyph: "𑜂", name: "nga", assamese: "ঙা", english: "Nga" },
    { glyph: "𑜋", name: "cha", assamese: "চা", english: "Cha" },
    { glyph: "𑜏", name: "sa", assamese: "ছা", english: "Sa" },
    { glyph: "𑜐", name: "nya", assamese: "ঞা", english: "Nya" },
    { glyph: "𑜄", name: "ta", assamese: "টা/তা", english: "Ta" },
    { glyph: "𑜌", name: "tha", assamese: "ঠা/থা", english: "Tha" },
    { glyph: "𑜓", name: "da", assamese: "ডা/দা", english: "Da" },
    { glyph: "𑜃", name: "na", assamese: "ণা/না", english: "Na" },
    { glyph: "𑜆", name: "pa", assamese: "পা", english: "Pa" },
    { glyph: "𑜇", name: "pha", assamese: "ফা", english: "Pha" },
    { glyph: "𑜉", name: "ma", assamese: "মা", english: "Ma" },
    { glyph: "𑜊", name: "ja_ya", assamese: "যা/য়া", english: "Ja/Ya" },
    { glyph: "𑜍", name: "ra", assamese: "ৰা", english: "Ra" },
    { glyph: "𑜎", name: "la", assamese: "লা", english: "La" },
    { glyph: "𑜈", name: "ba_wa", assamese: "বা/ৱা", english: "Ba/Wa" },
    { glyph: "𑜑", name: "ha", assamese: "হা", english: "Ha" },
    { glyph: "𑜒", name: "a", assamese: "আ", english: "A" },
    { glyph: "𑜕", name: "ga", assamese: "গা", english: "Ga" },
    { glyph: "𑜗", name: "gha", assamese: "ঘা", english: "Gha" },
    { glyph: "𑜔", name: "dha", assamese: "ঢা/ধা", english: "Dha" },
    { glyph: "𑜘", name: "bha", assamese: "ভা", english: "Bha" },
    { glyph: "𑜙", name: "jha", assamese: "ঝা", english: "Jha" },
    { glyph: "𑜅", name: "alt_ta", assamese: "টা/তা (বিকল্প)", english: "Alt Ta" },
    { glyph: "𑜖", name: "alt_ga", assamese: "গা (বিকল্প)", english: "Alt Ga" },
    { glyph: "𑜚", name: "alt_ba", assamese: "বা (বিকল্প)", english: "Alt Ba" }
  ];

  const ahomVowelsAndMarks = [
    { glyph: "𑜞", name: "medial ra" },
    { glyph: "𑜡", name: "vowel aa" },
    { glyph: "𑜢", name: "vowel i" },
    { glyph: "𑜣", name: "vowel ii" },
    { glyph: "𑜤", name: "vowel u" },
    { glyph: "𑜥", name: "vowel uu" },
    { glyph: "𑜫", name: "virama (killer)" }
  ];

  // Shuffler for Quiz (using dynamically loaded words array)
  const setupQuizQuestion = () => {
    if (words.length === 0) return;
    if (quizIndex < words.length) {
      const correctWord = words[quizIndex];
      const items = [correctWord.english_meaning];
      
      const distractions = words
        .filter((w) => w.word_id !== correctWord.word_id)
        .map((w) => w.english_meaning);
      
      const shuffledDistractions = [...distractions].sort(() => Math.random() - 0.5);
      items.push(...shuffledDistractions.slice(0, 2));
      
      setShuffledOptions([...items].sort(() => Math.random() - 0.5));
    }
  };

  useEffect(() => {
    setupQuizQuestion();
  }, [quizIndex, words]);

  const handleQuizAnswer = (answer: string) => {
    if (quizFeedback || words.length === 0) return;
    const correctWord = words[quizIndex];
    const isCorrect = answer === correctWord.english_meaning;
    
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
    
    setQuizFeedback({ isCorrect, selected: answer });
  };

  const nextQuizQuestion = () => {
    setQuizFeedback(null);
    if (quizIndex + 1 < words.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizScore(0);
    setQuizIndex(0);
    setQuizFeedback(null);
    setQuizFinished(false);
  };

  // Filter dictionary based on search and selected category filter
  const filteredWords = words.filter((word) => {
    const q = searchQuery.toLowerCase();
    const info = getCategoryInfo(word.word_id);
    const matchesCategory = selectedCategory === "ALL" || info.cat === selectedCategory;
    const matchesSearch = (
      word.phonetic_spelling.toLowerCase().includes(q) ||
      word.assamese_meaning.toLowerCase().includes(q) ||
      word.english_meaning.toLowerCase().includes(q) ||
      word.ahom_script.includes(q) ||
      word.word_id.toLowerCase().includes(q)
    );
    return matchesCategory && matchesSearch;
  });

  // Handle addition of a contributed word using backend POST route
  const handleContributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordId || !newAhomScript || !newPhonetic || !newAssamese || !newEnglish) {
      triggerToast("Please fill all mandatory golden scroll fields.");
      return;
    }

    setSubmittingWord(true);
    try {
      const res = await fetch("/api/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word_id: newWordId,
          ahom_script: newAhomScript,
          phonetic_spelling: newPhonetic,
          assamese_meaning: newAssamese,
          english_meaning: newEnglish,
          historical_context: newContext || "Contributed by a modern digital codex patron."
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast("Word chronicled successfully into full-stack backend!");
        // Reset local form values
        setNewAhomScript("");
        setNewPhonetic("");
        setNewAssamese("");
        setNewEnglish("");
        setNewContext("");
        setIsContributeOpen(false);
        // Refresh items list
        await loadWords(true);
        setSelectedWordId(newWordId);
      } else {
        triggerToast(data.error || "Submission failed.");
      }
    } catch (err) {
      triggerToast("Error connecting to server backend.");
    } finally {
      setSubmittingWord(false);
    }
  };

  // Reset backend database
  const handleResetCodex = async () => {
    if (!window.confirm("Restore original historical 1795 Bar Amra defaults? All additions will be cleared.")) return;
    try {
      const res = await fetch("/api/words/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast("Venerable codex restored successfully!");
        setSandboxText("");
        await loadWords();
      } else {
        triggerToast("Failed to reset backend.");
      }
    } catch (err) {
      triggerToast("Backend connection failure.");
    }
  };

  // AI Chiring Archivist Consultation Scribe Call
  const handleAskArchivist = async (questionString?: string) => {
    const activeQuestion = questionString || scribeQuestion;
    if (!activeQuestion.trim()) return;

    setScribeLoading(true);
    setScribeQuestion(activeQuestion);
    try {
      const res = await fetch("/api/scribe/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: activeQuestion })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScribeAnswer(data.answer);
      } else {
        setScribeAnswer(`*The Archivist pauses in deep thought:* "${data.error || "I could not decipher the sky. Let us return to our traditional studies."}"`);
      }
    } catch (e) {
      setScribeAnswer("*A digital cloud darkens the court:* Sound from our royal chronicles failed to load today.");
    } finally {
      setScribeLoading(false);
    }
  };

  // Pre-configured questions for the AI Scribe
  const standardQuestions = [
    { label: "Muga Weaving Guilds", q: "How did Ahom kings organize standard guilds for weaving and wear of Muga Golden silk?" },
    { label: "Royal Garment Codification", q: "What were the traditional Ahom laws (Buranji) on who can carry embroidered Muga patterns and Seleng cloths?" },
    { label: "Meaning of Phra / Seng", q: "Explain the sacred root meaning of the terms 'Phra' (Deity) and 'Seng' (Gem/Divine light) in your ritual chronicles." },
    { label: "Pandit Tengai Mohon Guide", q: "Who was Pandit Tengai Mohon, and what motivated the 1795 AD compilation of the Bar Amra?" }
  ];

  // Visual Styling definitions - Sanchipat / Muga Golden Silk light theme active exclusively
  const isMuga = true;
  
  // Theme styling configurations
  const themeClasses = {
    bg: "bg-[#FAF7ED] text-[#332415]",
    header: "bg-gradient-to-b from-[#F2E8CE] to-[#FAF7ED] border-[#E2D5B5]",
    title: "text-[#2B1B0C]",
    card: "bg-white border-[#E4D7B8] shadow-sm shadow-[#DFD6BD]/50 text-[#3d2a17]",
    badgeLabel: "text-[#A04000]",
    subtext: "text-[#695540]",
    badgeSec: "bg-[#332415]/5 border-[#332415]/15 text-[#332415]",
    highlightText: "text-[#BF1A1A] font-bold",
    tabActive: "bg-gold-500 text-gold-950 shadow-md",
    tabInactive: "text-[#58483B] hover:text-[#2d1f14] hover:bg-[#FAF4DF]",
    inputBg: "bg-[#FCFCFA] border-[#DCD3B5] text-[#3d2916]",
    sidebarCard: "bg-[#FFFDF4] border-[#E3D6B2]",
    buttonAccent: "bg-[#801313] hover:bg-[#610d0d] text-[#FAF5E6]",
    timelineCard: "bg-[#F7F2DE] border-[#E0D4B2]",
    citation: "bg-[#F9ECE7] border-[#801313] text-[#4d1010]"
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} font-sans flex flex-col selection:bg-gold-500 selection:text-[#07090c] transition-colors duration-500`}>
      
      {/* Dynamic Toast System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 shadow-2xl flex items-center font-medium gap-2 font-space text-sm px-5 py-3.5 rounded-lg border bg-[#801313] border-[#a04000] text-white"
          >
            <Sparkles className="h-4 w-4 animate-spin text-amber-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Royal Header Section */}
      <header className={`relative border-b ${themeClasses.header} pt-7 pb-6 px-4 md:px-8 transition-colors duration-500`}>
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] tracking-[0.25em] font-mono border px-2.5 py-1 rounded-md bg-[#FAF1D6] border-[#D0BA82] text-[#806B32] font-semibold">
                1795 AD TAI LANGUAGE MANUSCRIPT
              </span>
              <span className="text-xs tracking-wider font-space text-slate-500 flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-gold-500 animate-pulse" /> Full-Stack Digilog
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-5xl font-serif font-extrabold tracking-tight ${themeClasses.title} flex flex-wrap items-baseline gap-2 md:gap-3`}>
              <span>বৰ অম্ৰ</span> 
              <span className="text-gold-500 font-light text-2xl md:text-3.5xl">Bar Amra Codex</span>
              <span className="text-xs px-2.5 py-1 rounded border font-space font-semibold uppercase tracking-wider bg-[#801313]/10 border-[#801313]/25 text-[#801313]">
                Tai-Ahom (তাই ভাষা)
              </span>
            </h1>
            
            <p className={`text-xs md:text-sm mt-2 max-w-2xl font-light leading-relaxed ${themeClasses.subtext}`}>
              Digitized full-stack codex of the historic <strong className="text-gold-500 font-medium">Tai Language (তাই ভাষা)</strong> lexicon compiled by <strong className="text-gold-500 font-medium">Pandit Tengai Mohon</strong> under primary royal patronage, conserving the elite sacred, courtly, and agrarian language strings of the Ahom dynasty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Quick action triggers */}
            <button
              onClick={() => setIsContributeOpen(true)}
              className="text-xs font-mono font-bold bg-[#b48522] hover:bg-[#936518] text-[#12161f] px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors duration-300 shadow shadow-amber-900/10"
            >
              <PlusCircle className="h-4 w-4" /> Add Word
            </button>

            <button
               onClick={() => {
                 setIsManuscriptExportOpen(true);
                 triggerToast("1795 Bark Manuscript Exporter initiated.");
               }}
               className="text-xs font-mono font-bold px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors duration-300 border bg-[#801313]/10 border-[#801313]/30 text-[#801313] hover:bg-[#801313]/20"
            >
              <Download className="h-4 w-4" /> Export Manuscript
            </button>
            
            <button
              title="Reset Database Defaults"
              onClick={handleResetCodex}
              className="p-2.5 rounded-lg border transition-colors duration-300 bg-white text-[#801313] border-[#E0D4B2] hover:bg-[#FAF4DF]"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Global Nav Pills Wrapper */}
        <div className="max-w-7xl mx-auto mt-6">
          <div className={`flex flex-wrap gap-1 border p-1 rounded-xl w-full max-w-4xl ${
            isMuga ? "bg-[#FAF6EA] border-[#E8DFC5]" : "bg-[#12161f] border-gold-900/30"
          }`}>
            {[
              { id: "lexicon", label: "Lexicon Explorer", icon: <BookOpen className="h-3.5 w-3.5" /> },
              { id: "primer", label: "Tai Alphabet (বৰ্ণমালা)", icon: <Languages className="h-3.5 w-3.5" /> },
              { id: "manuscript", label: "Interactive Sanchipat (পুথি)", icon: <Book className="h-3.5 w-3.5" /> },
              { id: "sandbox", label: "Script Sandbox", icon: <Keyboard className="h-3.5 w-3.5" /> },
              { id: "quiz", label: "Memory Review", icon: <Languages className="h-3.5 w-3.5" /> },
              { id: "scribe", label: "Ask Archivist AI", icon: <Feather className="h-3.5 w-3.5" /> },
              { id: "database", label: "Compliance Database", icon: <FileJson className="h-3.5 w-3.5" /> }
            ].map((tabSpec) => (
              <button
                key={tabSpec.id}
                onClick={() => setActiveTab(tabSpec.id as any)}
                className={`flex-1 min-w-[120px] py-2.5 px-4 text-xs font-space font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  activeTab === tabSpec.id ? themeClasses.tabActive : themeClasses.tabInactive
                }`}
              >
                {tabSpec.icon}
                <span>{tabSpec.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main body wrapper */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        
        {/* TAB 1: LEXICON EXPLORER */}
        {activeTab === "lexicon" && (
          <div className="space-y-6">
            
            {/* Interactive Category Selector bar */}
            <div className="flex flex-wrap gap-2 pb-1.5 border-b border-gold-900/10">
              {[
                { id: "ALL", label: "All Codex Words", count: words.length, icon: "📖" },
                { id: "ROYAL", label: "Royal & Statehood", count: words.filter(w => getCategoryInfo(w.word_id).cat === "ROYAL").length, icon: "👑" },
                { id: "SACRED", label: "Sacred & Liturgies", count: words.filter(w => getCategoryInfo(w.word_id).cat === "SACRED").length, icon: "✨" },
                { id: "COMMON", label: "Commoner / Agrarian", count: words.filter(w => getCategoryInfo(w.word_id).cat === "COMMON").length, icon: "🌾" }
              ].map((catSpec) => (
                <button
                  key={catSpec.id}
                  onClick={() => setSelectedCategory(catSpec.id as any)}
                  className={`py-2 px-4 rounded-full text-xs font-space font-semibold transition-all duration-300 flex items-center gap-2 border ${
                    selectedCategory === catSpec.id
                      ? "bg-gold-500 text-gold-950 border-gold-450 shadow-md"
                      : isMuga 
                        ? "bg-white border-[#E0D4B2] text-[#5c4a39] hover:bg-[#FAF4DF] hover:text-black"
                        : "bg-[#0b0e14] border-gold-950/45 text-[#a1afbf] hover:text-[#f4efe0] hover:border-gold-800/40"
                  }`}
                >
                  <span>{catSpec.icon}</span>
                  <span>{catSpec.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    selectedCategory === catSpec.id 
                      ? "bg-gold-950/20 text-gold-950 font-bold" 
                      : isMuga ? "bg-[#332415]/5 text-slate-500" : "bg-[#181d26] text-slate-500"
                  }`}>
                    {catSpec.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Metadata Bar */}
            <div className={`flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border p-4 rounded-xl transition-all ${
              isMuga ? "bg-[#FFFDF4] border-[#E4D7B8] shadow-sm" : "bg-[#0e1116] border-gold-950/40"
            }`}>
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-600/70 h-4.5 w-4.5" />
                <input
                  type="text"
                  placeholder="Query Ahom characters, English gloss, phonetic spelling, or specific ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/40 transition-colors ${themeClasses.inputBg}`}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-space px-2 text-[#7d8b9e]">
                <span>Status: <span className="text-emerald-500 font-bold">● Synchronized</span></span>
                <span>|</span>
                <span>Found: <strong className={isMuga ? "text-slate-800" : "text-white"}>{filteredWords.length} terms</strong></span>
                <span>|</span>
                <button
                  onClick={() => setIsManuscriptExportOpen(true)}
                  className="text-gold-500 hover:text-gold-450 font-bold flex items-center gap-1 transition-all underline decoration-dotted"
                >
                  <Download className="h-3.5 w-3.5" /> Export as 1795 Manuscript
                </button>
              </div>
            </div>

            {/* Split Master-Detail Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Premium Master List */}
              <div className="lg:col-span-7 space-y-4">
                {filteredWords.length > 0 ? (
                  <div className="space-y-3.5">
                    {filteredWords.map((word, idx) => {
                      const wordInfo = getCategoryInfo(word.word_id);
                      const isCurrentlySelected = selectedWordId === word.word_id;
                      
                      return (
                        <motion.button
                          key={word.word_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                          onClick={() => setSelectedWordId(word.word_id)}
                          className={`w-full text-left relative overflow-hidden p-5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 group ${
                            isCurrentlySelected
                              ? isMuga
                                ? "bg-[#FFF9E6] border-gold-500 shadow-md"
                                : "bg-gradient-to-r from-[#17130c] to-[#0e1116] border-gold-500 shadow-lg shadow-gold-950/15"
                              : isMuga
                                ? "bg-white border-[#E6DA9F] hover:border-gold-500/55 hover:bg-[#FFFDF4]"
                                : "bg-[#0b0e14]/90 border-gold-950 hover:border-gold-500/25 hover:bg-[#11151f]"
                          }`}
                        >
                          {/* Selected Left-Accent strip */}
                          {isCurrentlySelected && (
                            <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-gold-500" />
                          )}

                          <div className="flex items-center gap-5">
                            {/* Accent symbol panel */}
                            <div className={`h-14 w-14 rounded-lg flex items-center justify-center font-serif text-2xl border select-none transition-transform duration-300 group-hover:scale-105 ${
                              isCurrentlySelected
                                ? "bg-gold-500/10 border-gold-450 text-[#b48522]"
                                : isMuga 
                                  ? "bg-[#FAF7ED] border-[#eae1c8] text-[#5c4731]" 
                                  : "bg-[#11151f] border-gold-950/70 text-slate-300 group-hover:bg-[#161c28]"
                            }`}>
                              {word.ahom_script.substring(0, 1) || "𑜀"}
                            </div>

                            {/* Core word details */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded border ${
                                  isMuga ? "bg-[#FAF5E2] text-[#801313] border-[#E3D6B2]" : "bg-gold-950/20 text-gold-500 border-gold-900/30"
                                }`}>
                                  {word.word_id}
                                </span>
                                <span className="text-[11px] font-space text-[#7e8d9f] flex items-center gap-1 font-medium">
                                  <span>{wordInfo.icon}</span>
                                  <span>{wordInfo.label}</span>
                                </span>
                              </div>
                              
                              <h4 className={`text-lg font-serif font-bold tracking-wide flex items-center gap-2 ${isMuga ? "text-[#2e1c0c]" : "text-white"}`}>
                                {word.phonetic_spelling}
                                <span className="text-[11px] font-mono font-normal text-slate-500">
                                  /{word.phonetic_spelling.split("").join("-")}/
                                </span>
                              </h4>

                              <p className={`text-xs font-medium block ${isMuga ? "text-[#6e5d4a]" : "text-[#a0afbe]"}`}>
                                {word.english_meaning} &bull; <span className="text-[#8e6e40]">{word.assamese_meaning}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-mono tracking-widest uppercase border px-2 py-0.5 rounded transition-opacity ${
                              isCurrentlySelected
                                ? "bg-gold-500 text-gold-950 border-gold-450 font-bold"
                                : "bg-[#141923]/20 text-slate-400 border-transparent opacity-0 group-hover:opacity-100"
                            }`}>
                              {isCurrentlySelected ? "Viewing" : "Inspect"}
                            </span>
                            <ArrowRight className={`h-4 w-4 transition-transform ${
                              isCurrentlySelected ? "text-gold-400 translate-x-1" : "text-slate-500 group-hover:translate-x-1 group-hover:text-gold-500"
                            }`} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`text-center py-16 rounded-xl border border-dashed ${isMuga ? "bg-[#FFFDF4] border-[#E4D7B8]" : "bg-[#0e1116] border-gold-800/15"}`}>
                    <p className="text-gold-500 font-serif text-base mb-1.5 font-medium">No chronicled terms matched your query.</p>
                    <p className="text-xs text-slate-400 mb-4">Try choosing a different standard category above or resetting parameters.</p>
                    <button 
                      onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); }} 
                      className="text-xs font-mono bg-gold-500 hover:bg-gold-600 text-gold-950 font-bold px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Reset Filter Criteria
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Pristine Gilded Codex Display (Selected Word Detail Panel) */}
              <div className={`lg:col-span-5 lg:sticky lg:top-8 border rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${
                isMuga 
                  ? "bg-gradient-to-b from-[#FFFDF6] to-[#FAF5E6] border-[#af7b15]/25 shadow-gold-500/5 text-[#3b1c09]" 
                  : "bg-gradient-to-b from-[#11151f] to-[#07090d] border-gold-500/25 text-[#f1edd0]"
              }`}>
                {/* Decorative retro corner borders */}
                <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-gold-500/30 rounded-tl pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-gold-500/30 rounded-tr pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-gold-500/30 rounded-bl pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-gold-500/30 rounded-br pointer-events-none" />

                {(() => {
                  const activeWord = words.find(w => w.word_id === selectedWordId) || words[0];
                  if (!activeWord) return (
                    <div className="text-center py-10 italic text-slate-400">Loading venerable manuscript...</div>
                  );
                  const wordInfo = getCategoryInfo(activeWord.word_id);
                  
                  return (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeWord.word_id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.22 }}
                        className="space-y-6"
                      >
                        {/* Detail Header Banner */}
                        <div className="flex justify-between items-center pb-3 border-b border-gold-950/20">
                          <div>
                            <span className={`text-[10px] tracking-widest font-mono font-bold border px-2.5 py-1 rounded-md ${
                              isMuga ? "bg-[#FAF5E2] text-[#801313] border-[#E3D6B2]" : "bg-gold-950/40 border border-gold-500/20 text-gold-400"
                            }`}>
                              {activeWord.word_id}
                            </span>
                            <span className="ml-2.5 text-[11px] text-slate-400 font-space font-medium">Buranji Reference</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              title="Listen to liturgical web-sound"
                              onClick={() => playSynthesizedWord(activeWord)}
                              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                                isPlayingId === activeWord.word_id 
                                  ? "bg-gold-500 text-gold-950 border-gold-400 animate-pulse" 
                                  : isMuga
                                    ? "bg-white text-[#801313] border-[#DCD3B5] hover:bg-[#FAF4DF]"
                                    : "bg-[#171d29] text-gold-300 border-gold-900/40 hover:border-gold-500/50 hover:bg-[#1e2738]"
                              }`}
                            >
                              <Volume2 className="h-4.5 w-4.5" />
                            </button>
                            <button
                              title="Copy Tai-Ahom character to clipboard"
                              onClick={() => copyText(activeWord.ahom_script, activeWord.word_id, `"${activeWord.phonetic_spelling}" unicode`)}
                              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                                isMuga
                                  ? "bg-white text-[#5c4a39] border-[#DCD3B5] hover:bg-[#FAF4DF]"
                                  : "bg-[#171d29] text-gold-300 border-gold-900/40 hover:border-gold-500/50 hover:bg-[#1e2738]"
                              }`}
                            >
                              {copiedId === activeWord.word_id ? <Check className="h-4.5 w-4.5 text-emerald-500" /> : <Copy className="h-4.5 w-4.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Calligraphic Script Plinth */}
                        <div className={`text-center py-10 rounded-xl border-2 shadow-inner relative group select-all transition-colors duration-500 ${
                          isMuga 
                            ? "bg-[#FFF9E6] border-[#af7b15]/15 text-[#3b1c09]" 
                            : "bg-gradient-to-b from-[#090b0e] to-[#040507] border-gold-500/10"
                        }`}>
                          {/* Ambient Pulsating Waveform when audio plays */}
                          {isPlayingId === activeWord.word_id && (
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-end gap-1 px-4 py-1 rounded bg-amber-500/5 h-6">
                              {[0.4, 0.9, 0.5, 0.8, 0.3].map((val, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ height: ["4px", "18px", "4px"] }}
                                  transition={{ repeat: Infinity, duration: val * 1.3, ease: "easeInOut", delay: i * 0.08 }}
                                  className="w-1 bg-[#b48522] rounded-full"
                                />
                              ))}
                            </div>
                          )}

                          <div className={`text-7.5xl font-serif font-bold tracking-widest drop-shadow-md select-all ${
                            isMuga ? "text-[#401205]" : "text-white"
                          }`}>
                            {activeWord.ahom_script}
                          </div>
                          <div className={`text-[10px] uppercase tracking-[0.22em] font-mono mt-4 font-semibold ${isMuga ? "text-[#936518]" : "text-gold-450"}`}>
                            Venerable Script Glyph
                          </div>
                        </div>

                        {/* Sub-Classification Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-[10px] font-mono font-bold tracking-widest uppercase border px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                            isMuga ? "bg-[#FAF1D6] text-[#806B32] border-[#D0BA82]" : "bg-gold-950/40 text-gold-300 border border-gold-900/45"
                          }`}>
                            <span>{wordInfo.icon}</span>
                            <span>{wordInfo.badge}</span>
                          </span>
                          <span className={`text-[10px] font-mono font-bold tracking-widest uppercase border px-2.5 py-1 rounded-md ${themeClasses.badgeSec}`}>
                            FOUNDATIONAL LEXEMES
                          </span>
                        </div>

                        {/* Phonetics Transcription */}
                        <div className={`p-4.5 rounded-xl border ${themeClasses.sidebarCard}`}>
                          <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mb-1.5">
                            Phonetic Transcription
                          </label>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-2.5xl font-serif font-extrabold ${isMuga ? "text-[#3a1d04]" : "text-white"}`}>
                              {activeWord.phonetic_spelling}
                            </span>
                            <span className="text-xs font-mono text-gold-500 font-bold tracking-widest">
                              ({activeWord.phonetic_spelling.toUpperCase()})
                            </span>
                          </div>
                          
                          {/* Syllable character sequence breakdown */}
                          <div className="mt-30 pt-3 border-t border-slate-500/10 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Syllables:</span>
                            {activeWord.ahom_script.split("").map((char, index) => (
                              <div key={index} className={`px-2.5 py-0.5 rounded text-xs font-serif border font-semibold ${
                                isMuga ? "bg-[#FCFAF2] border-[#eae1c8]" : "bg-gold-950/20 text-gold-100 border-gold-950"
                              }`}>
                                {char}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assamese vs English meanings */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-xl border ${
                            isMuga ? "bg-[#FFF9E6] border-[#E3D6B2]" : "bg-[#1c1811] border-gold-900/15"
                          }`}>
                            <label className="text-[10px] font-mono tracking-widest text-[#a04000] font-bold uppercase block mb-1">
                              অসমীয়া প্ৰতিশব্দ (Assamese)
                            </label>
                            <span className={`font-sans font-bold text-base block pt-0.5 leading-relaxed ${isMuga ? "text-[#2e1d09]" : "text-gold-100"}`}>
                              {activeWord.assamese_meaning}
                            </span>
                          </div>
                          
                          <div className={`p-4 rounded-xl border ${
                            isMuga ? "bg-[#EAECF0]/60 border-slate-200" : "bg-[#121620] border-[#232c3f]/50"
                          }`}>
                            <label className="text-[10px] font-mono tracking-widest text-slate-500 font-bold uppercase block mb-1">
                              English Equivalent
                            </label>
                            <span className={`font-sans font-bold text-base block pt-0.5 leading-relaxed ${isMuga ? "text-slate-800" : "text-white"}`}>
                              {activeWord.english_meaning}
                            </span>
                          </div>
                        </div>

                        {/* Detailed Historical scroll citation metadata */}
                        <div className={`${themeClasses.citation} border-l-2 p-4.5 rounded-r-xl space-y-1.5 relative overflow-hidden select-text transition-colors duration-300`}>
                          <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-gold-600/70 tracking-wider">
                            BURANJI CITATION
                          </div>
                          <h5 className="text-[10px] font-mono uppercase tracking-widest font-bold text-sky-500">
                            Chronicle Context & Historical Import
                          </h5>
                          <p className="text-xs leading-relaxed italic">
                            "{activeWord.historical_context}"
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })()}

              </div>
            </div>

            {/* Epoch Timeline / History Widget */}
            <div className={`border p-6 rounded-2xl shadow transition-colors duration-300 ${
              isMuga ? "bg-[#FFFDF4] border-[#E4D7B8]" : "bg-gradient-to-b from-[#11141b] to-[#0a0d13] border-gold-950/45"
            }`}>
              <h4 className={`font-serif text-lg font-bold mb-4 flex items-center gap-2 ${isMuga ? "text-slate-950" : "text-white"}`}>
                <TrendingUp className="h-4.5 w-4.5 text-gold-500" />
                Historic Chronology of Tai-Ahom Lexicons
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                <div className="hidden md:block absolute top-[13.5px] left-8 right-8 h-[2px] bg-gradient-to-r from-gold-900/10 via-gold-500/25 to-gold-900/10 z-0" />
                
                {[
                  { year: "1228 AD", title: "Patkai Crossing", desc: "Monarch Chao Lung Sukaphaa introduces state written chronicle keeping." },
                  { year: "1543 AD", title: "Weaving Mandate", desc: "Traditional looms (Huk) codified for spinning Eri, Pat and golden Muga silk." },
                  { year: "1795 AD", title: "Bar Amra Completed", desc: "Pandit Tengai Mohon compiles 'Bar Amra' lexicon standardizing Tai syntax." },
                  { year: "1856 AD", title: "Print Era Begins", desc: "Imperial scholars transcribe classic lists using early metal plates." },
                  { year: "2026 AD", title: "Full-Stack Codex", desc: "Custom node backend persistence and live AI Scribe query integrations." }
                ].map((milestone, idx) => (
                  <div key={idx} className={`relative z-10 p-4 rounded-xl space-y-1.5 hover:border-gold-500/35 transition-colors border ${themeClasses.timelineCard}`}>
                    <span className="text-xs font-mono font-bold text-[#b48522] block tracking-widest">
                      {milestone.year}
                    </span>
                    <h5 className={`text-xs font-space font-extrabold ${isMuga ? "text-[#3c2a11]" : "text-white"}`}>
                      {milestone.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      {milestone.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Archival Custom Muga Note Card */}
            <div className={`p-5 rounded-r-xl shadow flex flex-col md:flex-row gap-5 items-start border-l-4 ${isMuga ? "bg-[#FAF5E2] border-[#801313] text-[#4d321c]" : "bg-[#10141e] border-gold-500 text-[#a3b1c2]"}`}>
              <div className="p-3 bg-gold-500/10 rounded-xl border border-gold-500/20 text-gold-500">
                <Info className="h-6 w-6 text-[#b48522]" />
              </div>
              <div className="space-y-1.5 flex-1 select-text">
                <h3 className={`font-serif text-lg font-bold ${isMuga ? "text-[#2e1d0e]" : "text-white"}`}>Golden Muga Wefts & Judicial Codex Keepers</h3>
                <p className="text-xs leading-relaxed font-light">
                  Under Chao Phra administrators, weaving the sacred golden-colored <strong className="text-rose-700">Muga Silk (Pha-Mai)</strong> was codified according to royal rank. High priests (Deodhails) monitored scripts written on treated Sanchipat bark scriptures using durable coal soot ink. This digital full-stack system pairs custom node word structures recursively with live AI-powered Scribe intelligence to celebrate the historic 1795 dictionary.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB: TAI ALPHABET PRIMER */}
        {activeTab === "primer" && (
          <div className="space-y-6">
            
            {/* Header section with ordering toggle and summary */}
            <div className={`p-6 rounded-2xl shadow border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              isMuga ? "bg-[#FAF7EC] border-[#E8DFC5]" : "bg-[#0e1116] border-gold-950/30"
            }`}>
              <div className="space-y-1 select-text">
                <span className="text-[10px] font-mono text-gold-550 font-bold uppercase tracking-widest block">
                  Elementary Lessons & Alphabets • টাই প্ৰাথমিক পাঠ
                </span>
                <h2 className={`font-serif text-2xl font-black ${isMuga ? "text-[#3D2511]" : "text-white"}`}>
                  Tai-Ahom 24 Consonants <span className="font-sans font-light text-base text-slate-500 opacity-90">(২৪ ব্যঞ্জন বৰ্ণ)</span>
                </h2>
                <p className="text-xs text-slate-500 font-light max-w-2xl">
                  Explore Lesson 1: Alphabets comprising the 24 foundational consonants of the Tai-Ahom language. Compare traditional alphabetic order with the unique 1795 AD Bar-Amra Codex manuscript layout.
                </p>
              </div>

              {/* Order Mode Toggle */}
              <div className="flex bg-gold-500/10 p-1 rounded-xl border border-gold-500/20 self-start md:self-auto shrink-0 font-space text-[11px]">
                <button
                  onClick={() => setPrimerOrder("standard")}
                  className={`py-2 px-3.5 text-xs font-medium rounded-lg transition-all duration-300 ${
                    primerOrder === "standard"
                      ? "bg-gold-500 text-slate-950 font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Tai Primer Order (টাই বৰ্ণ ক্ৰম)
                </button>
                <button
                  onClick={() => setPrimerOrder("baramra")}
                  className={`py-2 px-3.5 text-xs font-medium rounded-lg transition-all duration-300 ${
                    primerOrder === "baramra"
                      ? "bg-gold-500 text-slate-950 font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Bar-Amra Codex Order (বৰ-অম্ৰ ক্ৰম)
                </button>
              </div>
            </div>

            {/* Interactive Grid & Detail Inspector Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              
              {/* Left Grid: 24 Consonants */}
              <div className="lg:col-span-2 space-y-4">
                <div className={`p-6 rounded-2xl border ${isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#0e1116] border-gold-950/20"}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-serif font-bold text-sm ${isMuga ? "text-[#331c05]" : "text-white"}`}>
                      Alphabet Matrix (বৰ্ণমালা মেট্ৰিক্স)
                    </h3>
                    <div className="text-[10px] font-mono text-[#b38e40] bg-gold-500/10 px-2 py-1 rounded border border-gold-500/15">
                      {primerOrder === "standard" ? "Sorted by Lesson Sequence (১-২৪)" : "Sorted by 1795 AD Bar-Amra Bark Manuscript (১-২৪)"}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {[...primerConsonants].sort((a, b) => {
                      if (primerOrder === "baramra") return a.bar_idx - b.bar_idx;
                      return a.standard_idx - b.standard_idx;
                    }).map((consonant) => {
                      const isActive = selectedPrimerGlyph === consonant.glyph;
                      const displayIdx = primerOrder === "baramra" ? consonant.bar_idx : consonant.standard_idx;
                      
                      return (
                        <button
                          key={consonant.glyph}
                          onClick={() => setSelectedPrimerGlyph(consonant.glyph)}
                          className={`relative p-3 rounded-xl border flex flex-col items-center justify-between transition-all duration-300 ${
                            isActive
                              ? isMuga
                                ? "bg-[#FAF5E2] border-[#801313] scale-[1.03] shadow ring-1 ring-[#801313]"
                                : "bg-gold-500/10 border-gold-500 scale-[1.03] shadow ring-1 ring-gold-500"
                              : isMuga
                                ? "bg-[#FCFBF8] border-[#E8DFC5] hover:bg-[#FAF4DF] hover:border-[#b59d5c]"
                                : "bg-[#111420] border-gold-950/40 hover:bg-[#161a29] hover:border-gold-500/40"
                          }`}
                        >
                          {/* Order Index Badge */}
                          <span className={`absolute top-1 left-1.5 text-[8px] font-bold font-mono px-1 rounded ${
                            isActive ? "bg-gold-500 text-slate-950" : "bg-slate-500/10 text-slate-450"
                          }`}>
                            {displayIdx}
                          </span>

                          {/* Large glyph display */}
                          <div className={`text-4xl font-serif font-black pt-4 pb-2 transition-transform duration-300 ${
                            isActive ? "scale-110 text-gold-550" : isMuga ? "text-[#3A220D]" : "text-slate-100"
                          }`}>
                            {consonant.glyph}
                          </div>

                          {/* English & Assamese label */}
                          <div className="w-full text-center border-t border-dotted border-slate-500/25 pt-1.5 mt-1">
                            <div className="text-[10px] font-sans font-bold text-slate-500">
                              {consonant.assamese}
                            </div>
                            <div className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-extrabold mt-0.5">
                              {consonant.english}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sanchipat-Style Historical Footnote Banner */}
                <div className={`p-6 rounded-2xl border-l-4 select-text relative overflow-hidden ${
                  isMuga ? "bg-[#FAF5E2] border-[#801313] text-[#422e1a]" : "bg-[#10141e] border-gold-500 text-[#a3b1c2]"
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-gold-500 shrink-0" />
                      <h4 className={`font-serif text-lg font-bold ${isMuga ? "text-[#3A220D]" : "text-white"}`}>
                        The Historical Order of Bar-Amra (১৮ শ শতিকাৰ বৰ-অম্ৰ ক্ৰম)
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                      <div>
                        <p className="font-semibold text-gold-500/90 mb-1">Assamese Description (অসমীয়া টোকা):</p>
                        <p className="font-light italic">
                          "আহোম বৰ্ণমালাৰ ক্ৰম ১৮ শ শতিকাৰ শেষ দশকত লিখা 'বৰ-অম্ৰ' পুথিত এইধৰণে পোৱা যায়। যেনে - <strong className="font-serif font-black text-rose-700">{[...primerConsonants].sort((a,b)=>a.bar_idx-b.bar_idx).map(c=>c.glyph).join(" ")}</strong> । এনে ধৰণৰ ক্ৰম লিখাৰ কাৰণ জনা নাযায়। কিন্তু এইখন পুথিত আন আন টাইসকলৰ ক্ৰম অনুসৰিয়েই দিয়া হৈছে।"
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gold-500/90 mb-1">English Historical Context:</p>
                        <p className="font-light">
                          "The unique order of the Ahom script found in the late 18th-century manuscript 'Bar-Amra Codex' begins with <strong className="font-serif text-rose-700">𑜒 (A)</strong> rather than taking standard plosives first. While the technical reason for this specific arrangement is lost to time, modern lessons follow conventional Shan/Khamti alphabet models for streamlined linguistic learning."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Consonant Inspector card */}
              <div className="space-y-6">
                {(() => {
                  const cons = primerConsonants.find(c => c.glyph === selectedPrimerGlyph) || primerConsonants[0];
                  
                  return (
                    <div className={`p-6 rounded-2xl border shadow-xl flex flex-col gap-5 sticky top-6 ${
                      isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#0e1116] border-gold-950/20"
                    }`}>
                      
                      <div className="flex justify-between items-start border-b border-slate-500/10 pb-4">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                          Active Consonant Inspector
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-slate-400">Unicode:</span>
                          <span className="text-[9px] font-mono bg-slate-500/10 text-slate-300 font-bold px-1.5 py-0.5 rounded border border-slate-500/10">
                            U+{cons.glyph.charCodeAt(0).toString(16).toUpperCase()}{cons.glyph.charCodeAt(1) ? cons.glyph.charCodeAt(1).toString(16).toUpperCase() : ""}
                          </span>
                        </div>
                      </div>

                      {/* Giant Centralized Display Card */}
                      <div className={`p-8 rounded-2xl flex flex-col items-center justify-center border ${
                        isMuga ? "bg-[#FAF8F5] border-[#E8DFC5]/60" : "bg-[#131724]/60 border-gold-950/30"
                      }`}>
                        <div className={`text-8xl font-serif font-black text-center ${
                          isMuga ? "text-[#2e1d0f]" : "text-white"
                        }`} id="inspect-glyph">
                          {cons.glyph}
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => {
                              const synth = window.speechSynthesis;
                              if (synth) {
                                synth.cancel();
                                const utter = new SpeechSynthesisUtterance(cons.name === "ja_ya" ? "ja ya" : cons.name);
                                utter.rate = 0.85;
                                utter.pitch = 1.1;
                                synth.speak(utter);
                              }
                              setIsPlayingId(cons.glyph);
                              setTimeout(() => setIsPlayingId(null), 850);
                            }}
                            className={`p-2 rounded-lg transition-transform active:scale-95 duration-200 ${
                              isPlayingId === cons.glyph
                                ? "bg-emerald-500 text-white"
                                : "bg-gold-500/15 border border-gold-500/25 hover:bg-gold-500/30 text-gold-500"
                            }`}
                            title="Generate phonetic synth vocalization sound"
                          >
                            <Volume2 className="h-4 w-4 animate-bounce" />
                          </button>
                          
                          <button
                            onClick={() => copyText(cons.glyph, cons.glyph, cons.name)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all duration-200 ${
                              copiedId === cons.glyph
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "bg-slate-500/10 border-slate-500/20 hover:bg-slate-500/15 text-slate-300"
                            }`}
                          >
                            {copiedId === cons.glyph ? (
                              <>
                                <CheckSquare className="h-3 w-3" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Clipboard className="h-3 w-3" />
                                <span>Copy Glyph</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Linguistic translation and parameters */}
                      <div className="space-y-3 divide-y divide-slate-500/5 select-text font-sans">
                        <div className="grid grid-cols-2 py-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase">Phonetic English</span>
                            <span className="font-bold text-sm text-gold-500">{cons.name.toUpperCase()} / {cons.english}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase">Assamese representation</span>
                            <span className="font-bold text-sm text-rose-500">{cons.assamese}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 py-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase">Tai Primer Index</span>
                            <span className="font-mono text-xs font-semibold">{cons.standard_idx} of 24</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Bar-Amra Index</span>
                            <span className="font-mono text-xs font-extrabold text-rose-500 font-serif">{cons.bar_idx} of 24</span>
                          </div>
                        </div>

                        <div className="py-2.5 text-xs">
                          <span className="text-[10px] font-mono text-slate-500 block uppercase mb-1">Keyboard mapping key</span>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 font-mono text-xs bg-slate-500/10 rounded border border-slate-500/15 text-gold-500 shadow-inner font-extrabold">
                              {cons.keyChar}
                            </kbd>
                            <span className="text-[9px] text-slate-500 font-light">Type this key in Sandbox to output this glyph</span>
                          </div>
                        </div>

                        <div className="py-2.5 text-xs leading-relaxed font-light">
                          <span className="text-[10px] font-mono text-slate-500 block uppercase mb-1">Codex Notes</span>
                          <p className={isMuga ? "text-[#3D2511]" : "text-slate-350"}>
                            {cons.historicalNote}
                          </p>
                        </div>
                      </div>

                      {/* Sandbox shortcut action */}
                      <button
                        onClick={() => {
                          setSandboxText(prev => prev + cons.glyph);
                          setActiveTab("sandbox");
                          triggerToast(`Injected '${cons.glyph}' directly into Typing Sandbox!`);
                        }}
                        className={`w-full py-2.5 rounded-xl border font-sans text-xs flex items-center justify-center gap-1.5 font-bold transition-all duration-300 ${
                          isMuga
                            ? "bg-[#FAF5E2] border-[#801313] hover:bg-[#801313] hover:text-white text-[#801313]"
                            : "bg-gold-500/10 border-gold-550/20 hover:bg-gold-500 hover:text-slate-950 text-gold-550"
                        }`}
                      >
                        <Keyboard className="h-3.5 w-3.5" />
                        <span>Inject into Sandbox Editor</span>
                      </button>

                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        )}

        {/* TAB: INTERACTIVE SANCHIPAT MANUSCRIPT */}
        {activeTab === "manuscript" && (
          <ManuscriptReader isMuga={isMuga} themeClasses={themeClasses} />
        )}

        {/* TAB 2: SCRIPT SANDBOX */}
        {activeTab === "sandbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Typing Workspace */}
            <div className="lg:col-span-2 space-y-6">
              <div className={`border p-6 rounded-2xl flex flex-col gap-4 ${isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#0e1116] border-gold-900/20"}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`font-serif text-lg font-bold flex items-center gap-2 ${isMuga ? "text-slate-950" : "text-white"}`}>
                    <Keyboard className="h-5 w-5 text-gold-500 animate-pulse" />
                    Tai-Ahom Transliteration Sandbox
                  </h3>
                  <button
                    onClick={() => setSandboxText("")}
                    className="text-xs font-mono text-slate-400 hover:text-red-500 flex items-center gap-1.5 border border-slate-500/15 px-2.5 py-1 rounded-md bg-slate-500/5 transition-all"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear text
                  </button>
                </div>

                {/* Built string output panel */}
                <div className={`p-8 rounded-xl text-center min-h-[160px] flex flex-col justify-center items-center relative group-style border ${
                  isMuga ? "bg-[#FFFDF4] border-[#E4D7B8]" : "bg-[#08090c] border-gold-950/70"
                }`}>
                  {sandboxText ? (
                    <div>
                      <div className={`text-6.5xl tracking-widest font-serif font-bold ${isMuga ? "text-[#401306]" : "text-white"}`}>
                        {sandboxText}
                      </div>
                      <div className="text-[10px] text-gold-500 font-mono mt-4 font-semibold tracking-widest uppercase">
                        Active Sandbox Buffer &bull; {sandboxText.length} character(s)
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-sm italic font-space">
                      Select appropriate root consonant glyphs and modifiers below to write custom Tai syllables...
                    </span>
                  )}
                  
                  {sandboxText && (
                    <button
                      onClick={() => copyText(sandboxText, "sandbox", "sandbox text")}
                      className="absolute btn shadow bottom-3 right-3 text-xs bg-gold-500 hover:bg-gold-600 border border-gold-450 text-gold-950 font-mono font-bold px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5"
                    >
                      <Copy className="h-3 w-3" /> Copy Output
                    </button>
                  )}
                </div>

                {/* Keyboard Layout */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-gold-500 font-bold uppercase tracking-widest block mb-2">
                      Consonant Glyphs (ব্যঞ্জন বৰ্ণ)
                    </span>
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                      {ahomConsonants.map((letter) => (
                        <button
                          key={letter.glyph}
                          onClick={() => setSandboxText((prev) => prev + letter.glyph)}
                          className={`border p-2.5 rounded-lg text-center transition-all duration-150 active:scale-95 flex flex-col items-center justify-between min-h-[70px] ${
                            isMuga 
                              ? "bg-[#FAF7ED] border-[#D6CBB0] hover:border-gold-500 hover:bg-[#FFFDF4] text-[#332415]" 
                              : "bg-[#121620] border-[#212b3c] hover:border-gold-500/60 hover:bg-[#1a2130] text-slate-300"
                          }`}
                        >
                          <div className={`text-2xl font-serif font-bold ${isMuga ? "text-[#3a1c04]" : "text-white"}`}>{letter.glyph}</div>
                          <div className="text-[9px] font-sans text-slate-500 font-bold block mt-1">
                            {letter.assamese && <span>{letter.assamese} </span>}
                            <span className="font-mono text-[8px] opacity-75">({letter.name})</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gold-500 font-bold uppercase tracking-widest block mb-2">
                       Vowels & Virama (স্বৰ বৰ্ণ আৰু হসন্ত)
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {ahomVowelsAndMarks.map((letter) => (
                        <button
                          key={letter.glyph}
                          onClick={() => setSandboxText((prev) => prev + letter.glyph)}
                          className={`border p-2.5 rounded-lg text-center transition-all duration-150 active:scale-95 flex flex-col items-center justify-between min-h-[70px] ${
                            isMuga 
                              ? "bg-[#FCFAF0] border-[#eae1c8] hover:border-gold-500 hover:bg-[#FFFDF4]" 
                              : "bg-[#1a1310] border-[#3e2c14] hover:border-gold-500/60 hover:bg-[#2b1f0c]"
                          }`}
                        >
                          <div className="text-2xl text-gold-500 font-serif font-bold">{letter.glyph}</div>
                          <div className="text-[9px] font-mono text-slate-450 font-bold block mt-1">{letter.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sandbox Sidebar Information */}
            <div className="space-y-6">
              <div className={`border p-6 rounded-2xl ${themeClasses.sidebarCard}`}>
                <h4 className="font-serif text-sm font-bold text-gold-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Syllable Recipe Guide
                </h4>
                <p className="text-xs text-slate-400 font-space leading-relaxed mb-4">
                  Tai-Ahom is constructed recursively without spaces. Syllables are composed by combining a root consonant with optional medial modifiers and finished with terminal vowels or killers.
                </p>

                <div className="space-y-3.5">
                  <div className={`p-3 rounded-xl border ${isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#080b0f] border-gold-950/40"}`}>
                    <span className="text-[10px] uppercase font-mono text-gold-550 block mb-1.5 font-bold">To Spell 'Chao' (Lord/King):</span>
                    <div className="flex items-center gap-1 text-sm font-serif">
                      <span className="px-1.5 py-0.5 rounded border border-slate-500/10 text-gold-600 font-bold">𑜋</span>
                      <span className="text-slate-400 font-sans text-xs">+</span>
                      <span className="px-1.5 py-0.5 rounded border border-slate-500/10 text-gold-500 font-bold">𑜞</span>
                      <span className="text-slate-400 font-sans text-xs">+</span>
                      <span className="px-1.5 py-0.5 rounded border border-slate-500/10 text-gold-500 font-bold">𑜡</span>
                      <ArrowRight className="h-3 w-3 text-gold-500 px-0.5" />
                      <span className="text-amber-600 font-bold ml-1 font-serif">𑜋𑜞𑜡</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#080b0f] border-gold-950/40"}`}>
                    <span className="text-[10px] uppercase font-mono text-gold-550 block mb-1.5 font-bold">To Spell 'Mung' (State):</span>
                    <div className="flex items-center gap-1 text-sm font-serif">
                      <span className="px-1.5 py-0.5 rounded border border-slate-500/10 text-gold-600 font-bold">𑜉</span>
                      <span className="text-slate-400 font-sans text-xs">+</span>
                      <span className="px-1.5 py-0.5 rounded border border-slate-500/10 text-gold-500 font-bold">𑜥</span>
                      <span className="text-slate-400 font-sans text-xs">+</span>
                      <span className="px-1.5 py-0.5 rounded border border-slate-500/10 text-gold-600 font-bold">𑜂</span>
                      <span className="text-slate-400 font-sans text-xs">+</span>
                      <span className="px-1.5 py-0.5 rounded border border-slate-500/10 text-gold-500 font-bold">𑜫</span>
                      <ArrowRight className="h-3 w-3 text-gold-500 px-0.5" />
                      <span className="text-amber-600 font-bold ml-1 font-serif">𑜉𑜥𑜂𑜫</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border ${isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#080b0f] border-gold-950/40"}`}>
                    <span className="text-[10px] uppercase font-mono text-gold-550 block mb-1 font-bold">To Spell 'Pha-Mai' (Silk):</span>
                    <div className="flex items-center gap-1 text-sm font-serif mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-500/5 text-[#3b1d04] font-bold">𑜆𑜞𑜡</span>
                      <span className="text-slate-400 text-xs px-1">and</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-500/5 text-[#3b1d04] font-bold">𑜉𑜤𑜣</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal pt-1 scale-95 origin-left">
                      Combining 'Pha' with Medial Ra and Aa vowel, paired with consonant 'Ma' and modifier vowel 'ui'.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: QUIZ CONTAINER */}
        {activeTab === "quiz" && (
          <div className={`max-w-2xl mx-auto border p-6 md:p-8 rounded-2xl shadow-xl ${isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#0e1116] border-gold-900/20"}`}>
            <h3 className={`font-serif text-xl font-bold mb-2 flex items-center gap-2 ${isMuga ? "text-[#2e1d09]" : "text-white"}`}>
              <Languages className="h-5.5 w-5.5 text-gold-500" />
              Preservationist’s Vocabulary Quiz
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-space">
              Test your recall of core lexical structures. Challenges are generated dynamically from live dictionary list entries (total entries in rotation: {words.length}).
            </p>

            {words.length === 0 ? (
              <div className="text-slate-500 italic text-center py-10">Waiting for manuscript archive...</div>
            ) : !quizFinished ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Question {quizIndex + 1} of {words.length}</span>
                    <span>Correct Count: {quizScore} / {quizIndex}</span>
                  </div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${isMuga ? "bg-[#332415]/5" : "bg-[#181d28]"}`}>
                    <div 
                      className="bg-[#b48522] h-full transition-all duration-300"
                      style={{ width: `${((quizIndex + 1) / words.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question glyph card */}
                <div className={`p-8 rounded-xl border text-center space-y-4 ${isMuga ? "bg-[#FFFDF4] border-[#E4D7B8]" : "bg-[#080b0f] border-gold-950/50"}`}>
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded tracking-widest border font-semibold ${
                    isMuga ? "bg-[#FAF5E2] border-[#E3D6B2] text-[#801313]" : "bg-gold-950/40 text-gold-500 border-gold-900/30"
                  }`}>
                    Identify the script
                  </span>
                  
                  <div className={`text-6xl font-serif font-bold tracking-widest my-2 select-none ${isMuga ? "text-[#401306]" : "text-white"}`}>
                    {words[quizIndex].ahom_script}
                  </div>

                  <div className="text-xs font-space text-slate-500 max-w-md mx-auto leading-relaxed">
                    Phonetic representation starts like: <strong>"{words[quizIndex].phonetic_spelling.substring(0, 2)}..."</strong> &middot; Assamese outline: <strong>"{words[quizIndex].assamese_meaning.substring(0, 15)}..."</strong>
                  </div>
                </div>

                {/* Multiple choice options */}
                <div className="space-y-3">
                  {shuffledOptions.map((option, choiceIndex) => {
                    const isSelected = quizFeedback?.selected === option;
                    const isCorrectChoice = option === words[quizIndex].english_meaning;
                    
                    let bgBorderClass = isMuga 
                      ? "bg-white border-[#E0D4B2] hover:bg-[#FAF7ED] text-[#3d2a17]" 
                      : "bg-[#131720] border-[#222c3c] hover:border-gold-500/40 text-slate-300";
                    
                    if (quizFeedback) {
                      if (isCorrectChoice) {
                        bgBorderClass = "bg-emerald-950/30 border-emerald-500 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        bgBorderClass = "bg-rose-950/30 border-rose-500 text-rose-300 font-bold";
                      } else {
                        bgBorderClass = "opacity-45 pointer-events-none border-transparent";
                      }
                    }

                    return (
                      <button
                        key={`${option}-${choiceIndex}`}
                        onClick={() => handleQuizAnswer(option)}
                        disabled={!!quizFeedback}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex justify-between items-center ${bgBorderClass}`}
                      >
                        <span className="text-sm font-space font-medium">{option}</span>
                        {quizFeedback && isCorrectChoice && (
                          <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950 border border-emerald-500 px-2 py-0.5 rounded">
                            VERIFIED CORE
                          </span>
                        )}
                        {quizFeedback && isSelected && !isCorrectChoice && (
                          <span className="text-[10px] font-mono text-rose-300 font-bold bg-rose-950 border border-rose-500 px-2 py-0.5 rounded">
                            UNALIGNED
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Trigger Next button */}
                {quizFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end pt-2 animate-bounce"
                  >
                    <button
                      onClick={nextQuizQuestion}
                      className="bg-gold-500 text-gold-950 hover:bg-gold-600 text-xs font-mono font-bold uppercase tracking-widest px-6 py-3.5 rounded-lg flex items-center gap-2"
                    >
                      <span>{quizIndex + 1 === words.length ? "Finish Quiz" : "Next Script"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}

              </div>
            ) : (
              <div className="text-center py-8 space-y-6">
                <div className="inline-block p-4 bg-gold-950/40 rounded-full border border-gold-500/30 text-gold-500">
                  <Award className="h-12 w-12 text-[#b48522] animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h4 className={`text-2xl font-serif font-bold ${isMuga ? "text-[#332111]" : "text-white"}`}>Quiz Evaluated!</h4>
                  <p className="text-sm text-slate-400">
                    You successfully chronicled <strong className="text-gold-500">{quizScore} out of {words.length}</strong> Tai-Ahom terms correctly.
                  </p>
                </div>

                <div className={`p-5 rounded-2xl max-w-sm mx-auto border ${isMuga ? "bg-[#FFFDF4] border-[#E4D7B8]" : "bg-[#080b0f] border-gold-950/40"}`}>
                  <span className="text-[10px] font-mono text-gold-550 block mb-1 font-semibold tracking-wider uppercase">
                    ACCURACY METRIC SCORE
                  </span>
                  <div className={`text-4.5xl font-serif font-bold ${isMuga ? "text-[#801313]" : "text-[#b48522]"}`}>
                    {Math.round((quizScore / words.length) * 100)}% Accuracy
                  </div>
                  <span className="text-[11px] text-slate-500 italic mt-1.5 block">
                    {quizScore === words.length 
                      ? "Magnificent accuracy! You have guarded the ancient roots perfectly." 
                      : "Venerable progress. Consult the AI Scribe to refine your definitions."}
                  </span>
                </div>

                <button
                  onClick={restartQuiz}
                  className="bg-gold-500 hover:bg-gold-600 text-gold-950 text-xs tracking-wider font-mono font-bold uppercase px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 shadow"
                >
                  <RotateCcw className="h-4 w-4" /> Reset quiz challenge
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ASK AI ARCHIVIST ESCRIBE CONSULTATION */}
        {activeTab === "scribe" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className={`border p-6 rounded-2xl ${isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#0e1116] border-gold-900/20"}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#b48522]/10 rounded-xl text-[#b48522] border border-gold-500/20">
                  <Feather className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className={`font-serif text-lg font-bold ${isMuga ? "text-[#332415]" : "text-white"}`}>
                    Consult the Royal Scribe (Chiring Phukan AI)
                  </h3>
                  <p className="text-xs text-slate-400 font-space">
                    Ask anything about Ahom history, golden fabrics (Muga/Pat), scripture chronicles, or standard language parameters. Powered by server-side Gemini.
                  </p>
                </div>
              </div>

              {/* Preconfigured Questions Pills */}
              <div className="mb-6 space-y-2">
                <span className="text-[10px] font-mono uppercase text-gold-500 font-bold tracking-widest block mb-2">Suggested Inquiries:</span>
                <div className="flex flex-wrap gap-2">
                  {standardQuestions.map((item, idx) => (
                    <button
                      key={idx}
                      disabled={scribeLoading}
                      onClick={() => handleAskArchivist(item.q)}
                      className={`text-xs px-3.5 py-2.5 rounded-lg border text-left transition-colors duration-150 font-space ${
                        isMuga 
                          ? "bg-[#FAF7ED] border-[#D6CBB0] hover:bg-[#FAF4DF] hover:border-gold-500 text-[#3b2a1a]" 
                          : "bg-[#121620] border-gold-950/70 hover:bg-[#1a2130] hover:border-gold-500 text-slate-300"
                      }`}
                    >
                      <span className="font-semibold text-gold-500 mr-1">&raquo;</span> {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Output Frame */}
              <div className={`p-6 min-h-[220px] rounded-xl border relative mb-6 font-serif leading-relaxed ${
                isMuga ? "bg-[#FFFDF4] border-[#E4D7B8]" : "bg-[#08090c] border-gold-950/70"
              }`}>
                {/* Scroll backdrop styling decoration */}
                <div className="absolute top-2 right-2 bg-amber-500/5 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest border border-amber-900/5 text-slate-500 uppercase select-none">
                  Chiring Scripture Scroll
                </div>

                {scribeLoading ? (
                  <div className="flex flex-col items-center justify-center min-h-[160px] space-y-3">
                    <Feather className="h-8 w-8 text-gold-500 animate-spin" />
                    <span className="text-xs font-mono text-gold-500 font-bold tracking-widest animate-pulse">
                      THE ARCHIVIST GRASPS COAL INK...
                    </span>
                  </div>
                ) : scribeAnswer ? (
                  <div className="space-y-4 text-sm whitespace-pre-wrap select-text animate-fadeIn">
                    <h5 className="text-[10px] font-mono tracking-widest text-[#a04000] font-bold uppercase select-none">
                      COURT RESPONSE CITATION
                    </h5>
                    <div className={isMuga ? "text-[#3B2C1B]" : "text-white"}>
                      {scribeAnswer}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[160px] text-center max-w-md mx-auto space-y-2">
                    <Feather className="h-6 w-6 text-slate-500" />
                    <span className="text-xs text-slate-500 italic font-space">
                      "I wait at the royal bark tables. Ask me regarding the historic Ahom courts, standard dictionary compiler Tengai Mohon, or our loom weavers."
                    </span>
                  </div>
                )}
              </div>

              {/* Chat Input Field */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAskArchivist(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={scribeQuestion}
                  onChange={(e) => setScribeQuestion(e.target.value)}
                  placeholder="Inquire are our golden fabrics (Muga) produced, or script translations..."
                  className={`flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/40 ${themeClasses.inputBg}`}
                />
                <button
                  type="submit"
                  disabled={scribeLoading || !scribeQuestion.trim()}
                  className={`p-3 bg-gold-450 hover:bg-gold-500 text-gold-950 font-bold rounded-xl transition-colors ${
                    (scribeLoading || !scribeQuestion.trim()) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE COMPLIANCE EXPORTER */}
        {activeTab === "database" && (
          <div className="space-y-6">
            <div className={`border p-6 rounded-2xl ${isMuga ? "bg-white border-[#E0D4B2]" : "bg-[#0e1116] border-gold-900/20"}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className={`font-serif text-lg font-bold flex items-center gap-2 ${isMuga ? "text-slate-950" : "text-white"}`}>
                    <FileJson className="h-5 w-5 text-gold-500 animate-pulse" />
                    Bar Amra Compliance Database Array
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Schema-compliant array loaded from full-stack system backend. Interactive counts: {words.length} lexemes.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyText(JSON.stringify(words, null, 2), "json", "Live relational schema")}
                    className="text-xs bg-[#b48522] hover:bg-gold-500 text-[#12161f] font-mono font-bold px-4 py-2.5 rounded-lg transition-all duration-150 inline-flex items-center gap-2 shadow"
                  >
                    <Copy className="h-4 w-4" /> Copy Database JSON
                  </button>
                </div>
              </div>

              {/* JSON codeblock display */}
              <div className={`relative rounded-xl overflow-hidden border ${isMuga ? "bg-[#332415]/5 border-[#E0D4B2]" : "bg-[#050709] border-gold-950/80"}`}>
                <div className={`px-4 py-2 text-xs border-b flex justify-between items-center ${isMuga ? "bg-[#F3EAD5]" : "bg-[#10141e] border-gold-950/40"}`}>
                  <span className="font-mono text-slate-500 font-bold">words_database.json</span>
                  <span className="text-[9px] font-mono text-[#801313] font-bold select-none">PERSISTED ROUTE</span>
                </div>
                <pre className={`p-6 text-xs font-mono overflow-auto max-h-[460px] leading-relaxed ${isMuga ? "text-amber-950" : "text-lime-400/90"}`}>
                  {JSON.stringify(words, null, 2)}
                </pre>
              </div>

              <div className={`mt-4 p-4 rounded-xl border ${isMuga ? "bg-[#FAF5E2] border-[#E3D6B2]" : "bg-gold-950/10 border-gold-900/20"}`}>
                <span className="text-[11px] font-mono text-gold-650 block mb-1 font-bold">
                  Compliance Specifications:
                </span>
                <p className="text-xs text-slate-400 leading-normal">
                  - **Persistence**: Data updates write directly to Node storage paths. Rebuilding or refreshing is fully sustained.<br />
                  - **Historic Accuracy**: Root glyphs adhere closely to Pandit Tengai Mohon's 1795 bark manuscripts recorded during the final decades of the sovereign court.
                </p>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Dynamic Modal Dialog for Contributing Lexicon Words */}
      <AnimatePresence>
        {isContributeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Glass backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContributeOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs"
            />
            
            {/* Form Sheet */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className={`relative z-10 w-full max-w-lg border rounded-2xl shadow-2xl p-6 overflow-hidden md:p-8 ${
                isMuga ? "bg-[#FFFDF6] border-[#af7b15]/30 text-[#3b2a1a]" : "bg-[#0e121a] border-gold-500/20 text-[#f4efe0]"
              }`}
            >
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => setIsContributeOpen(false)}
                  className="p-1 text-slate-500 hover:text-red-500 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gold-950/15">
                <Award className="h-5 w-5 text-gold-500" />
                <h3 className="font-serif text-lg font-bold">Contribute Codex Entry</h3>
              </div>

              <form onSubmit={handleContributeSubmit} className="space-y-4">
                
                {/* 2-Column top inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                      Word ID ID *
                    </label>
                    <input 
                      type="text"
                      required
                      value={newWordId}
                      onChange={(e) => setNewWordId(e.target.value.toUpperCase())}
                      placeholder="e.g. BA_012"
                      className={`w-full text-xs rounded-lg px-3 py-2 ${themeClasses.inputBg}`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                      Phonetic Spelling *
                    </label>
                    <input 
                      type="text"
                      required
                      value={newPhonetic}
                      onChange={(e) => setNewPhonetic(e.target.value)}
                      placeholder="e.g. Pha-Mai"
                      className={`w-full text-xs rounded-lg px-3 py-2 ${themeClasses.inputBg}`}
                    />
                  </div>
                </div>

                {/* Script input block */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                      Ahom Script character *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        // Quick populate suggestion from sandbox or keyboard
                        setNewAhomScript(prev => prev + "𑜆𑜞𑜡");
                        triggerToast("Injected '𑜆𑜞𑜡' characters. Customize as desired.");
                      }}
                      className="text-[9px] font-mono text-[#b38320] hover:underline"
                    >
                      Inject 'Pha-Mai' glyph suggestion?
                    </button>
                  </div>
                  <input 
                    type="text"
                    required
                    value={newAhomScript}
                    onChange={(e) => setNewAhomScript(e.target.value)}
                    placeholder="e.g. 𑜆𑜞𑜡 𑜉𑜤𑜣"
                    className="w-full text-lg font-serif rounded-lg px-3 py-2 text-center tracking-widest bg-amber-500/5 border border-gold-500/25 font-bold text-amber-500"
                  />
                  <span className="text-[9px] text-slate-500 mt-1 block">
                    Use characters from our Script Sandbox tab if your device doesn't have a standard Ahom glyph unicode font keyboard mapped natively.
                  </span>
                </div>

                {/* Translations mappings */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#bf1a1a] font-bold block mb-1">
                      Assamese Meaning (অসমীয়া) *
                    </label>
                    <input 
                      type="text"
                      required
                      value={newAssamese}
                      onChange={(e) => setNewAssamese(e.target.value)}
                      placeholder="e.g. মুগা পাট"
                      className={`w-full text-xs rounded-lg px-3 py-1.5 ${themeClasses.inputBg}`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                      English gloss *
                    </label>
                    <input 
                      type="text"
                      required
                      value={newEnglish}
                      onChange={(e) => setNewEnglish(e.target.value)}
                      placeholder="e.g. Golden silk fabric"
                      className={`w-full text-xs rounded-lg px-3 py-1.5 ${themeClasses.inputBg}`}
                    />
                  </div>
                </div>

                {/* Chronicle context text block */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                    Historical / Chronicle context Description
                  </label>
                  <textarea 
                    value={newContext}
                    onChange={(e) => setNewContext(e.target.value)}
                    placeholder="Describe context of wet-rice farming, coronation rites, royal guilds, weaving styles..."
                    rows={2}
                    className={`w-full text-xs rounded-lg px-3 py-2 resize-none ${themeClasses.inputBg}`}
                  />
                </div>

                {/* Action CTA triggers */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsContributeOpen(false)}
                    className={`flex-1 text-xs font-mono font-bold py-2.5 rounded-lg border text-center transition-colors ${
                      isMuga ? "bg-[#FAF7ED] border-[#eae1c8] text-slate-600 hover:bg-slate-100" : "bg-slate-500/5 border-slate-500/10 text-slate-400 hover:bg-slate-500/10"
                    }`}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={submittingWord}
                    className="flex-1 text-xs font-mono font-bold bg-[#b48522] hover:bg-gold-600 text-[#12161f] py-2.5 rounded-lg text-center transition-colors shadow"
                  >
                    {submittingWord ? "Chronicle writing..." : "Chronicle into Database"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-xs font-space mt-12 border-[#E4D7B8] bg-[#F2EBCE]/55 text-[#5c412a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:items-start text-center sm:text-left gap-1">
            <span>Digitally Restored &amp; Maintained by <strong className="text-gold-500">[ Kaku Dihingia Mohan/ বৰ অম্ৰ (BarAmra) Codex ]</strong></span>
            <span className="text-[10px] opacity-70">Digital Bar Amra Full-Stack &copy; 2026. Under royal preservationist patronage &amp; AI Scribe modules.</span>
          </div>
          <div className="flex gap-4">
            <a onClick={() => setActiveTab("lexicon")} className="hover:text-gold-500 cursor-pointer transition-colors">Explorer</a>
            <span>&bull;</span>
            <a onClick={() => setActiveTab("sandbox")} className="hover:text-gold-500 cursor-pointer transition-colors">Sandbox</a>
            <span>&bull;</span>
            <a onClick={() => setActiveTab("scribe")} className="hover:text-gold-500 cursor-pointer transition-colors font-bold">Ask AI Scribe</a>
            <span>&bull;</span>
            <a onClick={() => setActiveTab("database")} className="hover:text-gold-500 cursor-pointer transition-colors">Compliance Raw JSON</a>
          </div>
        </div>
      </footer>

      <ManuscriptExporter
        isOpen={isManuscriptExportOpen}
        onClose={() => setIsManuscriptExportOpen(false)}
        words={words}
        activeTheme="muga"
      />

    </div>
  );
}
