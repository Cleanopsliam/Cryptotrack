import { useState, useEffect, useCallback } from 'react';
import type { Coin } from '../types';
import CryptoList from '../components/CryptoList';
import { usePortfolio } from '../context/PortfolioContext';

const Portfolio = () => {
  const { portfolioIds } = usePortfolio();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    if (portfolioIds.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const ids = portfolioIds.join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=volume_desc&sparkline=false`);
      if (!response.ok) {
        if (response.status === 429) throw new Error('Rate limit exceeded. Please try again in a moment.');
        throw new Error('Failed to fetch portfolio data.');
      }
      const data = await response.json();
      setCoins(data);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('CoinGecko rate limit reached (Network/CORS error). Please wait a moment and click retry.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [portfolioIds]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return (
    <>
      <div className="header">
        <h1>My Portfolio</h1>
      </div>

      {portfolioIds.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          Your portfolio is empty. Go to the dashboard to add some coins!
        </div>
      ) : loading ? (
        <div className="loading">Loading portfolio...</div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchPortfolio}>Retry</button>
        </div>
      ) : (
        <CryptoList coins={coins} />
      )}
    </>
  );
};

export default Portfolio;
