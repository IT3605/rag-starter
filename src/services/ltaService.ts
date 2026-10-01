import { BusArrival } from '../data/busServices';

export interface LtaBusArrivalItem {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
  ArrivalDisplay?: string;
  MinutesRemaining?: number;
  LoadInfo?: {
    code: string;
    category: 'seats' | 'standing' | 'crowded';
    label: string;
  };
  TypeLabel?: string;
  IsWab?: boolean;
}

export interface LtaServiceArrival {
  ServiceNo: string;
  Operator: string;
  NextBus: LtaBusArrivalItem;
  NextBus2?: LtaBusArrivalItem;
  NextBus3?: LtaBusArrivalItem;
  Normalized?: {
    NextBus?: LtaBusArrivalItem;
    NextBus2?: LtaBusArrivalItem;
    NextBus3?: LtaBusArrivalItem;
  };
}

export interface LtaBusArrivalResponse {
  'odata.metadata': string;
  BusStopCode: string;
  Services: LtaServiceArrival[];
  isSimulated?: boolean;
  notice?: string;
  upstreamError?: string;
}

export interface ApiHealthResponse {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  service: string;
  lta: {
    accountKeyConfigured: boolean;
    endpoint: string;
    status: string;
    latencyMs: number | null;
    message: string;
  };
}

/**
 * Format raw LTA BusArrival into UI BusArrival[]
 */
export function formatLtaArrivals(serviceItem?: LtaServiceArrival): BusArrival[] {
  if (!serviceItem) return [];

  const buses = [
    serviceItem.Normalized?.NextBus || serviceItem.NextBus,
    serviceItem.Normalized?.NextBus2 || serviceItem.NextBus2,
    serviceItem.Normalized?.NextBus3 || serviceItem.NextBus3,
  ].filter(Boolean);

  const arrivals: BusArrival[] = [];

  for (const bus of buses) {
    if (!bus || !bus.EstimatedArrival) continue;

    let timeDisplay = bus.ArrivalDisplay;
    if (!timeDisplay) {
      const diffMin = Math.round((new Date(bus.EstimatedArrival).getTime() - Date.now()) / 60000);
      timeDisplay = diffMin <= 1 ? 'Arr' : `${diffMin} min`;
    }

    let loadCat: 'seats' | 'standing' | 'crowded' = 'seats';
    if (bus.Load === 'SDA') loadCat = 'standing';
    if (bus.Load === 'LSD') loadCat = 'crowded';

    let typeStr: 'Single Deck' | 'Double Decker' | 'Bendy' = 'Double Decker';
    if (bus.Type === 'SD') typeStr = 'Single Deck';
    if (bus.Type === 'BD') typeStr = 'Bendy';

    arrivals.push({
      time: timeDisplay,
      load: loadCat,
      type: typeStr,
      wab: bus.Feature === 'WAB',
    });
  }

  return arrivals;
}

/**
 * Fetches real-time bus arrivals from /api/bus-arrival endpoint
 */
export async function fetchLiveBusArrival(
  busStopCode: string,
  serviceNo?: string
): Promise<LtaBusArrivalResponse> {
  const url = new URL('/api/bus-arrival', window.location.origin);
  url.searchParams.set('BusStopCode', busStopCode);
  if (serviceNo) {
    url.searchParams.set('ServiceNo', serviceNo);
  }

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Bus arrival API returned ${response.status}`);
  }

  return response.json();
}

/**
 * Checks API and LTA endpoint health from /api/health
 */
export async function checkApiHealth(): Promise<ApiHealthResponse> {
  const response = await fetch('/api/health', {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Health check API returned ${response.status}`);
  }

  return response.json();
}
