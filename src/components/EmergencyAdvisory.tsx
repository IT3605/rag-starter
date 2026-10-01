import React from 'react';
import { Language, TRANSLATIONS } from '../data/translations';

interface EmergencyAdvisoryProps {
  currentLang: Language;
  onOpenDetails: () => void;
  serviceNo: string;
}

export const EmergencyAdvisory: React.FC<EmergencyAdvisoryProps> = ({
  currentLang,
  onOpenDetails,
  serviceNo,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section className="w-full bg-[#F5A623]/10 px-margin py-space-sm border-b border-[#F5A623]/20">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm min-w-0">
          <span
            className="material-symbols-outlined text-[#F5A623] text-[20px] shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          <div className="min-w-0">
            <p className="font-body-sm text-[#1a1b22]">
              <span className="font-label-sm font-bold uppercase tracking-wider text-[#F5A623] bg-white px-space-xs py-space-2xs rounded mr-space-xs shadow-sm inline-block">
                {t.diversionPrefix}
              </span>
              <span>
                {currentLang === 'zh'
                  ? `配合牛车水文化长跑，${serviceNo} 号巴士将于 10 月 12 日（周日）上午 06:00 - 10:00 暂不停靠 `
                  : currentLang === 'ta'
                  ? `சைனாடவுன் ஓட்டப்பந்தயத்திற்காக ஞாயிறு அக் 12, காலை 06:00 முதல் 10:00 வரை பேருந்து ${serviceNo} நிறுத்தம் `
                  : `Service ${serviceNo} will skip bus stop `}
              </span>
              <span className="font-semibold text-[#5c0088]">
                05019 (Chinatown Stn Exit E)
              </span>
              <span>
                {currentLang === 'zh'
                  ? `。`
                  : currentLang === 'ta'
                  ? ` தவிர்க்கப்படும்.`
                  : ` on Sun 12 Oct, 06:00 - 10:00 for the Chinatown Heritage Run.`}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={onOpenDetails}
          className="shrink-0 font-label-sm text-[#5c0088] hover:underline flex items-center gap-space-2xs cursor-pointer focus:outline-none"
        >
          <span>{t.details}</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </section>
  );
};
