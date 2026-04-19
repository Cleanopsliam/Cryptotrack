import type { Coin } from '../types';
import CryptoCard from './CryptoCard';

interface Props {
  coins: Coin[];
}

const CryptoList: React.FC<Props> = ({ coins }) => {
  // Find max volume to calculate percentage for the volume bar
  const maxVolume = Math.max(...coins.map(c => c.total_volume));

  return (
    <div className="crypto-list">
      {coins.map((coin, index) => (
        <CryptoCard 
          key={coin.id} 
          coin={coin} 
          rank={index + 1} 
          maxVolume={maxVolume} 
        />
      ))}
    </div>
  );
};

export default CryptoList;
