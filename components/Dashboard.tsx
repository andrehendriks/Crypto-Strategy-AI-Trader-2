
import React, { useState, useEffect } from 'react';
import { CryptoPair, HistoricalDataPoint, PriceUpdate } from '../types';
import PriceChart from './PriceChart';
import RealtimePrice from './RealtimePrice';
import StrategyPanel from './StrategyPanel';
import { MOCK_HISTORICAL_DATA, subscribeToPriceUpdates, unsubscribeFromPriceUpdates } from '../services/mockCoinbaseService';

const Dashboard: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<CryptoPair>(CryptoPair.BTC_USD);
  const [realtimePrices, setRealtimePrices] = useState<Record<CryptoPair, number | null>>({
    [CryptoPair.BTC_USD]: null,
    [CryptoPair.ETH_USD]: null,
  });

  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(MOCK_HISTORICAL_DATA[selectedPair]);

  useEffect(() => {
    setHistoricalData(MOCK_HISTORICAL_DATA[selectedPair]);
    setRealtimePrices(prev => ({ ...prev, [selectedPair]: MOCK_HISTORICAL_DATA[selectedPair].slice(-1)[0].price }));
  }, [selectedPair]);

  useEffect(() => {
    const handlePriceUpdate = (update: PriceUpdate) => {
      setRealtimePrices(prevPrices => ({
        ...prevPrices,
        [update.pair]: update.price,
      }));
       if(update.pair === selectedPair){
         setHistoricalData(prevData => {
            const newDataPoint = {
                time: new Date().toISOString().slice(11, 16),
                price: update.price
            };
            const updatedData = [...prevData.slice(1), newDataPoint];
            return updatedData;
         });
       }
    };

    subscribeToPriceUpdates(handlePriceUpdate);

    return () => {
      unsubscribeFromPriceUpdates();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPair]);

  const currentPrice = realtimePrices[selectedPair] ?? historicalData.slice(-1)[0]?.price ?? 0;

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-center space-x-2 rounded-lg bg-gray-800 p-1 max-w-xs mx-auto">
        {(Object.keys(CryptoPair) as Array<keyof typeof CryptoPair>).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedPair(CryptoPair[key])}
            className={`w-full py-2 px-4 text-sm font-semibold rounded-md transition-colors duration-300 focus:outline-none ${
              selectedPair === CryptoPair[key]
                ? 'bg-blue-600 text-white shadow'
                : 'bg-transparent text-gray-400 hover:bg-gray-700'
            }`}
          >
            {CryptoPair[key]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart data={historicalData} pair={selectedPair} />
        </div>
        <div className="flex flex-col space-y-6">
          <RealtimePrice pair={selectedPair} price={currentPrice} />
          <StrategyPanel pair={selectedPair} currentPrice={currentPrice} historicalData={historicalData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
