/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { barAmraDb } from "./src/wordsData";

const PORT = 3000;
const app = express();

app.use(express.json());

// In-memory words database initialized with our static Bar Amra dictionary words
let wordsList = [...barAmraDb.words];

// File path for persistence in memory/storage
const STORE_PATH = path.join(process.cwd(), "user_words.json");

// Attempt to load existing persistent data if available
try {
  if (fs.existsSync(STORE_PATH)) {
    const data = fs.readFileSync(STORE_PATH, "utf8");
    wordsList = JSON.parse(data);
    console.log(`Loaded custom words count: ${wordsList.length}`);
  }
} catch (e) {
  console.error("Error reading persistent words store. Reverting to defaults:", e);
}

// Words database loaded and maintained cleanly

function persistWords() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(wordsList, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to save words store:", e);
  }
}

// ───── API ENDPOINTS ─────

// Get all dictionary words (including any custom contributions)
app.get("/api/words", (req, res) => {
  res.json({
    success: true,
    words: wordsList
  });
});

// Contribute/add a new word to the dictionary
app.post("/api/words", (req, res) => {
  try {
    const { word_id, ahom_script, phonetic_spelling, assamese_meaning, english_meaning, historical_context } = req.body;

    if (!word_id || !ahom_script || !phonetic_spelling || !assamese_meaning || !english_meaning) {
      return res.status(400).json({
        success: false,
        error: "Missing mandatory fields. Each word needs word_id, ahom_script, phonetic_spelling, assamese_meaning, english_meaning."
      });
    }

    // Verify uniqueness of word ID
    const exists = wordsList.find(w => w.word_id.toUpperCase() === word_id.toUpperCase());
    if (exists) {
      return res.status(400).json({
        success: false,
        error: `Word database already contains entry with ID ${word_id}.`
      });
    }

    const newWord = {
      word_id: word_id.toUpperCase().trim(),
      ahom_script: ahom_script.trim(),
      phonetic_spelling: phonetic_spelling.trim(),
      assamese_meaning: assamese_meaning.trim(),
      english_meaning: english_meaning.trim(),
      historical_context: (historical_context || "Contributed by a modern digital codex patron.").trim()
    };

    wordsList.push(newWord);
    persistWords();

    res.json({
      success: true,
      message: "Word chronicled successfully into the digital codex.",
      word: newWord
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset dictionary to static default historical set
app.post("/api/words/reset", (req, res) => {
  try {
    wordsList = [...barAmraDb.words];
    persistWords();
    res.json({
      success: true,
      message: "Dictionary reset to the foundational 1795 Bar Amra codex."
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Archivist / Scribe endpoint using Gemini API
app.post("/api/scribe/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        error: "Question content is required."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Gemini API key is not configured on the server. Please add your GEMINI_API_KEY in the Settings > Secrets menu."
      });
    }

    // Initialize Gemini SDK with named parameters
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const systemInstruction = `You are the venerable Court Archivist (Chiring Phukan) of the historical Ahom Kingdom.
Your duty is to answer questions about:
- Tai-Ahom language, lexicon terms, script translation, and spelling.
- Traditional silk fabrics (Eri, Pat), royal handloom weaving (Huk method), garment hierarchy, or traditional textiles.
- Historical Ahom lifestyle, state administration, and chronological milestones (e.g. Sukaphaa, Buranjis, Pandit Tengai Mohon's compilation of the 1795 Bar Amra).

Adopt an authentic, respected, and learned tone. Frame answers beautifully using elegant language, citing historic Ahom customs or the Sanchi Bark (Tula-pat/Sanchipat) tradition if relevant.
If the user asks to translate a simple phrase or word into Tai-Ahom, explain the phonetic sound and describe the script to the best of your traditional knowledge.
Limit response length to 4-5 scannable paragraphs or a beautifully formatted narrative block. Do not mention modern AI metadata or port numbers. Write in English, with Assamese/Ahom terms where appropriate.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    res.json({
      success: true,
      answer: response.text
    });
  } catch (err: any) {
    console.error("Gemini API Scribe Error:", err);
    res.status(500).json({
      success: false,
      error: `Gemini Scribe failed: ${err.message || err}`
    });
  }
});

// ───── VITE DEVELOPMENT & PRODUCTION MIDDLEWARE ─────

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Digital Bar Amra Server listening on http://localhost:${PORT}`);
  });
}

startServer();
