import { CryptoPair, HistoricalDataPoint, PriceUpdate } from '../types';

const PAIR_MAP: Record<CryptoPair, string> = {
  [CryptoPair.BTC_USD]: 'btcusdt',
  [CryptoPair.ETH_USD]: 'ethusdt',
};
const REVERSE_PAIR_MAP: Record<string, CryptoPair> = {
  'btcusdt': CryptoPair.BTC_USD,
  'ethusdt': CryptoPair.ETH_USD,
};

// --- Historical Data (Generated for initial chart view) ---
// This remains a "mock" generation as historical data APIs are often rate-limited or paid.
// The real-time data below is live from a public data feed.
const generateMockHistoricalData = (pair: CryptoPair, points = 100): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let price = pair === CryptoPair.BTC_USD ? 68000 : 3800; // Use more realistic starting prices
  const now = new Date();

  for (let i = points; i > 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Hourly data
    const change = (Math.random() - 0.49) * (price * 0.02); // up to 2% change per hour
    price += change;
    price = Math.max(price, 0); // Price can't be negative
    data.push({
      time: time.toISOString().slice(11, 16), // Format as HH:MM
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

export const MOCK_HISTORICAL_DATA: Record<CryptoPair, HistoricalDataPoint[]> = {
  [CryptoPair.BTC_USD]: generateMockHistoricalData(CryptoPair.BTC_USD),
  [CryptoPair.ETH_USD]: generateMockHistoricalData(CryptoPair.ETH_USD),
};


// --- Real-time WebSocket Logic (Live from Binance Public Stream) ---
let socket: WebSocket | null = null;
let callback: ((update: PriceUpdate) => void) | null = null;

const WEBSOCKET_URL = 'wss://stream.binance.com:9443/ws';

const connect = () => {
    // Prevent multiple connections
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return;
    }

    // Subscribe to both streams for simplicity, as the dashboard can show either.
    const streams = `${PAIR_MAP[CryptoPair.BTC_USD]}@trade/${PAIR_MAP[CryptoPair.ETH_USD]}@trade`;
    socket = new WebSocket(`${WEBSOCKET_URL}/${streams}`);

    socket.onopen = () => {
        console.log('Real-time price feed connected via WebSocket.');
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            // Binance trade stream message format
            if (data && data.e === 'trade' && callback) {
                const pair = REVERSE_PAIR_MAP[data.s.toLowerCase()];
                if (pair) {
                    const update: PriceUpdate = {
                        pair,
                        price: parseFloat(data.p),
                    };
                    callback(update);
                }
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed. Attempting to reconnect...');
        socket = null;
        // Simple reconnect logic, only if a subscription is still active.
        setTimeout(() => {
            if (callback) connect();
        }, 5000); // Reconnect after 5 seconds
    };
};

export const subscribeToPriceUpdates = (cb: (update: PriceUpdate) => void) => {
  callback = cb;
  connect();
};

export const unsubscribeFromPriceUpdates = () => {
  if (socket) {
    socket.onclose = null; // prevent reconnection logic from firing on manual close
    socket.close(1000, "Component unmounted");
    socket = null;
  }
  callback = null;
};
