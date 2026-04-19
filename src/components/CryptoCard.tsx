import React, { useState } from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import type { Coin } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { getCoinColor } from '../utils/colors';
import ChartSparkline from './ChartSparkline';

interface Props {
  coin: Coin;
  rank: number;
  maxVolume: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
};

const formatCompact = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short"
  }).format(value);
};

const CryptoCard: React.FC<Props> = ({ coin, rank, maxVolume }) => {
  const { isInPortfolio, addToPortfolio, removeFromPortfolio } = usePortfolio();
  const change = coin.price_change_percentage_24h;
  const isUp = change >= 0;
  const volumePercentage = (coin.total_volume / maxVolume) * 100;
  const isSaved = isInPortfolio(coin.id);
  
  const brandColor = getCoinColor(coin.id);
  const [isHovered, setIsHovered] = useState(false);

  const togglePortfolio = () => {
    if (isSaved) removeFromPortfolio(coin.id);
    else addToPortfolio(coin.id);
  };

  return (
    <div 
      className="crypto-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? `0 0 20px ${brandColor}40` : 'none',
        borderColor: isHovered ? `${brandColor}80` : 'var(--card-border)'
      }}
    >
      <div className="rank">#{rank}</div>
      <button className={`portfolio-btn ${isSaved ? 'active' : ''}`} onClick={togglePortfolio}>
        <Star size={18} fill={isSaved ? '#f59e0b' : 'none'} />
      </button>
      <div className="coin-info">
        <img src={coin.image} alt={coin.name} className="coin-icon" />
        <div className="coin-name-block">
          <span className="coin-name">{coin.name}</span>
          <span className="coin-symbol">{coin.symbol}</span>
        </div>
      </div>
      <ChartSparkline coinId={coin.id} />
      <div className="price">{formatCurrency(coin.current_price)}</div>
      <div className={`change-badge ${isUp ? 'up' : 'down'}`}>
        {isUp ? <TrendingUp size={16} style={{ marginRight: 4 }} /> : <TrendingDown size={16} style={{ marginRight: 4 }} />}
        {isUp ? '+' : ''}{change.toFixed(2)}%
      </div>
      <div className="volume-container">
        <span className="volume-text">Vol: ${formatCompact(coin.total_volume)}</span>
        <div className="volume-bar-bg">
          <div className="volume-bar-fill" style={{ width: `${volumePercentage}%`, background: isHovered ? brandColor : 'var(--text-secondary)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
