/* global React, Recharts */
const { useState, useEffect, useMemo, useRef } = React;
const { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, ReferenceLine, BarChart, Bar, Tooltip, Cell } = Recharts;

/* ============================================================
   PRIMITIVES
   ============================================================ */

const SectionMarker = ({ n, label }) => (
  <div className="flex items-baseline gap-3 mb-5">
    <span className="section-marker">§ {String(n).padStart(2, "0")}</span>
    <span className="section-marker" style={{ color: "var(--ink-2)" }}>{label}</span>
    <span className="rule-soft flex-1" />
  </div>
);

const Eyebrow = ({ children, className = "" }) => (
  <div className={`eyebrow ${className}`}>{children}</div>
);

const Sev = ({ level, label }) => {
  const cls = level === "red" ? "dot-red" : level === "amber" ? "dot-amber" : level === "green" ? "dot-green" : "dot-mute";
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span className={`dot ${cls}`} />
      {label && <span className="eyebrow" style={{ color: "var(--ink-2)" }}>{label}</span>}
    </span>
  );
};

const Delta = ({ value, suffix = "", invert = false, format = (v) => v }) => {
  const positive = value > 0;
  const good = invert ? !positive : positive;
  const color = value === 0 ? "var(--ink-3)" : good ? "var(--green)" : "var(--red)";
  const arrow = value === 0 ? "—" : positive ? "▲" : "▼";
  return (
    <span className="mono tnum" style={{ color, fontSize: 11, letterSpacing: "0.04em" }}>
      {arrow} {format(Math.abs(value))}{suffix}
    </span>
  );
};

const TrendArrow = ({ direction }) => {
  if (direction === "rising") return <span className="mono" style={{ color: "var(--amber)" }}>↗</span>;
  if (direction === "declining") return <span className="mono" style={{ color: "var(--red)" }}>↘</span>;
  return <span className="mono" style={{ color: "var(--ink-3)" }}>→</span>;
};

/* ============================================================
   SPARKLINES & MICRO CHARTS
   ============================================================ */

const Sparkline = ({ data, color = "var(--ink)", height = 36, fill = false, baseline = null }) => {
  const series = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer>
        <LineChart data={series} margin={{ top: 4, right: 2, left: 2, bottom: 4 }}>
          {baseline != null && (
            <ReferenceLine y={baseline} stroke="var(--ink-3)" strokeDasharray="2 3" strokeWidth={1} opacity={0.45} />
          )}
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.25}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Custom recovery distribution bar (7 days, color-coded)
const RecoveryDistribution = ({ days }) => {
  const buckets = days.map((d) => {
    const s = d.recovery.score;
    const isNull = s == null;
    const c = isNull ? "var(--line)" :
              s >= 67 ? "var(--green)" :
              s >= 34 ? "var(--amber)" : "var(--red)";
    return { ...d, color: c, _isNull: isNull };
  });
  const max = 100;
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 36 }}>
      {buckets.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center" title={`${d.day}: ${d._isNull ? "—" : d.recovery.score + "%"}`}>
          <div style={{
            width: "100%",
            height: d._isNull ? "8%" : `${(d.recovery.score / max) * 100}%`,
            background: d.color,
            opacity: d._isNull ? 0.4 : 0.85,
            minHeight: 2,
          }} />
        </div>
      ))}
    </div>
  );
};

// Sleep stack: deep / rem / light layered bars
const SleepStack = ({ days, target = 8 }) => {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 48 }}>
      {days.map((d) => {
        const total = d.sleep.total;
        if (total == null || total === 0) {
          return (
            <div key={d.day} className="flex-1" style={{ height: "100%" }} title={`${d.day}: —`}>
              <div style={{ height: "8%", background: "var(--line)", opacity: 0.4, minHeight: 2 }} />
            </div>
          );
        }
        const max = 9;
        const totalPct = (total / max) * 100;
        const deepPct = (d.sleep.deep / total) * totalPct;
        const remPct = (d.sleep.rem / total) * totalPct;
        const lightPct = totalPct - deepPct - remPct;
        return (
          <div key={d.day} className="flex-1 flex flex-col-reverse" style={{ height: "100%" }} title={`${d.day}: ${fmtH(total)}`}>
            <div style={{ height: `${deepPct}%`, background: "var(--ink)", opacity: 0.95 }} />
            <div style={{ height: `${remPct}%`, background: "var(--ink-2)", opacity: 0.7 }} />
            <div style={{ height: `${lightPct}%`, background: "var(--ink-4)", opacity: 0.55 }} />
          </div>
        );
      })}
    </div>
  );
};

// 4-week trend with current week highlight. Null entries render as a low
// muted bar so the strip stays plottable when a day's reading is missing.
const TrendBars = ({ data, color = "var(--ink-2)", highlight = "var(--gold)" }) => {
  const valid = data.filter((v) => v != null);
  const max = valid.length ? Math.max(...valid) : 1;
  const min = valid.length ? Math.min(...valid) * 0.9 : 0;
  const range = max - min;
  return (
    <div className="flex items-end gap-1" style={{ height: 36 }}>
      {data.map((v, i) => {
        const isLast = i === data.length - 1;
        if (v == null) {
          return <div key={i} className="flex-1" style={{
            height: "8%", background: "var(--line)", opacity: 0.35, minHeight: 2,
          }} />;
        }
        const pct = range > 0 ? ((v - min) / range) * 100 : 50;
        return (
          <div key={i} className="flex-1" style={{
            height: `${Math.max(pct, 6)}%`,
            background: isLast ? highlight : color,
            opacity: isLast ? 1 : 0.55,
            minHeight: 2,
          }} />
        );
      })}
    </div>
  );
};

// Format hours as "Xh YYm" (e.g. 4.58 -> "4h 35m"). Renders "—" for null/undefined.
const fmtH = (v) => {
  if (v == null || (typeof v === "number" && !isFinite(v))) return "—";
  const h = Math.floor(v);
  const m = Math.round((v - h) * 60);
  if (m === 60) return `${h + 1}h 0m`;
  return `${h}h ${m}m`;
};

window.HRPrimitives = {
  SectionMarker, Eyebrow, Sev, Delta, TrendArrow,
  Sparkline, RecoveryDistribution, SleepStack, TrendBars,
  fmtH,
};
