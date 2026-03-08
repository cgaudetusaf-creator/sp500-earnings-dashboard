// S&P 500 Earnings Intelligence Dashboard - Short Interest & Technical Analysis Data
// Top 25 most shorted S&P 500 stocks with 90-day historical data

// Generate 90-day date labels (weekly snapshots, 13 weeks)
function generateWeeklyDates(weeksBack) {
  const dates = [];
  const now = new Date(2026, 2, 6); // Mar 6, 2026
  for (let i = weeksBack; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    dates.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }
  return dates;
}
const WEEKLY_DATES = generateWeeklyDates(12);

// Helper: generate a realistic random walk series
function genSeries(start, volatility, trend, len) {
  const arr = [start];
  for (let i = 1; i < len; i++) {
    const noise = (Math.random() - 0.48) * volatility;
    arr.push(Math.max(0.5, +(arr[i-1] + trend + noise).toFixed(2)));
  }
  return arr;
}
function genPriceSeries(start, vol, trend, len) {
  const arr = [start];
  for (let i = 1; i < len; i++) {
    const noise = (Math.random() - 0.47) * vol;
    arr.push(+(arr[i-1] * (1 + trend + noise)).toFixed(2));
  }
  return arr;
}
function genVolumeSeries(base, variance, len) {
  return Array.from({length: len}, () => Math.round(base + (Math.random() - 0.5) * variance));
}

const SHORTED_STOCKS = [
  {
    ticker: "INTC", name: "Intel Corp.", sector: "Information Technology",
    price: 22.47, chg1d: -1.8, chg5d: -3.2, chg1m: -8.4, chg3m: -14.7,
    siCurrent: 12.8, siPrev: 11.9, siFreeFloat: 12.8, sharesShort: 543e6,
    avgVolume: 68.2e6, daysTocover: 3.2,
    siHistory: genSeries(9.2, 0.7, 0.28, 13),
    priceHistory: genPriceSeries(26.30, 0.025, -0.008, 13),
    headlines: [
      {date:"Mar 4",title:"Intel delays Ohio fab expansion amid restructuring",impact:"bearish",siMove:"+0.6%"},
      {date:"Feb 18",title:"Foundry division posts wider-than-expected losses",impact:"bearish",siMove:"+0.9%"},
      {date:"Feb 3",title:"New CEO unveils strategic turnaround plan",impact:"neutral",siMove:"-0.3%"},
      {date:"Jan 15",title:"Intel loses server CPU market share to AMD in Q4",impact:"bearish",siMove:"+0.5%"}
    ],
    callVol: 285400, putVol: 412600, pcRatio: 1.45, ivRank: 72,
    optionsHistory: {calls: genVolumeSeries(280000,80000,13), puts: genVolumeSeries(390000,95000,13)},
    sma20: 23.10, sma50: 24.85, sma200: 28.40,
    rsi: 32.4, macd: -0.85, macdSignal: -0.62, macdHist: -0.23,
    atr: 1.12, vwap: 22.65, stochK: 18.5, stochD: 22.1,
    bollingerUpper: 25.20, bollingerLower: 20.90,
    support1: 21.50, support2: 19.80, resistance1: 24.00, resistance2: 26.50,
    technicalSummary: "Strong bearish momentum. Price below all major MAs. RSI oversold territory at 32. MACD bearish crossover deepening. High short interest rising steadily over 90 days. Breakdown below $21.50 support targets $19.80.",
    overallSignal: "bearish"
  },
  {
    ticker: "PARA", name: "Paramount Global", sector: "Communication Services",
    price: 11.23, chg1d: -0.9, chg5d: -2.1, chg1m: -5.6, chg3m: -11.2,
    siCurrent: 14.2, siPrev: 13.8, siFreeFloat: 14.2, sharesShort: 92e6,
    avgVolume: 22.4e6, daysTocover: 4.1,
    siHistory: genSeries(10.5, 0.8, 0.3, 13),
    priceHistory: genPriceSeries(12.65, 0.03, -0.006, 13),
    headlines: [
      {date:"Mar 3",title:"Paramount+ subscriber growth slows in Q4 update",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 20",title:"Analyst downgrades to Sell citing debt concerns",impact:"bearish",siMove:"+0.6%"},
      {date:"Feb 5",title:"Content licensing deal provides near-term cash boost",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 22",title:"Merger talks with Skydance resume with new terms",impact:"neutral",siMove:"-0.5%"}
    ],
    callVol: 52300, putVol: 89700, pcRatio: 1.71, ivRank: 68,
    optionsHistory: {calls: genVolumeSeries(50000,18000,13), puts: genVolumeSeries(85000,22000,13)},
    sma20: 11.60, sma50: 12.15, sma200: 13.80,
    rsi: 35.8, macd: -0.28, macdSignal: -0.21, macdHist: -0.07,
    atr: 0.52, vwap: 11.35, stochK: 22.3, stochD: 25.7,
    bollingerUpper: 12.40, bollingerLower: 10.20,
    support1: 10.50, support2: 9.20, resistance1: 12.20, resistance2: 13.50,
    technicalSummary: "Persistent downtrend with expanding short interest. Price below all key MAs. Elevated put/call ratio signals continued bearish positioning. RSI weak but not yet oversold. Debt overhang limits upside catalysts.",
    overallSignal: "bearish"
  },
  {
    ticker: "WBD", name: "Warner Bros. Discovery", sector: "Communication Services",
    price: 8.92, chg1d: -1.2, chg5d: -4.1, chg1m: -7.3, chg3m: -16.5,
    siCurrent: 11.5, siPrev: 10.8, siFreeFloat: 11.5, sharesShort: 281e6,
    avgVolume: 35.1e6, daysTocover: 3.8,
    siHistory: genSeries(8.2, 0.65, 0.25, 13),
    priceHistory: genPriceSeries(10.68, 0.028, -0.009, 13),
    headlines: [
      {date:"Mar 5",title:"WBD announces additional $2B write-down on TV assets",impact:"bearish",siMove:"+0.7%"},
      {date:"Feb 22",title:"Max streaming hits 110M subs but losses persist",impact:"neutral",siMove:"+0.1%"},
      {date:"Feb 8",title:"Debt refinancing extends maturities at higher rates",impact:"bearish",siMove:"+0.4%"},
      {date:"Jan 18",title:"Theatrical slate shows improvement for 2026",impact:"neutral",siMove:"-0.3%"}
    ],
    callVol: 78200, putVol: 118500, pcRatio: 1.52, ivRank: 65,
    optionsHistory: {calls: genVolumeSeries(75000,25000,13), puts: genVolumeSeries(115000,30000,13)},
    sma20: 9.35, sma50: 9.90, sma200: 11.20,
    rsi: 28.6, macd: -0.32, macdSignal: -0.24, macdHist: -0.08,
    atr: 0.48, vwap: 9.05, stochK: 12.8, stochD: 16.4,
    bollingerUpper: 10.10, bollingerLower: 7.80,
    support1: 8.50, support2: 7.00, resistance1: 9.90, resistance2: 11.00,
    technicalSummary: "Deep oversold on RSI at 28.6 — potential for short-term bounce but overall trend remains firmly bearish. All MAs declining. Heavy debt burden and persistent asset write-downs fuel short thesis. Watch for $8.50 support test.",
    overallSignal: "bearish"
  },
  {
    ticker: "NKE", name: "Nike Inc.", sector: "Consumer Discretionary",
    price: 72.35, chg1d: -0.6, chg5d: -1.8, chg1m: -6.2, chg3m: -12.8,
    siCurrent: 8.4, siPrev: 7.9, siFreeFloat: 8.4, sharesShort: 102e6,
    avgVolume: 14.8e6, daysTocover: 3.5,
    siHistory: genSeries(5.8, 0.5, 0.2, 13),
    priceHistory: genPriceSeries(82.90, 0.02, -0.007, 13),
    headlines: [
      {date:"Mar 2",title:"Nike CFO warns of prolonged inventory rebalancing",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 15",title:"China sales disappoint amid local brand competition",impact:"bearish",siMove:"+0.5%"},
      {date:"Jan 28",title:"New product innovation pipeline gets positive reviews",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 10",title:"DTC strategy pivot back to wholesale partnerships",impact:"neutral",siMove:"+0.1%"}
    ],
    callVol: 124500, putVol: 168200, pcRatio: 1.35, ivRank: 58,
    optionsHistory: {calls: genVolumeSeries(120000,35000,13), puts: genVolumeSeries(165000,40000,13)},
    sma20: 74.20, sma50: 76.80, sma200: 84.50,
    rsi: 38.2, macd: -1.45, macdSignal: -1.10, macdHist: -0.35,
    atr: 2.85, vwap: 72.90, stochK: 25.4, stochD: 28.8,
    bollingerUpper: 78.60, bollingerLower: 68.40,
    support1: 70.00, support2: 65.50, resistance1: 76.80, resistance2: 82.00,
    technicalSummary: "Extended downtrend with price well below SMA200. MACD bearish divergence widening. Short interest climbing steadily from 5.8% to 8.4% over 90 days — significant build. Brand turnaround thesis being challenged. Key level: $70 psychological support.",
    overallSignal: "bearish"
  },
  {
    ticker: "BA", name: "Boeing Co.", sector: "Industrials",
    price: 168.50, chg1d: -0.8, chg5d: 1.2, chg1m: -3.5, chg3m: -9.2,
    siCurrent: 7.2, siPrev: 7.0, siFreeFloat: 7.2, sharesShort: 44e6,
    avgVolume: 8.9e6, daysTocover: 4.9,
    siHistory: genSeries(5.5, 0.35, 0.13, 13),
    priceHistory: genPriceSeries(185.60, 0.022, -0.005, 13),
    headlines: [
      {date:"Mar 6",title:"FAA extends production cap on 737 MAX through Q2",impact:"bearish",siMove:"+0.3%"},
      {date:"Feb 25",title:"Boeing delivers fewer widebodies than Airbus in Jan",impact:"bearish",siMove:"+0.2%"},
      {date:"Feb 10",title:"Quality improvements noted in latest FAA audit",impact:"neutral",siMove:"-0.1%"},
      {date:"Jan 20",title:"Defense division wins $4.2B contract for MQ-25",impact:"neutral",siMove:"-0.2%"}
    ],
    callVol: 95200, putVol: 112800, pcRatio: 1.18, ivRank: 62,
    optionsHistory: {calls: genVolumeSeries(92000,28000,13), puts: genVolumeSeries(110000,32000,13)},
    sma20: 171.40, sma50: 176.20, sma200: 192.00,
    rsi: 40.5, macd: -2.80, macdSignal: -2.15, macdHist: -0.65,
    atr: 6.40, vwap: 169.80, stochK: 30.2, stochD: 33.5,
    bollingerUpper: 182.00, bollingerLower: 158.50,
    support1: 162.00, support2: 150.00, resistance1: 176.00, resistance2: 192.00,
    technicalSummary: "Choppy downtrend continues. Price below all major MAs with SMA200 at $192 acting as strong overhead resistance. Quality and production issues maintain bearish overhang. Short interest elevated but stable. Watch for $162 support — break opens $150.",
    overallSignal: "bearish"
  },
  {
    ticker: "SMCI", name: "Super Micro Computer", sector: "Information Technology",
    price: 38.75, chg1d: 2.4, chg5d: -5.6, chg1m: -18.2, chg3m: -32.5,
    siCurrent: 22.5, siPrev: 21.8, siFreeFloat: 22.5, sharesShort: 132e6,
    avgVolume: 42.5e6, daysTocover: 2.1,
    siHistory: genSeries(14.0, 1.5, 0.65, 13),
    priceHistory: genPriceSeries(57.40, 0.05, -0.02, 13),
    headlines: [
      {date:"Mar 5",title:"SMCI receives Nasdaq compliance extension to file 10-K",impact:"neutral",siMove:"-0.4%"},
      {date:"Feb 21",title:"DOJ opens preliminary inquiry into accounting practices",impact:"bearish",siMove:"+1.8%"},
      {date:"Feb 6",title:"Hindenburg Research releases follow-up short report",impact:"bearish",siMove:"+2.1%"},
      {date:"Jan 14",title:"AI server demand strong but margin pressure persists",impact:"neutral",siMove:"+0.3%"}
    ],
    callVol: 520300, putVol: 685400, pcRatio: 1.32, ivRank: 89,
    optionsHistory: {calls: genVolumeSeries(500000,150000,13), puts: genVolumeSeries(650000,180000,13)},
    sma20: 41.20, sma50: 48.60, sma200: 62.40,
    rsi: 34.8, macd: -3.45, macdSignal: -2.80, macdHist: -0.65,
    atr: 4.20, vwap: 39.10, stochK: 20.1, stochD: 24.6,
    bollingerUpper: 48.50, bollingerLower: 32.00,
    support1: 35.00, support2: 28.00, resistance1: 48.60, resistance2: 62.00,
    technicalSummary: "Highest short interest in the S&P 500 at 22.5%. Accounting concerns and Hindenburg short reports driving extreme bearish positioning. IV rank at 89 — options pricing in massive moves. Could see violent short squeeze on positive filing news or continued collapse to $28.",
    overallSignal: "bearish"
  },
  {
    ticker: "ENPH", name: "Enphase Energy", sector: "Information Technology",
    price: 68.40, chg1d: -2.1, chg5d: -4.8, chg1m: -12.5, chg3m: -22.3,
    siCurrent: 16.8, siPrev: 15.9, siFreeFloat: 16.8, sharesShort: 22.8e6,
    avgVolume: 6.8e6, daysTocover: 3.4,
    siHistory: genSeries(11.5, 1.0, 0.41, 13),
    priceHistory: genPriceSeries(88.10, 0.035, -0.013, 13),
    headlines: [
      {date:"Mar 3",title:"NEM tariff uncertainty clouds solar installer outlook",impact:"bearish",siMove:"+0.5%"},
      {date:"Feb 19",title:"European solar demand falls 20% YoY in January",impact:"bearish",siMove:"+0.8%"},
      {date:"Feb 1",title:"ITC extension provides policy certainty through 2032",impact:"neutral",siMove:"-0.4%"},
      {date:"Jan 12",title:"Battery storage revenue mix improves to 30% of total",impact:"neutral",siMove:"-0.2%"}
    ],
    callVol: 78500, putVol: 142300, pcRatio: 1.81, ivRank: 74,
    optionsHistory: {calls: genVolumeSeries(75000,22000,13), puts: genVolumeSeries(138000,35000,13)},
    sma20: 72.50, sma50: 78.20, sma200: 98.60,
    rsi: 30.8, macd: -3.20, macdSignal: -2.45, macdHist: -0.75,
    atr: 4.15, vwap: 69.20, stochK: 14.5, stochD: 18.2,
    bollingerUpper: 80.40, bollingerLower: 60.50,
    support1: 65.00, support2: 55.00, resistance1: 78.20, resistance2: 88.00,
    technicalSummary: "Severe downtrend with RSI approaching oversold at 30.8. Put/call ratio at 1.81 — highest among large-cap solar. Short interest surging from 11.5% to 16.8% in 90 days. NEM/tariff policy risk is the primary bear catalyst. Stochastic deeply oversold.",
    overallSignal: "bearish"
  },
  {
    ticker: "EL", name: "Estee Lauder", sector: "Consumer Staples",
    price: 72.80, chg1d: -1.5, chg5d: -3.9, chg1m: -9.8, chg3m: -18.4,
    siCurrent: 10.2, siPrev: 9.5, siFreeFloat: 10.2, sharesShort: 35.8e6,
    avgVolume: 5.2e6, daysTocover: 4.2,
    siHistory: genSeries(6.8, 0.6, 0.26, 13),
    priceHistory: genPriceSeries(89.20, 0.025, -0.011, 13),
    headlines: [
      {date:"Mar 1",title:"China travel retail sales decline 15% in lunar new year",impact:"bearish",siMove:"+0.5%"},
      {date:"Feb 14",title:"CEO steps down citing need for fresh perspective",impact:"neutral",siMove:"+0.3%"},
      {date:"Jan 30",title:"Q2 earnings miss on Asia weakness and prestige demand",impact:"bearish",siMove:"+0.8%"},
      {date:"Jan 8",title:"Analysts cut price targets across the board",impact:"bearish",siMove:"+0.4%"}
    ],
    callVol: 42100, putVol: 68500, pcRatio: 1.63, ivRank: 66,
    optionsHistory: {calls: genVolumeSeries(40000,12000,13), puts: genVolumeSeries(65000,18000,13)},
    sma20: 75.60, sma50: 80.40, sma200: 96.50,
    rsi: 33.5, macd: -2.10, macdSignal: -1.65, macdHist: -0.45,
    atr: 3.40, vwap: 73.50, stochK: 16.8, stochD: 20.5,
    bollingerUpper: 82.00, bollingerLower: 66.00,
    support1: 70.00, support2: 62.00, resistance1: 80.40, resistance2: 90.00,
    technicalSummary: "Prolonged bearish trend driven by China/travel retail headwinds. All MAs declining steeply. CEO departure adds uncertainty. Short interest doubled from ~6% to 10.2% in 90 days. Oversold stochastics suggest possible dead-cat bounce near $70.",
    overallSignal: "bearish"
  },
  {
    ticker: "PFE", name: "Pfizer Inc.", sector: "Health Care",
    price: 25.40, chg1d: -0.4, chg5d: -1.5, chg1m: -4.2, chg3m: -8.6,
    siCurrent: 6.8, siPrev: 6.4, siFreeFloat: 6.8, sharesShort: 382e6,
    avgVolume: 38.5e6, daysTocover: 2.8,
    siHistory: genSeries(4.8, 0.4, 0.15, 13),
    priceHistory: genPriceSeries(27.80, 0.018, -0.005, 13),
    headlines: [
      {date:"Mar 4",title:"Pfizer cuts 2026 revenue guidance on COVID decline",impact:"bearish",siMove:"+0.3%"},
      {date:"Feb 17",title:"Pipeline readout on obesity drug shows mixed results",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 2",title:"Cost savings program reaches $4.5B annualized",impact:"neutral",siMove:"-0.1%"},
      {date:"Jan 15",title:"Seagen oncology assets show promise in Phase 3",impact:"neutral",siMove:"-0.2%"}
    ],
    callVol: 215000, putVol: 278000, pcRatio: 1.29, ivRank: 45,
    optionsHistory: {calls: genVolumeSeries(210000,55000,13), puts: genVolumeSeries(270000,65000,13)},
    sma20: 25.90, sma50: 26.80, sma200: 28.50,
    rsi: 38.8, macd: -0.42, macdSignal: -0.32, macdHist: -0.10,
    atr: 0.82, vwap: 25.55, stochK: 28.5, stochD: 31.2,
    bollingerUpper: 27.50, bollingerLower: 24.00,
    support1: 24.50, support2: 22.80, resistance1: 26.80, resistance2: 28.50,
    technicalSummary: "Gradual grind lower as post-COVID revenue cliff weighs on sentiment. Short interest moderate but rising. Seagen pipeline is the key upside catalyst. RSI weak at 38.8. MACD slightly bearish. Massive share count means even modest SI% = huge short positions.",
    overallSignal: "bearish"
  },
  {
    ticker: "SBUX", name: "Starbucks Corp.", sector: "Consumer Discretionary",
    price: 88.20, chg1d: 0.5, chg5d: -0.8, chg1m: -4.5, chg3m: -7.8,
    siCurrent: 5.8, siPrev: 5.4, siFreeFloat: 5.8, sharesShort: 66e6,
    avgVolume: 9.2e6, daysTocover: 3.6,
    siHistory: genSeries(3.8, 0.35, 0.15, 13),
    priceHistory: genPriceSeries(95.60, 0.018, -0.004, 13),
    headlines: [
      {date:"Mar 5",title:"Starbucks Q1 same-store sales miss expectations",impact:"bearish",siMove:"+0.3%"},
      {date:"Feb 20",title:"CEO turnaround plan gets mixed analyst reception",impact:"neutral",siMove:"+0.1%"},
      {date:"Feb 5",title:"China business faces local brand competitive pressure",impact:"bearish",siMove:"+0.4%"},
      {date:"Jan 16",title:"New pricing strategy aims to recapture value customers",impact:"neutral",siMove:"-0.1%"}
    ],
    callVol: 88500, putVol: 108200, pcRatio: 1.22, ivRank: 52,
    optionsHistory: {calls: genVolumeSeries(85000,25000,13), puts: genVolumeSeries(105000,28000,13)},
    sma20: 89.50, sma50: 92.10, sma200: 96.80,
    rsi: 42.5, macd: -1.15, macdSignal: -0.88, macdHist: -0.27,
    atr: 2.90, vwap: 88.80, stochK: 35.2, stochD: 38.6,
    bollingerUpper: 95.00, bollingerLower: 84.00,
    support1: 85.00, support2: 80.00, resistance1: 92.10, resistance2: 96.80,
    technicalSummary: "Turnaround narrative being tested. Price below all MAs but not deeply oversold. Short interest rising from 3.8% to 5.8% — moderate build. Put/call ratio only mildly bearish at 1.22. Key: needs to reclaim $92 SMA50 to shift momentum.",
    overallSignal: "neutral"
  },
  {
    ticker: "MCHP", name: "Microchip Technology", sector: "Information Technology",
    price: 58.20, chg1d: -1.2, chg5d: -3.5, chg1m: -8.8, chg3m: -15.2,
    siCurrent: 9.6, siPrev: 8.8, siFreeFloat: 9.6, sharesShort: 52e6,
    avgVolume: 8.5e6, daysTocover: 3.1,
    siHistory: genSeries(6.2, 0.6, 0.26, 13),
    priceHistory: genPriceSeries(68.60, 0.025, -0.008, 13),
    headlines: [
      {date:"Mar 3",title:"Industrial chip demand recovery pushed to H2 2026",impact:"bearish",siMove:"+0.5%"},
      {date:"Feb 18",title:"Microchip cuts capex 20% signaling demand weakness",impact:"bearish",siMove:"+0.6%"},
      {date:"Jan 28",title:"Automotive chip orders stabilize sequentially",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 8",title:"Debt concerns rise after acquisition leverage",impact:"bearish",siMove:"+0.3%"}
    ],
    callVol: 52400, putVol: 78600, pcRatio: 1.50, ivRank: 60,
    optionsHistory: {calls: genVolumeSeries(50000,15000,13), puts: genVolumeSeries(75000,20000,13)},
    sma20: 60.40, sma50: 64.20, sma200: 72.80,
    rsi: 34.2, macd: -1.85, macdSignal: -1.42, macdHist: -0.43,
    atr: 2.65, vwap: 58.80, stochK: 18.8, stochD: 22.4,
    bollingerUpper: 66.50, bollingerLower: 52.50,
    support1: 55.00, support2: 48.00, resistance1: 64.20, resistance2: 72.00,
    technicalSummary: "Analog/MCU inventory correction weighing heavily. SI nearly doubled from 6.2% to 9.6%. All MAs declining. Debt from acquisitions adding fundamental risk. Needs industrial demand inflection for sentiment shift. $55 is critical support.",
    overallSignal: "bearish"
  },
  {
    ticker: "SWKS", name: "Skyworks Solutions", sector: "Information Technology",
    price: 82.60, chg1d: -0.9, chg5d: -2.4, chg1m: -6.8, chg3m: -13.5,
    siCurrent: 8.2, siPrev: 7.5, siFreeFloat: 8.2, sharesShort: 13.2e6,
    avgVolume: 3.8e6, daysTocover: 3.5,
    siHistory: genSeries(5.5, 0.5, 0.21, 13),
    priceHistory: genPriceSeries(95.50, 0.022, -0.007, 13),
    headlines: [
      {date:"Feb 28",title:"Apple iPhone 17 supply chain signals lower content share",impact:"bearish",siMove:"+0.5%"},
      {date:"Feb 12",title:"Skyworks misses Q1 estimates on mobile weakness",impact:"bearish",siMove:"+0.7%"},
      {date:"Jan 25",title:"IoT segment shows early recovery signs",impact:"neutral",siMove:"-0.1%"},
      {date:"Jan 6",title:"Analyst notes broadcom gaining socket share in flagship phones",impact:"bearish",siMove:"+0.3%"}
    ],
    callVol: 28500, putVol: 44200, pcRatio: 1.55, ivRank: 58,
    optionsHistory: {calls: genVolumeSeries(27000,8000,13), puts: genVolumeSeries(42000,12000,13)},
    sma20: 85.10, sma50: 89.40, sma200: 98.20,
    rsi: 36.5, macd: -2.10, macdSignal: -1.65, macdHist: -0.45,
    atr: 3.20, vwap: 83.20, stochK: 22.5, stochD: 26.8,
    bollingerUpper: 92.00, bollingerLower: 76.00,
    support1: 80.00, support2: 72.00, resistance1: 89.40, resistance2: 98.00,
    technicalSummary: "Apple content share concerns driving persistent selling. SI built from 5.5% to 8.2%. MACD bearish with accelerating downward momentum. Mobile semiconductor cycle weak. Need Apple design-in confirmation for reversal.",
    overallSignal: "bearish"
  },
  {
    ticker: "ALB", name: "Albemarle Corp.", sector: "Materials",
    price: 78.40, chg1d: 1.8, chg5d: -2.2, chg1m: -11.5, chg3m: -24.8,
    siCurrent: 13.5, siPrev: 12.8, siFreeFloat: 13.5, sharesShort: 15.8e6,
    avgVolume: 3.2e6, daysTocover: 4.9,
    siHistory: genSeries(8.5, 0.9, 0.38, 13),
    priceHistory: genPriceSeries(104.20, 0.035, -0.015, 13),
    headlines: [
      {date:"Mar 4",title:"Lithium spot price falls to 3-year low on oversupply",impact:"bearish",siMove:"+0.6%"},
      {date:"Feb 20",title:"Chile tightens lithium mining regulations",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 3",title:"EV demand growth in US slows vs. Chinese competition",impact:"bearish",siMove:"+0.5%"},
      {date:"Jan 15",title:"Albemarle announces cost reduction and capacity deferral",impact:"neutral",siMove:"-0.2%"}
    ],
    callVol: 35200, putVol: 62800, pcRatio: 1.78, ivRank: 76,
    optionsHistory: {calls: genVolumeSeries(33000,10000,13), puts: genVolumeSeries(60000,16000,13)},
    sma20: 82.50, sma50: 90.60, sma200: 112.40,
    rsi: 28.5, macd: -4.20, macdSignal: -3.30, macdHist: -0.90,
    atr: 5.10, vwap: 79.50, stochK: 10.2, stochD: 14.8,
    bollingerUpper: 95.00, bollingerLower: 68.00,
    support1: 72.00, support2: 60.00, resistance1: 90.60, resistance2: 105.00,
    technicalSummary: "Extreme bearish momentum. RSI oversold at 28.5, stochastic at 10.2. Lithium pricing collapse is the fundamental driver. SI surged from 8.5% to 13.5%. Put/call at 1.78 signals heavy hedging. Potential capitulation setup — but no bottom signals yet.",
    overallSignal: "bearish"
  },
  {
    ticker: "BIIB", name: "Biogen Inc.", sector: "Health Care",
    price: 148.60, chg1d: -0.3, chg5d: -1.8, chg1m: -5.2, chg3m: -9.5,
    siCurrent: 7.5, siPrev: 7.1, siFreeFloat: 7.5, sharesShort: 10.8e6,
    avgVolume: 2.4e6, daysTocover: 4.5,
    siHistory: genSeries(5.2, 0.45, 0.18, 13),
    priceHistory: genPriceSeries(164.20, 0.02, -0.005, 13),
    headlines: [
      {date:"Mar 2",title:"Alzheimer drug lecanemab Phase 4 shows safety concerns",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 16",title:"Biosimilar competition erodes legacy MS franchise",impact:"bearish",siMove:"+0.3%"},
      {date:"Jan 28",title:"Rare disease pipeline shows encouraging Phase 2 data",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 10",title:"Biogen announces $1B accelerated buyback program",impact:"neutral",siMove:"-0.1%"}
    ],
    callVol: 18500, putVol: 26800, pcRatio: 1.45, ivRank: 55,
    optionsHistory: {calls: genVolumeSeries(17000,5000,13), puts: genVolumeSeries(25000,7000,13)},
    sma20: 152.00, sma50: 156.80, sma200: 168.40,
    rsi: 38.0, macd: -2.80, macdSignal: -2.15, macdHist: -0.65,
    atr: 5.20, vwap: 149.80, stochK: 25.0, stochD: 28.8,
    bollingerUpper: 162.00, bollingerLower: 140.00,
    support1: 142.00, support2: 130.00, resistance1: 156.80, resistance2: 168.00,
    technicalSummary: "Steady decline as legacy drugs face biosimilar pressure and Alzheimer drug struggles. SI rising gradually. Not deeply oversold but momentum clearly negative. Pipeline catalysts could reverse sentiment but timeline uncertain.",
    overallSignal: "bearish"
  },
  {
    ticker: "MMM", name: "3M Company", sector: "Industrials",
    price: 108.50, chg1d: 0.8, chg5d: 2.1, chg1m: 3.5, chg3m: -1.2,
    siCurrent: 5.2, siPrev: 5.6, siFreeFloat: 5.2, sharesShort: 28.5e6,
    avgVolume: 5.8e6, daysTocover: 2.5,
    siHistory: genSeries(7.8, 0.4, -0.2, 13),
    priceHistory: genPriceSeries(109.80, 0.018, 0.001, 13),
    headlines: [
      {date:"Mar 5",title:"3M post-separation margins improve ahead of guidance",impact:"bullish",siMove:"-0.3%"},
      {date:"Feb 18",title:"Legal settlement payments proceeding as planned",impact:"neutral",siMove:"-0.1%"},
      {date:"Feb 1",title:"Industrial demand shows modest sequential improvement",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 12",title:"Short sellers reducing positions after separation clarity",impact:"bullish",siMove:"-0.4%"}
    ],
    callVol: 62500, putVol: 48200, pcRatio: 0.77, ivRank: 38,
    optionsHistory: {calls: genVolumeSeries(60000,18000,13), puts: genVolumeSeries(50000,14000,13)},
    sma20: 106.80, sma50: 105.20, sma200: 104.00,
    rsi: 55.2, macd: 0.85, macdSignal: 0.52, macdHist: 0.33,
    atr: 3.10, vwap: 108.20, stochK: 62.5, stochD: 58.4,
    bollingerUpper: 114.00, bollingerLower: 102.00,
    support1: 105.00, support2: 100.00, resistance1: 114.00, resistance2: 120.00,
    technicalSummary: "Short squeeze unwind in progress. SI declining from 7.8% to 5.2% — bears covering as post-separation story improves. Price above all MAs for first time in months. MACD bullish crossover. Put/call ratio below 1.0 signals shifting sentiment. Potential trend reversal.",
    overallSignal: "bullish"
  },
  {
    ticker: "MRNA", name: "Moderna Inc.", sector: "Health Care",
    price: 34.80, chg1d: -2.5, chg5d: -6.2, chg1m: -14.5, chg3m: -28.6,
    siCurrent: 18.2, siPrev: 17.1, siFreeFloat: 18.2, sharesShort: 70e6,
    avgVolume: 18.5e6, daysTocover: 2.8,
    siHistory: genSeries(12.0, 1.2, 0.48, 13),
    priceHistory: genPriceSeries(48.70, 0.04, -0.018, 13),
    headlines: [
      {date:"Mar 6",title:"Moderna cuts 2026 sales guidance for third time",impact:"bearish",siMove:"+0.8%"},
      {date:"Feb 22",title:"RSV vaccine market share trails GSK and Pfizer",impact:"bearish",siMove:"+0.5%"},
      {date:"Feb 5",title:"Cancer vaccine partnership with Merck shows Phase 3 promise",impact:"neutral",siMove:"-0.6%"},
      {date:"Jan 18",title:"Cash burn rate raises going-concern discussion among analysts",impact:"bearish",siMove:"+1.1%"}
    ],
    callVol: 285000, putVol: 420000, pcRatio: 1.47, ivRank: 82,
    optionsHistory: {calls: genVolumeSeries(270000,80000,13), puts: genVolumeSeries(400000,100000,13)},
    sma20: 38.40, sma50: 44.20, sma200: 62.80,
    rsi: 25.4, macd: -2.85, macdSignal: -2.20, macdHist: -0.65,
    atr: 3.20, vwap: 35.50, stochK: 8.5, stochD: 12.4,
    bollingerUpper: 44.00, bollingerLower: 28.00,
    support1: 32.00, support2: 25.00, resistance1: 44.20, resistance2: 55.00,
    technicalSummary: "Catastrophic technical picture. RSI at 25.4 — deeply oversold. Stochastic at 8.5 — extreme. SI at 18.2% and climbing. Cash burn concerns are existential risk. Cancer vaccine is the only bull catalyst. Could see capitulation washout below $32 or violent squeeze.",
    overallSignal: "bearish"
  },
  {
    ticker: "CE", name: "Celanese Corp.", sector: "Materials",
    price: 82.40, chg1d: -0.6, chg5d: -2.8, chg1m: -7.2, chg3m: -14.8,
    siCurrent: 11.8, siPrev: 11.2, siFreeFloat: 11.8, sharesShort: 12.8e6,
    avgVolume: 2.1e6, daysTocover: 5.2,
    siHistory: genSeries(8.0, 0.7, 0.29, 13),
    priceHistory: genPriceSeries(96.70, 0.025, -0.008, 13),
    headlines: [
      {date:"Mar 4",title:"Celanese cuts dividend 95% to accelerate deleveraging",impact:"bearish",siMove:"+0.8%"},
      {date:"Feb 15",title:"Chemical demand in Europe remains weak",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 1",title:"M&M integration cost synergies ahead of schedule",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 10",title:"Moody's places CE on negative credit watch",impact:"bearish",siMove:"+0.6%"}
    ],
    callVol: 15200, putVol: 28400, pcRatio: 1.87, ivRank: 70,
    optionsHistory: {calls: genVolumeSeries(14000,5000,13), puts: genVolumeSeries(27000,8000,13)},
    sma20: 85.60, sma50: 91.20, sma200: 108.40,
    rsi: 32.0, macd: -2.80, macdSignal: -2.15, macdHist: -0.65,
    atr: 3.80, vwap: 83.20, stochK: 15.5, stochD: 19.8,
    bollingerUpper: 96.00, bollingerLower: 72.00,
    support1: 78.00, support2: 68.00, resistance1: 91.20, resistance2: 100.00,
    technicalSummary: "Dividend cut signals balance sheet stress. SI climbing steadily with highest days-to-cover at 5.2 — short squeeze potential if covering starts. Put/call at 1.87 is extreme bearish positioning. Technically oversold but fundamentally challenged.",
    overallSignal: "bearish"
  },
  {
    ticker: "CHTR", name: "Charter Communications", sector: "Communication Services",
    price: 312.40, chg1d: -0.5, chg5d: -1.2, chg1m: -5.8, chg3m: -10.4,
    siCurrent: 6.4, siPrev: 6.0, siFreeFloat: 6.4, sharesShort: 9.2e6,
    avgVolume: 2.0e6, daysTocover: 4.6,
    siHistory: genSeries(4.5, 0.35, 0.15, 13),
    priceHistory: genPriceSeries(348.50, 0.018, -0.006, 13),
    headlines: [
      {date:"Mar 3",title:"Broadband subscriber losses accelerate in Q4",impact:"bearish",siMove:"+0.3%"},
      {date:"Feb 18",title:"Fixed wireless competition continues to erode cable base",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 2",title:"RDOF rural deployment creates new subscriber opportunity",impact:"neutral",siMove:"-0.1%"},
      {date:"Jan 14",title:"Charter video cord-cutting pace accelerates",impact:"bearish",siMove:"+0.2%"}
    ],
    callVol: 12800, putVol: 18500, pcRatio: 1.45, ivRank: 50,
    optionsHistory: {calls: genVolumeSeries(12000,4000,13), puts: genVolumeSeries(17000,5000,13)},
    sma20: 318.50, sma50: 328.80, sma200: 356.00,
    rsi: 37.5, macd: -5.80, macdSignal: -4.50, macdHist: -1.30,
    atr: 10.50, vwap: 314.80, stochK: 22.0, stochD: 26.5,
    bollingerUpper: 340.00, bollingerLower: 295.00,
    support1: 300.00, support2: 280.00, resistance1: 328.80, resistance2: 356.00,
    technicalSummary: "Cable cord-cutting and FWA competition driving steady decline. Price below all MAs with large gap to SMA200 at $356. SI moderate but persistent. $300 psychological level is key support. Industry-wide headwinds limit near-term catalyst potential.",
    overallSignal: "bearish"
  },
  {
    ticker: "ILMN", name: "Illumina Inc.", sector: "Health Care",
    price: 112.80, chg1d: 0.4, chg5d: -1.5, chg1m: -6.2, chg3m: -12.0,
    siCurrent: 7.8, siPrev: 7.3, siFreeFloat: 7.8, sharesShort: 12.2e6,
    avgVolume: 3.5e6, daysTocover: 3.5,
    siHistory: genSeries(5.5, 0.45, 0.18, 13),
    priceHistory: genPriceSeries(128.20, 0.022, -0.006, 13),
    headlines: [
      {date:"Mar 1",title:"Genomics reimbursement uncertainty pressures stock",impact:"bearish",siMove:"+0.3%"},
      {date:"Feb 14",title:"NovaSeq X adoption slower than expected in clinical",impact:"bearish",siMove:"+0.5%"},
      {date:"Jan 30",title:"Illumina completes GRAIL divestiture for $7.5B",impact:"neutral",siMove:"-0.3%"},
      {date:"Jan 12",title:"New CEO resets growth targets at analyst day",impact:"neutral",siMove:"+0.1%"}
    ],
    callVol: 28500, putVol: 38200, pcRatio: 1.34, ivRank: 52,
    optionsHistory: {calls: genVolumeSeries(27000,8000,13), puts: genVolumeSeries(36000,10000,13)},
    sma20: 115.40, sma50: 120.80, sma200: 132.50,
    rsi: 38.5, macd: -2.40, macdSignal: -1.85, macdHist: -0.55,
    atr: 4.80, vwap: 113.50, stochK: 24.5, stochD: 28.2,
    bollingerUpper: 126.00, bollingerLower: 104.00,
    support1: 108.00, support2: 95.00, resistance1: 120.80, resistance2: 132.00,
    technicalSummary: "Post-GRAIL divestiture reset continues. Price below all MAs. Short interest moderately elevated. Genomics adoption timeline longer than bulls expected. MACD bearish but not extreme. $108 key support; GRAIL cash could fund strategic pivot.",
    overallSignal: "bearish"
  },
  {
    ticker: "F", name: "Ford Motor Co.", sector: "Consumer Discretionary",
    price: 9.85, chg1d: -0.3, chg5d: -1.8, chg1m: -6.5, chg3m: -12.2,
    siCurrent: 8.8, siPrev: 8.2, siFreeFloat: 8.8, sharesShort: 352e6,
    avgVolume: 52.0e6, daysTocover: 2.2,
    siHistory: genSeries(6.0, 0.5, 0.22, 13),
    priceHistory: genPriceSeries(11.22, 0.025, -0.007, 13),
    headlines: [
      {date:"Mar 4",title:"Ford EV losses expected to exceed $5.5B in 2026",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 18",title:"Warranty costs remain elevated above industry norms",impact:"bearish",siMove:"+0.3%"},
      {date:"Feb 2",title:"Ford Pro commercial segment posts record profit",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 14",title:"F-150 Lightning inventory builds signal demand softness",impact:"bearish",siMove:"+0.4%"}
    ],
    callVol: 385000, putVol: 520000, pcRatio: 1.35, ivRank: 56,
    optionsHistory: {calls: genVolumeSeries(370000,100000,13), puts: genVolumeSeries(500000,120000,13)},
    sma20: 10.20, sma50: 10.80, sma200: 11.50,
    rsi: 35.2, macd: -0.18, macdSignal: -0.14, macdHist: -0.04,
    atr: 0.42, vwap: 9.95, stochK: 20.5, stochD: 24.8,
    bollingerUpper: 11.00, bollingerLower: 9.00,
    support1: 9.50, support2: 8.50, resistance1: 10.80, resistance2: 11.50,
    technicalSummary: "EV investment losses continue to weigh on sentiment. SI rising from 6% to 8.8%. Ford Pro profitability is the bull case but not enough to offset EV drag. High volume stock with massive short positions in absolute terms. Sub-$10 is a danger zone.",
    overallSignal: "bearish"
  },
  {
    ticker: "MTCH", name: "Match Group", sector: "Communication Services",
    price: 32.50, chg1d: -1.8, chg5d: -4.5, chg1m: -10.2, chg3m: -18.6,
    siCurrent: 9.4, siPrev: 8.8, siFreeFloat: 9.4, sharesShort: 24.8e6,
    avgVolume: 5.5e6, daysTocover: 3.2,
    siHistory: genSeries(6.2, 0.6, 0.25, 13),
    priceHistory: genPriceSeries(39.80, 0.03, -0.011, 13),
    headlines: [
      {date:"Mar 5",title:"Tinder paying user count declines for third straight quarter",impact:"bearish",siMove:"+0.5%"},
      {date:"Feb 20",title:"Gen Z dating app fatigue accelerates user churn",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 4",title:"Hinge growth partially offsets Tinder weakness",impact:"neutral",siMove:"-0.1%"},
      {date:"Jan 16",title:"Match announces $800M cost restructuring plan",impact:"neutral",siMove:"-0.2%"}
    ],
    callVol: 42500, putVol: 68800, pcRatio: 1.62, ivRank: 64,
    optionsHistory: {calls: genVolumeSeries(40000,12000,13), puts: genVolumeSeries(65000,18000,13)},
    sma20: 34.80, sma50: 37.50, sma200: 42.20,
    rsi: 30.5, macd: -1.65, macdSignal: -1.28, macdHist: -0.37,
    atr: 2.10, vwap: 33.00, stochK: 14.2, stochD: 18.5,
    bollingerUpper: 38.50, bollingerLower: 28.50,
    support1: 30.00, support2: 26.00, resistance1: 37.50, resistance2: 42.00,
    technicalSummary: "Secular headwinds from dating app fatigue weighing on stock. RSI oversold at 30.5. SI climbing steadily. Tinder decline is the primary short thesis while Hinge growth is the bull hope. $30 psychological support critical.",
    overallSignal: "bearish"
  },
  {
    ticker: "IFF", name: "International Flavors", sector: "Materials",
    price: 82.20, chg1d: -0.4, chg5d: -1.5, chg1m: -4.8, chg3m: -9.5,
    siCurrent: 7.2, siPrev: 6.8, siFreeFloat: 7.2, sharesShort: 18.2e6,
    avgVolume: 3.2e6, daysTocover: 4.0,
    siHistory: genSeries(5.0, 0.4, 0.17, 13),
    priceHistory: genPriceSeries(90.80, 0.02, -0.005, 13),
    headlines: [
      {date:"Mar 2",title:"IFF misses estimates on scent division weakness",impact:"bearish",siMove:"+0.3%"},
      {date:"Feb 16",title:"Deleveraging progress slower than guidance",impact:"bearish",siMove:"+0.4%"},
      {date:"Jan 28",title:"New CEO refocuses portfolio on core flavor business",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 10",title:"Activist investor builds 5% stake seeking board changes",impact:"neutral",siMove:"-0.1%"}
    ],
    callVol: 18500, putVol: 25800, pcRatio: 1.39, ivRank: 48,
    optionsHistory: {calls: genVolumeSeries(17000,5000,13), puts: genVolumeSeries(24000,7000,13)},
    sma20: 84.00, sma50: 86.80, sma200: 92.40,
    rsi: 40.2, macd: -1.20, macdSignal: -0.92, macdHist: -0.28,
    atr: 2.80, vwap: 82.80, stochK: 30.5, stochD: 34.2,
    bollingerUpper: 90.00, bollingerLower: 76.00,
    support1: 78.00, support2: 72.00, resistance1: 86.80, resistance2: 92.00,
    technicalSummary: "Deleveraging story being questioned. SI moderate and rising. Price below all MAs. Activist involvement could provide catalyst for change. Not deeply oversold — more of a grind lower. $78 support from prior lows.",
    overallSignal: "bearish"
  },
  {
    ticker: "DLTR", name: "Dollar Tree", sector: "Consumer Discretionary",
    price: 68.50, chg1d: -1.4, chg5d: -3.8, chg1m: -9.5, chg3m: -20.2,
    siCurrent: 10.5, siPrev: 9.8, siFreeFloat: 10.5, sharesShort: 22.8e6,
    avgVolume: 5.8e6, daysTocover: 3.0,
    siHistory: genSeries(6.8, 0.7, 0.28, 13),
    priceHistory: genPriceSeries(85.80, 0.03, -0.012, 13),
    headlines: [
      {date:"Mar 3",title:"Dollar Tree comps miss as low-income consumer weakens",impact:"bearish",siMove:"+0.6%"},
      {date:"Feb 15",title:"Family Dollar conversion costs higher than expected",impact:"bearish",siMove:"+0.5%"},
      {date:"Feb 1",title:"Multi-price point strategy showing early promise",impact:"neutral",siMove:"-0.2%"},
      {date:"Jan 12",title:"Tariff impact on import costs could pressure margins",impact:"bearish",siMove:"+0.4%"}
    ],
    callVol: 45200, putVol: 72800, pcRatio: 1.61, ivRank: 68,
    optionsHistory: {calls: genVolumeSeries(43000,14000,13), puts: genVolumeSeries(70000,20000,13)},
    sma20: 72.40, sma50: 78.20, sma200: 92.00,
    rsi: 29.8, macd: -3.20, macdSignal: -2.50, macdHist: -0.70,
    atr: 3.60, vwap: 69.40, stochK: 12.5, stochD: 16.8,
    bollingerUpper: 82.00, bollingerLower: 60.00,
    support1: 65.00, support2: 55.00, resistance1: 78.20, resistance2: 85.00,
    technicalSummary: "Aggressive selloff with RSI near 30. Low-income consumer stress and tariff concerns driving short build from 6.8% to 10.5%. MACD deeply bearish. Stochastics extreme. Could see capitulation bounce but fundamental headwinds persist. $65 critical support.",
    overallSignal: "bearish"
  },
  {
    ticker: "APTV", name: "Aptiv plc", sector: "Consumer Discretionary",
    price: 62.40, chg1d: -0.8, chg5d: -2.5, chg1m: -7.8, chg3m: -15.5,
    siCurrent: 8.5, siPrev: 7.9, siFreeFloat: 8.5, sharesShort: 20.2e6,
    avgVolume: 4.5e6, daysTocover: 3.2,
    siHistory: genSeries(5.8, 0.5, 0.21, 13),
    priceHistory: genPriceSeries(73.80, 0.025, -0.008, 13),
    headlines: [
      {date:"Mar 4",title:"Auto production forecasts cut for H1 2026 globally",impact:"bearish",siMove:"+0.4%"},
      {date:"Feb 19",title:"Aptiv loses key ADAS contract to Mobileye",impact:"bearish",siMove:"+0.6%"},
      {date:"Feb 3",title:"Signal and Power segment shows margin improvement",impact:"neutral",siMove:"-0.1%"},
      {date:"Jan 15",title:"EV platform architecture wins offset volume weakness",impact:"neutral",siMove:"-0.2%"}
    ],
    callVol: 22800, putVol: 35500, pcRatio: 1.56, ivRank: 60,
    optionsHistory: {calls: genVolumeSeries(21000,7000,13), puts: genVolumeSeries(33000,9000,13)},
    sma20: 64.80, sma50: 68.50, sma200: 76.40,
    rsi: 34.5, macd: -1.80, macdSignal: -1.38, macdHist: -0.42,
    atr: 2.65, vwap: 63.10, stochK: 18.5, stochD: 22.8,
    bollingerUpper: 72.00, bollingerLower: 56.00,
    support1: 58.00, support2: 50.00, resistance1: 68.50, resistance2: 76.00,
    technicalSummary: "Auto sector weakness and ADAS competitive losses driving short build. All MAs declining. RSI weak at 34.5. Lost Mobileye contract is a significant negative catalyst. EV architecture wins provide some offset but not enough near term.",
    overallSignal: "bearish"
  },
  {
    ticker: "PYPL", name: "PayPal Holdings", sector: "Financials",
    price: 68.80, chg1d: 1.2, chg5d: 2.5, chg1m: 5.8, chg3m: 12.4,
    siCurrent: 5.5, siPrev: 6.2, siFreeFloat: 5.5, sharesShort: 58e6,
    avgVolume: 15.2e6, daysTocover: 2.4,
    siHistory: genSeries(8.5, 0.5, -0.23, 13),
    priceHistory: genPriceSeries(61.20, 0.022, 0.006, 13),
    headlines: [
      {date:"Mar 5",title:"PayPal branded checkout growth accelerates to 6%",impact:"bullish",siMove:"-0.4%"},
      {date:"Feb 20",title:"Venmo monetization improving with business profiles",impact:"bullish",siMove:"-0.3%"},
      {date:"Feb 5",title:"AI-powered fraud detection saves $500M annually",impact:"bullish",siMove:"-0.2%"},
      {date:"Jan 18",title:"Activist investor praises turnaround progress",impact:"neutral",siMove:"-0.3%"}
    ],
    callVol: 185000, putVol: 128000, pcRatio: 0.69, ivRank: 42,
    optionsHistory: {calls: genVolumeSeries(180000,50000,13), puts: genVolumeSeries(130000,35000,13)},
    sma20: 66.50, sma50: 64.80, sma200: 63.20,
    rsi: 62.5, macd: 1.45, macdSignal: 1.10, macdHist: 0.35,
    atr: 2.50, vwap: 68.20, stochK: 72.5, stochD: 68.8,
    bollingerUpper: 74.00, bollingerLower: 62.00,
    support1: 64.80, support2: 60.00, resistance1: 74.00, resistance2: 80.00,
    technicalSummary: "Short squeeze and turnaround play in action. SI declining from 8.5% to 5.5% as bears cover. Price above all MAs. MACD bullish crossover with positive momentum. Put/call ratio at 0.69 — bullish. Branded checkout reacceleration is the key catalyst.",
    overallSignal: "bullish"
  }
];

// Sort by current SI descending
SHORTED_STOCKS.sort((a, b) => b.siCurrent - a.siCurrent);

// ==================== OPTIONS WRITING DATA ====================
// Attach options-writing intelligence to each shorted stock
function computeAnnualizedYield(premium, price, dte) {
  return +((premium / price) * (365 / dte) * 100).toFixed(1);
}

SHORTED_STOCKS.forEach(s => {
  const dte = 30 + Math.floor(Math.random() * 20); // 30-50 DTE (nearest monthly)
  const iv30d = +(0.25 + (s.ivRank / 100) * 0.55 + (Math.random() - 0.5) * 0.08).toFixed(3);
  const ivHist = +(iv30d * (0.65 + Math.random() * 0.25)).toFixed(3);
  const ivChange5d = +((iv30d - ivHist) / ivHist * 100 * (0.3 + Math.random() * 0.7) * (Math.random() > 0.3 ? 1 : -1)).toFixed(1);
  const atmCallPremium = +(s.price * iv30d * Math.sqrt(dte / 365) * 0.4).toFixed(2);
  const atmPutPremium = +(atmCallPremium * (0.85 + Math.random() * 0.3)).toFixed(2);
  const earningsDate = `2026-0${4 + Math.floor(Math.random() * 3)}-${10 + Math.floor(Math.random() * 18)}`;
  const earningsInWindow = dte > 25 && Math.random() > 0.6;
  const callYieldAnn = computeAnnualizedYield(atmCallPremium, s.price, dte);
  const putYieldAnn = computeAnnualizedYield(atmPutPremium, s.price, dte);

  let ccSignal = "sell";
  if (s.ivRank < 30 || callYieldAnn < 8) ccSignal = "hold";
  if (earningsInWindow || s.overallSignal === "bullish") ccSignal = s.ivRank > 55 ? "sell" : "hold";
  if (s.rsi > 75) ccSignal = "sell"; // Overbought = good for selling calls
  if (s.ivRank < 20) ccSignal = "avoid";

  let cspSignal = "sell";
  if (s.ivRank < 30 || putYieldAnn < 8) cspSignal = "hold";
  if (s.overallSignal === "bearish" && s.rsi < 25) cspSignal = "avoid"; // Falling knife
  if (earningsInWindow) cspSignal = s.ivRank > 65 ? "sell" : "hold";
  if (s.ivRank < 20) cspSignal = "avoid";

  s.optionsWriting = {
    ivRank: s.ivRank,
    iv30d, ivHist, ivChange5d,
    atmCallPremium, atmPutPremium,
    callDelta: +(0.45 + Math.random() * 0.10).toFixed(2),
    putDelta: -(0.45 + Math.random() * 0.10).toFixed(2),
    dte, earningsInWindow, earningsDate,
    callYieldAnn, putYieldAnn,
    ccSignal, cspSignal,
    marginOfSafety: +((1 - s.support1 / s.price) * 100).toFixed(1),
    pe: +(8 + Math.random() * 40).toFixed(1)
  };
});

// Additional high-IV options candidates from broader S&P 500 (not in SHORTED_STOCKS)
const OPTIONS_CANDIDATES = [
  {
    ticker: "SMCI", name: "Super Micro Computer", sector: "Information Technology",
    price: 42.50, rsi: 28.5, support1: 38.00,
    optionsWriting: { ivRank: 92, iv30d: 0.95, ivHist: 0.58, ivChange5d: 32.1, atmCallPremium: 6.80, atmPutPremium: 6.45, callDelta: 0.50, putDelta: -0.50, dte: 38, earningsInWindow: false, earningsDate: "2026-05-06", callYieldAnn: 153.4, putYieldAnn: 145.5, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 10.6, pe: 12.3 }
  },
  {
    ticker: "MARA", name: "Marathon Digital", sector: "Information Technology",
    price: 18.75, rsi: 45.2, support1: 15.00,
    optionsWriting: { ivRank: 88, iv30d: 1.05, ivHist: 0.72, ivChange5d: 24.5, atmCallPremium: 3.35, atmPutPremium: 3.10, callDelta: 0.48, putDelta: -0.48, dte: 32, earningsInWindow: false, earningsDate: "2026-05-08", callYieldAnn: 202.1, putYieldAnn: 187.0, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 20.0, pe: 25.8 }
  },
  {
    ticker: "RIVN", name: "Rivian Automotive", sector: "Consumer Discretionary",
    price: 13.20, rsi: 38.4, support1: 11.00,
    optionsWriting: { ivRank: 85, iv30d: 0.82, ivHist: 0.55, ivChange5d: 18.5, atmCallPremium: 1.85, atmPutPremium: 1.72, callDelta: 0.49, putDelta: -0.49, dte: 38, earningsInWindow: false, earningsDate: "2026-05-07", callYieldAnn: 133.5, putYieldAnn: 124.1, ccSignal: "sell", cspSignal: "hold", marginOfSafety: 16.7, pe: -1 }
  },
  {
    ticker: "COIN", name: "Coinbase Global", sector: "Financials",
    price: 205.30, rsi: 55.8, support1: 180.00,
    optionsWriting: { ivRank: 82, iv30d: 0.75, ivHist: 0.52, ivChange5d: 15.2, atmCallPremium: 26.50, atmPutPremium: 24.80, callDelta: 0.51, putDelta: -0.49, dte: 32, earningsInWindow: false, earningsDate: "2026-05-08", callYieldAnn: 147.3, putYieldAnn: 137.8, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 12.3, pe: 28.5 }
  },
  {
    ticker: "SHOP", name: "Shopify Inc.", sector: "Information Technology",
    price: 98.50, rsi: 62.1, support1: 88.00,
    optionsWriting: { ivRank: 76, iv30d: 0.58, ivHist: 0.40, ivChange5d: 22.8, atmCallPremium: 9.80, atmPutPremium: 9.20, callDelta: 0.50, putDelta: -0.50, dte: 38, earningsInWindow: true, earningsDate: "2026-04-28", callYieldAnn: 95.0, putYieldAnn: 89.2, ccSignal: "hold", cspSignal: "hold", marginOfSafety: 10.7, pe: 72.4 }
  },
  {
    ticker: "PLTR", name: "Palantir Technologies", sector: "Information Technology",
    price: 78.20, rsi: 68.5, support1: 68.00,
    optionsWriting: { ivRank: 74, iv30d: 0.65, ivHist: 0.48, ivChange5d: 12.8, atmCallPremium: 8.65, atmPutPremium: 8.10, callDelta: 0.51, putDelta: -0.49, dte: 32, earningsInWindow: false, earningsDate: "2026-05-05", callYieldAnn: 126.2, putYieldAnn: 118.2, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 13.0, pe: 145.2 }
  },
  {
    ticker: "HOOD", name: "Robinhood Markets", sector: "Financials",
    price: 42.80, rsi: 52.3, support1: 36.50,
    optionsWriting: { ivRank: 71, iv30d: 0.68, ivHist: 0.50, ivChange5d: 28.5, atmCallPremium: 4.95, atmPutPremium: 4.60, callDelta: 0.49, putDelta: -0.49, dte: 38, earningsInWindow: false, earningsDate: "2026-05-06", callYieldAnn: 110.2, putYieldAnn: 102.5, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 14.7, pe: 32.1 }
  },
  {
    ticker: "CRWD", name: "CrowdStrike Holdings", sector: "Information Technology",
    price: 345.60, rsi: 58.2, support1: 310.00,
    optionsWriting: { ivRank: 68, iv30d: 0.48, ivHist: 0.35, ivChange5d: 8.5, atmCallPremium: 28.40, atmPutPremium: 26.80, callDelta: 0.50, putDelta: -0.50, dte: 32, earningsInWindow: false, earningsDate: "2026-06-03", callYieldAnn: 93.7, putYieldAnn: 88.5, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 10.3, pe: 85.3 }
  },
  {
    ticker: "SQ", name: "Block Inc.", sector: "Financials",
    price: 72.40, rsi: 44.8, support1: 62.00,
    optionsWriting: { ivRank: 66, iv30d: 0.58, ivHist: 0.42, ivChange5d: 11.2, atmCallPremium: 7.15, atmPutPremium: 6.70, callDelta: 0.50, putDelta: -0.50, dte: 38, earningsInWindow: false, earningsDate: "2026-05-01", callYieldAnn: 94.2, putYieldAnn: 88.3, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 14.4, pe: 38.7 }
  },
  {
    ticker: "SNOW", name: "Snowflake Inc.", sector: "Information Technology",
    price: 168.90, rsi: 50.1, support1: 148.00,
    optionsWriting: { ivRank: 65, iv30d: 0.52, ivHist: 0.38, ivChange5d: 9.8, atmCallPremium: 14.95, atmPutPremium: 14.10, callDelta: 0.50, putDelta: -0.50, dte: 32, earningsInWindow: false, earningsDate: "2026-05-28", callYieldAnn: 100.9, putYieldAnn: 95.2, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 12.4, pe: -1 }
  },
  {
    ticker: "ROKU", name: "Roku Inc.", sector: "Communication Services",
    price: 85.60, rsi: 40.2, support1: 72.00,
    optionsWriting: { ivRank: 72, iv30d: 0.62, ivHist: 0.44, ivChange5d: 25.2, atmCallPremium: 9.05, atmPutPremium: 8.50, callDelta: 0.50, putDelta: -0.50, dte: 38, earningsInWindow: false, earningsDate: "2026-04-24", callYieldAnn: 100.8, putYieldAnn: 94.7, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 15.9, pe: -1 }
  },
  {
    ticker: "UPST", name: "Upstart Holdings", sector: "Financials",
    price: 62.30, rsi: 55.8, support1: 52.00,
    optionsWriting: { ivRank: 80, iv30d: 0.82, ivHist: 0.58, ivChange5d: 18.8, atmCallPremium: 8.70, atmPutPremium: 8.15, callDelta: 0.49, putDelta: -0.49, dte: 32, earningsInWindow: false, earningsDate: "2026-05-06", callYieldAnn: 159.3, putYieldAnn: 149.2, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 16.5, pe: 95.2 }
  },
  {
    ticker: "AFRM", name: "Affirm Holdings", sector: "Financials",
    price: 52.40, rsi: 48.5, support1: 44.00,
    optionsWriting: { ivRank: 75, iv30d: 0.72, ivHist: 0.52, ivChange5d: 14.2, atmCallPremium: 6.42, atmPutPremium: 6.00, callDelta: 0.50, putDelta: -0.50, dte: 38, earningsInWindow: false, earningsDate: "2026-05-08", callYieldAnn: 116.8, putYieldAnn: 109.2, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 16.0, pe: -1 }
  },
  {
    ticker: "NET", name: "Cloudflare Inc.", sector: "Information Technology",
    price: 112.80, rsi: 56.3, support1: 98.00,
    optionsWriting: { ivRank: 62, iv30d: 0.50, ivHist: 0.38, ivChange5d: 7.5, atmCallPremium: 9.60, atmPutPremium: 9.00, callDelta: 0.50, putDelta: -0.50, dte: 32, earningsInWindow: false, earningsDate: "2026-05-01", callYieldAnn: 97.1, putYieldAnn: 91.0, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 13.1, pe: 250.5 }
  },
  {
    ticker: "DKNG", name: "DraftKings Inc.", sector: "Consumer Discretionary",
    price: 38.50, rsi: 42.8, support1: 32.00,
    optionsWriting: { ivRank: 70, iv30d: 0.62, ivHist: 0.45, ivChange5d: 21.5, atmCallPremium: 4.08, atmPutPremium: 3.80, callDelta: 0.49, putDelta: -0.49, dte: 38, earningsInWindow: false, earningsDate: "2026-05-02", callYieldAnn: 101.1, putYieldAnn: 94.1, ccSignal: "sell", cspSignal: "sell", marginOfSafety: 16.9, pe: 65.8 }
  }
];

// Combine all options writing candidates (shorted + additional), deduplicating by ticker
function getAllOptionsWritingCandidates() {
  const fromShorted = SHORTED_STOCKS.filter(s => s.optionsWriting).map(s => ({
    ticker: s.ticker, name: s.name, sector: s.sector, price: s.price,
    rsi: s.rsi, support1: s.support1, optionsWriting: s.optionsWriting
  }));
  const seen = new Set(fromShorted.map(s => s.ticker));
  const extras = OPTIONS_CANDIDATES.filter(c => !seen.has(c.ticker));
  return [...fromShorted, ...extras].sort((a, b) => b.optionsWriting.ivRank - a.optionsWriting.ivRank);
}
