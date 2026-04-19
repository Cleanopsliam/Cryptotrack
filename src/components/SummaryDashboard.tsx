import type { Coin } from '../types';

interface Props {
  coins: Coin[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const SummaryDashboard: React.FC<Props> = ({ coins }) => {
  if (!coins.length) return null;

  const totalVolume = coins.reduce((acc, coin) => acc + coin.total_volume, 0);
  
  let biggestGainer = coins[0];
  let totalChange = 0;

  coins.forEach(coin => {
    if (coin.price_change_percentage_24h > biggestGainer.price_change_percentage_24h) {
      biggestGainer = coin;
    }
    totalChange += coin.price_change_percentage_24h;
  });

  const averageChange = totalChange / coins.length;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <span className="label">Total 24h Volume (Top 5)</span>
        <span className="value">{formatCurrency(totalVolume)}</span>
      </div>
      <div className="summary-card">
        <span className="label">Biggest Gainer</span>
        <span className={`value ${biggestGainer.price_change_percentage_24h >= 0 ? 'success' : 'danger'}`}>
          {biggestGainer.symbol.toUpperCase()} {formatPercent(biggestGainer.price_change_percentage_24h)}
        </span>
      </div>
      <div className="summary-card">
        <span className="label">Average Change</span>
        <span className={`value ${averageChange >= 0 ? 'success' : 'danger'}`}>
          {formatPercent(averageChange)}
        </span>
      </div>
    </div>
  );
};

export default SummaryDashboard;
