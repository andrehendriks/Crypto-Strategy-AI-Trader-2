
import { GoogleGenAI, Type } from "@google/genai";
import { CryptoPair, TradingStrategy } from '../types';

// IMPORTANT: The API key must be set in your environment variables.
// Do not hardcode API keys in your application. The user-provided key has been disregarded for security reasons.
// A frontend application should never handle secret keys directly. This logic would typically live on a secure backend server.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const strategySchema = {
  type: Type.OBJECT,
  properties: {
    strategyName: {
      type: Type.STRING,
      description: "A creative name for the trading strategy, e.g., 'Bullish Momentum Ride'."
    },
    action: {
      type: Type.STRING,
      enum: ["BUY", "SELL", "HOLD"],
      description: "The recommended trading action."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence level for this strategy, from 0 to 100."
    },
    entryPrice: {
      type: Type.NUMBER,
      description: "Suggested price to enter the trade."
    },
    targetPrice: {
      type: Type.NUMBER,
      description: "Price target for taking profits."
    },
    stopLoss: {
      type: Type.NUMBER,
      description: "Price at which to exit the trade to limit losses."
    },
    reasoning: {
      type: Type.STRING,
      description: "A detailed, step-by-step explanation for the recommendation, analyzing market sentiment and technical indicators."
    },
  },
  required: ["strategyName", "action", "confidence", "entryPrice", "targetPrice", "stopLoss", "reasoning"],
};

export const generateTradingStrategy = async (pair: CryptoPair, currentPrice: number, historicalData: { price: number }[]): Promise<TradingStrategy> => {
  if (!API_KEY) {
    throw new Error("API key not configured for Gemini.");
  }

  const recentPrices = historicalData.slice(-10).map(p => p.price.toFixed(2)).join(', ');
  const prompt = `
    Analyze the following cryptocurrency market data for ${pair}:
    - Current Price: $${currentPrice.toFixed(2)}
    - Recent Price Trend (last 10 periods): ${recentPrices}
    
    Based on this data, act as an expert crypto market analyst. Provide a short-term trading strategy.
    Your analysis should be concise and clear. Formulate a concrete trading plan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: strategySchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    // It's good practice to validate the parsed object, but we trust the schema here.
    return JSON.parse(jsonText) as TradingStrategy;
  } catch (error) {
    console.error("Error generating trading strategy:", error);
    throw new Error("Failed to get a trading strategy from AI. The model may be overloaded or the request is invalid.");
  }
};
