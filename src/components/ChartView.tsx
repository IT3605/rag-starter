import React, { useState, useRef, useEffect } from 'react';
import { WatchlistItem, Candle, IndicatorSettings } from '../types';
import { INITIAL_CANDLES } from '../data/mockData';
import { OrderBook } from './OrderBook';

interface ChartViewProps {
  item: WatchlistItem;
  livePrice: number;
  priceTick: 'up' | 'down' | null;
  onOpenOrderModal: (side: 'buy' | 'sell', price: number) => void;
  onOpenIndicatorsModal: () => void;
  onOpenAlertModal: () => void;
  indicators: IndicatorSettings;
}

export const ChartView: React.FC<ChartViewProps> = ({
  item,
  livePrice,
  priceTick,
  onOpenOrderModal,
  onOpenIndicatorsModal,
  onOpenAlertModal,
  indicators,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [activeTool, setActiveTool] = useState<'crosshair' | 'trendline' | 'fib' | 'measure' | 'magnet' | null>('crosshair');
  const [chartType, setChartType] = useState<'candle' | 'line' | 'area'>('candle');
  const [selectedPercentage, setSelectedPercentage] = useState<string>('Max');
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [userTrendlines, setUserTrendlines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Timeframes list
  const timeframes = ['1m', '15m', '1h', '4h', '1D', '1W'];

  // Calculate live dynamic spread prices
  const spreadDelta = item.decimals === 4 ? 0.0002 : item.decimals === 2 ? 3.00 : 0.05;
  const bidPrice = Math.max(0, livePrice - spreadDelta / 2);
  const askPrice = livePrice + spreadDelta / 2;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (activeTool === 'trendline') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 320;
      const y = ((e.clientY - rect.top) / rect.height) * 380;
      if (!drawingStart) {
        setDrawingStart({ x, y });
        showToast('Trendline anchor 1 set. Tap point 2');
      } else {
        setUserTrendlines([...userTrendlines, { x1: drawingStart.x, y1: drawingStart.y, x2: x, y2: y }]);
        setDrawingStart(null);
        showToast('Trendline created');
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 320;
    const y = ((e.clientY - rect.top) / rect.height) * 380;
    setCrosshairPos({ x, y });

    // Find nearest candle
    const candleIndex = Math.min(
      INITIAL_CANDLES.length - 1,
      Math.max(0, Math.floor((x / 320) * INITIAL_CANDLES.length))
    );
    setHoveredCandle(INITIAL_CANDLES[candleIndex]);
  };

  const handlePointerLeave = () => {
    setCrosshairPos(null);
    setHoveredCandle(null);
  };

  const clearAllDrawings = () => {
    setUserTrendlines([]);
    setDrawingStart(null);
    showToast('All drawing overlays cleared');
  };

  const triggerSnapshot = () => {
    showToast('📸 Chart snapshot saved to clipboard!');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // EMA values based on current price
  const ema20Val = (livePrice * 0.9901).toFixed(2);
  const ema50Val = (livePrice * 0.9694).toFixed(2);
  const ema200Val = (livePrice * 0.8842).toFixed(2);

  return (
    <div
      className={`flex flex-col w-full select-none overflow-hidden bg-[#0f131e] pb-24 ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2962ff] text-white text-[12px] font-medium px-4 py-2 rounded-lg shadow-2xl animate-fade-in flex items-center gap-1.5 border border-white/20">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Asset Sub-Header & Live Metric Stream */}
      <div className="flex flex-col bg-[#171b26] px-3 py-2 gap-1 border-b border-[#1b1f2b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[18px] tracking-tight text-[#dfe2f2]">
              {item.symbol.includes('/') ? item.symbol : `${item.symbol}/USDT`}
            </span>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#313441] text-[#66dabf] tracking-wider">
              {item.exchange}
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1b1f2b] text-[#b6c4ff] font-bold border border-[#262a35]">
              {selectedTimeframe}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleFullscreen}
              className="w-7 h-7 flex items-center justify-center rounded bg-[#1b1f2b] hover:bg-[#262a35] text-[#c3c5d8] active:text-[#dfe2f2] border border-[#262a35]"
              title="Expand Viewport"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
            <button
              onClick={triggerSnapshot}
              className="w-7 h-7 flex items-center justify-center rounded bg-[#1b1f2b] hover:bg-[#262a35] text-[#c3c5d8] active:text-[#dfe2f2] border border-[#262a35]"
              title="Camera Snapshot"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </button>
          </div>
        </div>

        {/* Live Price Ticker & Delta */}
        <div className="flex items-baseline justify-between mt-0.5">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono text-[22px] font-bold tracking-tight transition-colors duration-200 ${
                priceTick === 'up'
                  ? 'text-[#089981]'
                  : priceTick === 'down'
                  ? 'text-[#f23645]'
                  : 'text-[#dfe2f2]'
              }`}
            >
              {livePrice.toLocaleString('en-US', {
                minimumFractionDigits: item.decimals,
                maximumFractionDigits: item.decimals,
              })}
            </span>
            <span className="font-mono text-[10px] text-[#8d90a2]">USD</span>
            <span
              className={`font-mono text-[13px] font-semibold flex items-center ${
                item.changePct >= 0 ? 'text-[#66dabf]' : 'text-[#ffb3b0]'
              }`}
            >
              {item.changePct >= 0 ? '+' : ''}
              {item.changeVal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              ({item.changePct >= 0 ? '+' : ''}
              {item.changePct.toFixed(2)}%)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#8d90a2] font-mono text-[10px]">
            <div>
              <span className="text-[#434656] mr-0.5">H</span>
              <span className="text-[#dfe2f2]">{item.high24h.toLocaleString('en-US')}</span>
            </div>
            <div>
              <span className="text-[#434656] mr-0.5">L</span>
              <span className="text-[#dfe2f2]">{item.low24h.toLocaleString('en-US')}</span>
            </div>
          </div>
        </div>

        {/* Stats strip (Volume & 24h range glance) */}
        <div className="flex items-center justify-between pt-0.5 font-mono text-[10px] text-[#c3c5d8]">
          <div className="flex items-center gap-3">
            <span>
              Vol(24h): <strong className="text-[#dfe2f2] font-bold">{item.vol24h}</strong>
            </span>
            <span>
              Turnover: <strong className="text-[#dfe2f2] font-bold">{item.turnover}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#66dabf]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#66dabf] animate-pulse" />
            <span className="font-medium">MARKET OPEN</span>
          </div>
        </div>

        {/* Active Hover Crosshair Readout Bar */}
        {hoveredCandle && (
          <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-[#8d90a2] border-t border-[#1b1f2b]/60">
            <span>T: <strong className="text-[#dfe2f2]">{hoveredCandle.time}</strong></span>
            <span>O: <strong className="text-[#dfe2f2]">{hoveredCandle.open}</strong></span>
            <span>H: <strong className="text-[#dfe2f2]">{hoveredCandle.high}</strong></span>
            <span>L: <strong className="text-[#dfe2f2]">{hoveredCandle.low}</strong></span>
            <span>C: <strong className={hoveredCandle.isUp ? 'text-[#089981]' : 'text-[#f23645]'}>{hoveredCandle.close}</strong></span>
          </div>
        )}
      </div>

      {/* TradingView Modular Action Strip (Timeframes & Indicators) */}
      <div className="flex items-center justify-between bg-[#1b1f2b] px-3 py-1 overflow-x-auto gap-1 border-b border-[#262a35] scrollbar-none">
        <div className="flex items-center gap-1 shrink-0">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2 py-1 rounded font-mono text-[10px] transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-[#313441] text-[#b6c4ff] font-bold shadow-sm'
                  : 'text-[#8d90a2] hover:text-[#dfe2f2]'
              }`}
            >
              {tf}
            </button>
          ))}
          <button
            onClick={() => showToast('Custom resolution selected: 1D default')}
            className="px-1 py-1 rounded text-[#8d90a2] hover:text-[#dfe2f2]"
            title="Custom timeframe"
          >
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
        </div>

        <div className="h-4 w-[1px] bg-[#313441] shrink-0 mx-1" />

        <div className="flex items-center gap-1 shrink-0">
          {/* Chart Type Toggle */}
          <button
            onClick={() => {
              const types: ('candle' | 'line' | 'area')[] = ['candle', 'line', 'area'];
              const nextIndex = (types.indexOf(chartType) + 1) % types.length;
              setChartType(types[nextIndex]);
              showToast(`Chart style: ${types[nextIndex].toUpperCase()}`);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#171b26] text-[#c3c5d8] hover:text-white border border-[#262a35] text-[11px] font-medium"
            title="Switch Chart Style"
          >
            <span className="material-symbols-outlined text-[15px] text-[#b6c4ff]">
              {chartType === 'candle' ? 'candlestick_chart' : chartType === 'line' ? 'show_chart' : 'area_chart'}
            </span>
          </button>

          {/* Indicators Button */}
          <button
            onClick={onOpenIndicatorsModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-[#dfe2f2] text-[11px] font-semibold transition-colors"
          >
            <span className="text-[#b6c4ff] font-serif font-bold italic text-[12px]">fx</span>
            <span>Indicators</span>
            <span className="px-1 py-0.2 rounded bg-[#313441] text-[9px] text-[#66dabf] font-mono">
              3
            </span>
          </button>

          {/* Alert Button */}
          <button
            onClick={onOpenAlertModal}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-[#c3c5d8]"
            title="Add Price Alert"
          >
            <span className="material-symbols-outlined text-[14px] text-[#ffb3b0]">add_alert</span>
          </button>

          {/* Compare Button */}
          <button
            onClick={() => showToast('Compare overlay mode')}
            className="w-6 h-6 flex items-center justify-center rounded bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-[#c3c5d8]"
            title="Compare Symbol"
          >
            <span className="material-symbols-outlined text-[15px]">compare_arrows</span>
          </button>
        </div>
      </div>

      {/* Indicator Badges Sub-header */}
      <div className="flex items-center gap-2 px-3 py-1 bg-[#0a0e19] overflow-x-auto text-[10px] font-mono border-b border-[#1b1f2b] scrollbar-none">
        {indicators.ema20 && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1b1f2b] text-[#f59e0b] border border-[#f59e0b]/20 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            <span>EMA 20: <strong className="text-[#dfe2f2]">{ema20Val}</strong></span>
          </div>
        )}
        {indicators.ema50 && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1b1f2b] text-[#06b6d4] border border-[#06b6d4]/20 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
            <span>EMA 50: <strong className="text-[#dfe2f2]">{ema50Val}</strong></span>
          </div>
        )}
        {indicators.ema200 && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1b1f2b] text-[#a855f7] border border-[#a855f7]/20 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
            <span>EMA 200: <strong className="text-[#dfe2f2]">{ema200Val}</strong></span>
          </div>
        )}
        {indicators.volMa && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1b1f2b] text-[#66dabf] border border-[#66dabf]/20 shrink-0">
            <span>Vol MA(20): <strong className="text-[#dfe2f2]">24.12K</strong></span>
          </div>
        )}
      </div>

      {/* Canvas Host Container with Left Floating Tools & Right Scale */}
      <div
        ref={chartContainerRef}
        className="relative w-full bg-[#0a0e19] flex select-none touch-none"
        style={{ height: isFullscreen ? 'calc(100vh - 280px)' : '380px' }}
      >
        {/* Floating Vertical Tool Dock (Left Bezel) */}
        <div className="absolute left-2 top-3 z-20 flex flex-col gap-1 bg-[#1b1f2b]/90 backdrop-blur-md p-1 rounded-xl shadow-2xl border border-[#313441]/80">
          <button
            onClick={() => setActiveTool(activeTool === 'crosshair' ? null : 'crosshair')}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              activeTool === 'crosshair' ? 'bg-[#313441] text-[#b6c4ff]' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
            title="Crosshair Tool"
          >
            <span className="material-symbols-outlined text-[17px]">control_camera</span>
          </button>

          <button
            onClick={() => {
              setActiveTool(activeTool === 'trendline' ? null : 'trendline');
              showToast(activeTool === 'trendline' ? 'Trendline off' : 'Tap two points to draw a trendline');
            }}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              activeTool === 'trendline' ? 'bg-[#313441] text-[#b6c4ff]' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
            title="Draw Trendline"
          >
            <span className="material-symbols-outlined text-[17px]">timeline</span>
          </button>

          <button
            onClick={() => {
              setActiveTool(activeTool === 'fib' ? null : 'fib');
              showToast('Fibonacci Retracement Grid active');
            }}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              activeTool === 'fib' ? 'bg-[#313441] text-[#b6c4ff]' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
            title="Fibonacci Retracement"
          >
            <span className="material-symbols-outlined text-[17px]">reorder</span>
          </button>

          <button
            onClick={() => {
              setActiveTool(activeTool === 'measure' ? null : 'measure');
              showToast('Price & Bar Measure Ruler active');
            }}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              activeTool === 'measure' ? 'bg-[#313441] text-[#b6c4ff]' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
            title="Measure Ruler"
          >
            <span className="material-symbols-outlined text-[17px]">straighten</span>
          </button>

          <button
            onClick={() => {
              setActiveTool(activeTool === 'magnet' ? null : 'magnet');
              showToast(activeTool === 'magnet' ? 'Magnet mode disabled' : 'Magnet Mode enabled (Snapping to OHLC)');
            }}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              activeTool === 'magnet' ? 'bg-[#313441] text-[#b6c4ff]' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
            }`}
            title="Magnet Mode"
          >
            <span className="material-symbols-outlined text-[17px]">near_me</span>
          </button>

          <div className="w-full h-[1px] bg-[#313441] my-0.5" />

          <button
            onClick={clearAllDrawings}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#313441] text-[#8d90a2] hover:text-[#f23645] transition-colors"
            title="Clear Drawings"
          >
            <span className="material-symbols-outlined text-[17px]">delete_sweep</span>
          </button>
        </div>

        {/* Scalable High-Performance SVG Chart Canvas */}
        <div className="relative flex-1 h-full overflow-hidden" id="candlestick-render-area">
          <svg
            className="w-full h-full block cursor-crosshair"
            preserveAspectRatio="none"
            viewBox="0 0 320 380"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <defs>
              <linearGradient id="volGradUp" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#089981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#089981" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="volGradDown" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f23645" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f23645" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="bullGlow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#66dabf" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0f131e" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle Canvas Grid */}
            <g stroke="#1b1f2b" strokeDasharray="2,2" strokeWidth="1">
              <line x1="0" x2="320" y1="40" y2="40" />
              <line x1="0" x2="320" y1="90" y2="90" />
              <line x1="0" x2="320" y1="140" y2="140" />
              <line x1="0" x2="320" y1="190" y2="190" />
              <line x1="0" x2="320" y1="240" y2="240" />

              <line x1="45" x2="45" y1="0" y2="300" />
              <line x1="105" x2="105" y1="0" y2="300" />
              <line x1="165" x2="165" y1="0" y2="300" />
              <line x1="225" x2="225" y1="0" y2="300" />
              <line x1="285" x2="285" y1="0" y2="300" />
            </g>

            {/* Dynamic EMA Glow Area */}
            <path
              d="M 10,240 Q 60,210 120,185 T 210,130 T 310,105 L 310,300 L 10,300 Z"
              fill="url(#bullGlow)"
            />

            {/* Fibonacci Levels if Active */}
            {activeTool === 'fib' && (
              <g opacity="0.6">
                <line x1="0" x2="320" y1="46" y2="46" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
                <text x="5" y="44" fill="#f59e0b" fontSize="8" fontFamily="monospace">1.0 (65,490)</text>
                <line x1="0" x2="320" y1="84" y2="84" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,2" />
                <text x="5" y="82" fill="#06b6d4" fontSize="8" fontFamily="monospace">0.618 (64,580)</text>
                <line x1="0" x2="320" y1="112" y2="112" stroke="#66dabf" strokeWidth="1" strokeDasharray="3,2" />
                <text x="5" y="110" fill="#66dabf" fontSize="8" fontFamily="monospace">0.5 (64,305)</text>
                <line x1="0" x2="320" y1="140" y2="140" stroke="#a855f7" strokeWidth="1" strokeDasharray="3,2" />
                <text x="5" y="138" fill="#a855f7" fontSize="8" fontFamily="monospace">0.382 (64,020)</text>
                <line x1="0" x2="320" y1="210" y2="210" stroke="#f23645" strokeWidth="1" strokeDasharray="3,2" />
                <text x="5" y="208" fill="#f23645" fontSize="8" fontFamily="monospace">0.0 (63,120)</text>
              </g>
            )}

            {/* Volume Histogram Bars (Docked to lower section: y=250 to 300) */}
            <g id="volume-bars">
              <rect x="8" y="278" width="8" height="22" fill="#089981" opacity="0.6" />
              <rect x="22" y="270" width="8" height="30" fill="#089981" opacity="0.6" />
              <rect x="36" y="284" width="8" height="16" fill="#f23645" opacity="0.6" />
              <rect x="50" y="265" width="8" height="35" fill="#089981" opacity="0.6" />
              <rect x="64" y="275" width="8" height="25" fill="#f23645" opacity="0.6" />
              <rect x="78" y="280" width="8" height="20" fill="#f23645" opacity="0.6" />
              <rect x="92" y="260" width="8" height="40" fill="#089981" opacity="0.6" />
              <rect x="106" y="268" width="8" height="32" fill="#089981" opacity="0.6" />
              <rect x="120" y="272" width="8" height="28" fill="#f23645" opacity="0.6" />
              <rect x="134" y="282" width="8" height="18" fill="#089981" opacity="0.6" />
              <rect x="148" y="255" width="8" height="45" fill="#089981" opacity="0.6" />
              <rect x="162" y="270" width="8" height="30" fill="#f23645" opacity="0.6" />
              <rect x="176" y="274" width="8" height="26" fill="#f23645" opacity="0.6" />
              <rect x="190" y="262" width="8" height="38" fill="#089981" opacity="0.6" />
              <rect x="204" y="258" width="8" height="42" fill="#089981" opacity="0.6" />
              <rect x="218" y="266" width="8" height="34" fill="#089981" opacity="0.6" />
              <rect x="232" y="278" width="8" height="22" fill="#f23645" opacity="0.6" />
              <rect x="246" y="264" width="8" height="36" fill="#089981" opacity="0.6" />
              <rect x="260" y="272" width="8" height="28" fill="#f23645" opacity="0.6" />
              <rect x="274" y="254" width="8" height="46" fill="#089981" opacity="0.6" />
              <rect x="288" y="250" width="8" height="50" fill="#089981" opacity="0.8" />
              <rect x="302" y="246" width="8" height="54" fill="#089981" opacity="0.9" />
            </g>

            {/* EMA Indicator Polyline Ribbons */}
            {indicators.ema200 && (
              <path
                d="M 0,265 C 50,260 110,250 170,240 C 230,230 280,222 320,215"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.85"
              />
            )}

            {indicators.ema50 && (
              <path
                d="M 0,245 C 60,230 130,205 190,175 C 240,150 285,135 320,128"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            )}

            {indicators.ema20 && (
              <path
                d="M 0,225 C 55,200 120,165 185,138 C 245,115 285,100 320,95"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}

            {/* User Custom Drawn Trendlines */}
            {userTrendlines.map((tl, idx) => (
              <line
                key={idx}
                x1={tl.x1}
                y1={tl.y1}
                x2={tl.x2}
                y2={tl.y2}
                stroke="#2962ff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}

            {drawingStart && (
              <circle cx={drawingStart.x} cy={drawingStart.y} r="4" fill="#2962ff" className="animate-ping" />
            )}

            {/* Candlesticks Array (22 Detailed Trading Bars with Wicks & Bodies) */}
            {chartType === 'candle' ? (
              <g id="candlestick-bars">
                {/* 1: Bullish */}
                <line x1="12" y1="210" x2="12" y2="250" stroke="#089981" strokeWidth="1.5" />
                <rect x="8.5" y="222" width="7" height="20" rx="0.5" fill="#089981" />

                {/* 2: Bullish */}
                <line x1="26" y1="205" x2="26" y2="240" stroke="#089981" strokeWidth="1.5" />
                <rect x="22.5" y="212" width="7" height="18" rx="0.5" fill="#089981" />

                {/* 3: Bearish */}
                <line x1="40" y1="208" x2="40" y2="236" stroke="#f23645" strokeWidth="1.5" />
                <rect x="36.5" y="215" width="7" height="15" rx="0.5" fill="#f23645" />

                {/* 4: Bullish Hammer */}
                <line x1="54" y1="190" x2="54" y2="238" stroke="#089981" strokeWidth="1.5" />
                <rect x="50.5" y="196" width="7" height="20" rx="0.5" fill="#089981" />

                {/* 5: Bearish Doji */}
                <line x1="68" y1="185" x2="68" y2="218" stroke="#f23645" strokeWidth="1.5" />
                <rect x="64.5" y="198" width="7" height="8" rx="0.5" fill="#f23645" />

                {/* 6: Bearish */}
                <line x1="82" y1="194" x2="82" y2="228" stroke="#f23645" strokeWidth="1.5" />
                <rect x="78.5" y="202" width="7" height="18" rx="0.5" fill="#f23645" />

                {/* 7: Strong Bullish Impulse */}
                <line x1="96" y1="165" x2="96" y2="215" stroke="#089981" strokeWidth="1.5" />
                <rect x="92.5" y="172" width="7" height="32" rx="0.5" fill="#089981" />

                {/* 8: Continuation Bull */}
                <line x1="110" y1="155" x2="110" y2="190" stroke="#089981" strokeWidth="1.5" />
                <rect x="106.5" y="162" width="7" height="22" rx="0.5" fill="#089981" />

                {/* 9: Bearish Pullback */}
                <line x1="124" y1="160" x2="124" y2="188" stroke="#f23645" strokeWidth="1.5" />
                <rect x="120.5" y="166" width="7" height="14" rx="0.5" fill="#f23645" />

                {/* 10: Spinning Top */}
                <line x1="138" y1="152" x2="138" y2="180" stroke="#089981" strokeWidth="1.5" />
                <rect x="134.5" y="162" width="7" height="8" rx="0.5" fill="#089981" />

                {/* 11: Expansion Bullish Bar */}
                <line x1="152" y1="128" x2="152" y2="175" stroke="#089981" strokeWidth="1.5" />
                <rect x="148.5" y="134" width="7" height="30" rx="0.5" fill="#089981" />

                {/* 12: Consolidation Bear */}
                <line x1="166" y1="132" x2="166" y2="162" stroke="#f23645" strokeWidth="1.5" />
                <rect x="162.5" y="138" width="7" height="12" rx="0.5" fill="#f23645" />

                {/* 13: Consolidation Pin */}
                <line x1="180" y1="130" x2="180" y2="158" stroke="#f23645" strokeWidth="1.5" />
                <rect x="176.5" y="139" width="7" height="9" rx="0.5" fill="#f23645" />

                {/* 14: Bullish Breakout */}
                <line x1="194" y1="110" x2="194" y2="150" stroke="#089981" strokeWidth="1.5" />
                <rect x="190.5" y="118" width="7" height="24" rx="0.5" fill="#089981" />

                {/* 15: Bullish Run */}
                <line x1="208" y1="98" x2="208" y2="132" stroke="#089981" strokeWidth="1.5" />
                <rect x="204.5" y="105" width="7" height="20" rx="0.5" fill="#089981" />

                {/* 16: Upward Continuation */}
                <line x1="222" y1="92" x2="222" y2="124" stroke="#089981" strokeWidth="1.5" />
                <rect x="218.5" y="99" width="7" height="18" rx="0.5" fill="#089981" />

                {/* 17: Bearish Wick Trap */}
                <line x1="236" y1="88" x2="236" y2="128" stroke="#f23645" strokeWidth="1.5" />
                <rect x="232.5" y="104" width="7" height="16" rx="0.5" fill="#f23645" />

                {/* 18: Bull Recovery */}
                <line x1="250" y1="90" x2="250" y2="125" stroke="#089981" strokeWidth="1.5" />
                <rect x="246.5" y="95" width="7" height="18" rx="0.5" fill="#089981" />

                {/* 19: Bearish Exhaustion */}
                <line x1="264" y1="85" x2="264" y2="116" stroke="#f23645" strokeWidth="1.5" />
                <rect x="260.5" y="94" width="7" height="12" rx="0.5" fill="#f23645" />

                {/* 20: Bullish Push */}
                <line x1="278" y1="68" x2="278" y2="108" stroke="#089981" strokeWidth="1.5" />
                <rect x="274.5" y="76" width="7" height="24" rx="0.5" fill="#089981" />

                {/* 21: High Test Wick */}
                <line x1="292" y1="52" x2="292" y2="92" stroke="#089981" strokeWidth="1.5" />
                <rect x="288.5" y="64" width="7" height="18" rx="0.5" fill="#089981" />

                {/* 22: Active Live Candlestick (dynamic tick) */}
                <line x1="306" y1="46" x2="306" y2="96" stroke="#089981" strokeWidth="1.5" />
                <rect
                  id="active-candle-body"
                  x="302.5"
                  y="60"
                  width="7"
                  height="24"
                  rx="0.5"
                  fill="#089981"
                  className={priceTick ? 'brightness-125' : ''}
                />
              </g>
            ) : chartType === 'line' ? (
              <path
                d="M 12,230 L 26,220 L 40,225 L 54,205 L 68,208 L 82,210 L 96,180 L 110,170 L 124,175 L 138,166 L 152,145 L 166,148 L 180,142 L 194,125 L 208,115 L 222,108 L 236,112 L 250,102 L 264,100 L 278,85 L 292,72 L 306,78"
                fill="none"
                stroke="#66dabf"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              /* Area Chart */
              <g>
                <path
                  d="M 12,230 L 26,220 L 40,225 L 54,205 L 68,208 L 82,210 L 96,180 L 110,170 L 124,175 L 138,166 L 152,145 L 166,148 L 180,142 L 194,125 L 208,115 L 222,108 L 236,112 L 250,102 L 264,100 L 278,85 L 292,72 L 306,78 L 306,300 L 12,300 Z"
                  fill="url(#bullGlow)"
                />
                <path
                  d="M 12,230 L 26,220 L 40,225 L 54,205 L 68,208 L 82,210 L 96,180 L 110,170 L 124,175 L 138,166 L 152,145 L 166,148 L 180,142 L 194,125 L 208,115 L 222,108 L 236,112 L 250,102 L 264,100 L 278,85 L 292,72 L 306,78"
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Current Price Dashed Crosshair Track Line */}
            <line
              x1="0"
              y1="78"
              x2="320"
              y2="78"
              stroke="#089981"
              strokeWidth="1.2"
              strokeDasharray="3,3"
              opacity="0.9"
            />

            {/* Live Execution Ping Beacon */}
            <circle cx="306" cy="78" r="3.5" fill="#089981">
              <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Dynamic Interactive Crosshair following Pointer */}
            {crosshairPos && activeTool === 'crosshair' && (
              <g pointerEvents="none">
                <line
                  x1={crosshairPos.x}
                  y1="0"
                  x2={crosshairPos.x}
                  y2="380"
                  stroke="#8d90a2"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                  opacity="0.75"
                />
                <line
                  x1="0"
                  y1={crosshairPos.y}
                  x2="320"
                  y2={crosshairPos.y}
                  stroke="#8d90a2"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                  opacity="0.75"
                />
                <circle cx={crosshairPos.x} cy={crosshairPos.y} r="3" fill="#2962ff" />
              </g>
            )}
          </svg>

          {/* Watermark TV Branding */}
          <div className="absolute right-4 bottom-20 pointer-events-none opacity-5 font-bold text-[32px] tracking-widest text-[#dfe2f2]">
            TRADINGVIEW
          </div>
        </div>

        {/* Right-Hand Price Scale Ladder (Y-Axis) */}
        <div className="w-16 h-full bg-[#1b1f2b] flex flex-col justify-between py-1 relative text-[10px] font-mono text-[#8d90a2] select-none shrink-0 border-l border-[#262a35]">
          <div className="px-1 text-right">66,500</div>
          <div className="px-1 text-right">65,800</div>
          <div className="px-1 text-right">65,100</div>

          {/* Floating Dynamic Price Tag docked on Right Edge */}
          <div className="absolute right-0 top-[67px] z-30 bg-[#089981] text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-l shadow-lg flex items-center gap-0.5 animate-pulse">
            <span>
              {livePrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="px-1 text-right">64,400</div>
          <div className="px-1 text-right">63,700</div>
          <div className="px-1 text-right">63,000</div>
          <div className="px-1 text-right">62,300</div>
          <div className="px-1 text-right">61,600</div>
          <div className="px-1 text-right">60,900</div>

          {/* Live countdown to candle close */}
          <div className="px-1 text-right text-[9px] text-[#c3c5d8] font-mono mt-auto border-t border-[#262a35] pt-0.5">
            14:28:02
          </div>
        </div>
      </div>

      {/* Bottom Indicator Oscillator Panel: RSI (14) */}
      {indicators.rsi && (
        <div className="w-full bg-[#171b26] px-3 py-1.5 flex flex-col gap-1 border-t border-b border-[#262a35]">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#dfe2f2]">RSI (14, Close)</span>
              <span className="text-[#b6c4ff] font-bold">58.42</span>
              <span className="text-[#8d90a2] text-[10px]">MA(14): 54.10</span>
            </div>
            <div className="flex items-center gap-2 text-[#8d90a2] text-[10px]">
              <span>Upper: 70</span>
              <span>Lower: 30</span>
              <button
                onClick={onOpenIndicatorsModal}
                className="w-4 h-4 flex items-center justify-center text-[#8d90a2] hover:text-[#dfe2f2]"
              >
                <span className="material-symbols-outlined text-[13px]">settings</span>
              </button>
            </div>
          </div>

          {/* RSI Visual Wave Mini-Canvas */}
          <div className="relative w-full h-11 bg-[#0a0e19] rounded overflow-hidden border border-[#262a35]/60">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 360 44">
              <rect x="0" y="8" width="360" height="24" fill="#a855f7" fillOpacity="0.08" />
              <line x1="0" y1="8" x2="360" y2="8" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.4" />
              <line x1="0" y1="32" x2="360" y2="32" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.4" />
              <line x1="0" y1="20" x2="360" y2="20" stroke="#8d90a2" strokeWidth="0.5" strokeDasharray="1,3" opacity="0.25" />

              {/* RSI Line Stream */}
              <path
                d="M 0,28 Q 30,34 60,30 T 120,24 T 180,26 T 240,16 T 300,18 T 360,14"
                fill="none"
                stroke="#b6c4ff"
                strokeWidth="1.8"
              />
              {/* Moving Average Overlay */}
              <path
                d="M 0,30 Q 50,32 100,28 T 200,25 T 300,20 T 360,18"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2,1"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Live Order Book & Depth Ladder */}
      <OrderBook
        item={item}
        livePrice={livePrice}
        onSelectPrice={(price, side) => onOpenOrderModal(side, price)}
      />

      {/* Bottom Order Book Glance & Spread Tracker */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0f131e] text-[11px] font-mono border-b border-[#1b1f2b]">
        <div className="flex items-center gap-2">
          <span className="text-[#8d90a2]">Spread:</span>
          <span className="text-[#dfe2f2] font-semibold">
            {spreadDelta.toFixed(item.decimals === 4 ? 4 : 2)} (0.004%)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f23645]" />
            <span className="text-[#f23645] font-semibold">48.2%</span>
          </div>
          <div className="w-16 h-1.5 rounded-full bg-[#313441] overflow-hidden flex">
            <div className="h-full bg-[#f23645]" style={{ width: '48.2%' }} />
            <div className="h-full bg-[#089981]" style={{ width: '51.8%' }} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#089981] font-semibold">51.8%</span>
            <span className="w-2 h-2 rounded-full bg-[#089981]" />
          </div>
        </div>
      </div>

      {/* High-Velocity Instant Order Execution Cockpit (Dual Action Buttons) */}
      <div className="px-3 pt-2 pb-3 bg-[#0f131e] flex flex-col gap-1.5 border-t border-[#1b1f2b]">
        <div className="grid grid-cols-2 gap-2">
          {/* Short / Sell Action */}
          <button
            onClick={() => onOpenOrderModal('sell', bidPrice)}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-lg bg-[#f23645] hover:opacity-95 active:scale-[0.98] transition-all text-white shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
              <span className="font-bold text-[16px] tracking-tight">Sell / Short</span>
            </div>
            <span className="font-mono text-[13px] font-bold mt-0.5 tracking-tight text-white/95">
              {bidPrice.toLocaleString('en-US', {
                minimumFractionDigits: item.decimals,
                maximumFractionDigits: item.decimals,
              })}
            </span>
          </button>

          {/* Long / Buy Action */}
          <button
            onClick={() => onOpenOrderModal('buy', askPrice)}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-lg bg-[#089981] hover:opacity-95 active:scale-[0.98] transition-all text-white shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
              <span className="font-bold text-[16px] tracking-tight">Buy / Long</span>
            </div>
            <span className="font-mono text-[13px] font-bold mt-0.5 tracking-tight text-white/95">
              {askPrice.toLocaleString('en-US', {
                minimumFractionDigits: item.decimals,
                maximumFractionDigits: item.decimals,
              })}
            </span>
          </button>
        </div>

        {/* Quick Lot / Size Step Row */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-[#8d90a2] pt-0.5">
          <div className="flex items-center gap-1">
            <span>Leverage:</span>
            <span
              onClick={() => showToast('Leverage settings: 20x Cross active')}
              className="px-1.5 py-0.5 rounded bg-[#1b1f2b] border border-[#262a35] font-bold text-[#b6c4ff] cursor-pointer hover:border-[#b6c4ff]/50"
            >
              20x Cross
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {['25%', '50%', '75%', 'Max'].map((pct) => (
              <span
                key={pct}
                onClick={() => setSelectedPercentage(pct)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  selectedPercentage === pct
                    ? 'bg-[#313441] text-[#dfe2f2] font-bold border border-[#434656]'
                    : 'bg-[#1b1f2b] hover:text-[#dfe2f2] border border-[#262a35]'
                }`}
              >
                {pct}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
