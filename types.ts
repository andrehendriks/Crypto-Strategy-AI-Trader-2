export enum CryptoPair {
  BTC_USD = 'BTC-USD',
  ETH_USD = 'ETH-USD',
}

export interface HistoricalDataPoint {
  time: string;
  price: number;
}

export interface TradingStrategy {
  id: string; // Unique ID for the strategy
  timestamp: string; // ISO string of when it was generated
  strategyName: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
}

export interface PriceUpdate {
  pair: CryptoPair;
  price: number;
}