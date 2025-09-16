
export enum CryptoPair {
  BTC_USD = 'BTC-USD',
  ETH_USD = 'ETH-USD',
}

export interface HistoricalDataPoint {
  time: string;
  price: number;
}

export interface TradingStrategy {
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
