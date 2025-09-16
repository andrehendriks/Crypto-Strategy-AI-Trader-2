
import React, { useState, useEffect, useRef } from 'react';
import { CryptoPair } from '../types';
import Card from './common/Card';

interface RealtimePriceProps {
  pair: CryptoPair;
  price: number | null;
}

const RealtimePrice: React.FC<RealtimePriceProps> = ({ pair, price }) => {
  const [priceChange, setPriceChange] = useState< 'up' | 'down' | 'none' >('none');
  const prevPriceRef = useRef<number | null>(null);

  useEffect(() => {
    if (price !== null && prevPriceRef.current !== null) {
      if (price > prevPriceRef.current) {
        setPriceChange('up');
      } else if (price < prevPriceRef.current) {
        setPriceChange('down');
      }
      setTimeout(() => setPriceChange('none'), 300);
    }
    prevPriceRef.current = price;
  }, [price]);
  
  const priceColor = priceChange === 'up' ? 'bg-green-500/30' : priceChange === 'down' ? 'bg-red-500/30' : 'bg-transparent';
  const textColor = priceChange === 'up' ? 'text-green-400' : priceChange === 'down' ? 'text-red-400' : 'text-gray-100';

  return (
    <Card title="Current Price">
      <div className={`p-4 rounded-lg transition-all duration-300 ${priceColor}`}>
        <div className="text-sm text-gray-400 mb-1">{pair}</div>
        <div className="flex items-baseline space-x-2">
          <p className={`text-4xl font-bold transition-colors duration-300 ${textColor}`}>
            {price !== null ? `$${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Loading...'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RealtimePrice;
