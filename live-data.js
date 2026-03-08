// S&P 500 Earnings Intelligence Dashboard - Live Data Layer
// Fetches real-time data from Financial Modeling Prep API
// Free tier: 250 calls/day — uses localStorage caching to minimize calls

const FMP_BASE = "https://financialmodelingprep.com/api/v3";
const CACHE_PREFIX = "sp500dash_";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache for intraday, refreshes on reload after expiry
const DAILY_CACHE = 24 * 60 * 60 * 1000; // 24h cache for slow-changing data

// API key management
function getFmpApiKey() {
  return localStorage.getItem("fmp_api_key") || "";
}

function setFmpApiKey(key) {
  localStorage.setItem("fmp_api_key", key.trim());
}

function hasApiKey() {
  return getFmpApiKey().length > 5;
}

// Cache helpers
function getCached(key, maxAge) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > maxAge) return null;
    return data;
  } catch { return null; }
}

function setCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* localStorage full — ignore */ }
}

// Fetch with cache
async function fmpFetch(endpoint, cacheKey, cacheDuration) {
  const cached = getCached(cacheKey, cacheDuration);
  if (cached) return cached;

  const apiKey = getFmpApiKey();
  if (!apiKey) return null;

  try {
    const sep = endpoint.includes("?") ? "&" : "?";
    const res = await fetch(`${FMP_BASE}${endpoint}${sep}apikey=${apiKey}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && !data["Error Message"]) {
      setCache(cacheKey, data);
      return data;
    }
    return null;
  } catch (e) {
    console.warn(`FMP fetch failed for ${cacheKey}:`, e.message);
    return null;
  }
}

// ==================== LIVE DATA FETCHERS ====================

// Batch quote for all shorted stocks (1 API call for up to 50 tickers)
async function fetchLiveQuotes(tickers) {
  const tickerStr = tickers.join(",");
  return fmpFetch(`/quote/${tickerStr}`, `quotes_${tickers.length}`, CACHE_DURATION);
}

// Technical indicators for a single stock
async function fetchTechnicals(ticker) {
  const [rsi, sma20, sma50, sma200] = await Promise.all([
    fmpFetch(`/technical_indicator/daily/${ticker}?period=14&type=rsi`, `rsi_${ticker}`, CACHE_DURATION),
    fmpFetch(`/technical_indicator/daily/${ticker}?period=20&type=sma`, `sma20_${ticker}`, CACHE_DURATION),
    fmpFetch(`/technical_indicator/daily/${ticker}?period=50&type=sma`, `sma50_${ticker}`, CACHE_DURATION),
    fmpFetch(`/technical_indicator/daily/${ticker}?period=200&type=sma`, `sma200_${ticker}`, CACHE_DURATION),
  ]);
  return { rsi, sma20, sma50, sma200 };
}

// Historical prices for chart (90 days)
async function fetchPriceHistory(ticker) {
  return fmpFetch(
    `/historical-price-full/${ticker}?timeseries=90`,
    `hist_${ticker}`,
    DAILY_CACHE
  );
}

// Sector performance
async function fetchSectorPerformance() {
  return fmpFetch("/sector-performance", "sector_perf", CACHE_DURATION);
}

// Market movers (most active, gainers, losers)
async function fetchMarketMovers() {
  const [active, gainers, losers] = await Promise.all([
    fmpFetch("/stock_market/actives", "actives", CACHE_DURATION),
    fmpFetch("/stock_market/gainers", "gainers", CACHE_DURATION),
    fmpFetch("/stock_market/losers", "losers", CACHE_DURATION),
  ]);
  return { active, gainers, losers };
}

// ==================== UPDATE DASHBOARD WITH LIVE DATA ====================

async function updateShortedStocksWithLiveData() {
  if (!hasApiKey()) return false;

  const tickers = SHORTED_STOCKS.map(s => s.ticker);
  const quotes = await fetchLiveQuotes(tickers);

  if (!quotes || !Array.isArray(quotes) || quotes.length === 0) return false;

  const quoteMap = {};
  quotes.forEach(q => { quoteMap[q.symbol] = q; });

  let updatedCount = 0;
  SHORTED_STOCKS.forEach(stock => {
    const q = quoteMap[stock.ticker];
    if (!q) return;

    stock.price = q.price || stock.price;
    stock.chg1d = q.changesPercentage != null ? +q.changesPercentage.toFixed(2) : stock.chg1d;
    stock.avgVolume = q.avgVolume || stock.avgVolume;
    stock.vwap = q.priceAvg50 ? +(q.price * 0.98 + q.priceAvg50 * 0.02).toFixed(2) : stock.vwap;

    // Update MAs if available from quote
    if (q.priceAvg50) stock.sma50 = +q.priceAvg50.toFixed(2);
    if (q.priceAvg200) stock.sma200 = +q.priceAvg200.toFixed(2);

    // Recalculate price-vs-MA relationships
    stock.priceVsSma50 = stock.price > stock.sma50;
    stock.priceVsSma200 = stock.price > stock.sma200;

    updatedCount++;
  });

  return updatedCount > 0;
}

async function updateSingleStockDetail(ticker) {
  if (!hasApiKey()) return null;

  const hist = await fetchPriceHistory(ticker);
  if (!hist?.historical) return null;

  // Extract last 13 weekly data points from daily data
  const daily = hist.historical.slice(0, 90).reverse(); // oldest to newest
  const weeklyPrices = [];
  const weeklyDates = [];
  for (let i = 0; i < daily.length; i += 7) {
    const d = daily[Math.min(i, daily.length - 1)];
    weeklyPrices.push(d.close);
    weeklyDates.push(new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }

  return { weeklyPrices, weeklyDates, daily };
}

// ==================== API KEY UI ====================

function renderApiKeyPrompt() {
  const container = document.getElementById("apiKeyStatus");
  if (!container) return;

  if (hasApiKey()) {
    container.innerHTML = `
      <span class="api-connected"><span class="live-dot"></span> Live Data Connected</span>
      <button class="api-btn" onclick="promptApiKey()">Change Key</button>
      <button class="api-btn secondary" onclick="clearApiKey()">Disconnect</button>
    `;
  } else {
    container.innerHTML = `
      <span class="api-disconnected">Static Data — Connect API for live updates</span>
      <button class="api-btn" onclick="promptApiKey()">Connect FMP API</button>
    `;
  }
}

function promptApiKey() {
  const key = prompt(
    "Enter your Financial Modeling Prep API key.\n\n" +
    "Get a FREE key at: https://financialmodelingprep.com/developer/docs\n\n" +
    "Free tier gives you 250 API calls/day — more than enough for this dashboard."
  );
  if (key && key.trim().length > 5) {
    setFmpApiKey(key);
    renderApiKeyPrompt();
    refreshLiveData();
  }
}

function clearApiKey() {
  localStorage.removeItem("fmp_api_key");
  // Clear all cached data
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
  });
  renderApiKeyPrompt();
  updateLastRefreshStatus(false);
}

function updateLastRefreshStatus(isLive) {
  const el = document.getElementById("dataSourceBadge");
  if (!el) return;
  const now = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true
  });
  if (isLive) {
    el.innerHTML = `<span class="live-dot"></span> Live · Updated ${now}`;
    el.className = "data-source-badge live";
  } else {
    el.innerHTML = `Static Data · Q4 2025 Earnings`;
    el.className = "data-source-badge static";
  }
}

// ==================== MASTER REFRESH ====================

async function refreshLiveData() {
  if (!hasApiKey()) {
    updateLastRefreshStatus(false);
    return;
  }

  // Show loading indicator
  const badge = document.getElementById("dataSourceBadge");
  if (badge) {
    badge.innerHTML = `<span class="loading-spinner"></span> Fetching live data...`;
    badge.className = "data-source-badge loading";
  }

  try {
    const updated = await updateShortedStocksWithLiveData();

    if (updated) {
      // Re-render sections that use live data
      renderShortsTable();
      renderShortsKPIs();
      updateLastRefreshStatus(true);
    } else {
      updateLastRefreshStatus(false);
    }
  } catch (e) {
    console.error("Live data refresh failed:", e);
    updateLastRefreshStatus(false);
  }
}

// Auto-refresh every 5 minutes during market hours (9:30 AM - 4:00 PM ET)
function scheduleAutoRefresh() {
  setInterval(() => {
    if (!hasApiKey()) return;
    const now = new Date();
    const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const hour = et.getHours();
    const min = et.getMinutes();
    const dayOfWeek = et.getDay();

    // Only refresh during market hours (weekdays, 9:30 AM - 4:30 PM ET)
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && (hour > 9 || (hour === 9 && min >= 30)) && hour < 17) {
      refreshLiveData();
    }
  }, 5 * 60 * 1000); // every 5 minutes
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderApiKeyPrompt();
  if (hasApiKey()) {
    refreshLiveData();
  } else {
    updateLastRefreshStatus(false);
  }
  scheduleAutoRefresh();
});
