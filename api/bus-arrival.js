/**
 * LTA DataMall v3 Bus Arrival API Proxy Endpoint
 * Endpoint: /api/bus-arrival?BusStopCode={code}&ServiceNo={svc}
 * Proxies to: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival
 */

/**
 * Calculates arrival time in minutes from ISO timestamp string
 */
function calculateArrival(estimatedArrivalIso) {
  if (!estimatedArrivalIso) return null;
  const arrivalTime = new Date(estimatedArrivalIso).getTime();
  if (isNaN(arrivalTime)) return null;

  const now = Date.now();
  const diffMinutes = Math.round((arrivalTime - now) / 60000);

  if (diffMinutes <= 1) {
    return { display: 'Arr', minutes: Math.max(0, diffMinutes) };
  }
  return { display: `${diffMinutes} min`, minutes: diffMinutes };
}

/**
 * Normalizes LTA Load code (SEA, SDA, LSD) to semantic labels
 */
function parseLoad(loadCode) {
  switch (loadCode) {
    case 'SEA':
      return { code: 'SEA', category: 'seats', label: 'Seats Available' };
    case 'SDA':
      return { code: 'SDA', category: 'standing', label: 'Standing Available' };
    case 'LSD':
      return { code: 'LSD', category: 'crowded', label: 'Limited Standing' };
    default:
      return { code: loadCode || 'SEA', category: 'seats', label: 'Seats Available' };
  }
}

/**
 * Normalizes LTA Bus Type (SD, DD, BD)
 */
function parseType(typeCode) {
  switch (typeCode) {
    case 'DD':
      return 'Double Decker';
    case 'SD':
      return 'Single Deck';
    case 'BD':
      return 'Bendy';
    default:
      return typeCode || 'Double Decker';
  }
}

/**
 * Normalizes individual bus metadata
 */
function normalizeBus(bus) {
  if (!bus || !bus.EstimatedArrival) return null;
  const arrival = calculateArrival(bus.EstimatedArrival);
  const loadInfo = parseLoad(bus.Load);
  const typeLabel = parseType(bus.Type);

  return {
    ...bus,
    ArrivalDisplay: arrival ? arrival.display : null,
    MinutesRemaining: arrival ? arrival.minutes : null,
    LoadInfo: loadInfo,
    TypeLabel: typeLabel,
    IsWab: bus.Feature === 'WAB',
  };
}

/**
 * Fallback generator for realistic data when LTA_ACCOUNT_KEY is not yet populated
 */
function generateFallbackData(busStopCode, serviceNo) {
  const defaultServices = serviceNo ? [serviceNo] : ['147', '65', '12', '166', '80'];
  const now = Date.now();

  const services = defaultServices.map((svc, idx) => {
    const min1 = 1 + idx * 2;
    const min2 = min1 + 7 + (idx % 3);
    const min3 = min2 + 9 + (idx % 4);

    const nextBus = {
      OriginCode: '64009',
      DestinationCode: '17179',
      EstimatedArrival: new Date(now + min1 * 60000).toISOString(),
      Monitored: 1,
      Latitude: '1.3521',
      Longitude: '103.8198',
      VisitNumber: '1',
      Load: idx % 2 === 0 ? 'SEA' : 'SDA',
      Feature: 'WAB',
      Type: 'DD',
    };

    const nextBus2 = {
      OriginCode: '64009',
      DestinationCode: '17179',
      EstimatedArrival: new Date(now + min2 * 60000).toISOString(),
      Monitored: 1,
      Latitude: '1.3412',
      Longitude: '103.8321',
      VisitNumber: '1',
      Load: idx % 3 === 0 ? 'LSD' : 'SEA',
      Feature: 'WAB',
      Type: 'DD',
    };

    const nextBus3 = {
      OriginCode: '64009',
      DestinationCode: '17179',
      EstimatedArrival: new Date(now + min3 * 60000).toISOString(),
      Monitored: 1,
      Latitude: '1.3305',
      Longitude: '103.8450',
      VisitNumber: '1',
      Load: 'SEA',
      Feature: 'WAB',
      Type: idx % 2 === 0 ? 'DD' : 'SD',
    };

    return {
      ServiceNo: svc,
      Operator: 'SBST',
      NextBus: nextBus,
      NextBus2: nextBus2,
      NextBus3: nextBus3,
      Normalized: {
        NextBus: normalizeBus(nextBus),
        NextBus2: normalizeBus(nextBus2),
        NextBus3: normalizeBus(nextBus3),
      },
    };
  });

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    BusStopCode: busStopCode,
    Services: services,
    isSimulated: true,
    notice: 'Displaying local fallback telemetry. Add LTA_ACCOUNT_KEY in environment variables to pull live LTA DataMall feed.',
  };
}

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse query parameters
  const url = new URL(req.url, 'http://localhost');
  const busStopCode = (req.query?.BusStopCode || url.searchParams.get('BusStopCode') || '').trim();
  const serviceNo = (req.query?.ServiceNo || url.searchParams.get('ServiceNo') || '').trim();

  if (!busStopCode) {
    return res.status(400).json({
      error: 'Missing required query parameter "BusStopCode"',
      example: '/api/bus-arrival?BusStopCode=83139&ServiceNo=15',
    });
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY ? process.env.LTA_ACCOUNT_KEY.trim() : '';

  // If AccountKey is not yet set, provide formatted fallback telemetry
  if (!accountKey) {
    const fallbackData = generateFallbackData(busStopCode, serviceNo);
    return res.status(200).json(fallbackData);
  }

  // Build upstream LTA DataMall v3 URL
  const ltaEndpoint = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
  ltaEndpoint.searchParams.set('BusStopCode', busStopCode);
  if (serviceNo) {
    ltaEndpoint.searchParams.set('ServiceNo', serviceNo);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const ltaResponse = await fetch(ltaEndpoint.toString(), {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!ltaResponse.ok) {
      // Fallback if key has rate limit or unauthorized
      console.warn(`LTA DataMall responded with ${ltaResponse.status}: ${ltaResponse.statusText}`);
      const fallbackData = generateFallbackData(busStopCode, serviceNo);
      fallbackData.upstreamError = `LTA DataMall returned HTTP ${ltaResponse.status}`;
      return res.status(200).json(fallbackData);
    }

    const data = await ltaResponse.json();

    // Enrich the services with calculated arrival times & load formatting
    if (Array.isArray(data.Services)) {
      data.Services = data.Services.map((svc) => ({
        ...svc,
        Normalized: {
          NextBus: normalizeBus(svc.NextBus),
          NextBus2: normalizeBus(svc.NextBus2),
          NextBus3: normalizeBus(svc.NextBus3),
        },
      }));
    }

    data.isSimulated = false;
    return res.status(200).json(data);
  } catch (error) {
    console.error('LTA DataMall proxy error:', error);
    const fallbackData = generateFallbackData(busStopCode, serviceNo);
    fallbackData.upstreamError = error.message;
    return res.status(200).json(fallbackData);
  }
}
