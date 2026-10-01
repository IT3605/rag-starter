import React from 'react';

interface FooterProps {
  serviceNo: string;
  onOpenFeedback: () => void;
  onOpenFares: () => void;
  onOpenSystemAlerts: () => void;
  onOpenLostProperty: () => void;
  onOpenAccessibility: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  serviceNo,
  onOpenFeedback,
  onOpenFares,
  onOpenSystemAlerts,
  onOpenLostProperty,
  onOpenAccessibility,
}) => {
  return (
    <>
      {/* Route Statistics & Frequently Traveled Links Section */}
      <section className="w-full bg-white border-t border-[#e3e1eb]/60 py-space-2xl px-margin mt-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-[#5c0088] font-headline-sm font-bold">
                <span className="material-symbols-outlined">analytics</span>
                <span>Real-Time Reliability</span>
              </div>
              <p className="font-body-sm text-[#64748B] leading-relaxed">
                SBS Transit operates Service {serviceNo} under the Bus Contracting Model (BCM) with strict On-Time Adherence (EWT: Excess Wait Time &lt; 1.2 mins).
              </p>
            </div>

            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-[#5c0088] font-headline-sm font-bold">
                <span className="material-symbols-outlined">devices</span>
                <span>Live Data Integrity</span>
              </div>
              <p className="font-body-sm text-[#64748B] leading-relaxed">
                Passenger capacity sensors calibrate vehicle weights to deliver 3-tier occupancy data directly to commuter screens every 15 seconds.
              </p>
            </div>

            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-[#5c0088] font-headline-sm font-bold">
                <span className="material-symbols-outlined">support_agent</span>
                <span>Need Route Assistance?</span>
              </div>
              <p className="font-body-sm text-[#64748B] leading-relaxed">
                Encountering delays or lost items on Bus {serviceNo}? Contact SBS Transit Command Centre at{' '}
                <a href="tel:18002872727" className="font-semibold text-[#1a1b22] hover:text-[#5c0088]">
                  1800-287-2727
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Corporate Footer */}
      <footer className="w-full bg-[#f4f2fd] py-space-2xl border-t border-[#e3e1eb]/60">
        <div className="w-full px-margin flex flex-col gap-space-xl max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl">
            {/* Col 1 */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[#5c0088] text-[24px]">directions_bus</span>
                <span className="font-headline-sm text-[#5c0088] font-bold">SBS Transit Ltd</span>
              </div>
              <p className="font-body-sm text-[#4e4352] leading-relaxed">
                A member of ComfortDelGro, delivering safe, reliable, and comfortable journeys across Singapore's bus and rail networks.
              </p>
              <div className="flex items-center gap-space-xs text-[#64748B] pt-space-xs">
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span className="font-label-md text-[#1a1b22] font-semibold">Hotline: 1800-287 2727</span>
              </div>
              <span className="font-body-sm text-[#64748B]">(Toll-free daily 7:30am - 8:00pm)</span>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-space-sm">
              <h4 className="font-label-md uppercase tracking-wider text-[#1a1b22] font-semibold">
                Commuter Services
              </h4>
              <ul className="flex flex-col gap-space-xs font-body-sm text-[#4e4352]">
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#5c0088] transition-colors text-left cursor-pointer">
                    Real-Time Bus Arrivals
                  </button>
                </li>
                <li>
                  <button onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })} className="hover:text-[#5c0088] transition-colors text-left cursor-pointer">
                    Service Route Directory
                  </button>
                </li>
                <li>
                  <button onClick={onOpenSystemAlerts} className="hover:text-[#5c0088] transition-colors text-left cursor-pointer">
                    First & Last Train Timings
                  </button>
                </li>
                <li>
                  <button onClick={onOpenFares} className="hover:text-[#5c0088] transition-colors text-left cursor-pointer">
                    TransitLink Fare Calculator
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-space-sm">
              <h4 className="font-label-md uppercase tracking-wider text-[#1a1b22] font-semibold">
                Digital Transit Ecosystem
              </h4>
              <p className="font-body-sm text-[#4e4352] leading-relaxed">
                Dynamic bus times, passenger load indicators, and route schedules are powered by the Land Transport Authority (LTA) DataMall API integration.
              </p>
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className="font-label-sm text-[#1a1b22] font-semibold">Official Transport Apps</span>
                <div className="flex gap-space-sm items-center">
                  <a href="https://www.lta.gov.sg" target="_blank" rel="noopener noreferrer" className="font-body-sm text-[#5c0088] hover:underline cursor-pointer">
                    MyTransport.SG
                  </a>
                  <span className="text-[#d1c2d4] font-body-sm">•</span>
                  <a href="https://simplygo.com.sg" target="_blank" rel="noopener noreferrer" className="font-body-sm text-[#5c0088] hover:underline cursor-pointer">
                    SimplyGo
                  </a>
                </div>
              </div>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col gap-space-sm">
              <h4 className="font-label-md uppercase tracking-wider text-[#1a1b22] font-semibold">
                Assistance & Regulatory
              </h4>
              <ul className="flex flex-col gap-space-xs font-body-sm text-[#4e4352]">
                <li>
                  <button onClick={onOpenFeedback} className="hover:text-[#5c0088] transition-colors text-left cursor-pointer">
                    Submit Commuter Feedback
                  </button>
                </li>
                <li>
                  <button onClick={onOpenLostProperty} className="hover:text-[#5c0088] transition-colors text-left cursor-pointer">
                    Lost Property Office
                  </button>
                </li>
                <li>
                  <button onClick={onOpenAccessibility} className="hover:text-[#5c0088] transition-colors text-left cursor-pointer">
                    Wheelchair Accessible Buses
                  </button>
                </li>
                <li>
                  <button onClick={onOpenSystemAlerts} className="hover:text-[#5c0088] transition-colors text-left cursor-pointer">
                    Emergency Advisories
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md pt-space-lg border-t border-[#e3e1eb]/60">
            <p className="font-body-sm text-[#4e4352]">
              © 2024 SBS Transit Ltd (Co. Reg. No.: 199206653M). All rights reserved. Operating under Public Transport Council regulatory licenses.
            </p>
            <div className="flex items-center gap-space-lg font-body-sm text-[#4e4352]">
              <span className="hover:text-[#1a1b22] transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#1a1b22] transition-colors cursor-pointer">Terms of Use</span>
              <span className="hover:text-[#1a1b22] transition-colors cursor-pointer">Sitemap</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
