import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface PortfolioContextType {
  portfolioIds: string[];
  addToPortfolio: (id: string) => void;
  removeFromPortfolio: (id: string) => void;
  isInPortfolio: (id: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolioIds, setPortfolioIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolioIds));
  }, [portfolioIds]);

  const addToPortfolio = (id: string) => {
    setPortfolioIds(prev => {
      if (!prev.includes(id)) return [...prev, id];
      return prev;
    });
  };

  const removeFromPortfolio = (id: string) => {
    setPortfolioIds(prev => prev.filter(coinId => coinId !== id));
  };

  const isInPortfolio = (id: string) => portfolioIds.includes(id);

  return (
    <PortfolioContext.Provider value={{ portfolioIds, addToPortfolio, removeFromPortfolio, isInPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
