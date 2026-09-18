import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS so external static sites (like GitHub Pages) can call the AI chat API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

// Rate Limiting & Quota Management:
// Google AI Studio Free Tier for Gemini 3.1 Flash Lite: 1,500 requests/day & 1,000,000 tokens/day.
// User requested strict cap at 10% of free tier:
// Max 150 requests/day and max 100,000 tokens/day.
const DAILY_LIMITS = {
  MAX_REQUESTS: 150,       // 10% of 1,500 RPD
  MAX_OUTPUT_TOKENS: 600,  // Cap each response to 600 tokens (~400 words) to save tokens
  MAX_DAILY_TOKENS: 100000 // 10% of 1,000,000 tokens/day
};

let dailyTracker = {
  date: new Date().toISOString().slice(0, 10),
  requestCount: 0,
  estimatedTokens: 0,
};

function checkAndIncrementQuota(incomingContentLength) {
  const today = new Date().toISOString().slice(0, 10);
  if (dailyTracker.date !== today) {
    // New day reset
    dailyTracker.date = today;
    dailyTracker.requestCount = 0;
    dailyTracker.estimatedTokens = 0;
  }

  if (dailyTracker.requestCount >= DAILY_LIMITS.MAX_REQUESTS) {
    return {
      allowed: false,
      reason: '今日 AI 助手諮詢配額已達設定上限（免費額度 10% 保險機制）。配額將於午夜（UTC）自動重置，或請直接透過 Email (yuentungsze@gmail.com) 與 YT 聯繫！'
    };
  }

  if (dailyTracker.estimatedTokens >= DAILY_LIMITS.MAX_DAILY_TOKENS) {
    return {
      allowed: false,
      reason: '今日 AI Token 消耗已達安全設定上限（免費額度 10%）。將於明日自動重置。'
    };
  }

  // Allow and tentatively count
  dailyTracker.requestCount += 1;
  // Estimate input tokens (~4 chars per token) + max output
  const estInputTokens = Math.ceil(incomingContentLength / 3.5);
  dailyTracker.estimatedTokens += estInputTokens + 400;

  return { allowed: true, currentUsage: dailyTracker.requestCount };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Measure request size for quota tracking
    const totalChars = messages.reduce((acc, m) => acc + (m.content ? m.content.length : 0), 0);
    const quotaCheck = checkAndIncrementQuota(totalChars);
    if (!quotaCheck.allowed) {
      return res.status(429).json({ error: quotaCheck.reason });
    }

    // Strictly lock to the most cost-efficient & lightest model: gemini-3.1-flash-lite
    // Fallback if needed: gemini-2.5-flash
    const FIXED_MODEL = 'gemini-3.1-flash-lite';
    const FALLBACK_MODEL = 'gemini-2.5-flash';

    const ai = getGenAI();

    // Prune context to prevent token accumulation (keep only recent 4 messages)
    const recentMessages = messages.slice(-4);

    // Map conversation history to contents format
    const contents = recentMessages.map((m) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    let response;
    let usedModel = FIXED_MODEL;
    try {
      response = await ai.models.generateContent({
        model: FIXED_MODEL,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
          maxOutputTokens: DAILY_LIMITS.MAX_OUTPUT_TOKENS, // Strictly capped to 600 tokens
        },
      });
    } catch (modelErr) {
      console.warn(`Model ${FIXED_MODEL} failed, using fallback ${FALLBACK_MODEL}:`, modelErr?.message || modelErr);
      response = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
          maxOutputTokens: DAILY_LIMITS.MAX_OUTPUT_TOKENS,
        },
      });
      usedModel = FALLBACK_MODEL;
    }

    const reply = response.text;
    res.json({
      reply,
      model: usedModel,
      dailyQuotaUsed: dailyTracker.requestCount,
      dailyQuotaMax: DAILY_LIMITS.MAX_REQUESTS
    });
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
