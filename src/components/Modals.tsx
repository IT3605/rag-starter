import React, { useState } from 'react';
import { BusService, SYSTEM_ALERTS, BUS_SERVICES } from '../data/busServices';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. System Alerts Modal
export const SystemAlertsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D9381E] text-2xl">warning</span>
            <h3 className="font-headline-sm font-bold text-slate-900">SBS Transit Live Network Advisories</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {SYSTEM_ALERTS.map((alert) => (
            <div key={alert.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-sm">{alert.line}</span>
                <span className={`text-[11px] font-bold text-white px-2 py-0.5 rounded-full ${alert.badgeColor}`}>
                  {alert.type}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{alert.details}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Synced with LTA Operations Control Centre</span>
          <button
            onClick={onClose}
            className="bg-[#5c0088] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a1cac] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Diversion Modal
export const DiversionModal: React.FC<ModalProps & { serviceNo: string }> = ({
  isOpen,
  onClose,
  serviceNo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F5A623] text-2xl">alt_route</span>
            <h3 className="font-headline-sm font-bold text-slate-900">Service {serviceNo} Diversion Notice</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
            <h4 className="font-bold text-amber-900 text-sm">Chinatown Heritage Run 2026</h4>
            <p className="text-xs text-amber-800 mt-1">
              Sunday, 12 Oct 2026 • 06:00 to 10:00 SGT
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <p>
              Due to road closures for the annual Chinatown Heritage Run, Service {serviceNo} will temporarily skip the following bus stop:
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-900 font-bold">
              • Stop 05019 - Chinatown Stn Exit E (Eu Tong Sen St)
            </div>
            <p className="font-semibold text-slate-800 pt-1">Alternative Boarding / Alighting:</p>
            <p className="text-slate-600">
              Commuters may board Service {serviceNo} at <span className="font-semibold text-[#5c0088]">Stop 05013 (Opp Hong Lim Cplx)</span> or <span className="font-semibold text-[#5c0088]">Stop 04121 (Clarke Quay Stn)</span>, both within 300m walking distance.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#5c0088] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a1cac] transition-colors cursor-pointer text-xs"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Plan Transfer Modal
export const PlanTransferModal: React.FC<ModalProps & { service: BusService }> = ({
  isOpen,
  onClose,
  service,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5c0088] text-2xl">transfer_within_a_station</span>
            <div>
              <h3 className="font-headline-sm font-bold text-slate-900">Transfer Plan: Serangoon NEX</h3>
              <p className="text-xs text-slate-500">Service {service.serviceNo} ➔ MRT North East & Circle Lines</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between bg-[#f4f2fd] p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5c0088]">directions_walk</span>
              <span className="text-xs font-semibold text-slate-800">Sheltered Walking Time: 2 mins</span>
            </div>
            <span className="text-xs bg-[#e8e7f1] text-[#5c0088] font-bold px-2 py-1 rounded">
              Rebate: Full Transit Transfer Discount
            </span>
          </div>

          <div className="relative pl-6 space-y-4 border-l-2 border-[#5c0088]/30 ml-3">
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#5c0088] ring-4 ring-white"></div>
              <h5 className="text-xs font-bold text-slate-900">Alight at Stop 66359 (Serangoon Stn Exit C / Nex)</h5>
              <p className="text-[11px] text-slate-500">Bus 147 alighting bay on Serangoon Central.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#8A31BC] ring-4 ring-white"></div>
              <h5 className="text-xs font-bold text-slate-900">Take Escalator to NEX Basement 2 Transit Link</h5>
              <p className="text-[11px] text-slate-500">Follow overhead purple signs towards NEL / Circle Line fare gates.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white"></div>
              <h5 className="text-xs font-bold text-slate-900">Tap in with SimplyGo / EZ-Link within 45 mins</h5>
              <div className="flex gap-2 mt-1">
                <span className="bg-[#8A31BC] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NE12 Dhoby Ghaut / HarbourFront</span>
                <span className="bg-[#FFAA00] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">CC13 Bishan / Marina Bay</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#5c0088] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a1cac] transition-colors cursor-pointer text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. PDF Route Guide Modal
export const PdfGuideModal: React.FC<ModalProps & { service: BusService }> = ({
  isOpen,
  onClose,
  service,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5c0088] text-white flex items-center justify-center font-bold text-lg">
              {service.serviceNo}
            </div>
            <div>
              <h3 className="font-headline-sm font-bold text-slate-900">Service Guide & Fare Stage Table</h3>
              <p className="text-xs text-slate-500">Official SBS Transit Schedule • Effective 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Guide</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Total Stops</span>
              <span className="font-bold text-slate-900 text-sm">{service.totalStops}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Route Distance</span>
              <span className="font-bold text-slate-900 text-sm">{service.totalDistance}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Wheelchair (WAB)</span>
              <span className="font-bold text-emerald-700 text-sm">100% Fleeted</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Electric Fleet</span>
              <span className="font-bold text-slate-900 text-sm">{service.electricFleet ? 'Active' : 'Standard'}</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-[#eeedf7] px-3 py-2 font-bold text-slate-800 flex justify-between">
              <span>First & Last Bus Schedules</span>
              <span>Operating Contract: BCM Package 14</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-2.5">Origin Terminus</th>
                  <th className="p-2.5">First Bus</th>
                  <th className="p-2.5">Last Bus</th>
                  <th className="p-2.5">Frequency Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-medium">{service.origin}</td>
                  <td className="p-2.5">05:30</td>
                  <td className="p-2.5">23:45</td>
                  <td className="p-2.5 text-emerald-700 font-semibold">{service.timetable.weekdayHeadway}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">{service.destination}</td>
                  <td className="p-2.5">05:45</td>
                  <td className="p-2.5">23:45</td>
                  <td className="p-2.5 text-emerald-700 font-semibold">{service.timetable.weekdayHeadway}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#5c0088] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a1cac] transition-colors cursor-pointer text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Fare Guide / Calculator Modal
export const FareCalculatorModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [distance, setDistance] = useState(5.6);
  if (!isOpen) return null;

  // Approximate LTA distance-based fare structure
  const adultFare = (0.99 + Math.min(distance * 0.08, 1.4)).toFixed(2);
  const studentFare = (0.45 + Math.min(distance * 0.04, 0.45)).toFixed(2);
  const seniorFare = (0.55 + Math.min(distance * 0.04, 0.5)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5c0088] text-2xl">calculate</span>
            <h3 className="font-headline-sm font-bold text-slate-900">TransitLink Fare Calculator</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Trip Distance: <span className="font-bold text-[#5c0088] tabular-nums">{distance} km</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.5"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value))}
              className="w-full accent-[#5c0088] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0.5 km (Feeder)</span>
              <span>15 km (Trunk)</span>
              <span>30 km (Express)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#f4f2fd] rounded-xl text-center border border-[#e3e1eb]">
              <span className="text-[11px] text-slate-500 block">Adult Card</span>
              <span className="text-lg font-extrabold text-[#5c0088] tabular-nums">${adultFare}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Student</span>
              <span className="text-lg font-bold text-slate-800 tabular-nums">${studentFare}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Senior Citizen</span>
              <span className="text-lg font-bold text-slate-800 tabular-nums">${seniorFare}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            * Fares are calculated under Distance-Based Fares (DBF) approved by the Public Transport Council (PTC). Concession transfer rules apply within 45 mins.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#5c0088] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a1cac] transition-colors cursor-pointer text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. Commuter Feedback Modal
export const FeedbackModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState('bus-punctuality');
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5c0088] text-2xl">rate_review</span>
            <h3 className="font-headline-sm font-bold text-slate-900">SBS Transit Commuter Feedback</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">check</span>
            </div>
            <h4 className="font-bold text-slate-900">Thank you for your feedback!</h4>
            <p className="text-xs text-slate-500">Reference Case #SBS-2026-9812 has been logged with Quality Assurance.</p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-3 bg-[#5c0088] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Feedback Category</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="bus-punctuality">Bus Arrival & Headway Accuracy</option>
                <option value="bus-captain">Bus Captain Commendation / Driving</option>
                <option value="air-con">Vehicle Air-conditioning & Cleanliness</option>
                <option value="app-telemetry">DataMall Live Telemetry App Feedback</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Your Comments or Service Number</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your experience on Service 147 or any SBS transit line..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5c0088]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="bg-[#5c0088] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a1cac] transition-colors cursor-pointer text-xs"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 7. Near Me Modal
export const NearMeModal: React.FC<ModalProps & { onSelectService: (svc: string) => void }> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5c0088] text-2xl">my_location</span>
            <div>
              <h3 className="font-headline-sm font-bold text-slate-900">Nearby Bus Stops</h3>
              <p className="text-xs text-slate-500">GPS Location: Upper Serangoon Rd (±8m)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="p-3 bg-[#f4f2fd] rounded-xl border border-[#e3e1eb]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Stop 63039 • Kovan Stn Exit C</span>
              <span className="text-[11px] font-bold text-[#5c0088] bg-[#f5d9ff] px-2 py-0.5 rounded">60m • 1 min walk</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  onSelectService('147');
                  onClose();
                }}
                className="bg-[#5c0088] text-white text-xs font-bold px-2.5 py-1 rounded hover:bg-[#7a1cac] cursor-pointer"
              >
                147 (Arr, 11 min)
              </button>
              <button
                onClick={() => {
                  onSelectService('80');
                  onClose();
                }}
                className="bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded hover:bg-slate-300 cursor-pointer"
              >
                80 (4 min)
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Stop 63029 • The Helping Hand</span>
              <span className="text-[11px] text-slate-500">220m • 3 min walk</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  onSelectService('147');
                  onClose();
                }}
                className="bg-[#5c0088] text-white text-xs font-bold px-2.5 py-1 rounded hover:bg-[#7a1cac] cursor-pointer"
              >
                147 (6 min)
              </button>
              <button
                onClick={() => {
                  onSelectService('65');
                  onClose();
                }}
                className="bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded hover:bg-slate-300 cursor-pointer"
              >
                65 (14 min)
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#5c0088] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a1cac] transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 8. Bookmarks Modal
export const BookmarksModal: React.FC<ModalProps & {
  bookmarks: string[];
  onSelectService: (svc: string) => void;
  onRemoveBookmark: (svc: string) => void;
}> = ({ isOpen, onClose, bookmarks, onSelectService, onRemoveBookmark }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5c0088] text-2xl">bookmark</span>
            <h3 className="font-headline-sm font-bold text-slate-900">Bookmarked Bus Services</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-4 space-y-2">
          {bookmarks.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              No bookmarked services yet. Click &quot;Bookmark Service&quot; on any route to save it here!
            </p>
          ) : (
            bookmarks.map((svc) => {
              const info = BUS_SERVICES[svc];
              return (
                <div key={svc} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <button
                    onClick={() => {
                      onSelectService(svc);
                      onClose();
                    }}
                    className="flex items-center gap-2 text-left cursor-pointer flex-1"
                  >
                    <span className="font-bold text-[#5c0088] bg-[#f5d9ff] px-2 py-0.5 rounded text-xs">
                      {svc}
                    </span>
                    <span className="text-xs text-slate-800 font-medium">
                      {info ? `${info.origin} ⇄ ${info.destination}` : `Service ${svc}`}
                    </span>
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(svc)}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#5c0088] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a1cac] transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
