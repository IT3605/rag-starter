/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabKey } from './components/BottomNav';
import { WatchlistView } from './components/WatchlistView';
import { MarketsView } from './components/MarketsView';
import { ChartView } from './components/ChartView';
import { IdeasView } from './components/IdeasView';
import { NewsView } from './components/NewsView';
import { OrderModal } from './components/OrderModal';
import { IndicatorsModal } from './components/IndicatorsModal';
import { SearchModal } from './components/SearchModal';
import { AlertsModal } from './components/AlertsModal';
import { ProfileModal } from './components/ProfileModal';
import { SymbolDetailsModal } from './components/SymbolDetailsModal';
import { INITIAL_WATCHLISTS } from './data/mockData';
import { WatchlistItem, IndicatorSettings, Position, TradeIdea } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('markets');
  const [watchlists, setWatchlists] = useState(INITIAL_WATCHLISTS);
  const [currentListName, setCurrentListName] = useState('Crypto Majors');
  const [activeSymbol, setActiveSymbol] = useState<WatchlistItem>(
    INITIAL_WATCHLISTS['Crypto Majors'][0] // BTCUSDT
  );

  // Live dynamic ticking price
  const [livePrice, setLivePrice] = useState<number>(64821.50);
  const [priceTick, setPriceTick] = useState<'up' | 'down' | null>(null);
  const [priceTickMap, setPriceTickMap] = useState<Record<string, 'up' | 'down' | null>>({});

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderPrice, setOrderPrice] = useState(64822.00);
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSymbolDetailsOpen, setIsSymbolDetailsOpen] = useState(false);
  const [symbolDetailsItem, setSymbolDetailsItem] = useState<WatchlistItem>(
    INITIAL_WATCHLISTS['Crypto Majors'][0]
  );

  // Open positions
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 'pos-init-1',
      symbol: 'BTCUSDT',
      side: 'Buy / Long',
      entryPrice: 63450.00,
      markPrice: 64821.50,
      amount: 0.5,
      leverage: 20,
      pnl: 685.75,
      pnlPct: 21.6,
    },
    {
      id: 'pos-init-2',
      symbol: 'NVDA',
      side: 'Buy / Long',
      entryPrice: 124.50,
      markPrice: 128.40,
      amount: 25,
      leverage: 5,
      pnl: 97.50,
      pnlPct: 15.6,
    }
  ]);

  // Indicators toggle state
  const [indicators, setIndicators] = useState<IndicatorSettings>({
    ema20: true,
    ema50: true,
    ema200: true,
    volMa: true,
    rsi: true,
    macd: false,
    bollinger: false,
  });

  // Flat array of all symbols for global search
  const allSymbols = Object.values(watchlists).flat();

  // Handle live tick simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Small random delta between -4.5 and +4.8
      const delta = (Math.random() - 0.47) * 4.5;
      const isUp = delta >= 0;

      setLivePrice((prev) => {
        const next = Math.max(10, +(prev + delta).toFixed(activeSymbol.decimals));
        return next;
      });

      setPriceTick(isUp ? 'up' : 'down');
      setPriceTickMap((prev) => ({
        ...prev,
        [activeSymbol.symbol]: isUp ? 'up' : 'down',
      }));

      // Reset tick highlight
      setTimeout(() => {
        setPriceTick(null);
        setPriceTickMap((prev) => ({
          ...prev,
          [activeSymbol.symbol]: null,
        }));
      }, 400);
    }, 1800);

    return () => clearInterval(timer);
  }, [activeSymbol.decimals, activeSymbol.symbol]);

  // Sync active symbol price change with live price
  useEffect(() => {
    setLivePrice(activeSymbol.price);
  }, [activeSymbol]);

  // Navigation handlers
  const handleSelectSymbol = (item: WatchlistItem) => {
    setActiveSymbol(item);
    setActiveTab('chart');
  };

  const handleSelectSymbolByName = (symbolName: string) => {
    const found = allSymbols.find((s) => s.symbol === symbolName);
    if (found) {
      setActiveSymbol(found);
      setActiveTab('chart');
    }
  };

  const handleOpenDetails = (itemOrSymbol: WatchlistItem | string) => {
    if (typeof itemOrSymbol === 'string') {
      const clean = itemOrSymbol.replace('/', '').toUpperCase();
      const found = allSymbols.find(
        (s) => s.symbol.replace('/', '').toUpperCase() === clean || s.symbol.startsWith(clean)
      );
      if (found) {
        setSymbolDetailsItem(found);
      } else {
        setSymbolDetailsItem({
          symbol: itemOrSymbol,
          name: `${itemOrSymbol} Asset`,
          sector: 'Crypto',
          price: livePrice,
          changePct: 2.26,
          changeVal: 1432.20,
          sparkline: [12, 14, 11, 16, 20, 24],
          high24h: 65490.00,
          low24h: 63120.00,
          vol24h: '42.8B',
          turnover: '1.84B',
          exchange: 'BINANCE',
          decimals: 2,
        });
      }
    } else {
      setSymbolDetailsItem(itemOrSymbol);
    }
    setIsSymbolDetailsOpen(true);
  };

  const handleOpenOrder = (side: 'buy' | 'sell', price: number) => {
    setOrderSide(side);
    setOrderPrice(price);
    setIsOrderOpen(true);
  };

  const handleExecuteOrder = (newPos: Position) => {
    setPositions([newPos, ...positions]);
  };

  const handleClosePosition = (id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  const handleTradeSetup = (symbol: string, side: 'buy' | 'sell', price: number) => {
    handleSelectSymbolByName(symbol);
    handleOpenOrder(side, price);
  };

  const handleAddToWatchlist = (item: WatchlistItem) => {
    const list = watchlists[currentListName] || [];
    if (!list.some((s) => s.symbol === item.symbol)) {
      setWatchlists({
        ...watchlists,
        [currentListName]: [item, ...list],
      });
    }
  };

  return (
    <div className="bg-[#0f131e] text-[#dfe2f2] min-h-screen flex flex-col antialiased selection:bg-[#2962ff]/30 font-sans">
      {/* Top Main Navigation Bar */}
      <Header
        currentTab={activeTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsAlertsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadAlertsCount={2}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pt-14 flex flex-col">
        {activeTab === 'watchlist' && (
          <WatchlistView
            watchlists={watchlists}
            currentListName={currentListName}
            onSelectListName={setCurrentListName}
            onSelectSymbol={handleSelectSymbol}
            onOpenAddSymbol={() => setIsSearchOpen(true)}
            priceTickMap={priceTickMap}
            onOpenSymbolDetails={handleOpenDetails}
          />
        )}

        {activeTab === 'markets' && (
          <MarketsView
            onSelectSymbolForDetails={handleOpenDetails}
            onOpenChart={(s) => {
              handleSelectSymbolByName(s);
              setActiveTab('chart');
            }}
          />
        )}

        {activeTab === 'chart' && (
          <ChartView
            item={activeSymbol}
            livePrice={livePrice}
            priceTick={priceTick}
            onOpenOrderModal={handleOpenOrder}
            onOpenIndicatorsModal={() => setIsIndicatorsOpen(true)}
            onOpenAlertModal={() => setIsAlertsOpen(true)}
            indicators={indicators}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasView
            onSelectSymbolForChart={handleSelectSymbolByName}
            onTradeSetup={handleTradeSetup}
          />
        )}

        {activeTab === 'menu' && (
          <div className="p-4 flex flex-col gap-4 max-w-lg mx-auto w-full pb-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#262a35]">
              <h2 className="font-bold text-[18px] text-[#dfe2f2]">Obsidian Terminal Menu</h2>
              <span className="text-[11px] font-mono text-[#089981] bg-[#089981]/15 px-2 py-0.5 rounded">
                SYSTEM ONLINE
              </span>
            </div>

            {/* Quick Balance Tile */}
            <div
              onClick={() => setIsProfileOpen(true)}
              className="p-4 bg-[#1b1f2b] rounded-xl border border-[#262a35] hover:border-[#313441] transition-all cursor-pointer flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-mono text-[#8d90a2]">Total Equity</span>
                <span className="font-mono text-[20px] font-bold text-[#dfe2f2]">$124,580.40 USDT</span>
                <span className="text-[11px] font-mono text-[#089981]">Margin Level: 94.2% (Safe)</span>
              </div>
              <span className="material-symbols-outlined text-[#8d90a2]">chevron_right</span>
            </div>

            {/* Terminal Actions */}
            <div className="flex flex-col gap-2 font-mono text-[12px]">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="p-3 bg-[#171b26] hover:bg-[#262a35] rounded-xl border border-[#262a35] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#2962ff] text-[18px]">account_balance_wallet</span>
                  <span className="text-[#dfe2f2]">Positions & Portfolio Manager</span>
                </div>
                <span className="text-[10px] text-[#b6c4ff] px-1.5 py-0.5 rounded bg-[#262a35]">{positions.length} Open</span>
              </button>

              <button
                onClick={() => setIsAlertsOpen(true)}
                className="p-3 bg-[#171b26] hover:bg-[#262a35] rounded-xl border border-[#262a35] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ffb3b0] text-[18px]">add_alert</span>
                  <span className="text-[#dfe2f2]">Price Alerts & Webhooks</span>
                </div>
                <span className="material-symbols-outlined text-[#8d90a2] text-[16px]">chevron_right</span>
              </button>

              <button
                onClick={() => setIsIndicatorsOpen(true)}
                className="p-3 bg-[#171b26] hover:bg-[#262a35] rounded-xl border border-[#262a35] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#66dabf] text-[18px]">tune</span>
                  <span className="text-[#dfe2f2]">Indicator Presets & Overlay Config</span>
                </div>
                <span className="material-symbols-outlined text-[#8d90a2] text-[16px]">chevron_right</span>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 bg-[#171b26] hover:bg-[#262a35] rounded-xl border border-[#262a35] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#f59e0b] text-[18px]">travel_explore</span>
                  <span className="text-[#dfe2f2]">All Market Instruments Directory</span>
                </div>
                <span className="material-symbols-outlined text-[#8d90a2] text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Build Spec & Status */}
            <div className="p-3.5 bg-[#0a0e19] rounded-xl border border-[#262a35] text-[11px] font-mono text-[#8d90a2] flex flex-col gap-1 mt-2">
              <div className="flex justify-between">
                <span>Version:</span>
                <span className="text-[#dfe2f2]">Obsidian Terminal 4.8.2-PRO</span>
              </div>
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className="text-[#089981]">14ms • Ultra-low ping</span>
              </div>
              <div className="flex justify-between">
                <span>Data Feed:</span>
                <span className="text-[#dfe2f2]">Binance / NASDAQ / OANDA WS</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Order Execution Modal */}
      <OrderModal
        isOpen={isOrderOpen}
        side={orderSide}
        symbolItem={activeSymbol}
        currentPrice={orderPrice}
        onClose={() => setIsOrderOpen(false)}
        onExecuteOrder={handleExecuteOrder}
      />

      {/* Indicators Configuration Modal */}
      <IndicatorsModal
        isOpen={isIndicatorsOpen}
        onClose={() => setIsIndicatorsOpen(false)}
        indicators={indicators}
        onChangeIndicators={setIndicators}
      />

      {/* Symbol Search & Switcher Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSymbol={handleSelectSymbol}
        allSymbols={allSymbols}
        onAddToWatchlist={handleAddToWatchlist}
      />

      {/* Price Alerts Modal */}
      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        activeSymbol={activeSymbol}
      />

      {/* User Profile & Positions Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        positions={positions}
        onClosePosition={handleClosePosition}
      />

      {/* Symbol Technical Details Modal Screen */}
      <SymbolDetailsModal
        isOpen={isSymbolDetailsOpen}
        item={symbolDetailsItem}
        livePrice={symbolDetailsItem.symbol === activeSymbol.symbol ? livePrice : symbolDetailsItem.price}
        onClose={() => setIsSymbolDetailsOpen(false)}
        onGoToChart={(item) => {
          handleSelectSymbol(item);
          setIsSymbolDetailsOpen(false);
          setActiveTab('chart');
        }}
        onOpenTrade={(item, side, price) => {
          handleSelectSymbol(item);
          handleOpenOrder(side, price);
          setIsSymbolDetailsOpen(false);
        }}
      />

      {/* Bottom Sticky Tab Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
