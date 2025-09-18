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
      description: "A creative, professional name for the trading strategy, e.g., 'RSI Divergence Play'."
    },
    action: {
      type: Type.STRING,
      enum: ["BUY", "SELL", "HOLD"],
      description: "The recommended trading action based on the analysis."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence level for this strategy, from 0 to 100, based on the convergence of indicators."
    },
    entryPrice: {
      type: Type.NUMBER,
      description: "A precise, suggested price to enter the trade, considering current market price."
    },
    targetPrice: {
      type: Type.NUMBER,
      description: "A realistic price target for taking profits."
    },
    stopLoss: {
      type: Type.NUMBER,
      description: "A disciplined price at which to exit the trade to limit potential losses."
    },
    reasoning: {
      type: Type.STRING,
      description: "A detailed, step-by-step explanation for the recommendation. Analyze the provided market sentiment, the current price, and critically, how the SMA and RSI indicators support the proposed action (e.g., 'RSI is overbought at 75, suggesting a potential reversal...')."
    },
  },
  required: ["strategyName", "action", "confidence", "entryPrice", "targetPrice", "stopLoss", "reasoning"],
};

interface TechnicalIndicators {
    sma20: number | null;
    rsi14: number | null;
}

export const generateTradingStrategy = async (
    pair: CryptoPair, 
    currentPrice: number, 
    historicalData: { price: number }[],
    indicators: TechnicalIndicators
): Promise<Omit<TradingStrategy, 'id' | 'timestamp'>> => {
  if (!API_KEY) {
    throw new Error("API key not configured for Gemini.");
  }

  const recentPrices = historicalData.slice(-10).map(p => p.price.toFixed(2)).join(', ');
  
  const prompt = `
    Act as an expert crypto market quantitative analyst. Your analysis must be sharp, concise, and actionable.

    **Market Context for ${pair}:**
    - Current Price: $${currentPrice.toFixed(2)}
    - Recent Price Trend (last 10 periods): ${recentPrices}
    
    **Technical Indicators:**
    - 20-Period Simple Moving Average (SMA): ${indicators.sma20 ? `$${indicators.sma20}` : 'N/A'}
    - 14-Period Relative Strength Index (RSI): ${indicators.rsi14 ? `${indicators.rsi14}` : 'N/A'}

    **Analysis Task:**
    Based *strictly* on the data provided, formulate a short-term trading strategy.
    Your reasoning must directly reference the technical indicators. For example, explain whether the price is above or below the SMA and what that implies, and whether the RSI indicates overbought (>70), oversold (<30), or neutral conditions.
    Provide a concrete trading plan with specific entry, target, and stop-loss levels.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: strategySchema,
        temperature: 0.5, // Reduced for more deterministic, data-driven output
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Omit<TradingStrategy, 'id' | 'timestamp'>;
  } catch (error) {
    console.error("Error generating trading strategy:", error);
    throw new Error("Failed to get a trading strategy from AI. The model may be overloaded or the request is invalid.");
  }
};