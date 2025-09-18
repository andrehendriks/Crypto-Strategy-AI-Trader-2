import { HistoricalDataPoint } from '../types';

export const calculateSMA = (data: HistoricalDataPoint[], period: number): number | null => {
  if (data.length < period) return null;
  const periodData = data.slice(-period);
  const sum = periodData.reduce((acc, val) => acc + val.price, 0);
  return parseFloat((sum / period).toFixed(2));
};

export const calculateRSI = (data: HistoricalDataPoint[], period: number = 14): number | null => {
    if (data.length < period + 1) return null;

    const prices = data.map(d => d.price);
    let gains = 0;
    let losses = 0;

    // Calculate initial average gains and losses
    for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) {
            gains += change;
        } else {
            losses -= change; // losses are positive values
        }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Smooth the average gains and losses
    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) {
            avgGain = (avgGain * (period - 1) + change) / period;
            avgLoss = (avgLoss * (period - 1)) / period;
        } else {
            avgGain = (avgGain * (period - 1)) / period;
            avgLoss = (avgLoss * (period - 1) - change) / period;
        }
    }

    if (avgLoss === 0) {
        return 100; // RSI is 100 if all changes are gains
    }
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return parseFloat(rsi.toFixed(2));
};
