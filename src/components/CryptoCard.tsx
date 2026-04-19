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
      className="crypto-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        boxShadow: isHovered ? `0 4px 25px ${brandColor}30` : 'none',
        background: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        zIndex: isHovered ? 10 : 1,
        position: 'relative',
        borderRadius: isHovered ? '16px' : '0'
      }}
    >
      <div className="crypto-card" style={{ borderBottom: 'none', background: 'transparent', boxShadow: 'none', transform: 'none' }}>
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
        <div style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.2s' }}>
          {!isHovered && <ChartSparkline coinId={coin.id} />}
        </div>
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
      
      {isHovered && (
        <div className="expanded-content" style={{ padding: '0 1.5rem 1.5rem 1.5rem', animation: 'fadeIn 0.3s ease-in-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Market Cap</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem' }}>${formatCompact(coin.market_cap)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>24h High</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem' }}>{formatCurrency(coin.high_24h)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>24h Low</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem' }}>{formatCurrency(coin.low_24h)}</span>
            </div>
          </div>
          <ChartSparkline coinId={coin.id} isExpanded={true} />
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default CryptoCard;
