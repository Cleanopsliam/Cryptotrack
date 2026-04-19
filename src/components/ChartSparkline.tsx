import React, { useEffect, useState } from 'react';
import { LineChart, Line, YAxis, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../types';
import { getCoinColor } from '../utils/colors';

interface Props {
  coinId: string;
  isExpanded?: boolean;
}

const ChartSparkline: React.FC<Props> = ({ coinId, isExpanded = false }) => {
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

  if (loading) return <div style={{ height: isExpanded ? '200px' : '40px', width: '100%', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>...</div>;
  if (!data.length) return <div style={{ height: isExpanded ? '200px' : '40px', width: '100%', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N/A</div>;

  const color = getCoinColor(coinId);
  const min = Math.min(...data.map(d => d.price));
  const max = Math.max(...data.map(d => d.price));

  const formatTime = (time: number) => {
    const date = new Date(time);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div style={{ height: isExpanded ? '200px' : '40px', width: '100%', marginTop: isExpanded ? '1rem' : 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: isExpanded ? 20 : 5 }}>
          <YAxis domain={[min, max]} hide />
          {isExpanded && (
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime} 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} 
              axisLine={false} 
              tickLine={false} 
              minTickGap={30}
            />
          )}
          {isExpanded && (
            <Tooltip 
              formatter={(value: any) => [formatTooltip(value as number), 'Price']}
              labelFormatter={(label: any) => new Date(label as number).toLocaleDateString()}
              contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', backdropFilter: 'blur(20px)' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={isExpanded ? 3 : 2} 
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
