import React from 'react';
import { TradingStrategy } from '../types';

interface StrategyLogItemProps {
    strategy: TradingStrategy;
}

const StrategyLogItem: React.FC<StrategyLogItemProps> = ({ strategy }) => {

    const getActionPill = (action: 'BUY' | 'SELL' | 'HOLD') => {
        const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full tracking-wide";
        switch (action) {
            case 'BUY': return `${baseClasses} bg-green-500/20 text-green-300`;
            case 'SELL': return `${baseClasses} bg-red-500/20 text-red-300`;
            case 'HOLD': return `${baseClasses} bg-gray-500/20 text-gray-300`;
        }
    };

    const formattedTimestamp = new Date(strategy.timestamp).toLocaleTimeString();

    return (
        <details className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden group">
            <summary className="p-4 cursor-pointer list-none flex justify-between items-center hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <span className={getActionPill(strategy.action)}>{strategy.action}</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-200">{strategy.strategyName}</h4>
                        <p className="text-xs text-gray-500">{formattedTimestamp}</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-400">Confidence</p>
                        <p className="font-semibold text-gray-200">{strategy.confidence.toFixed(1)}%</p>
                    </div>
                    <div className="transform transition-transform duration-300 group-open:rotate-90">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                 </div>
            </summary>
            <div className="p-4 border-t border-gray-700 bg-gray-900/50 animate-fade-in-down">
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-sm mb-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Entry</p>
                        <p className="font-semibold text-lg text-gray-200">${strategy.entryPrice.toFixed(2)}</p>
                    </div>
                     <div className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Target</p>
                        <p className="font-semibold text-lg text-green-400">${strategy.targetPrice.toFixed(2)}</p>
                    </div>
                     <div className="bg-gray-700/50 p-3 rounded-lg col-span-2 sm:col-span-1">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Stop-Loss</p>
                        <p className="font-semibold text-lg text-red-400">${strategy.stopLoss.toFixed(2)}</p>
                    </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-300 mb-2">Analyst Reasoning:</h5>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{strategy.reasoning}</p>
                </div>
            </div>
        </details>
    );
};

export default StrategyLogItem;