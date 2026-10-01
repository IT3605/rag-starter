/**
 * Health check & telemetry monitoring endpoint for SBS Transit Mobility Portal
 * Accessible via /api/health
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const startTime = Date.now();
  const hasKey = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim() !== '');
  let ltaStatus = 'unconfigured';
  let ltaLatencyMs = null;
  let ltaMessage = hasKey
    ? 'LTA_ACCOUNT_KEY detected in environment.'
    : 'LTA_ACCOUNT_KEY is not configured. Set LTA_ACCOUNT_KEY in Vercel or .env to enable real-time LTA DataMall v3 feed.';

  // If key is configured, perform a lightweight check to LTA DataMall v3
  if (hasKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const testRes = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139',
        {
          headers: {
            AccountKey: process.env.LTA_ACCOUNT_KEY.trim(),
            accept: 'application/json',
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      ltaLatencyMs = Date.now() - startTime;

      if (testRes.ok) {
        ltaStatus = 'healthy';
        ltaMessage = 'Connected to LTA DataMall v3 BusArrival API successfully.';
      } else {
        ltaStatus = `http_${testRes.status}`;
        ltaMessage = `LTA DataMall API responded with HTTP ${testRes.status} (${testRes.statusText}). Verify LTA_ACCOUNT_KEY permissions.`;
      }
    } catch (err) {
      ltaStatus = 'unreachable';
      ltaMessage = `Network check to LTA DataMall failed: ${err.message}`;
    }
  }

  const payload = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    service: 'SBS Transit Singapore Mobility Portal API',
    version: '3.0.0',
    environment: process.env.NODE_ENV || 'production',
    lta: {
      accountKeyConfigured: hasKey,
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      status: ltaStatus,
      latencyMs: ltaLatencyMs,
      message: ltaMessage,
    },
    endpoints: {
      busArrival: '/api/bus-arrival?BusStopCode={code}&ServiceNo={svc}',
      health: '/api/health',
    },
  };

  return res.status(200).json(payload);
}
