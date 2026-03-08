// S&P 500 Earnings Intelligence Dashboard - Application Logic

// ==================== HELPERS ====================
function formatLargeNum(num) {
  if (!num && num !== 0) return "N/A";
  if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString();
}
function formatNum(num) { return num != null ? num.toLocaleString() : "N/A"; }
function mergeCtx(base, overlay) {
  if (!overlay) return base;
  const m = { ...base };
  for (const [k, v] of Object.entries(overlay)) { if (v !== null && v !== undefined) m[k] = v; }
  return m;
}
function valItem(label, value) {
  return `<div class="valuation-item"><div class="label">${label}</div><div class="value">${value || "N/A"}</div></div>`;
}

// ==================== KPI CARDS ====================
function renderKPIs() {
  const totalCompanies = COMPANIES.length;
  const bullishSignals = SIGNALS.filter(s => s.type === "bullish").length;
  const cautionSignals = SIGNALS.filter(s => s.type === "caution").length;
  const transitionSignals = SIGNALS.filter(s => s.type === "transition").length;
  const avgSentiment = (COMPANIES.reduce((s, c) => s + c.sent, 0) / totalCompanies).toFixed(2);
  const sectorCount = SECTORS.length;

  const kpis = [
    { value: totalCompanies, label: "Companies Tracked", sub: "S&P 500 constituents with transcripts", color: "var(--accent)" },
    { value: THEMES.length, label: "Themes Tracked", sub: "Cross-sector narrative analysis", color: "var(--purple)" },
    { value: `${bullishSignals}B / ${cautionSignals}C / ${transitionSignals}T`, label: "Momentum Signals", sub: `${bullishSignals} bullish · ${cautionSignals} caution · ${transitionSignals} transition`, color: "var(--green)" },
    { value: avgSentiment, label: "Avg Sentiment Score", sub: "Weighted executive tone analysis", color: "var(--cyan)" },
    { value: sectorCount, label: "GICS Sectors", sub: "Full sector coverage", color: "var(--orange)" }
  ];

  document.getElementById("kpiRow").innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value" style="color:${k.color}">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>
  `).join("");
}

// ==================== THEME FREQUENCY CHART ====================
function renderThemeChart() {
  const ctx = document.getElementById("themeChart").getContext("2d");
  const topThemes = Object.keys(THEME_SECTOR_MATRIX).slice(0, 10);
  const sectorColors = ["#3b82f6","#22c55e","#a855f7","#f97316","#06b6d4","#ef4444","#ec4899","#14b8a6","#eab308","#6366f1","#f43f5e"];

  const datasets = SECTORS.map((sector, i) => ({
    label: sector,
    data: topThemes.map(theme => THEME_SECTOR_MATRIX[theme]?.[sector] || 0),
    backgroundColor: sectorColors[i] + "cc",
    borderWidth: 0, borderRadius: 2
  }));

  new Chart(ctx, {
    type: "bar",
    data: { labels: topThemes.map(t => t.length > 22 ? t.slice(0, 20) + "\u2026" : t), datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 10 }, boxWidth: 12, padding: 8 } },
        tooltip: { backgroundColor: "#1a2236", borderColor: "#1e2d4a", borderWidth: 1, titleColor: "#e2e8f0", bodyColor: "#94a3b8", callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw} mentions` } }
      },
      scales: {
        x: { stacked: true, ticks: { color: "#94a3b8", font: { size: 9 }, maxRotation: 45 }, grid: { display: false } },
        y: { stacked: true, ticks: { color: "#94a3b8", font: { size: 10 } }, grid: { color: "#1e2d4a" }, title: { display: true, text: "Mentions in Transcripts", color: "#94a3b8", font: { size: 11 } } }
      }
    }
  });
}

// ==================== SECTOR SENTIMENT CHART ====================
function renderSentimentChart() {
  const ctx = document.getElementById("sentimentChart").getContext("2d");
  const sorted = Object.entries(SECTOR_SENTIMENT).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map(s => s[0]);
  const values = sorted.map(s => s[1]);
  const colors = values.map(v => v >= 0.75 ? "#22c55e" : v >= 0.70 ? "#06b6d4" : v >= 0.65 ? "#eab308" : "#f97316");

  new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ data: values, backgroundColor: colors.map(c => c + "cc"), borderColor: colors, borderWidth: 1, borderRadius: 4 }] },
    options: {
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1a2236", borderColor: "#1e2d4a", borderWidth: 1, callbacks: { label: ctx => `Sentiment: ${ctx.raw.toFixed(2)}` } } },
      scales: {
        x: { min: 0.5, max: 0.85, ticks: { color: "#94a3b8", font: { size: 10 }, callback: v => v.toFixed(2) }, grid: { color: "#1e2d4a" } },
        y: { ticks: { color: "#e2e8f0", font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

// ==================== MOMENTUM SIGNALS ====================
function renderSignals() {
  document.getElementById("signalCount").textContent = `\u2014 ${SIGNALS.length} active signals`;
  document.getElementById("signalsGrid").innerHTML = SIGNALS.map(s => `
    <div class="signal-card ${s.type}">
      <div class="signal-type ${s.type}">${s.type === "transition" ? "Energy Transition" : s.type}</div>
      <div class="signal-title">${s.title}</div>
      <div class="signal-desc">${s.desc}</div>
      <div class="signal-tickers">${s.tickers.map(t => `<span class="ticker-chip clickable" onclick="event.stopPropagation();openTickerModal('${t}')">${t}</span>`).join("")}</div>
    </div>
  `).join("");
}

// ==================== EXECUTIVE QUOTES ====================
let quotePage = 1;
const quotesPerPage = 12;
let filteredQuotes = [...COMPANIES];

function getFilteredQuotes() {
  const search = document.getElementById("quoteSearch").value.toLowerCase();
  const sector = document.getElementById("sectorFilter").value;
  const theme = document.getElementById("themeFilter").value;
  const sentiment = document.getElementById("sentimentFilter").value;

  return COMPANIES.filter(c => {
    if (sector !== "all" && c.s !== sector) return false;
    if (theme !== "all" && !c.themes.includes(theme)) return false;
    if (sentiment !== "all") {
      if (sentiment === "bullish" && c.sent < 0.70) return false;
      if (sentiment === "neutral" && (c.sent < 0.60 || c.sent >= 0.70)) return false;
      if (sentiment === "bearish" && c.sent >= 0.60) return false;
    }
    if (search) {
      const haystack = `${c.t} ${c.n} ${c.s} ${c.q} ${c.themes.join(" ")}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

function getSentimentClass(sent) {
  if (sent >= 0.70) return "bullish";
  if (sent >= 0.60) return "neutral";
  return "bearish";
}

function renderQuotes() {
  filteredQuotes = getFilteredQuotes();
  const total = filteredQuotes.length;
  const totalPages = Math.ceil(total / quotesPerPage);
  if (quotePage > totalPages) quotePage = 1;
  const start = (quotePage - 1) * quotesPerPage;
  const pageQuotes = filteredQuotes.slice(start, start + quotesPerPage);

  document.getElementById("quotesList").innerHTML = pageQuotes.length === 0
    ? '<div style="text-align:center;color:var(--text2);padding:40px;">No quotes match your filters.</div>'
    : pageQuotes.map(c => `
    <div class="quote-card">
      <div class="quote-header">
        <span><span class="quote-ticker clickable" onclick="openTickerModal('${c.t}')">${c.t}</span> <span class="quote-company">${c.n}</span></span>
        <span class="quote-sector-badge">${c.s}</span>
      </div>
      <div class="quote-text">"${c.q}"</div>
      <div class="quote-meta">
        ${c.themes.map(t => `<span class="theme-tag">${t}</span>`).join("")}
        <span class="sentiment-tag ${getSentimentClass(c.sent)}">${c.sent.toFixed(2)} ${getSentimentClass(c.sent)}</span>
      </div>
    </div>
  `).join("");

  renderPagination(total, totalPages);
}

function renderPagination(total, totalPages) {
  if (totalPages <= 1) {
    document.getElementById("pagination").innerHTML = `<span class="page-info">Showing ${total} of ${total} results</span>`;
    return;
  }
  let html = `<button class="page-btn" onclick="goToPage(${quotePage - 1})" ${quotePage === 1 ? "disabled" : ""}>Prev</button>`;
  const maxButtons = 7;
  let startPage = Math.max(1, quotePage - 3);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) startPage = Math.max(1, endPage - maxButtons + 1);
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === quotePage ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="goToPage(${quotePage + 1})" ${quotePage === totalPages ? "disabled" : ""}>Next</button>`;
  html += `<span class="page-info">${total} results</span>`;
  document.getElementById("pagination").innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  if (page < 1 || page > totalPages) return;
  quotePage = page;
  renderQuotes();
  document.querySelector(".quotes-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

function initQuoteFilters() {
  const sectorSelect = document.getElementById("sectorFilter");
  SECTORS.forEach(s => { const opt = document.createElement("option"); opt.value = s; opt.textContent = s; sectorSelect.appendChild(opt); });
  const themeSelect = document.getElementById("themeFilter");
  THEMES.forEach(t => { const opt = document.createElement("option"); opt.value = t; opt.textContent = t; themeSelect.appendChild(opt); });
  document.getElementById("quoteSearch").addEventListener("input", () => { quotePage = 1; renderQuotes(); });
  document.getElementById("sectorFilter").addEventListener("change", () => { quotePage = 1; renderQuotes(); });
  document.getElementById("themeFilter").addEventListener("change", () => { quotePage = 1; renderQuotes(); });
  document.getElementById("sentimentFilter").addEventListener("change", () => { quotePage = 1; renderQuotes(); });
}

// ==================== SECTOR BREAKDOWN ====================
let activeSector = SECTORS[0];

function renderSectorTabs() {
  document.getElementById("sectorTabs").innerHTML = SECTORS.map(s => {
    const count = COMPANIES.filter(c => c.s === s).length;
    return `<button class="sector-tab ${s === activeSector ? "active" : ""}" onclick="switchSector('${s}')">${s} (${count})</button>`;
  }).join("");
}

function switchSector(sector) { activeSector = sector; renderSectorTabs(); renderSectorTable(); }

function renderSectorTable() {
  const companies = COMPANIES.filter(c => c.s === activeSector).sort((a, b) => b.sent - a.sent);
  document.getElementById("sectorTableBody").innerHTML = companies.map(c => {
    const sentClass = getSentimentClass(c.sent);
    const sentColor = sentClass === "bullish" ? "var(--green)" : sentClass === "neutral" ? "var(--yellow)" : "var(--red)";
    const sentPct = ((c.sent - 0.4) / 0.55 * 100).toFixed(0);
    return `<tr>
      <td><span class="ticker-chip clickable" onclick="openTickerModal('${c.t}')">${c.t}</span></td>
      <td>${c.n}</td>
      <td>
        <span class="sentiment-bar"><span class="sentiment-fill" style="width:${sentPct}%;background:${sentColor}"></span></span>
        <span style="color:${sentColor};font-weight:600">${c.sent.toFixed(2)}</span>
      </td>
      <td><div class="td-themes">${c.themes.map(t => `<span class="theme-tag">${t}</span>`).join("")}</div></td>
      <td style="max-width:320px;font-size:0.75rem;color:var(--text2);font-style:italic">"${c.q.slice(0, 120)}${c.q.length > 120 ? "\u2026" : ""}"</td>
    </tr>`;
  }).join("");
}

// ==================== SHORT INTEREST SECTION ====================

function renderShortsKPIs() {
  const avgSI = (SHORTED_STOCKS.reduce((s, c) => s + c.siCurrent, 0) / SHORTED_STOCKS.length).toFixed(1);
  const maxSI = SHORTED_STOCKS.reduce((m, c) => c.siCurrent > m.siCurrent ? c : m);
  const avgPC = (SHORTED_STOCKS.reduce((s, c) => s + c.pcRatio, 0) / SHORTED_STOCKS.length).toFixed(2);
  const bearishCount = SHORTED_STOCKS.filter(s => s.overallSignal === "bearish").length;
  const bullishCount = SHORTED_STOCKS.filter(s => s.overallSignal === "bullish").length;
  const avgDTC = (SHORTED_STOCKS.reduce((s, c) => s + c.daysTocover, 0) / SHORTED_STOCKS.length).toFixed(1);

  const kpis = [
    { value: SHORTED_STOCKS.length, label: "Stocks Tracked", sub: "Top most shorted S&P 500", color: "var(--red)" },
    { value: `${maxSI.siCurrent}%`, label: "Highest SI", sub: maxSI.ticker, color: "var(--orange)" },
    { value: `${avgSI}%`, label: "Avg Short Interest", sub: "Across tracked names", color: "var(--yellow)" },
    { value: avgPC, label: "Avg Put/Call Ratio", sub: "> 1.0 = bearish positioning", color: "var(--purple)" },
    { value: `${avgDTC}d`, label: "Avg Days to Cover", sub: "Higher = squeeze potential", color: "var(--cyan)" },
    { value: `${bearishCount}B / ${bullishCount}L`, label: "Bear vs Bull Signals", sub: "Overall technical signals", color: "var(--red)" }
  ];

  document.getElementById("shortsKpiRow").innerHTML = kpis.map(k => `
    <div class="shorts-kpi">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value" style="color:${k.color}">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>
  `).join("");
}

function renderShortsTable() {
  document.getElementById("shortsTableBody").innerHTML = SHORTED_STOCKS.map((s, i) => {
    const siPct = Math.min(100, (s.siCurrent / 25) * 100);
    const si90dStart = s.siHistory[0];
    const siChange = (s.siCurrent - si90dStart).toFixed(1);
    const siChangeDir = siChange >= 0 ? "up" : "down";
    const rsiColor = s.rsi < 30 ? "var(--red)" : s.rsi < 40 ? "var(--orange)" : s.rsi < 60 ? "var(--text2)" : "var(--green)";
    const priceColor = s.chg1d >= 0 ? "var(--green)" : "var(--red)";

    return `<tr onclick="openTickerModal('${s.ticker}')">
      <td style="font-weight:700;color:var(--text2)">#${i + 1}</td>
      <td><span class="ticker-chip clickable">${s.ticker}</span></td>
      <td style="font-size:0.78rem">${s.name}</td>
      <td>
        <span style="font-weight:700">$${s.price.toFixed(2)}</span>
        <span style="color:${priceColor};font-size:0.7rem;margin-left:4px">${s.chg1d >= 0 ? "+" : ""}${s.chg1d}%</span>
      </td>
      <td>
        <span class="si-bar"><span class="si-fill" style="width:${siPct}%"></span></span>
        <span style="font-weight:700;color:var(--orange)">${s.siCurrent}%</span>
      </td>
      <td><span class="si-change ${siChangeDir}">${siChangeDir === "up" ? "+" : ""}${siChange}%</span> <span style="font-size:0.65rem;color:var(--text2)">from ${si90dStart}%</span></td>
      <td style="font-weight:600">${s.daysTocover.toFixed(1)}</td>
      <td style="font-weight:600;color:${s.pcRatio > 1.3 ? "var(--red)" : s.pcRatio < 0.8 ? "var(--green)" : "var(--text2)"}">${s.pcRatio.toFixed(2)}</td>
      <td style="font-weight:700;color:${rsiColor}">${s.rsi.toFixed(1)}</td>
      <td><span class="signal-badge ${s.overallSignal}">${s.overallSignal}</span></td>
      <td><button class="detail-btn" onclick="event.stopPropagation();openTickerModal('${s.ticker}')">Deep Dive</button></td>
    </tr>`;
  }).join("");
}

// ==================== UNIVERSAL TICKER DEEP-DIVE MODAL ====================
let modalCharts = {};
let modalSessionId = 0;
let modalDataCache = { ticker: null, insiderLoaded: false };

function destroyModalCharts() {
  Object.values(modalCharts).forEach(c => { try { c.destroy(); } catch(e) {} });
  modalCharts = {};
}

function closeStockModal() {
  document.getElementById("stockModalOverlay").classList.remove("active");
  document.body.style.overflow = "";
  destroyModalCharts();
  modalDataCache = { ticker: null, insiderLoaded: false };
}

// Backward compatibility
function openStockModal(ticker) { openTickerModal(ticker); }

// Build static context from available data sources
function buildStaticContext(ticker) {
  const shortData = SHORTED_STOCKS.find(x => x.ticker === ticker) || null;
  const companyData = COMPANIES.find(x => x.t === ticker) || null;
  return {
    ticker,
    name: shortData?.name || companyData?.n || ticker,
    sector: shortData?.sector || companyData?.s || "Unknown",
    sentiment: companyData?.sent ?? null,
    themes: companyData?.themes || [],
    execQuote: companyData?.q || null,
    hasShortData: !!shortData,
    price: shortData?.price || null,
    chg1d: shortData?.chg1d ?? null,
    chg5d: shortData?.chg5d ?? null,
    chg1m: shortData?.chg1m ?? null,
    chg3m: shortData?.chg3m ?? null,
    siCurrent: shortData?.siCurrent || null,
    siHistory: shortData?.siHistory || null,
    sharesShort: shortData?.sharesShort || null,
    daysTocover: shortData?.daysTocover || null,
    avgVolume: shortData?.avgVolume || null,
    priceHistory: shortData?.priceHistory || null,
    headlines: shortData?.headlines || null,
    optionsHistory: shortData?.optionsHistory || null,
    callVol: shortData?.callVol || null,
    putVol: shortData?.putVol || null,
    pcRatio: shortData?.pcRatio || null,
    ivRank: shortData?.ivRank || null,
    rsi: shortData?.rsi ?? null,
    macd: shortData?.macd ?? null,
    macdSignal: shortData?.macdSignal ?? null,
    macdHist: shortData?.macdHist ?? null,
    sma20: shortData?.sma20 || null,
    sma50: shortData?.sma50 || null,
    sma200: shortData?.sma200 || null,
    atr: shortData?.atr || null,
    vwap: shortData?.vwap || null,
    stochK: shortData?.stochK ?? null,
    stochD: shortData?.stochD ?? null,
    bollingerUpper: shortData?.bollingerUpper || null,
    bollingerLower: shortData?.bollingerLower || null,
    support1: shortData?.support1 || null,
    support2: shortData?.support2 || null,
    resistance1: shortData?.resistance1 || null,
    resistance2: shortData?.resistance2 || null,
    technicalSummary: shortData?.technicalSummary || null,
    overallSignal: shortData?.overallSignal || null,
    // Live data placeholders
    profile: null, quote: null, liveHistory: null,
    analystEstimates: null, news: null, ratios: null, earnings: null,
    insiderTrades: null, institutions: null
  };
}

// Main modal open function
async function openTickerModal(ticker) {
  const thisSession = ++modalSessionId;
  destroyModalCharts();
  modalDataCache = { ticker, insiderLoaded: false };

  const overlay = document.getElementById("stockModalOverlay");
  const modal = document.getElementById("stockModal");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";

  // Show loading state
  modal.innerHTML = `
    <button class="modal-close" onclick="closeStockModal()">&times;</button>
    <div class="modal-header" id="modalHeader">
      <div class="mh-top"><div><span class="mh-ticker">${ticker}</span><span class="mh-name" style="margin-left:12px">Loading...</span></div></div>
      <div style="margin-top:12px"><div class="skeleton-line w80"></div><div class="skeleton-line w60"></div><div class="skeleton-line w40"></div></div>
    </div>
    <div class="modal-tabs" id="modalTabs"></div>
    <div class="modal-body" id="modalBody"><div class="modal-loading"><span class="loading-spinner"></span> Loading ${ticker} data...</div></div>
  `;

  // Build from static data
  let ctx = buildStaticContext(ticker);
  if (thisSession !== modalSessionId) return; // stale

  renderModalContent(ctx);

  // Fetch live data if API key is available
  if (typeof hasApiKey === "function" && hasApiKey()) {
    try {
      const wave1 = await fetchTickerWave1(ticker);
      if (thisSession !== modalSessionId) return;
      ctx = mergeCtx(ctx, wave1);
      renderModalContent(ctx);

      // Lazy load Wave 2
      fetchTickerWave2(ticker).then(wave2 => {
        if (thisSession !== modalSessionId) return;
        ctx = mergeCtx(ctx, wave2);
        renderModalContent(ctx);
      });
    } catch (e) {
      console.warn("Live data fetch failed:", e);
    }
  }
}

function renderModalContent(ctx) {
  renderModalHeader(ctx);
  renderModalTabs(ctx);
}

// ==================== MODAL HEADER ====================
function renderModalHeader(ctx) {
  const header = document.getElementById("modalHeader");
  if (!header) return;

  const price = ctx.quote?.price || ctx.price;
  const change = ctx.quote?.changesPercentage ?? ctx.chg1d;

  let priceHtml = "";
  if (price) {
    const pc = change >= 0 ? "pos" : "neg";
    priceHtml = `<div class="mh-price-row">
      <span class="mh-price">$${price.toFixed(2)}</span>
      ${change != null ? `<span class="mh-change ${pc}">${change >= 0 ? "+" : ""}${change.toFixed(2)}% today</span>` : ""}
      ${ctx.chg5d != null ? `<span class="mh-change ${ctx.chg5d >= 0 ? "pos" : "neg"}">${ctx.chg5d >= 0 ? "+" : ""}${ctx.chg5d}% 5d</span>` : ""}
      ${ctx.chg1m != null ? `<span class="mh-change ${ctx.chg1m >= 0 ? "pos" : "neg"}">${ctx.chg1m >= 0 ? "+" : ""}${ctx.chg1m}% 1m</span>` : ""}
      ${ctx.chg3m != null ? `<span class="mh-change ${ctx.chg3m >= 0 ? "pos" : "neg"}">${ctx.chg3m >= 0 ? "+" : ""}${ctx.chg3m}% 3m</span>` : ""}
    </div>`;
  }

  let stats = '<div class="mh-stats">';
  const q = ctx.quote;
  if (q?.marketCap) stats += `<div class="mh-stat">Mkt Cap: <span>$${formatLargeNum(q.marketCap)}</span></div>`;
  if (q?.volume) stats += `<div class="mh-stat">Volume: <span>${formatLargeNum(q.volume)}</span></div>`;
  if (q?.avgVolume || ctx.avgVolume) stats += `<div class="mh-stat">Avg Vol: <span>${formatLargeNum(q?.avgVolume || ctx.avgVolume)}</span></div>`;
  if (ctx.siCurrent) stats += `<div class="mh-stat">SI: <span style="color:var(--orange)">${ctx.siCurrent}%</span></div>`;
  if (ctx.pcRatio) stats += `<div class="mh-stat">P/C: <span style="color:${ctx.pcRatio > 1.3 ? "var(--red)" : "var(--green)"}">${ctx.pcRatio.toFixed(2)}</span></div>`;
  if (q?.pe) stats += `<div class="mh-stat">P/E: <span>${q.pe.toFixed(1)}</span></div>`;
  if (q?.eps) stats += `<div class="mh-stat">EPS: <span>$${q.eps.toFixed(2)}</span></div>`;
  if (ctx.ivRank) stats += `<div class="mh-stat">IV Rank: <span style="color:${ctx.ivRank > 60 ? "var(--orange)" : "var(--text)"}">${ctx.ivRank}</span></div>`;
  stats += "</div>";

  header.innerHTML = `
    <div class="mh-top">
      <div>
        <span class="mh-ticker">${ctx.ticker}</span>
        <span class="mh-name">${ctx.name}</span>
        <span class="quote-sector-badge" style="margin-left:8px">${ctx.sector}</span>
      </div>
      ${ctx.overallSignal ? `<span class="signal-badge ${ctx.overallSignal}" style="font-size:0.85rem;padding:6px 16px">${ctx.overallSignal} signal</span>` : ""}
    </div>
    ${priceHtml}
    ${stats}
  `;
}

// ==================== MODAL TABS ====================
function renderModalTabs(ctx) {
  const tabsEl = document.getElementById("modalTabs");
  const bodyEl = document.getElementById("modalBody");
  if (!tabsEl || !bodyEl) return;

  // Define which tabs are available
  const tabs = [];
  tabs.push({ id: "overview", label: "Overview" });
  if (ctx.price || ctx.quote || ctx.liveHistory || ctx.priceHistory) tabs.push({ id: "price", label: "Price & Technicals" });
  if (ctx.hasShortData) tabs.push({ id: "si", label: "Short Interest" });
  if (ctx.analystEstimates || ctx.earnings) tabs.push({ id: "analyst", label: "Analyst & Estimates" });
  if (ctx.hasShortData || ctx.pcRatio || ctx.callVol) tabs.push({ id: "options", label: "Options Flow" });
  tabs.push({ id: "insider", label: "Insider & Institutional" });
  if (ctx.news && ctx.news.length > 0) tabs.push({ id: "news", label: "News" });
  if (ctx.ratios) tabs.push({ id: "fundamentals", label: "Fundamentals" });

  // If no API data loaded yet but API is available, show placeholder tabs
  if (typeof hasApiKey === "function" && hasApiKey()) {
    if (!tabs.find(t => t.id === "analyst")) tabs.push({ id: "analyst", label: "Analyst & Estimates" });
    if (!tabs.find(t => t.id === "news")) tabs.push({ id: "news", label: "News" });
    if (!tabs.find(t => t.id === "fundamentals")) tabs.push({ id: "fundamentals", label: "Fundamentals" });
  }

  const activeTab = tabs[0]?.id || "overview";

  tabsEl.innerHTML = tabs.map(t =>
    `<button class="modal-tab ${t.id === activeTab ? "active" : ""}" data-tab="${t.id}" onclick="switchModalTab('${t.id}')">${t.label}</button>`
  ).join("");

  // Render all panels
  let panelsHtml = "";
  tabs.forEach(t => {
    panelsHtml += `<div class="modal-tab-panel ${t.id === activeTab ? "active" : ""}" id="tab-${t.id}">${renderTabContent(t.id, ctx)}</div>`;
  });
  bodyEl.innerHTML = panelsHtml;

  // Create charts after DOM is ready
  requestAnimationFrame(() => {
    destroyModalCharts();
    if (document.getElementById("tab-price")?.classList.contains("active")) createPriceCharts(ctx);
    if (document.getElementById("tab-si")?.classList.contains("active")) createSIChart(ctx);
    if (document.getElementById("tab-options")?.classList.contains("active")) createOptionsChart(ctx);
  });
}

function switchModalTab(tabId) {
  document.querySelectorAll(".modal-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
  document.querySelectorAll(".modal-tab-panel").forEach(p => p.classList.toggle("active", p.id === `tab-${tabId}`));

  // Create charts when their tab becomes visible
  destroyModalCharts();
  if (tabId === "price") {
    const ctx = window._currentModalCtx;
    if (ctx) requestAnimationFrame(() => createPriceCharts(ctx));
  }
  if (tabId === "si") {
    const ctx = window._currentModalCtx;
    if (ctx) requestAnimationFrame(() => createSIChart(ctx));
  }
  if (tabId === "options") {
    const ctx = window._currentModalCtx;
    if (ctx) requestAnimationFrame(() => createOptionsChart(ctx));
  }

  // On-demand fetch for insider tab
  if (tabId === "insider" && !modalDataCache.insiderLoaded && typeof hasApiKey === "function" && hasApiKey()) {
    loadInsiderTab(modalDataCache.ticker);
  }
}

// Store context for tab switching
function renderModalContent(ctx) {
  window._currentModalCtx = ctx;
  renderModalHeader(ctx);
  renderModalTabs(ctx);
}

function renderTabContent(tabId, ctx) {
  switch (tabId) {
    case "overview": return renderOverviewTab(ctx);
    case "price": return renderPriceTab(ctx);
    case "si": return renderSITab(ctx);
    case "analyst": return renderAnalystTab(ctx);
    case "options": return renderOptionsTab(ctx);
    case "insider": return renderInsiderTab(ctx);
    case "news": return renderNewsTab(ctx);
    case "fundamentals": return renderFundamentalsTab(ctx);
    default: return '<div class="no-data-msg">No data available.</div>';
  }
}

// ==================== TAB RENDERERS ====================

function renderOverviewTab(ctx) {
  let html = "";

  // Company profile from FMP
  if (ctx.profile?.description) {
    const desc = ctx.profile.description;
    html += `<div class="company-desc">
      <p>${desc.length > 400 ? desc.slice(0, 400) + "\u2026" : desc}</p>
      <div class="profile-stats">
        ${ctx.profile.ceo ? `<span class="mh-stat">CEO: <span>${ctx.profile.ceo}</span></span>` : ""}
        ${ctx.profile.mktCap ? `<span class="mh-stat">Mkt Cap: <span>$${formatLargeNum(ctx.profile.mktCap)}</span></span>` : ""}
        ${ctx.profile.fullTimeEmployees ? `<span class="mh-stat">Employees: <span>${formatNum(ctx.profile.fullTimeEmployees)}</span></span>` : ""}
        ${ctx.profile.ipoDate ? `<span class="mh-stat">IPO: <span>${ctx.profile.ipoDate}</span></span>` : ""}
        ${ctx.profile.industry ? `<span class="mh-stat">Industry: <span>${ctx.profile.industry}</span></span>` : ""}
      </div>
    </div>`;
  }

  // Earnings sentiment
  if (ctx.sentiment !== null) {
    const sc = getSentimentClass(ctx.sentiment);
    html += `<div class="modal-section" style="margin-top:16px">
      <h4>Earnings Sentiment</h4>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="sentiment-tag ${sc}" style="font-size:0.85rem;padding:4px 14px">${ctx.sentiment.toFixed(2)} ${sc}</span>
        <span style="font-size:0.8rem;color:var(--text2)">Q4 2025 earnings call tone analysis</span>
      </div>
    </div>`;
  }

  // Themes
  if (ctx.themes.length > 0) {
    html += `<div class="modal-section" style="margin-top:12px">
      <h4>Key Themes</h4>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${ctx.themes.map(t => `<span class="theme-tag">${t}</span>`).join("")}</div>
    </div>`;
  }

  // Executive quote
  if (ctx.execQuote) {
    html += `<div class="modal-section" style="margin-top:12px">
      <h4>Executive Quote</h4>
      <div class="quote-text">"${ctx.execQuote}"</div>
    </div>`;
  }

  if (!html) {
    html = `<div class="no-data-msg">No overview data available for ${ctx.ticker}.</div>`;
    if (typeof hasApiKey === "function" && !hasApiKey()) {
      html += `<div class="connect-api-hint" onclick="promptApiKey()">Connect FMP API for company profile, description, and more</div>`;
    }
  }
  return html;
}

function renderPriceTab(ctx) {
  let html = `<div class="modal-grid"><div class="modal-col">
    <h3>Price Action & Moving Averages</h3>
    <div class="modal-chart-wrap"><canvas id="priceChart"></canvas></div>
  </div><div class="modal-col">
    <h3>Technical Indicators</h3>
    <div class="tech-indicators" id="techIndicators">`;

  if (ctx.rsi != null) {
    const rsiColor = ctx.rsi < 30 ? "bearish" : ctx.rsi < 40 ? "bearish" : ctx.rsi < 60 ? "neutral" : "bullish";
    const macdColor = ctx.macdHist != null ? (ctx.macdHist < 0 ? "bearish" : "bullish") : "neutral";
    const stochColor = ctx.stochK != null ? (ctx.stochK < 20 ? "bearish" : ctx.stochK < 80 ? "neutral" : "bullish") : "neutral";

    html += `
      <div class="tech-row"><span class="tech-label">RSI (14)</span>
        <span><span class="tech-gauge"><span class="tech-gauge-fill" style="width:${ctx.rsi}%;background:${ctx.rsi < 30 ? "var(--red)" : ctx.rsi > 70 ? "var(--green)" : "var(--yellow)"}"></span></span>
        <span class="tech-value ${rsiColor}">${ctx.rsi.toFixed(1)}</span></span></div>`;
    if (ctx.macd != null) html += `<div class="tech-row"><span class="tech-label">MACD</span><span class="tech-value ${macdColor}">${ctx.macd.toFixed(2)} / Signal: ${ctx.macdSignal?.toFixed(2) || "N/A"}</span></div>`;
    if (ctx.macdHist != null) html += `<div class="tech-row"><span class="tech-label">MACD Histogram</span><span class="tech-value ${macdColor}">${ctx.macdHist > 0 ? "+" : ""}${ctx.macdHist.toFixed(2)}</span></div>`;
    if (ctx.stochK != null) html += `<div class="tech-row"><span class="tech-label">Stochastic %K / %D</span><span class="tech-value ${stochColor}">${ctx.stochK.toFixed(1)} / ${ctx.stochD?.toFixed(1) || "N/A"}</span></div>`;
    if (ctx.atr != null) html += `<div class="tech-row"><span class="tech-label">ATR (14)</span><span class="tech-value neutral">$${ctx.atr.toFixed(2)}</span></div>`;
    if (ctx.vwap != null) html += `<div class="tech-row"><span class="tech-label">VWAP</span><span class="tech-value neutral">$${ctx.vwap.toFixed(2)}</span></div>`;
    if (ctx.bollingerUpper != null) html += `<div class="tech-row"><span class="tech-label">Bollinger Bands</span><span class="tech-value neutral">$${ctx.bollingerLower.toFixed(2)} \u2014 $${ctx.bollingerUpper.toFixed(2)}</span></div>`;
    if (ctx.sma20) html += `<div class="tech-row"><span class="tech-label">Price vs SMA20</span><span class="tech-value ${(ctx.price || ctx.quote?.price) > ctx.sma20 ? "bullish" : "bearish"}">${(ctx.price || ctx.quote?.price) > ctx.sma20 ? "Above" : "Below"} ($${ctx.sma20.toFixed(2)})</span></div>`;
    if (ctx.sma50) html += `<div class="tech-row"><span class="tech-label">Price vs SMA50</span><span class="tech-value ${(ctx.price || ctx.quote?.price) > ctx.sma50 ? "bullish" : "bearish"}">${(ctx.price || ctx.quote?.price) > ctx.sma50 ? "Above" : "Below"} ($${ctx.sma50.toFixed(2)})</span></div>`;
    if (ctx.sma200) html += `<div class="tech-row"><span class="tech-label">Price vs SMA200</span><span class="tech-value ${(ctx.price || ctx.quote?.price) > ctx.sma200 ? "bullish" : "bearish"}">${(ctx.price || ctx.quote?.price) > ctx.sma200 ? "Above" : "Below"} ($${ctx.sma200.toFixed(2)})</span></div>`;
  } else {
    html += `<div style="padding:16px;color:var(--text2);font-size:0.82rem">Technical indicators available with live data connection.</div>`;
  }

  html += `</div></div></div>`; // close tech-indicators, modal-col, modal-grid

  // Key Levels
  if (ctx.support1) {
    html += `<div class="key-levels" style="margin-top:16px">
      <h4>Key Price Levels</h4>
      <div class="levels-grid">
        <div class="level-item"><span class="level-label">Support 1</span><span class="level-value support">$${ctx.support1.toFixed(2)}</span></div>
        <div class="level-item"><span class="level-label">Resistance 1</span><span class="level-value resistance">$${ctx.resistance1.toFixed(2)}</span></div>
        <div class="level-item"><span class="level-label">Support 2</span><span class="level-value support">$${ctx.support2.toFixed(2)}</span></div>
        <div class="level-item"><span class="level-label">Resistance 2</span><span class="level-value resistance">$${ctx.resistance2.toFixed(2)}</span></div>
        ${ctx.sma20 ? `<div class="level-item"><span class="level-label">SMA 20</span><span class="level-value ma">$${ctx.sma20.toFixed(2)}</span></div>` : ""}
        ${ctx.sma50 ? `<div class="level-item"><span class="level-label">SMA 50</span><span class="level-value ma">$${ctx.sma50.toFixed(2)}</span></div>` : ""}
        ${ctx.sma200 ? `<div class="level-item"><span class="level-label">SMA 200</span><span class="level-value ma">$${ctx.sma200.toFixed(2)}</span></div>` : ""}
        ${ctx.vwap ? `<div class="level-item"><span class="level-label">VWAP</span><span class="level-value ma">$${ctx.vwap.toFixed(2)}</span></div>` : ""}
        ${ctx.bollingerUpper ? `<div class="level-item"><span class="level-label">Bollinger Upper</span><span class="level-value resistance">$${ctx.bollingerUpper.toFixed(2)}</span></div>` : ""}
        ${ctx.bollingerLower ? `<div class="level-item"><span class="level-label">Bollinger Lower</span><span class="level-value support">$${ctx.bollingerLower.toFixed(2)}</span></div>` : ""}
      </div>
    </div>`;
  }

  // Technical Summary
  if (ctx.technicalSummary) {
    html += `<div class="tech-summary" style="margin-top:16px">
      <span class="summary-signal ${ctx.overallSignal}">${ctx.overallSignal}</span>
      <p class="summary-text">${ctx.technicalSummary}</p>
    </div>`;
  }

  return html;
}

function renderSITab(ctx) {
  if (!ctx.hasShortData) return '<div class="no-data-msg">Short interest data not available for this ticker.</div>';

  let html = `<div class="modal-grid"><div class="modal-col">
    <h3>Short Interest \u2014 90 Day History</h3>
    <div class="modal-chart-wrap"><canvas id="siHistoryChart"></canvas></div>
    <div class="mh-stats" style="margin-top:12px">
      <div class="mh-stat">SI: <span style="color:var(--orange)">${ctx.siCurrent}%</span> of float</div>
      ${ctx.sharesShort ? `<div class="mh-stat">Shares Short: <span>${(ctx.sharesShort / 1e6).toFixed(1)}M</span></div>` : ""}
      ${ctx.daysTocover ? `<div class="mh-stat">Days to Cover: <span>${ctx.daysTocover}</span></div>` : ""}
    </div>
  </div><div class="modal-col">
    <h3>Short Interest vs Headlines</h3>
    <div class="headlines-list">${ctx.headlines ? ctx.headlines.map(h => `
      <div class="headline-card">
        <div class="hl-date">${h.date}, 2026</div>
        <div class="hl-title">${h.title}</div>
        <div class="hl-meta">
          <span class="hl-impact ${h.impact}">${h.impact}</span>
          <span class="hl-si-move">SI Move: <strong style="color:${h.siMove.startsWith("+") ? "var(--red)" : "var(--green)"}">${h.siMove}</strong></span>
        </div>
      </div>
    `).join("") : ""}</div>
  </div></div>`;
  return html;
}

function renderAnalystTab(ctx) {
  if (!ctx.analystEstimates && !ctx.earnings) {
    if (typeof hasApiKey === "function" && !hasApiKey()) {
      return `<div class="no-data-msg">Analyst estimates require live data.</div><div class="connect-api-hint" onclick="promptApiKey()">Connect FMP API for analyst ratings, price targets, and EPS estimates</div>`;
    }
    return `<div class="modal-loading"><span class="loading-spinner"></span> Loading analyst data...</div>`;
  }

  let html = "";
  if (ctx.analystEstimates && Array.isArray(ctx.analystEstimates) && ctx.analystEstimates.length > 0) {
    const latest = ctx.analystEstimates[0];
    html += `<div class="modal-section"><h4>Consensus Estimates</h4><div class="analyst-grid">
      ${latest.estimatedRevenueAvg ? `<div class="analyst-card"><div class="label">Est. Revenue</div><div class="value">$${formatLargeNum(latest.estimatedRevenueAvg)}</div></div>` : ""}
      ${latest.estimatedEpsAvg != null ? `<div class="analyst-card"><div class="label">Est. EPS</div><div class="value" style="color:var(--green)">$${latest.estimatedEpsAvg.toFixed(2)}</div></div>` : ""}
      ${latest.estimatedEpsHigh != null ? `<div class="analyst-card"><div class="label">EPS High / Low</div><div class="value">$${latest.estimatedEpsHigh.toFixed(2)} / $${latest.estimatedEpsLow.toFixed(2)}</div></div>` : ""}
      ${latest.numberAnalystsEstimatedRevenue ? `<div class="analyst-card"><div class="label"># Analysts</div><div class="value">${latest.numberAnalystsEstimatedRevenue}</div></div>` : ""}
      ${latest.estimatedRevenueHigh ? `<div class="analyst-card"><div class="label">Rev. High / Low</div><div class="value">$${formatLargeNum(latest.estimatedRevenueHigh)} / $${formatLargeNum(latest.estimatedRevenueLow)}</div></div>` : ""}
      ${latest.estimatedNetIncomeAvg ? `<div class="analyst-card"><div class="label">Est. Net Income</div><div class="value">$${formatLargeNum(latest.estimatedNetIncomeAvg)}</div></div>` : ""}
    </div></div>`;
  }

  if (ctx.earnings && Array.isArray(ctx.earnings) && ctx.earnings.length > 0) {
    html += `<div class="modal-section" style="margin-top:16px"><h4>Earnings Surprise History</h4>`;
    html += ctx.earnings.slice(0, 8).map(e => {
      const surprise = (e.actualEarningResult || 0) - (e.estimatedEarning || 0);
      const beat = surprise >= 0;
      return `<div class="earnings-row">
        <span style="color:var(--text2);font-size:0.75rem;min-width:80px">${e.date || "N/A"}</span>
        <span>Est: $${e.estimatedEarning?.toFixed(2) || "N/A"}</span>
        <span>Actual: <strong>$${e.actualEarningResult?.toFixed(2) || "N/A"}</strong></span>
        <span class="${beat ? "earnings-beat" : "earnings-miss"}">${beat ? "+" : ""}${surprise.toFixed(2)} ${beat ? "BEAT" : "MISS"}</span>
      </div>`;
    }).join("");
    html += `</div>`;
  }

  return html || '<div class="no-data-msg">No analyst data available.</div>';
}

function renderOptionsTab(ctx) {
  let html = "";

  if (ctx.optionsHistory) {
    html += `<div class="modal-grid"><div class="modal-col">
      <h3>Options Flow \u2014 Calls vs Puts (90d)</h3>
      <div class="modal-chart-wrap"><canvas id="optionsChart"></canvas></div>
    </div><div class="modal-col">
      <h3>Options Metrics</h3>
      <div class="tech-indicators">
        ${ctx.callVol ? `<div class="tech-row"><span class="tech-label">Call Volume</span><span class="tech-value neutral">${(ctx.callVol / 1000).toFixed(1)}K</span></div>` : ""}
        ${ctx.putVol ? `<div class="tech-row"><span class="tech-label">Put Volume</span><span class="tech-value bearish">${(ctx.putVol / 1000).toFixed(1)}K</span></div>` : ""}
        ${ctx.pcRatio ? `<div class="tech-row"><span class="tech-label">Put/Call Ratio</span><span class="tech-value ${ctx.pcRatio > 1.0 ? "bearish" : "bullish"}">${ctx.pcRatio.toFixed(2)}</span></div>` : ""}
        ${ctx.ivRank ? `<div class="tech-row"><span class="tech-label">IV Rank</span><span class="tech-value ${ctx.ivRank > 60 ? "bearish" : "neutral"}">${ctx.ivRank}</span></div>` : ""}
      </div>
    </div></div>`;
  } else {
    html = '<div class="no-data-msg">Options flow data not available for this ticker.</div>';
  }
  return html;
}

function renderInsiderTab(ctx) {
  if (typeof hasApiKey === "function" && !hasApiKey()) {
    return `<div class="no-data-msg">Insider and institutional data requires live data.</div><div class="connect-api-hint" onclick="promptApiKey()">Connect FMP API for insider trades and institutional holdings</div>`;
  }
  return `<div class="modal-loading"><span class="loading-spinner"></span> Loading insider & institutional data...</div>`;
}

async function loadInsiderTab(ticker) {
  const panel = document.getElementById("tab-insider");
  if (!panel) return;

  const [insiders, holders] = await Promise.all([
    fetchInsiderData(ticker),
    fetchInstitutionalHolders(ticker)
  ]);

  let html = "";

  if (insiders && Array.isArray(insiders) && insiders.length > 0) {
    html += `<div class="modal-section"><h4>Recent Insider Transactions</h4>
    <div style="overflow-x:auto"><table class="insider-table">
      <thead><tr><th>Date</th><th>Name</th><th>Title</th><th>Type</th><th>Shares</th><th>Price</th><th>Value</th></tr></thead>
      <tbody>${insiders.slice(0, 12).map(t => {
        const isBuy = t.transactionType && (t.transactionType.includes("P") || t.transactionType.includes("urchase"));
        const val = (t.securitiesTransacted || 0) * (t.price || 0);
        return `<tr>
          <td>${t.transactionDate || "N/A"}</td>
          <td style="font-weight:600">${t.reportingName || "N/A"}</td>
          <td style="font-size:0.72rem;color:var(--text2)">${t.typeOfOwner || ""}</td>
          <td class="${isBuy ? "insider-buy" : "insider-sell"}">${isBuy ? "BUY" : "SELL"}</td>
          <td>${formatNum(t.securitiesTransacted)}</td>
          <td>$${t.price?.toFixed(2) || "N/A"}</td>
          <td style="font-weight:600">$${formatLargeNum(val)}</td>
        </tr>`;
      }).join("")}</tbody>
    </table></div></div>`;
  } else {
    html += `<div class="no-data-msg" style="margin-bottom:16px">No recent insider transactions found.</div>`;
  }

  if (holders && Array.isArray(holders) && holders.length > 0) {
    html += `<div class="modal-section"><h4>Top Institutional Holders</h4>
    <div style="overflow-x:auto"><table class="insider-table">
      <thead><tr><th>Institution</th><th>Shares</th><th>Value</th><th>% Portfolio</th><th>Date Reported</th></tr></thead>
      <tbody>${holders.slice(0, 10).map(h => `
        <tr>
          <td style="font-weight:600">${h.holder || "N/A"}</td>
          <td>${formatLargeNum(h.shares)}</td>
          <td>$${formatLargeNum(h.value)}</td>
          <td>${h.weightPercent != null ? (h.weightPercent).toFixed(2) + "%" : "N/A"}</td>
          <td style="color:var(--text2)">${h.dateReported || "N/A"}</td>
        </tr>
      `).join("")}</tbody>
    </table></div></div>`;
  } else {
    html += `<div class="no-data-msg">No institutional holder data found.</div>`;
  }

  panel.innerHTML = html;
  modalDataCache.insiderLoaded = true;
}

function renderNewsTab(ctx) {
  if (!ctx.news || !Array.isArray(ctx.news) || ctx.news.length === 0) {
    if (typeof hasApiKey === "function" && !hasApiKey()) {
      return `<div class="no-data-msg">News requires live data connection.</div><div class="connect-api-hint" onclick="promptApiKey()">Connect FMP API for real-time news</div>`;
    }
    return `<div class="modal-loading"><span class="loading-spinner"></span> Loading news...</div>`;
  }
  return `<div class="news-grid">${ctx.news.slice(0, 10).map(n => `
    <div class="news-card">
      <div class="hl-date">${n.publishedDate ? new Date(n.publishedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}</div>
      <a href="${n.url || "#"}" target="_blank" rel="noopener">${n.title || "Untitled"}</a>
      <div class="news-source">${n.site || ""} ${n.symbol ? `\u00b7 ${n.symbol}` : ""}</div>
    </div>
  `).join("")}</div>`;
}

function renderFundamentalsTab(ctx) {
  if (!ctx.ratios) {
    if (typeof hasApiKey === "function" && !hasApiKey()) {
      return `<div class="no-data-msg">Fundamentals require live data.</div><div class="connect-api-hint" onclick="promptApiKey()">Connect FMP API for P/E, ROE, margins, and more</div>`;
    }
    return `<div class="modal-loading"><span class="loading-spinner"></span> Loading fundamentals...</div>`;
  }

  const r = Array.isArray(ctx.ratios) ? ctx.ratios[0] : ctx.ratios;
  if (!r) return '<div class="no-data-msg">No fundamentals data available.</div>';

  const safe = (v, fmt) => { try { return v != null ? fmt(v) : "N/A"; } catch { return "N/A"; } };

  return `<div class="modal-section"><h4>Valuation & Profitability (TTM)</h4>
    <div class="valuation-grid">
      ${valItem("P/E", safe(r.peRatioTTM, v => v.toFixed(1)))}
      ${valItem("P/B", safe(r.priceToBookRatioTTM, v => v.toFixed(2)))}
      ${valItem("P/S", safe(r.priceToSalesRatioTTM, v => v.toFixed(2)))}
      ${valItem("EV/EBITDA", safe(r.enterpriseValueOverEBITDATTM, v => v.toFixed(1)))}
      ${valItem("ROE", safe(r.returnOnEquityTTM, v => (v * 100).toFixed(1) + "%"))}
      ${valItem("ROA", safe(r.returnOnAssetsTTM, v => (v * 100).toFixed(1) + "%"))}
      ${valItem("D/E", safe(r.debtEquityRatioTTM, v => v.toFixed(2)))}
      ${valItem("Div Yield", safe(r.dividendYielTTM, v => (v * 100).toFixed(2) + "%"))}
      ${valItem("Net Margin", safe(r.netProfitMarginTTM, v => (v * 100).toFixed(1) + "%"))}
      ${valItem("Gross Margin", safe(r.grossProfitMarginTTM, v => (v * 100).toFixed(1) + "%"))}
      ${valItem("Op Margin", safe(r.operatingProfitMarginTTM, v => (v * 100).toFixed(1) + "%"))}
      ${valItem("Current Ratio", safe(r.currentRatioTTM, v => v.toFixed(2)))}
    </div>
  </div>`;
}

// ==================== CHART CREATORS ====================

function createPriceCharts(ctx) {
  const canvas = document.getElementById("priceChart");
  if (!canvas) return;
  const chartCtx = canvas.getContext("2d");

  // Use live history if available, otherwise static
  let labels, priceData;
  if (ctx.liveHistory && ctx.liveHistory.length > 0) {
    const daily = [...ctx.liveHistory].reverse();
    // Sample ~13 points from 90 days
    const step = Math.max(1, Math.floor(daily.length / 13));
    labels = []; priceData = [];
    for (let i = 0; i < daily.length; i += step) {
      const d = daily[i];
      labels.push(new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }));
      priceData.push(d.close);
    }
  } else if (ctx.priceHistory) {
    labels = typeof WEEKLY_DATES !== "undefined" ? WEEKLY_DATES : Array.from({ length: 13 }, (_, i) => `W${i + 1}`);
    priceData = ctx.priceHistory;
  } else {
    return;
  }

  const datasets = [{ label: "Price", data: priceData, borderColor: "#e2e8f0", backgroundColor: "rgba(226,232,240,0.05)", fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2 }];
  if (ctx.sma20) datasets.push({ label: "SMA 20", data: Array(labels.length).fill(ctx.sma20), borderColor: "#3b82f6", borderDash: [5, 3], borderWidth: 1.5, pointRadius: 0 });
  if (ctx.sma50) datasets.push({ label: "SMA 50", data: Array(labels.length).fill(ctx.sma50), borderColor: "#f97316", borderDash: [5, 3], borderWidth: 1.5, pointRadius: 0 });
  if (ctx.sma200) datasets.push({ label: "SMA 200", data: Array(labels.length).fill(ctx.sma200), borderColor: "#a855f7", borderDash: [8, 4], borderWidth: 1.5, pointRadius: 0 });

  modalCharts.price = new Chart(chartCtx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 9 }, boxWidth: 10, padding: 8 } },
        tooltip: { backgroundColor: "#1a2236", borderColor: "#1e2d4a", borderWidth: 1, callbacks: { label: c => `${c.dataset.label}: $${c.raw.toFixed(2)}` } }
      },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 9 }, callback: v => "$" + v.toFixed(0) }, grid: { color: "#1e2d4a" } }
      }
    }
  });
}

function createSIChart(ctx) {
  const canvas = document.getElementById("siHistoryChart");
  if (!canvas || !ctx.siHistory) return;
  const chartCtx = canvas.getContext("2d");

  modalCharts.si = new Chart(chartCtx, {
    type: "line",
    data: {
      labels: typeof WEEKLY_DATES !== "undefined" ? WEEKLY_DATES : Array.from({ length: 13 }, (_, i) => `W${i + 1}`),
      datasets: [{ label: "Short Interest %", data: ctx.siHistory, borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", fill: true, tension: 0.3, pointRadius: 3, pointBackgroundColor: "#ef4444", borderWidth: 2 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1a2236", borderColor: "#1e2d4a", borderWidth: 1, callbacks: { label: c => `SI: ${c.raw.toFixed(1)}%` } } },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 9 }, callback: v => v.toFixed(1) + "%" }, grid: { color: "#1e2d4a" } }
      }
    }
  });
}

function createOptionsChart(ctx) {
  const canvas = document.getElementById("optionsChart");
  if (!canvas || !ctx.optionsHistory) return;
  const chartCtx = canvas.getContext("2d");

  modalCharts.options = new Chart(chartCtx, {
    type: "bar",
    data: {
      labels: typeof WEEKLY_DATES !== "undefined" ? WEEKLY_DATES : Array.from({ length: 13 }, (_, i) => `W${i + 1}`),
      datasets: [
        { label: "Call Volume", data: ctx.optionsHistory.calls, backgroundColor: "rgba(34,197,94,0.6)", borderRadius: 3 },
        { label: "Put Volume", data: ctx.optionsHistory.puts, backgroundColor: "rgba(239,68,68,0.6)", borderRadius: 3 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 9 }, boxWidth: 10, padding: 8 } },
        tooltip: { backgroundColor: "#1a2236", borderColor: "#1e2d4a", borderWidth: 1, callbacks: { label: c => `${c.dataset.label}: ${(c.raw / 1000).toFixed(0)}K` } }
      },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 9 }, callback: v => (v / 1000).toFixed(0) + "K" }, grid: { color: "#1e2d4a" } }
      }
    }
  });
}

// ==================== OPTIONS WRITING INTELLIGENCE ====================

function renderOptionsWritingKPIs() {
  const candidates = getAllOptionsWritingCandidates();
  const avgIV = (candidates.reduce((s, c) => s + c.optionsWriting.ivRank, 0) / candidates.length).toFixed(0);
  const highIV = candidates.filter(c => c.optionsWriting.ivRank > 50).length;
  const bestYield = Math.max(...candidates.map(c => c.optionsWriting.callYieldAnn));
  const skewAlerts = candidates.filter(c => {
    const stock = SHORTED_STOCKS.find(s => s.ticker === c.ticker);
    return stock && stock.pcRatio > 1.5;
  }).length;

  const kpis = [
    { value: avgIV, label: "Avg IV Rank", sub: "Across all candidates", color: "var(--purple)" },
    { value: highIV, label: "IV Rank > 50", sub: "Elevated premium stocks", color: "var(--orange)" },
    { value: `${bestYield.toFixed(0)}%`, label: "Best Ann. Yield", sub: "Top premium opportunity", color: "var(--green)" },
    { value: skewAlerts, label: "P/C Skew Alerts", sub: "Put/Call ratio > 1.5", color: "var(--red)" }
  ];

  document.getElementById("owKpiRow").innerHTML = kpis.map(k => `
    <div class="ow-kpi">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value" style="color:${k.color}">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>
  `).join("");
}

function renderSpikeAlerts() {
  const candidates = getAllOptionsWritingCandidates();
  const spikes = candidates.filter(c => c.optionsWriting.ivChange5d > 15).sort((a, b) => b.optionsWriting.ivChange5d - a.optionsWriting.ivChange5d);

  if (spikes.length === 0) {
    document.getElementById("spikeAlerts").innerHTML = '<div class="no-data-msg">No premium spike alerts currently active.</div>';
    return;
  }

  document.getElementById("spikeAlerts").innerHTML = spikes.slice(0, 8).map(c => {
    const ow = c.optionsWriting;
    return `<div class="spike-card" onclick="openTickerModal('${c.ticker}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="spike-ticker">${c.ticker}</div>
          <div class="spike-name">${c.name}</div>
        </div>
        <span class="ow-signal sell">OPPORTUNITY</span>
      </div>
      <div class="spike-label">5-Day IV Change</div>
      <div class="spike-iv">+${ow.ivChange5d.toFixed(1)}%</div>
      <div class="spike-meta">
        IV Rank: <strong style="color:var(--orange)">${ow.ivRank}</strong> &middot;
        30d IV: <strong>${(ow.iv30d * 100).toFixed(0)}%</strong> vs Hist: <strong>${(ow.ivHist * 100).toFixed(0)}%</strong> &middot;
        Price: <strong>$${c.price.toFixed(2)}</strong>
      </div>
    </div>`;
  }).join("");
}

function renderCoveredCallTable() {
  const candidates = getAllOptionsWritingCandidates().sort((a, b) => b.optionsWriting.ivRank - a.optionsWriting.ivRank);

  document.getElementById("ccTableBody").innerHTML = candidates.map(c => {
    const ow = c.optionsWriting;
    const ivBarPct = Math.min(100, ow.ivRank);
    return `<tr onclick="openTickerModal('${c.ticker}')">
      <td><span class="ticker-chip clickable">${c.ticker}</span></td>
      <td style="font-size:0.76rem">${c.name}</td>
      <td style="font-weight:700">$${c.price.toFixed(2)}</td>
      <td>
        <span class="iv-bar"><span class="iv-fill ${ow.ivRank > 50 ? "iv-elevated" : "iv-normal"}" style="width:${ivBarPct}%"></span></span>
        <span style="font-weight:700;color:${ow.ivRank > 60 ? "var(--orange)" : "var(--text)"}">${ow.ivRank}</span>
      </td>
      <td>${(ow.iv30d * 100).toFixed(0)}% <span style="font-size:0.65rem;color:var(--text2)">vs ${(ow.ivHist * 100).toFixed(0)}%</span></td>
      <td style="font-weight:700;color:var(--green)">$${ow.atmCallPremium.toFixed(2)}</td>
      <td style="font-weight:700;color:var(--cyan)">${ow.callYieldAnn.toFixed(1)}%</td>
      <td>${ow.callDelta.toFixed(2)}</td>
      <td>${ow.dte}d</td>
      <td>${ow.earningsInWindow ? '<span class="earnings-warn">EARNINGS</span>' : '<span class="earnings-clear">Clear</span>'}</td>
      <td><span class="ow-signal ${ow.ccSignal}">${ow.ccSignal}</span></td>
    </tr>`;
  }).join("");
}

function renderCashSecuredPutTable() {
  const candidates = getAllOptionsWritingCandidates().sort((a, b) => {
    const scoreA = a.optionsWriting.ivRank * a.optionsWriting.putYieldAnn * (a.rsi < 40 ? 1.3 : 1);
    const scoreB = b.optionsWriting.ivRank * b.optionsWriting.putYieldAnn * (b.rsi < 40 ? 1.3 : 1);
    return scoreB - scoreA;
  });

  document.getElementById("cspTableBody").innerHTML = candidates.map(c => {
    const ow = c.optionsWriting;
    const ivBarPct = Math.min(100, ow.ivRank);
    const rsiColor = c.rsi < 30 ? "var(--red)" : c.rsi < 40 ? "var(--orange)" : c.rsi < 60 ? "var(--text2)" : "var(--green)";
    return `<tr onclick="openTickerModal('${c.ticker}')">
      <td><span class="ticker-chip clickable">${c.ticker}</span></td>
      <td style="font-size:0.76rem">${c.name}</td>
      <td style="font-weight:700">$${c.price.toFixed(2)}</td>
      <td>
        <span class="iv-bar"><span class="iv-fill ${ow.ivRank > 50 ? "iv-elevated" : "iv-normal"}" style="width:${ivBarPct}%"></span></span>
        <span style="font-weight:700;color:${ow.ivRank > 60 ? "var(--orange)" : "var(--text)"}">${ow.ivRank}</span>
      </td>
      <td style="font-weight:700;color:var(--purple)">$${ow.atmPutPremium.toFixed(2)}</td>
      <td style="font-weight:700;color:var(--cyan)">${ow.putYieldAnn.toFixed(1)}%</td>
      <td style="color:var(--green)">${ow.marginOfSafety.toFixed(1)}%</td>
      <td>$${c.support1.toFixed(2)}</td>
      <td style="font-weight:700;color:${rsiColor}">${c.rsi.toFixed(1)}</td>
      <td>${ow.pe > 0 ? ow.pe.toFixed(1) : "N/A"}</td>
      <td><span class="ow-signal ${ow.cspSignal}">${ow.cspSignal}</span></td>
    </tr>`;
  }).join("");
}

function renderOptionsWritingSection() {
  renderOptionsWritingKPIs();
  renderSpikeAlerts();
  renderCoveredCallTable();
  renderCashSecuredPutTable();
}

// ==================== EVENT LISTENERS ====================

// Close modal on overlay click
document.addEventListener("click", (e) => {
  if (e.target.id === "stockModalOverlay") closeStockModal();
});

// Close modal on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeStockModal();
});

// ==================== INITIALIZE ====================
document.addEventListener("DOMContentLoaded", () => {
  renderKPIs();
  renderThemeChart();
  renderSentimentChart();
  renderSignals();
  initQuoteFilters();
  renderQuotes();
  renderSectorTabs();
  renderSectorTable();
  renderShortsKPIs();
  renderShortsTable();
  renderOptionsWritingSection();
});
