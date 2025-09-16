
import React, { useState } from 'react';
import { CryptoPair, HistoricalDataPoint, TradingStrategy } from '../types';
import { generateTradingStrategy } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface StrategyPanelProps {
  pair: CryptoPair;
  currentPrice: number;
  historicalData: HistoricalDataPoint[];
}

const StrategyPanel: React.FC<StrategyPanelProps> = ({ pair, currentPrice, historicalData }) => {
  const [strategy, setStrategy] = useState<TradingStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStrategy = async () => {
    setIsLoading(true);
    setError(null);
    setStrategy(null);
    try {
      const result = await generateTradingStrategy(pair, currentPrice, historicalData);
      setStrategy(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getActionPill = (action: 'BUY' | 'SELL' | 'HOLD') => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    switch(action) {
      case 'BUY': return `${baseClasses} bg-green-500/20 text-green-300`;
      case 'SELL': return `${baseClasses} bg-red-500/20 text-red-300`;
      case 'HOLD': return `${baseClasses} bg-gray-500/20 text-gray-300`;
    }
  };

  return (
    <Card title="AI Strategy Assistant" className="flex-grow flex flex-col">
      <div className="flex-grow">
        {isLoading && <div className="flex flex-col items-center justify-center h-full"><Spinner /><p className="mt-2 text-gray-400">Analyzing market data...</p></div>}
        {error && <div className="text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</div>}
        {strategy && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="font-bold text-lg text-blue-300">{strategy.strategyName}</h4>
            <div className="flex justify-between items-center">
                <span className={getActionPill(strategy.action)}>{strategy.action}</span>
                <div className="text-sm text-gray-400">Confidence: <span className="font-semibold text-gray-200">{strategy.confidence.toFixed(1)}%</span></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-gray-700/50 p-2 rounded-md">
                    <p className="text-gray-400">Entry</p>
                    <p className="font-semibold">${strategy.entryPrice.toFixed(2)}</p>
                </div>
                 <div className="bg-gray-700/50 p-2 rounded-md">
                    <p className="text-gray-400">Target</p>
                    <p className="font-semibold text-green-400">${strategy.targetPrice.toFixed(2)}</p>
                </div>
                 <div className="bg-gray-700/50 p-2 rounded-md">
                    <p className="text-gray-400">Stop-Loss</p>
                    <p className="font-semibold text-red-400">${strategy.stopLoss.toFixed(2)}</p>
                </div>
            </div>
            <div>
              <h5 className="font-semibold text-gray-300 mb-1">Reasoning:</h5>
              <p className="text-gray-400 text-sm leading-relaxed">{strategy.reasoning}</p>
            </div>
          </div>
        )}
        {!isLoading && !strategy && !error && (
            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                <p>Click the button below to generate a new trading strategy based on the latest market data.</p>
            </div>
        )}
      </div>

      <button
        onClick={handleGenerateStrategy}
        disabled={isLoading}
        className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
      >
        {isLoading ? <Spinner /> : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
        )}
        <span>{isLoading ? 'Generating...' : 'Generate Strategy'}</span>
      </button>
    </Card>
  );
};

export default StrategyPanel;
