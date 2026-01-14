import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client
// Note: This assumes process.env.API_KEY is available.
// In a real production app, you might proxy this through a backend to hide the key,
// but for this client-side demo, we use the env var directly as instructed.

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini client", error);
}

// Rate Limiting Logic
let isRateLimited = false;
let rateLimitResetTime = 0;

const checkRateLimit = () => {
  if (isRateLimited) {
    if (Date.now() < rateLimitResetTime) {
      return true;
    } else {
      isRateLimited = false; // Reset after timeout
    }
  }
  return false;
};

const handleGeminiError = (e: any) => {
  const msg = JSON.stringify(e || {});
  if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
    if (!isRateLimited) {
       console.warn("Gemini API Rate Limit Hit. Switching to offline fallbacks for 1 minute.");
    }
    isRateLimited = true;
    rateLimitResetTime = Date.now() + 60000; // Backoff for 1 minute
  } else {
    console.error("Gemini API Error:", e);
  }
};

const FALLBACK_NAMES = [
  "Neon Systems", "CyberDyne", "OmniCorp", "Zenith AI", "Nexus Tech", 
  "Flux Industries", "Quantum Dynamics", "Starlight Inc", "Void Systems", 
  "Aether Corp", "Hyperion", "Tyrell Corp", "Massive Dynamic", "Venture Ind",
  "Blue Sun", "Weyland-Yutani", "CyberLife", "Biotechica", "Arasaka"
];

const FALLBACK_EVENTS = [
  { message: "Crypto crash detected. Investors panic.", multiplier: 0.5 },
  { message: "Tech boom! Stocks are soaring.", multiplier: 2.0 },
  { message: "AI regulations loosened. Profits up.", multiplier: 1.5 },
  { message: "Server farm meltdown. Productivity down.", multiplier: 0.7 },
  { message: "Competitor hacked. Market share increased.", multiplier: 1.2 },
  { message: "Global network outage. Transactions stalled.", multiplier: 0.8 },
  { message: "New chipset released. Efficiency doubled.", multiplier: 2.0 },
  { message: "Economic recession forecast. Belt tightening.", multiplier: 0.6 },
  { message: "Interplanetary trade route opened.", multiplier: 2.5 },
  { message: "Solar flare disrupts communications.", multiplier: 0.5 }
];

export const generateCompanyName = async (): Promise<string> => {
  if (!ai || checkRateLimit()) {
    return FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)];
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a single, short, futuristic, cool tech company name. No explanation, just the name.",
    });
    return response.text.trim().replace(/['"]/g, '') || FALLBACK_NAMES[0];
  } catch (e) {
    handleGeminiError(e);
    return FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)];
  }
};

export const generateMarketEvent = async (currentMoney: number): Promise<{ message: string, multiplier: number }> => {
  if (!ai || checkRateLimit()) {
    return FALLBACK_EVENTS[Math.floor(Math.random() * FALLBACK_EVENTS.length)];
  }

  try {
    const prompt = `
      You are the narrator of a cyberpunk tycoon game. 
      Generate a short, 1-sentence "Market News" headline that explains a sudden economic shift.
      It should be satirical or sci-fi themed.
      
      Also, decide if this is a BULL market (positive) or BEAR market (negative).
      
      Return ONLY a JSON object with this format:
      {
        "headline": "string",
        "type": "BULL" | "BEAR"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    let multiplier = 1.0;
    if (result.type === 'BULL') multiplier = 2.0; // Double income
    if (result.type === 'BEAR') multiplier = 0.5; // Half income

    return {
      message: result.headline,
      multiplier: multiplier
    };

  } catch (e) {
    handleGeminiError(e);
    return FALLBACK_EVENTS[Math.floor(Math.random() * FALLBACK_EVENTS.length)];
  }
};