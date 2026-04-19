import { useState, useEffect, useCallback } from 'react';
import type { Coin } from '../types';
import SummaryDashboard from '../components/SummaryDashboard';
import CryptoList from '../components/CryptoList';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=5&page=1&sparkline=false';

const Dashboard = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchCoins = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        if (response.status === 429) throw new Error('Rate limit exceeded. Please try again in a moment.');
        throw new Error('Failed to fetch data.');
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
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  return (
    <>
      <div className="header">
        <h1>Market Overview</h1>
        <button 
          className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`} 
          onClick={fetchCoins}
          disabled={isRefreshing}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.5l5.25 5.25" />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Update Now'}
        </button>
      </div>

      {loading ? (
        <div className="loading">Fetching live market data...</div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCoins}>Retry</button>
        </div>
      ) : (
        <>
          <SummaryDashboard coins={coins} />
          <CryptoList coins={coins} />
        </>
      )}
    </>
  );
};

export default Dashboard;
