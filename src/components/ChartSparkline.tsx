import React, { useEffect, useState } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../types';
import { getCoinColor } from '../utils/colors';

interface Props {
  coinId: string;
}

const ChartSparkline: React.FC<Props> = ({ coinId }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`);
        if (!response.ok) throw new Error('Rate limit');
        const json = await response.json();
        const formatted = json.prices.map((item: [number, number]) => ({
          timestamp: item[0],
          price: item[1]
        }));
        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch chart for", coinId, err);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [coinId]);

  if (loading) return <div style={{ height: '40px', width: '100px', opacity: 0.5, display: 'flex', alignItems: 'center' }}>...</div>;
  if (!data.length) return <div style={{ height: '40px', width: '100px', opacity: 0.5, display: 'flex', alignItems: 'center' }}>N/A</div>;

  const color = getCoinColor(coinId);
  const min = Math.min(...data.map(d => d.price));
  const max = Math.max(...data.map(d => d.price));

  return (
    <div style={{ height: '40px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={[min, max]} hide />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={true}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSparkline;
