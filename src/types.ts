export type AssetType = 'Crypto' | 'Stock' | 'Forex' | 'Metal' | 'Index';

export interface WatchlistItem {
  symbol: string;
  name: string;
  sector: AssetType;
  price: number;
  changePct: number;
  changeVal: number;
  sparkline: number[];
  high24h: number;
  low24h: number;
  vol24h: string;
  turnover: string;
  exchange: string;
  decimals: number;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isUp: boolean;
}

export interface IndicatorSettings {
  ema20: boolean;
  ema50: boolean;
  ema200: boolean;
  volMa: boolean;
  rsi: boolean;
  macd: boolean;
  bollinger: boolean;
}

export interface TradeIdea {
  id: string;
  symbol: string;
  title: string;
  author: string;
  authorAvatar: string;
  timeAgo: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  likes: number;
  comments: number;
  summary: string;
  timeframe: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  readTime: string;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'Buy / Long' | 'Sell / Short';
  entryPrice: number;
  markPrice: number;
  amount: number;
  leverage: number;
  pnl: number;
  pnlPct: number;
}
