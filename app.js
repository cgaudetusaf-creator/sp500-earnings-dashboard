// S&P 500 Earnings Intelligence Dashboard - Application Logic

// ==================== KPI CARDS ====================
function renderKPIs() {
  const totalCompanies = COMPANIES.length;
  const totalThemes = THEMES.length;
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
  const sectorColors = [
    "#3b82f6","#22c55e","#a855f7","#f97316","#06b6d4",
    "#ef4444","#ec4899","#14b8a6","#eab308","#6366f1","#f43f5e"
  ];

  const datasets = SECTORS.map((sector, i) => ({
    label: sector,
    data: topThemes.map(theme => THEME_SECTOR_MATRIX[theme]?.[sector] || 0),
    backgroundColor: sectorColors[i] + "cc",
    borderWidth: 0,
    borderRadius: 2
  }));

  new Chart(ctx, {
    type: "bar",
    data: { labels: topThemes.map(t => t.length > 22 ? t.slice(0, 20) + "…" : t), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#94a3b8", font: { size: 10 }, boxWidth: 12, padding: 8 }
        },
        tooltip: {
          backgroundColor: "#1a2236",
          borderColor: "#1e2d4a",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.raw} mentions`
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: "#94a3b8", font: { size: 9 }, maxRotation: 45 },
          grid: { display: false }
        },
        y: {
          stacked: true,
          ticks: { color: "#94a3b8", font: { size: 10 } },
          grid: { color: "#1e2d4a" },
          title: { display: true, text: "Mentions in Transcripts", color: "#94a3b8", font: { size: 11 } }
        }
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
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.map(c => c + "cc"),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1a2236",
          borderColor: "#1e2d4a",
          borderWidth: 1,
          callbacks: {
            label: ctx => `Sentiment: ${ctx.raw.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          min: 0.5, max: 0.85,
          ticks: { color: "#94a3b8", font: { size: 10 }, callback: v => v.toFixed(2) },
          grid: { color: "#1e2d4a" }
        },
        y: {
          ticks: { color: "#e2e8f0", font: { size: 10 } },
          grid: { display: false }
        }
      }
    }
  });
}

// ==================== MOMENTUM SIGNALS ====================
function renderSignals() {
  document.getElementById("signalCount").textContent = `— ${SIGNALS.length} active signals`;
  document.getElementById("signalsGrid").innerHTML = SIGNALS.map(s => `
    <div class="signal-card ${s.type}">
      <div class="signal-type ${s.type}">${s.type === "transition" ? "Energy Transition" : s.type}</div>
      <div class="signal-title">${s.title}</div>
      <div class="signal-desc">${s.desc}</div>
      <div class="signal-tickers">${s.tickers.map(t => `<span class="ticker-chip">${t}</span>`).join("")}</div>
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
        <span><span class="quote-ticker">${c.t}</span> <span class="quote-company">${c.n}</span></span>
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
  // Populate sector filter
  const sectorSelect = document.getElementById("sectorFilter");
  SECTORS.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s; opt.textContent = s;
    sectorSelect.appendChild(opt);
  });

  // Populate theme filter
  const themeSelect = document.getElementById("themeFilter");
  THEMES.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t; opt.textContent = t;
    themeSelect.appendChild(opt);
  });

  // Event listeners
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

function switchSector(sector) {
  activeSector = sector;
  renderSectorTabs();
  renderSectorTable();
}

function renderSectorTable() {
  const companies = COMPANIES.filter(c => c.s === activeSector).sort((a, b) => b.sent - a.sent);
  document.getElementById("sectorTableBody").innerHTML = companies.map(c => {
    const sentClass = getSentimentClass(c.sent);
    const sentColor = sentClass === "bullish" ? "var(--green)" : sentClass === "neutral" ? "var(--yellow)" : "var(--red)";
    const sentPct = ((c.sent - 0.4) / 0.55 * 100).toFixed(0);
    return `<tr>
      <td><span class="ticker-chip">${c.t}</span></td>
      <td>${c.n}</td>
      <td>
        <span class="sentiment-bar"><span class="sentiment-fill" style="width:${sentPct}%;background:${sentColor}"></span></span>
        <span style="color:${sentColor};font-weight:600">${c.sent.toFixed(2)}</span>
      </td>
      <td><div class="td-themes">${c.themes.map(t => `<span class="theme-tag">${t}</span>`).join("")}</div></td>
      <td style="max-width:320px;font-size:0.75rem;color:var(--text2);font-style:italic">"${c.q.slice(0, 120)}${c.q.length > 120 ? "…" : ""}"</td>
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

    return `<tr onclick="openStockModal('${s.ticker}')">
      <td style="font-weight:700;color:var(--text2)">#${i + 1}</td>
      <td><span class="ticker-chip">${s.ticker}</span></td>
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
      <td><button class="detail-btn" onclick="event.stopPropagation();openStockModal('${s.ticker}')">Deep Dive</button></td>
    </tr>`;
  }).join("");
}

// ==================== STOCK DETAIL MODAL ====================
let modalCharts = {};

function destroyModalCharts() {
  Object.values(modalCharts).forEach(c => c.destroy());
  modalCharts = {};
}

function openStockModal(ticker) {
  const s = SHORTED_STOCKS.find(x => x.ticker === ticker);
  if (!s) return;

  destroyModalCharts();
  document.getElementById("stockModalOverlay").classList.add("active");
  document.body.style.overflow = "hidden";

  // Header
  const priceClass = s.chg1d >= 0 ? "pos" : "neg";
  document.getElementById("modalHeader").innerHTML = `
    <div class="mh-top">
      <div>
        <span class="mh-ticker">${s.ticker}</span>
        <span class="mh-name">${s.name}</span>
        <span class="quote-sector-badge" style="margin-left:8px">${s.sector}</span>
      </div>
      <span class="signal-badge ${s.overallSignal}" style="font-size:0.85rem;padding:6px 16px">${s.overallSignal} signal</span>
    </div>
    <div class="mh-price-row">
      <span class="mh-price">$${s.price.toFixed(2)}</span>
      <span class="mh-change ${priceClass}">${s.chg1d >= 0 ? "+" : ""}${s.chg1d}% today</span>
      <span class="mh-change ${s.chg5d >= 0 ? "pos" : "neg"}">${s.chg5d >= 0 ? "+" : ""}${s.chg5d}% 5d</span>
      <span class="mh-change ${s.chg1m >= 0 ? "pos" : "neg"}">${s.chg1m >= 0 ? "+" : ""}${s.chg1m}% 1m</span>
      <span class="mh-change ${s.chg3m >= 0 ? "pos" : "neg"}">${s.chg3m >= 0 ? "+" : ""}${s.chg3m}% 3m</span>
    </div>
    <div class="mh-stats">
      <div class="mh-stat">SI: <span style="color:var(--orange)">${s.siCurrent}%</span> of float</div>
      <div class="mh-stat">Shares Short: <span>${(s.sharesShort / 1e6).toFixed(1)}M</span></div>
      <div class="mh-stat">Days to Cover: <span>${s.daysTocover}</span></div>
      <div class="mh-stat">Avg Volume: <span>${(s.avgVolume / 1e6).toFixed(1)}M</span></div>
      <div class="mh-stat">IV Rank: <span style="color:${s.ivRank > 60 ? "var(--orange)" : "var(--text)"}">${s.ivRank}</span></div>
      <div class="mh-stat">Put/Call: <span style="color:${s.pcRatio > 1.3 ? "var(--red)" : "var(--green)"}">${s.pcRatio.toFixed(2)}</span></div>
    </div>`;

  // SI History Chart
  const siCtx = document.getElementById("siHistoryChart").getContext("2d");
  modalCharts.si = new Chart(siCtx, {
    type: "line",
    data: {
      labels: WEEKLY_DATES,
      datasets: [{
        label: "Short Interest %",
        data: s.siHistory,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: "#ef4444",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "#1a2236", borderColor: "#1e2d4a", borderWidth: 1, callbacks: { label: ctx => `SI: ${ctx.raw.toFixed(1)}%` } } },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 9 }, callback: v => v.toFixed(1) + "%" }, grid: { color: "#1e2d4a" } }
      }
    }
  });

  // Price Chart with MAs
  const priceCtx = document.getElementById("priceChart").getContext("2d");
  const sma20Line = Array(13).fill(s.sma20);
  const sma50Line = Array(13).fill(s.sma50);
  const sma200Line = Array(13).fill(s.sma200);
  modalCharts.price = new Chart(priceCtx, {
    type: "line",
    data: {
      labels: WEEKLY_DATES,
      datasets: [
        { label: "Price", data: s.priceHistory, borderColor: "#e2e8f0", backgroundColor: "rgba(226,232,240,0.05)", fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2 },
        { label: "SMA 20", data: sma20Line, borderColor: "#3b82f6", borderDash: [5, 3], borderWidth: 1.5, pointRadius: 0 },
        { label: "SMA 50", data: sma50Line, borderColor: "#f97316", borderDash: [5, 3], borderWidth: 1.5, pointRadius: 0 },
        { label: "SMA 200", data: sma200Line, borderColor: "#a855f7", borderDash: [8, 4], borderWidth: 1.5, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 9 }, boxWidth: 10, padding: 8 } },
        tooltip: { backgroundColor: "#1a2236", borderColor: "#1e2d4a", borderWidth: 1, callbacks: { label: ctx => `${ctx.dataset.label}: $${ctx.raw.toFixed(2)}` } }
      },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 9 }, callback: v => "$" + v.toFixed(0) }, grid: { color: "#1e2d4a" } }
      }
    }
  });

  // Options Flow Chart
  const optCtx = document.getElementById("optionsChart").getContext("2d");
  modalCharts.options = new Chart(optCtx, {
    type: "bar",
    data: {
      labels: WEEKLY_DATES,
      datasets: [
        { label: "Call Volume", data: s.optionsHistory.calls, backgroundColor: "rgba(34,197,94,0.6)", borderRadius: 3 },
        { label: "Put Volume", data: s.optionsHistory.puts, backgroundColor: "rgba(239,68,68,0.6)", borderRadius: 3 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 9 }, boxWidth: 10, padding: 8 } },
        tooltip: { backgroundColor: "#1a2236", borderColor: "#1e2d4a", borderWidth: 1, callbacks: { label: ctx => `${ctx.dataset.label}: ${(ctx.raw / 1000).toFixed(0)}K` } }
      },
      scales: {
        x: { ticks: { color: "#94a3b8", font: { size: 9 } }, grid: { display: false } },
        y: { ticks: { color: "#94a3b8", font: { size: 9 }, callback: v => (v / 1000).toFixed(0) + "K" }, grid: { color: "#1e2d4a" } }
      }
    }
  });

  // Technical Indicators
  const rsiColor = s.rsi < 30 ? "bearish" : s.rsi < 40 ? "bearish" : s.rsi < 60 ? "neutral" : "bullish";
  const macdColor = s.macdHist < 0 ? "bearish" : "bullish";
  const stochColor = s.stochK < 20 ? "bearish" : s.stochK < 80 ? "neutral" : "bullish";
  const priceVsSma20 = s.price > s.sma20 ? "bullish" : "bearish";
  const priceVsSma50 = s.price > s.sma50 ? "bullish" : "bearish";
  const priceVsSma200 = s.price > s.sma200 ? "bullish" : "bearish";

  document.getElementById("techIndicators").innerHTML = `
    <div class="tech-row"><span class="tech-label">RSI (14)</span>
      <span><span class="tech-gauge"><span class="tech-gauge-fill" style="width:${s.rsi}%;background:${s.rsi < 30 ? "var(--red)" : s.rsi > 70 ? "var(--green)" : "var(--yellow)"}"></span></span>
      <span class="tech-value ${rsiColor}">${s.rsi.toFixed(1)}</span></span></div>
    <div class="tech-row"><span class="tech-label">MACD</span><span class="tech-value ${macdColor}">${s.macd.toFixed(2)} / Signal: ${s.macdSignal.toFixed(2)}</span></div>
    <div class="tech-row"><span class="tech-label">MACD Histogram</span><span class="tech-value ${macdColor}">${s.macdHist > 0 ? "+" : ""}${s.macdHist.toFixed(2)}</span></div>
    <div class="tech-row"><span class="tech-label">Stochastic %K / %D</span><span class="tech-value ${stochColor}">${s.stochK.toFixed(1)} / ${s.stochD.toFixed(1)}</span></div>
    <div class="tech-row"><span class="tech-label">ATR (14)</span><span class="tech-value neutral">$${s.atr.toFixed(2)}</span></div>
    <div class="tech-row"><span class="tech-label">VWAP</span><span class="tech-value neutral">$${s.vwap.toFixed(2)}</span></div>
    <div class="tech-row"><span class="tech-label">Bollinger Bands</span><span class="tech-value neutral">$${s.bollingerLower.toFixed(2)} — $${s.bollingerUpper.toFixed(2)}</span></div>
    <div class="tech-row"><span class="tech-label">Price vs SMA20</span><span class="tech-value ${priceVsSma20}">${priceVsSma20 === "bullish" ? "Above" : "Below"} ($${s.sma20.toFixed(2)})</span></div>
    <div class="tech-row"><span class="tech-label">Price vs SMA50</span><span class="tech-value ${priceVsSma50}">${priceVsSma50 === "bullish" ? "Above" : "Below"} ($${s.sma50.toFixed(2)})</span></div>
    <div class="tech-row"><span class="tech-label">Price vs SMA200</span><span class="tech-value ${priceVsSma200}">${priceVsSma200 === "bullish" ? "Above" : "Below"} ($${s.sma200.toFixed(2)})</span></div>
    <div class="tech-row"><span class="tech-label">Call Volume</span><span class="tech-value neutral">${(s.callVol / 1000).toFixed(1)}K</span></div>
    <div class="tech-row"><span class="tech-label">Put Volume</span><span class="tech-value bearish">${(s.putVol / 1000).toFixed(1)}K</span></div>
    <div class="tech-row"><span class="tech-label">Put/Call Ratio</span><span class="tech-value ${s.pcRatio > 1.0 ? "bearish" : "bullish"}">${s.pcRatio.toFixed(2)}</span></div>
    <div class="tech-row"><span class="tech-label">IV Rank</span><span class="tech-value ${s.ivRank > 60 ? "bearish" : "neutral"}">${s.ivRank}</span></div>
  `;

  // Headlines
  document.getElementById("headlinesList").innerHTML = s.headlines.map(h => `
    <div class="headline-card">
      <div class="hl-date">${h.date}, 2026</div>
      <div class="hl-title">${h.title}</div>
      <div class="hl-meta">
        <span class="hl-impact ${h.impact}">${h.impact}</span>
        <span class="hl-si-move">SI Move: <strong style="color:${h.siMove.startsWith("+") ? "var(--red)" : "var(--green)"}">${h.siMove}</strong></span>
      </div>
    </div>
  `).join("");

  // Technical Summary
  document.getElementById("techSummary").innerHTML = `
    <span class="summary-signal ${s.overallSignal}">${s.overallSignal}</span>
    <p class="summary-text">${s.technicalSummary}</p>
  `;

  // Key Levels
  document.getElementById("keyLevels").innerHTML = `
    <h4>Key Price Levels</h4>
    <div class="levels-grid">
      <div class="level-item"><span class="level-label">Support 1</span><span class="level-value support">$${s.support1.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">Resistance 1</span><span class="level-value resistance">$${s.resistance1.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">Support 2</span><span class="level-value support">$${s.support2.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">Resistance 2</span><span class="level-value resistance">$${s.resistance2.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">SMA 20</span><span class="level-value ma">$${s.sma20.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">SMA 50</span><span class="level-value ma">$${s.sma50.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">SMA 200</span><span class="level-value ma">$${s.sma200.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">VWAP</span><span class="level-value ma">$${s.vwap.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">Bollinger Upper</span><span class="level-value resistance">$${s.bollingerUpper.toFixed(2)}</span></div>
      <div class="level-item"><span class="level-label">Bollinger Lower</span><span class="level-value support">$${s.bollingerLower.toFixed(2)}</span></div>
    </div>
  `;
}

function closeStockModal() {
  document.getElementById("stockModalOverlay").classList.remove("active");
  document.body.style.overflow = "";
  destroyModalCharts();
}

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
});
