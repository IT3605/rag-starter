import React, { useState } from 'react';

interface IdeasViewProps {
  onSelectSymbolForChart: (symbol: string) => void;
  onTradeSetup?: (symbol: string, side: 'buy' | 'sell', price: number) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({
  onSelectSymbolForChart,
  onTradeSetup,
}) => {
  const [activeCategory, setActiveCategory] = useState<'trending' | 'picks' | 'following'>('trending');
  const [followedAuthors, setFollowedAuthors] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState({ btc: 1420, nvda: 890 });
  const [liked, setLiked] = useState({ btc: false, nvda: false });
  const [saved, setSaved] = useState({ btc: false, nvda: false });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [publishSymbol, setPublishSymbol] = useState('BTCUSDT');
  const [publishOutlook, setPublishOutlook] = useState<'LONG' | 'SHORT' | 'NEUTRAL'>('LONG');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const toggleFollow = (author: string) => {
    const isNow = !followedAuthors[author];
    setFollowedAuthors({ ...followedAuthors, [author]: isNow });
    showToast(isNow ? `Followed ${author}` : `Unfollowed ${author}`);
  };

  const toggleLike = (key: 'btc' | 'nvda') => {
    const isNow = !liked[key];
    setLiked({ ...liked, [key]: isNow });
    setLikesCount({
      ...likesCount,
      [key]: likesCount[key] + (isNow ? 1 : -1),
    });
  };

  const toggleBookmark = (key: 'btc' | 'nvda') => {
    const isNow = !saved[key];
    setSaved({ ...saved, [key]: isNow });
    showToast(isNow ? 'Idea bookmarked' : 'Bookmark removed');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishTitle) return;
    setIsPublishModalOpen(false);
    showToast(`Published: "${publishTitle}" on ${publishSymbol}`);
    setPublishTitle('');
  };

  return (
    <div className="flex flex-col w-full select-none pb-28 bg-[#0f131e] px-3 pt-3">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2962ff] text-white text-[12px] font-medium px-4 py-2 rounded-lg shadow-2xl animate-fade-in flex items-center gap-1.5 border border-white/20">
          <span className="material-symbols-outlined text-[16px]">info</span>
          {toastMessage}
        </div>
      )}

      {/* Top Live Stream Banner */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3 flex items-center justify-between shadow-md mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#262a35] shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Streamer"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#f23645] ring-2 ring-[#171b26]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <span className="flex items-center gap-0.5 text-[#f23645] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f23645] animate-pulse" />
                LIVE
              </span>
              <span className="text-[#8d90a2] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">visibility</span>
                3.2K
              </span>
            </div>
            <h4 className="font-bold text-[12px] text-[#dfe2f2] leading-tight mt-0.5">
              Daily Market Open with John Doe
            </h4>
            <span className="text-[10px] text-[#8d90a2] truncate max-w-[190px]">
              CPI breakdown & breakout setup scans
            </span>
          </div>
        </div>

        <button
          onClick={() => showToast('Connecting to audio room: Daily Market Open...')}
          className="px-3 py-1.5 bg-[#2962ff] hover:bg-[#2962ff]/90 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors shadow shrink-0"
        >
          <span>Tune in</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveCategory('trending')}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1 transition-colors border ${
            activeCategory === 'trending'
              ? 'bg-[#1b1f2b] border-[#2962ff] text-[#dfe2f2] font-semibold'
              : 'bg-[#171b26] border-[#262a35] text-[#8d90a2] hover:text-[#dfe2f2]'
          }`}
        >
          <span className="text-[#f59e0b]">🔥</span>
          <span>Trending Ideas</span>
        </button>

        <button
          onClick={() => setActiveCategory('picks')}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1 transition-colors border ${
            activeCategory === 'picks'
              ? 'bg-[#1b1f2b] border-[#2962ff] text-[#dfe2f2] font-semibold'
              : 'bg-[#171b26] border-[#262a35] text-[#8d90a2] hover:text-[#dfe2f2]'
          }`}
        >
          <span>Editors&apos; Picks</span>
        </button>

        <button
          onClick={() => setActiveCategory('following')}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1 transition-colors border ${
            activeCategory === 'following'
              ? 'bg-[#1b1f2b] border-[#2962ff] text-[#dfe2f2] font-semibold'
              : 'bg-[#171b26] border-[#262a35] text-[#8d90a2] hover:text-[#dfe2f2]'
          }`}
        >
          <span>My Following</span>
        </button>
      </div>

      {/* Idea Feed */}
      <div className="flex flex-col gap-3.5">
        {/* CARD 1: CryptoWizard_Pro (BTC Bull Flag) */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2.5 shadow-md">
          {/* Author Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2962ff]/20 border border-[#2962ff] flex items-center justify-center font-bold text-[12px] text-[#2962ff]">
                CW
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[12px] text-[#dfe2f2]">CryptoWizard_Pro</span>
                  <span className="material-symbols-outlined text-[14px] text-[#2962ff]">check_circle</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#2962ff] text-white font-mono font-bold">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-[#8d90a2] font-mono">2h ago • Updated</span>
              </div>
            </div>

            <button
              onClick={() => toggleFollow('CryptoWizard_Pro')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors border ${
                followedAuthors['CryptoWizard_Pro']
                  ? 'bg-[#262a35] text-[#dfe2f2] border-[#434656]'
                  : 'bg-[#1b1f2b] hover:bg-[#262a35] text-[#b6c4ff] border-[#262a35]'
              }`}
            >
              {followedAuthors['CryptoWizard_Pro'] ? 'Following' : '+ Follow'}
            </button>
          </div>

          {/* Symbol Tag */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span
              onClick={() => onSelectSymbolForChart('BTCUSDT')}
              className="text-[#089981] font-bold cursor-pointer hover:underline flex items-center gap-1"
            >
              <span>↗ BTCUSDT</span>
              <span>•</span>
              <span>LONG</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#262a35] text-[#8d90a2]">
              4H
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[15px] text-[#dfe2f2] leading-snug">
            Bitcoin Breaking 65k Bull Flag Confirmation! Target 72k
          </h3>

          {/* Annotated Technical Chart Card */}
          <div className="bg-[#0a0e19] border border-[#262a35] rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden">
            {/* Top Bar of Chart */}
            <div className="flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#089981]/20 text-[#089981] font-bold">
                  LONG
                </span>
                <span className="text-[#8d90a2]">
                  Entry: <strong className="text-[#dfe2f2]">64,820</strong>
                </span>
                <span className="text-[#089981]">
                  TP: <strong className="text-[#089981]">72,400</strong>
                </span>
                <span className="text-[#f23645]">
                  SL: <strong className="text-[#f23645]">63,100</strong>
                </span>
              </div>
              <button
                onClick={() => onSelectSymbolForChart('BTCUSDT')}
                className="text-[#8d90a2] hover:text-[#dfe2f2]"
                title="Expand chart"
              >
                <span className="material-symbols-outlined text-[15px]">fullscreen</span>
              </button>
            </div>

            {/* SVG Chart Preview */}
            <div className="w-full h-32 relative">
              <svg viewBox="0 0 320 120" className="w-full h-full" preserveAspectRatio="none">
                {/* Horizontal price dashed lines */}
                <line x1="0" x2="320" y1="20" y2="20" stroke="#089981" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                <text x="250" y="16" fill="#089981" fontSize="8" fontFamily="monospace">72,400 (+11.7%)</text>

                <line x1="0" x2="320" y1="100" y2="100" stroke="#f23645" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                <text x="210" y="112" fill="#f23645" fontSize="8" fontFamily="monospace">STOP 63,100 (-2.6%)</text>

                {/* EMA ribbon */}
                <path d="M 0,95 Q 120,80 200,65 T 320,50" fill="none" stroke="#a855f7" strokeWidth="1.2" opacity="0.7" />

                {/* Candles sequence */}
                <line x1="30" y1="70" x2="30" y2="100" stroke="#089981" strokeWidth="1.5" />
                <rect x="27" y="75" width="6" height="20" fill="#089981" rx="0.5" />

                <line x1="48" y1="65" x2="48" y2="92" stroke="#f23645" strokeWidth="1.5" />
                <rect x="45" y="70" width="6" height="15" fill="#f23645" rx="0.5" />

                <line x1="66" y1="68" x2="66" y2="95" stroke="#089981" strokeWidth="1.5" />
                <rect x="63" y="72" width="6" height="16" fill="#089981" rx="0.5" />

                <line x1="84" y1="74" x2="84" y2="98" stroke="#f23645" strokeWidth="1.5" />
                <rect x="81" y="78" width="6" height="14" fill="#f23645" rx="0.5" />

                <line x1="102" y1="72" x2="102" y2="95" stroke="#f23645" strokeWidth="1.5" />
                <rect x="99" y="76" width="6" height="12" fill="#f23645" rx="0.5" />

                <line x1="120" y1="70" x2="120" y2="90" stroke="#089981" strokeWidth="1.5" />
                <rect x="117" y="74" width="6" height="12" fill="#089981" rx="0.5" />

                <line x1="138" y1="65" x2="138" y2="88" stroke="#089981" strokeWidth="1.5" />
                <rect x="135" y="68" width="6" height="15" fill="#089981" rx="0.5" />

                {/* Breakout Candle */}
                <line x1="156" y1="52" x2="156" y2="82" stroke="#089981" strokeWidth="1.5" />
                <rect x="153" y="56" width="6" height="22" fill="#089981" rx="0.5" />

                {/* Target Projection Vector Arrow */}
                <path
                  d="M 160,55 Q 220,35 280,22"
                  fill="none"
                  stroke="#66dabf"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4,3"
                />
                <polygon points="282,21 274,18 276,27" fill="#66dabf" />
              </svg>
            </div>

            {/* Bottom Metrics */}
            <div className="flex items-center justify-between pt-1 border-t border-[#262a35] text-[10px] font-mono">
              <span className="text-[#dfe2f2]">
                R:R Ratio <strong className="text-[#089981] font-bold">4.46</strong>
              </span>
              <span className="text-[#089981] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                Validated setup
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[12px] text-[#c3c5d8] leading-relaxed">
            After breaking out of the high time frame bull pennant on surging spot volume, BTC printed a clean retest of the $64,200 support flip. Looking for expansion into 72k.
          </p>

          {/* Card Social Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#262a35] text-[11px] font-mono text-[#8d90a2]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike('btc')}
                className={`flex items-center gap-1 transition-colors ${
                  liked.btc ? 'text-[#089981]' : 'hover:text-[#dfe2f2]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                <span>{likesCount.btc.toLocaleString()}</span>
              </button>

              <button
                onClick={() => showToast('Opening 384 comments...')}
                className="flex items-center gap-1 hover:text-[#dfe2f2] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                <span>384</span>
              </button>

              <button
                onClick={() => showToast('Copied setup link')}
                className="flex items-center gap-1 hover:text-[#dfe2f2] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>92</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark('btc')}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                  saved.btc ? 'text-[#f59e0b]' : 'hover:text-[#dfe2f2]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">bookmark</span>
              </button>

              {onTradeSetup && (
                <button
                  onClick={() => onTradeSetup('BTCUSDT', 'buy', 64820)}
                  className="px-2.5 py-1 bg-[#2962ff] text-white text-[11px] font-semibold rounded hover:bg-[#2962ff]/90 transition-colors shadow"
                >
                  Copy Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: AlphaWaveTrader (NVDA Double Top) */}
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-3.5 flex flex-col gap-2.5 shadow-md">
          {/* Author Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ec4899]/20 border border-[#ec4899] flex items-center justify-center font-bold text-[12px] text-[#ec4899]">
                AW
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[12px] text-[#dfe2f2]">AlphaWaveTrader</span>
                  <span className="material-symbols-outlined text-[14px] text-[#f59e0b]">stars</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#089981] text-white font-mono font-bold">
                    PREM
                  </span>
                </div>
                <span className="text-[10px] text-[#8d90a2] font-mono">4h ago • NASDAQ</span>
              </div>
            </div>

            <button
              onClick={() => toggleFollow('AlphaWaveTrader')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors border ${
                followedAuthors['AlphaWaveTrader']
                  ? 'bg-[#262a35] text-[#dfe2f2] border-[#434656]'
                  : 'bg-[#1b1f2b] hover:bg-[#262a35] text-[#b6c4ff] border-[#262a35]'
              }`}
            >
              {followedAuthors['AlphaWaveTrader'] ? 'Following' : '+ Follow'}
            </button>
          </div>

          {/* Symbol Tag */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span
              onClick={() => onSelectSymbolForChart('NVDA')}
              className="text-[#8d90a2] font-bold cursor-pointer hover:underline flex items-center gap-1"
            >
              <span>⇄ NVDA</span>
              <span>•</span>
              <span>NEUTRAL</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#262a35] text-[#8d90a2]">
              1D
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f23645]/20 text-[#f23645] font-bold">
              Earnings in 3d
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[15px] text-[#dfe2f2] leading-snug">
            NVDA Double Top or Continuation before Earnings?
          </h3>

          {/* Annotated Chart Card */}
          <div className="bg-[#0a0e19] border border-[#262a35] rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#f23645] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                Bearish RSI Div (D1)
              </span>
              <span className="text-[#8d90a2]">Target Retest: $118</span>
            </div>

            {/* SVG Visual */}
            <div className="w-full h-28 relative">
              <svg viewBox="0 0 320 100" className="w-full h-full" preserveAspectRatio="none">
                {/* Double Top Price Line */}
                <path
                  d="M 20,80 L 80,30 L 130,55 L 180,30 L 260,85"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="80" cy="30" r="4" fill="#f23645" />
                <text x="60" y="22" fill="#8d90a2" fontSize="7" fontFamily="monospace">Peak 1 ($136.30)</text>
                <circle cx="180" cy="30" r="4" fill="#f23645" />
                <text x="160" y="22" fill="#8d90a2" fontSize="7" fontFamily="monospace">Peak 2 ($136.10)</text>

                {/* Neckline */}
                <line x1="60" x2="280" y1="55" y2="55" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
                <text x="240" y="52" fill="#f59e0b" fontSize="7" fontFamily="monospace">Neckline $118</text>

                {/* Breakdown Vector */}
                <path d="M 180,30 L 260,85" stroke="#f23645" strokeWidth="2.5" strokeDasharray="3,3" />

                {/* RSI Mini Wave */}
                <path d="M 20,95 Q 80,75 130,85 T 180,82 T 260,95" fill="none" stroke="#66dabf" strokeWidth="1.5" />
                <text x="20" y="90" fill="#66dabf" fontSize="7" fontFamily="monospace">RSI Lower High (Div)</text>
              </svg>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#262a35] text-[10px] font-mono">
              <span className="text-[#8d90a2]">
                IV Rank: <strong className="text-[#dfe2f2]">78.4% • High Vol</strong>
              </span>
              <span className="text-[#b6c4ff]">
                Straddle Pricing: <strong>±8.2%</strong>
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[12px] text-[#c3c5d8] leading-relaxed">
            NVIDIA is testing the $136 all-time high zone for the second time in 3 weeks, but daily RSI is failing to confirm new highs. Caution is advised heading into the event.
          </p>

          {/* Card Social Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#262a35] text-[11px] font-mono text-[#8d90a2]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike('nvda')}
                className={`flex items-center gap-1 transition-colors ${
                  liked.nvda ? 'text-[#089981]' : 'hover:text-[#dfe2f2]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                <span>{likesCount.nvda.toLocaleString()}</span>
              </button>

              <button
                onClick={() => showToast('Opening 156 comments...')}
                className="flex items-center gap-1 hover:text-[#dfe2f2] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                <span>156</span>
              </button>

              <button
                onClick={() => showToast('Copied setup link')}
                className="flex items-center gap-1 hover:text-[#dfe2f2] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>41</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark('nvda')}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                  saved.nvda ? 'text-[#f59e0b]' : 'hover:text-[#dfe2f2]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">bookmark</span>
              </button>

              {onTradeSetup && (
                <button
                  onClick={() => onTradeSetup('NVDA', 'sell', 128.40)}
                  className="px-2.5 py-1 bg-[#262a35] hover:bg-[#313441] text-[#dfe2f2] text-[11px] font-semibold rounded transition-colors"
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Publish Idea Trigger Banner */}
      <div className="mt-4 p-3.5 bg-[#171b26] border border-[#262a35] rounded-xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#2962ff]/20 text-[#2962ff] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[12px] text-[#dfe2f2]">Have a market outlook?</span>
            <span className="text-[10px] text-[#8d90a2] truncate max-w-[200px]">
              Publish your annotated chart and build your trading reputation
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-3.5 py-2 bg-[#2962ff] hover:bg-[#2962ff]/90 text-white text-[12px] font-bold rounded-lg shadow-lg flex items-center gap-1 shrink-0 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Publish Idea</span>
        </button>
      </div>

      {/* Publish Idea Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 animate-fade-in">
          <div
            className="w-full max-w-md bg-[#171b26] border border-[#262a35] rounded-2xl p-4 flex flex-col gap-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#262a35] pb-2">
              <h3 className="font-bold text-[15px] text-[#dfe2f2]">Publish Trading Idea</h3>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="w-7 h-7 rounded flex items-center justify-center text-[#8d90a2] hover:text-[#dfe2f2]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handlePublish} className="flex flex-col gap-3 font-mono text-[11px]">
              <div className="flex flex-col gap-1">
                <label className="text-[#8d90a2]">Symbol</label>
                <input
                  type="text"
                  value={publishSymbol}
                  onChange={(e) => setPublishSymbol(e.target.value.toUpperCase())}
                  className="bg-[#0a0e19] border border-[#262a35] rounded-lg px-3 py-1.5 text-[#dfe2f2] focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#8d90a2]">Market Direction</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LONG', 'SHORT', 'NEUTRAL'] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setPublishOutlook(dir)}
                      className={`py-1.5 rounded text-[11px] font-bold border transition-colors ${
                        publishOutlook === dir
                          ? dir === 'LONG'
                            ? 'bg-[#089981] text-white border-[#089981]'
                            : dir === 'SHORT'
                            ? 'bg-[#f23645] text-white border-[#f23645]'
                            : 'bg-[#2962ff] text-white border-[#2962ff]'
                          : 'bg-[#0a0e19] text-[#8d90a2] border-[#262a35]'
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#8d90a2]">Idea Title & Analysis Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the technical setup, breakout pattern, indicators, and risk management..."
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  className="bg-[#0a0e19] border border-[#262a35] rounded-lg p-2.5 text-[#dfe2f2] focus:outline-none focus:border-[#2962ff] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#2962ff] text-white font-bold rounded-lg hover:bg-[#2962ff]/90 transition-colors shadow mt-1"
              >
                Submit Idea to Community
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
