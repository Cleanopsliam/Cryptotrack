export const COIN_COLORS: Record<string, string> = {
  'bitcoin': '#f7931a',
  'ethereum': '#627eea',
  'tether': '#26a17b',
  'binancecoin': '#f3ba2f',
  'solana': '#14f195',
  'usd-coin': '#2775ca',
  'ripple': '#23292f',
  'cardano': '#0033ad',
  'avalanche-2': '#e84142',
  'dogecoin': '#c2a633',
  'polkadot': '#e6007a',
  'chainlink': '#2a5ada',
};

export const getCoinColor = (id: string) => COIN_COLORS[id] || '#ffffff';
