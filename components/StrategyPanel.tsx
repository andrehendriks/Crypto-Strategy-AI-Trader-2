import React, { useState, useMemo } from 'react';
import { CryptoPair, HistoricalDataPoint, TradingStrategy } from '../types';
import { generateTradingStrategy } from '../services/geminiService';
import { calculateRSI, calculateSMA } from '../services/technicalAnalysis';
import Card from './common/Card';
import Spinner from './common/Spinner';
import StrategyLogItem from './StrategyLogItem'; // New component

interface StrategyPanelProps {
  pair: CryptoPair;
  currentPrice: number;
  historicalData: HistoricalDataPoint[];
}

const StrategyPanel: React.FC<StrategyPanelProps> = ({ pair, currentPrice, historicalData }) => {
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const technicalIndicators = useMemo(() => {
    return {
      sma20: calculateSMA(historicalData, 20),
      rsi14: calculateRSI(historicalData, 14),
    }
  }, [historicalData]);


  const handleGenerateStrategy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateTradingStrategy(pair, currentPrice, historicalData, technicalIndicators);
      const newStrategy: TradingStrategy = {
        ...result,
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
      };
      setStrategies(prev => [newStrategy, ...prev]);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="AI Strategy Assistant" className="flex-grow flex flex-col h-[480px]">
      <div className="flex-grow overflow-y-auto pr-2 space-y-3">
        {isLoading && strategies.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <Spinner />
            <p className="mt-2 text-gray-400">Analyzing market data...</p>
          </div>
        )}

        {error && <div className="text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</div>}
        
        {strategies.length > 0 && (
            <div className="space-y-2">
                {strategies.map(strategy => (
                    <StrategyLogItem key={strategy.id} strategy={strategy} />
                ))}
            </div>
        )}

        {!isLoading && strategies.length === 0 && !error && (
            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="font-semibold text-gray-400">Ready for Analysis</p>
                <p className="text-sm">Click the button to generate a new trading strategy based on the latest market data and technical indicators.</p>
            </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-around text-xs text-gray-400 mb-4">
          <span>SMA (20): <span className="font-semibold text-gray-200">{technicalIndicators.sma20 ?? 'N/A'}</span></span>
          <span>RSI (14): <span className="font-semibold text-gray-200">{technicalIndicators.rsi14 ?? 'N/A'}</span></span>
        </div>
        <button
          onClick={handleGenerateStrategy}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Spinner /> 
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Generate New Strategy</span>
            </>
          )}
        </button>
      </div>
    </Card>
  );
};

export default StrategyPanel;