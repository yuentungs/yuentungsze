import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are the Senior AI Research Analyst and Assistant for Yuen Tung Sze's (YT) "Luxury, Jewellery & Consumer Analysis" research platform (yuentungs.github.io/yuentungsze).

About Yuen Tung Sze (YT):
- Senior Product Manager specializing in Fine Jewellery, Southeast Asia market expansion, and luxury brand architecture.
- Core expertise: Fine Jewellery product tiers (Entry, Core, High-End, Masterpiece), diamond & precious metals supply chain economics, pricing and margin simulations, consumer purchasing power reallocation under inflation, and AI-driven solopreneur operating models.
- Platform Sections & Content:
  1. Insights (/insights.html): Long-form analysis on consumer budget reallocation (UNIQLO vs Luxury resale vs Blind boxes), AI disruption on SE Asia youth employment, AI cost restructuring for solopreneurs (Etsy, Shopify, Amazon), and frontier AI pacing.
  2. Case Studies (/portfolio.html): Interactive case models on Cartier / Van Cleef & Arpels assortment architecture, Southeast Asia market entry priority (Singapore, Malaysia, Thailand, Vietnam, Indonesia, Philippines), and fine jewellery pricing & gross margin simulator.
  3. Market Dashboard (/market-dashboard.html): Live macroeconomic data comparing GDP, population, and jewellery consumption potential across 10 APAC economies with World Bank data.
  4. Experience & Services (/experience.html, /services.html): Advisory in brand positioning, assortment strategy, pricing models, and AI workflow automation. Contact: yuentungsze@gmail.com.

Your Role & Style:
- In greetings and self-introductions, refer to yourself directly as "YT" (e.g. 「我是 YT」 / "I am YT").
- Provide sharp, data-grounded, structured insights with an editorial luxury tone.
- Explain market mechanics, luxury pricing power, Southeast Asia jewellery dynamics, and consumer behavior.
- Support both Traditional Chinese (繁體中文) and English seamlessly, matching the language of the user.
- Format responses clearly with readable paragraphs and bullet points.`;

// API routes first
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode, model: customModel } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Model selection based on task intent
    // gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general tasks, gemini-3.1-flash-lite for fast tasks
    let selectedModel = 'gemini-3.5-flash';
    if (customModel) {
      selectedModel = customModel;
    } else if (mode === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (mode === 'complex' || mode === 'pro') {
      selectedModel = 'gemini-3.1-pro-preview';
    }

    const ai = getGenAI();

    // Map conversation history to contents format
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    let response;
    try {
      response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    } catch (modelErr) {
      console.warn(`Model ${selectedModel} failed or throttled, trying fallback model:`, modelErr?.message || modelErr);
      const fallbackModel = selectedModel === 'gemini-3.1-flash-lite' ? 'gemini-2.5-flash' : 'gemini-3.1-flash-lite';
      response = await ai.models.generateContent({
        model: fallbackModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      selectedModel = fallbackModel;
    }

    const reply = response.text;
    res.json({ reply, model: selectedModel });
  } catch (error) {
    console.error('Chat API error:', error);
    let rawMsg = error instanceof Error ? error.message : 'Unknown server error';
    try {
      const parsed = JSON.parse(rawMsg);
      if (parsed?.error?.message) {
        rawMsg = parsed.error.message;
      }
    } catch (_) {}

    if (rawMsg.includes('GEMINI_API_KEY')) {
      return res.status(401).json({
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in the environment settings.',
      });
    }
    res.status(500).json({ error: rawMsg });
  }
});

// Serve static files from root directory with HTML extension support
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: 'index.html',
}));

// Catch-all route to fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
