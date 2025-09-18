import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoPair, HistoricalDataPoint } from '../types';
import Card from './common/Card';

interface PriceChartProps {
  data: HistoricalDataPoint[];
  pair: CryptoPair;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, pair }) => {
  if (!data || data.length === 0) {
    return <Card title={`${pair} Price Chart`}>Loading chart data...</Card>;
  }

  const chartColor = pair === CryptoPair.BTC_USD ? '#F7931A' : '#627EEA';

  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return (tickItem / 1000).toFixed(1) + 'k';
    }
    return tickItem.toString();
  };
  
  const minPrice = Math.min(...data.map(p => p.price));
  const maxPrice = Math.max(...data.map(p => p.price));
  const priceBuffer = (maxPrice - minPrice) * 0.1; // 10% buffer

  return (
    <Card title={`${pair} Price Chart (Hourly)`} className="h-[480px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis 
            dataKey="time" 
            stroke="#A0AEC0" 
            tick={{ fontSize: 12 }} 
            angle={-30}
            textAnchor="end"
            height={50}
            interval="preserveStartEnd"
            />
          <YAxis 
            stroke="#A0AEC0" 
            tick={{ fontSize: 12 }} 
            tickFormatter={formatYAxis}
            domain={[minPrice - priceBuffer, maxPrice + priceBuffer]}
            />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1A202C', 
              border: '1px solid #4A5568', 
              borderRadius: '0.5rem'
            }} 
            labelStyle={{ color: '#E2E8F0' }}
            itemStyle={{ color: chartColor }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PriceChart;