/* global React, WEEK_DATA, HRPrimitives */
const {
  SectionMarker, Eyebrow, Sev, Delta, TrendArrow,
  Sparkline, RecoveryDistribution, SleepStack, TrendBars, fmtH,
} = window.HRPrimitives;

const VERDICT_EMPHASIS_WORDS = [
  "compounding", "spiralling", "spiraling", "spiral",
  "recovering", "rebounding", "stabilising", "stabilizing",
  "declining", "deteriorating", "worsening", "improving",
  "accelerating", "decelerating", "narrowing", "widening",
  "collapsing", "expanding", "rising", "falling",
  "depleted", "exhausted", "overtrained", "undertrained",
  "elevated", "suppressed", "blunted", "amplified",
  "deficit", "surplus", "imbalance", "dysregulation",
  "inflammation", "catabolic", "anabolic",
];

const parseVerdict = (verdict) => {
  if (!verdict || typeof verdict !== "string") {
    return {
      headline: "Analysis pending — insufficient data this week",
      paragraphs: [],
      empty: true,
    };
  }
  const sentences = verdict.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const headline = sentences[0] || verdict;
  const remaining = sentences.slice(1);
  let paragraphs;
  if (remaining.length <= 1) paragraphs = remaining;
  else paragraphs = [remaining.slice(0, -1).join(" "), remaining[remaining.length - 1]];
  return { headline, paragraphs, empty: false };
};

const emphasizeHeadline = (headline) => {
  const wrap = (re) => {
    const m = headline.match(re);
    if (!m) return null;
    const idx = m.index;
    const matched = m[0];
    return (
      <>
        {headline.slice(0, idx)}
        <em style={{ color: "var(--gold)", fontStyle: "italic" }}>{matched}</em>
        {headline.slice(idx + matched.length)}
      </>
    );
  };
  for (const word of VERDICT_EMPHASIS_WORDS) {
    const out = wrap(new RegExp(`\\b${word}\\b`, "i"));
    if (out) return out;
  }
  const fallback = wrap(/\b\w+(?:ing|ed)\b/i);
  if (fallback) return fallback;
  return headline;
};

/* ============================================================
   00 · HEADER
   ============================================================ */

const Header = ({ data, currentSection, onJump }) => {
  const sections = [
    { id: "verdict", label: "Verdict" },
    { id: "pulse", label: "Pulse" },
    { id: "week", label: "Week" },
    { id: "signals", label: "Signals" },
    { id: "connections", label: "Connections" },
    { id: "actions", label: "Actions" },
  ];

  return (
    <div className="topnav">
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, gap: 24 }}>
        <div className="flex items-baseline gap-3" style={{ minWidth: 0 }}>
          <span className="serif" style={{ fontSize: 18, letterSpacing: "-0.01em" }}>
            <span style={{ color: "var(--ink-3)" }}>The</span> Briefing
          </span>
          <span className="divider-dot mono">·</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em" }}>
            {data.patient.name.toUpperCase()} / {data.patient.week.toUpperCase()}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-7">
          {sections.map((s) => (
            <a key={s.id}
               className={`navlink ${currentSection === s.id ? "active" : ""}`}
               onClick={() => onJump(s.id)}>
              {s.label}
            </a>
          ))}
        </div>
        <div className="hidden md:block mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
          {data.patient.dateRange}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   01 · MASTHEAD + VERDICT (the editor's letter)
   ============================================================ */

const Verdict = ({ data }) => {
  const d = data.derived;
  const v = parseVerdict(data.verdict);
  return (
    <section id="verdict" className="page" style={{ paddingTop: 56, paddingBottom: 72 }}>
      {/* Masthead */}
      <div className="reveal" style={{ animationDelay: "0ms" }}>
        <div className="rule-thick" style={{ marginBottom: 16 }} />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Eyebrow>Weekly Health Intelligence · {data.patient.week}</Eyebrow>
          <Eyebrow>Issued Fri · {data.patient.dateRange}</Eyebrow>
        </div>
        <div className="rule" style={{ marginTop: 16, marginBottom: 40 }} />
      </div>

      {/* Title */}
      <div className="reveal" style={{ animationDelay: "80ms" }}>
        <h1 className="display-1 mb-6" style={{ maxWidth: "16ch" }}>
          {v.empty ? v.headline : emphasizeHeadline(v.headline)}
        </h1>
      </div>

      {/* Pull-quote verdict — 8 col / 4 col annotation rail */}
      <div className="grid grid-cols-12 gap-8 mt-10 reveal" style={{ animationDelay: "160ms" }}>
        <div className="col-span-12 lg:col-span-8">
          <div className="serif" style={{ fontSize: 13, letterSpacing: "0.06em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 18 }}>
            The Verdict
          </div>
          {v.paragraphs.map((p, i) => (
            <p key={i} className="pull" style={i > 0 ? { marginTop: 20 } : undefined}>{p}</p>
          ))}

          <div className="flex items-center gap-3 mt-10">
            <div className="rule" style={{ flex: 1 }} />
            <span className="serif" style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>{v.empty ? "Severity · Pending" : "Severity · Amber-Red"}</span>
            <Sev level={v.empty ? "grey" : "red"} />
          </div>
        </div>

        {/* Annotation rail */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="annot" style={{ borderLeft: "1px solid var(--line)", paddingLeft: 18 }}>
            <div className="eyebrow" style={{ color: "var(--ink-2)", marginBottom: 14 }}>What changed this week</div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <div>
                <div style={{ color: "var(--ink-3)" }}>HRV 7d / 30d</div>
                <div className="serif-tab" style={{ color: "var(--ink)", fontSize: 22 }}>{d.hrvAvg7d.toFixed(1)} <span style={{ color: "var(--ink-4)", fontSize: 14 }}>/ {d.hrvAvg30d.toFixed(1)}</span></div>
                <Delta value={-(d.hrvAvg30d - d.hrvAvg7d)} suffix=" ms" invert format={(v) => v.toFixed(1)} />
              </div>
              <div>
                <div style={{ color: "var(--ink-3)" }}>RHR 7d / 30d</div>
                <div className="serif-tab" style={{ color: "var(--ink)", fontSize: 22 }}>{d.rhrAvg7d.toFixed(1)} <span style={{ color: "var(--ink-4)", fontSize: 14 }}>/ {d.rhrAvg30d.toFixed(1)}</span></div>
                <Delta value={d.rhrAvg7d - d.rhrAvg30d} suffix=" bpm" format={(v) => v.toFixed(1)} />
              </div>
              <div>
                <div style={{ color: "var(--ink-3)" }}>Recovery 7d</div>
                <div className="serif-tab" style={{ color: "var(--ink)", fontSize: 22 }}>{d.recoveryAvg7d}<span style={{ color: "var(--ink-4)", fontSize: 14 }}>%</span></div>
                <Delta value={d.recoveryAvg7d - d.recoveryAvg30d} suffix=" pts" format={(v) => v.toFixed(0)} />
                <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)", letterSpacing: "0.06em", marginTop: 2, opacity: 0.7 }}>30D BAND {d.recoveryBand[0]}–{d.recoveryBand[1]}%</div>
              </div>
              <div>
                <div style={{ color: "var(--ink-3)" }}>Sleep debt</div>
                <div className="serif-tab" style={{ color: "var(--ink)", fontSize: 22 }}>{fmtH(d.sleepDebtCum)}</div>
                <span className="mono tnum" style={{ color: "var(--red)", fontSize: 11 }}>cumulative · 7d</span>
              </div>
            </div>

            <div className="rule-soft" style={{ margin: "20px 0 16px" }} />
            <div className="eyebrow" style={{ color: "var(--ink-2)", marginBottom: 8 }}>Standing context</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {data.conditions.map((c, i) => (
                <li key={i} style={{ display: "flex", gap: 8, padding: "4px 0", color: "var(--ink-2)", borderBottom: i < data.conditions.length - 1 ? "1px dashed var(--line-soft)" : "none" }}>
                  <span style={{ color: "var(--ink-4)" }}>—</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
};

/* ============================================================
   02 · BIOMETRIC PULSE
   Editorial layout: large lead metric + 5 stacked metric rows
   ============================================================ */

const Pulse = ({ data }) => {
  const d = data.derived;
  const hrvSpark = data.days.map((x) => x.recovery.hrv);
  const rhrSpark = data.days.map((x) => x.recovery.rhr);

  // Recovery distribution. Treat null score as "no data" so it doesn't get
  // miscounted as red (JS `null < 34` coerces to `0 < 34` and would otherwise
  // inflate the red-day count).
  const recoveryDays = data.days.filter((x) => x.recovery.score != null);
  const greenDays = recoveryDays.filter((x) => x.recovery.score >= 67).length;
  const amberDays = recoveryDays.filter((x) => x.recovery.score >= 34 && x.recovery.score < 67).length;
  const redDays   = recoveryDays.filter((x) => x.recovery.score < 34).length;
  const noDataDays = data.days.length - recoveryDays.length;

  const sleepDays = data.days.filter((x) => x.sleep.total != null && x.sleep.total > 0);
  const totalSleep = sleepDays.reduce((a, x) => a + x.sleep.total, 0);
  const avgSleep = sleepDays.length ? totalSleep / sleepDays.length : null;
  const totalNeeded = sleepDays.reduce((a, x) => a + (x.sleep.needed || 0), 0);
  const avgNeeded = sleepDays.length ? totalNeeded / sleepDays.length : null;

  const deepPct = avgSleep ? (d.deepAvg7d / avgSleep) * 100 : 0;

  // Derived note inputs
  const rhrDelta = (d.rhrAvg7d != null && d.rhrAvg30d != null) ? d.rhrAvg7d - d.rhrAvg30d : 0;
  const shortNights = sleepDays.filter((x) => x.sleep.total < 5.5).length;
  const deepShortNights = data.days.filter((x) => x.sleep.deep != null && x.sleep.deep < d.deepTarget).length;
  const deepMeasuredNights = data.days.filter((x) => x.sleep.deep != null).length;

  return (
    <section id="pulse" className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <SectionMarker n={2} label="Biometric Pulse" />

      <div className="grid grid-cols-12 gap-8">
        {/* Lead metric — HRV (the headline number) */}
        <div className="col-span-12 lg:col-span-5 metric-block">
          <div className="flex items-baseline justify-between mb-2">
            <Eyebrow>Heart Rate Variability · 7d avg</Eyebrow>
            <TrendArrow direction={d.hrvTrend} />
          </div>
          <div className="flex items-end gap-3">
            <div className="serif-tab" style={{ fontSize: 88, lineHeight: 0.92, letterSpacing: "-0.03em" }}>
              {d.hrvAvg7d.toFixed(1)}
            </div>
            <div style={{ paddingBottom: 14 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>MILLISECONDS</div>
              <Delta value={-(d.hrvAvg30d - d.hrvAvg7d)} suffix=" vs 30d" invert format={(v) => v.toFixed(1)} />
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <Sparkline data={hrvSpark} color="var(--ink)" height={56} baseline={d.hrvAvg30d} />
            <div className="flex justify-between mono" style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 4 }}>
              {data.days.map((x) => <span key={x.day}>{x.day[0]}</span>)}
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.06em", marginTop: 4, opacity: 0.75 }}>
              <span style={{ borderTop: "1px dashed var(--ink-3)", display: "inline-block", width: 14, verticalAlign: "middle", marginRight: 6, opacity: 0.6 }} />
              30D BASELINE {d.hrvAvg30d.toFixed(1)} MS
            </div>
          </div>

          <div className="prose mt-6" style={{ paddingTop: 18, borderTop: "1px solid var(--line-soft)" }}>
            <p style={{ fontSize: 14 }}>
              HRV is <strong>{d.hrvDeltaPct >= 0 ? `${d.hrvDeltaPct.toFixed(1)}% above` : `${Math.abs(d.hrvDeltaPct).toFixed(1)}% below`} your 30-day baseline</strong> — trend is <span className="mono">{d.hrvTrend}</span>. Coefficient of variation <span className="mono tnum">{d.hrvCv}%</span> reflects {d.hrvCv >= 20 ? "dysregulated autonomic recovery, not random noise" : "consistent autonomic state"}.
            </p>
          </div>
        </div>

        {/* Right column: 5 stacked metric rows */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 gap-0">
          {/* RHR */}
          <MetricRow
            eyebrow="Resting Heart Rate · 7d avg"
            value={d.rhrAvg7d.toFixed(1)}
            unit="bpm"
            baseline={`30d ${d.rhrAvg30d.toFixed(1)}`}
            delta={<Delta value={d.rhrAvg7d - d.rhrAvg30d} suffix=" vs baseline" format={(v) => v.toFixed(1)} />}
            note={
              rhrDelta > 0.5
                ? <>Elevated <span className="serif-tab">{rhrDelta.toFixed(1)} bpm</span> over baseline. Sustained sympathetic load.</>
                : rhrDelta < -0.5
                  ? <>Suppressed <span className="serif-tab">{Math.abs(rhrDelta).toFixed(1)} bpm</span> below baseline. Parasympathetic recovery.</>
                  : <>RHR within <span className="serif-tab">{Math.abs(rhrDelta).toFixed(1)} bpm</span> of baseline. Stable autonomic state.</>
            }
            chart={<Sparkline data={rhrSpark} color="var(--amber)" height={36} baseline={d.rhrAvg30d} />}
          />
          <MetricRow
            eyebrow="Recovery Score · distribution"
            value={d.recoveryAvg7d}
            unit="%"
            baseline={`30d ${d.recoveryAvg30d}%`}
            delta={<Delta value={d.recoveryAvg7d - d.recoveryAvg30d} suffix=" pts" format={(v) => v.toFixed(0)} />}
            note={<>{redDays} red · {amberDays} amber · {greenDays} green{noDataDays ? ` · ${noDataDays} no data` : ""}.</>}
            chart={<RecoveryDistribution days={data.days} />}
          />
          <MetricRow
            eyebrow="Sleep · total vs needed"
            value={avgSleep == null ? "—" : fmtH(avgSleep)}
            unit="/ night"
            baseline={`30d ${fmtH(d.sleepAvg30d)}`}
            delta={
              avgSleep != null && avgNeeded != null
                ? <span className="mono tnum" style={{ color: "var(--red)", fontSize: 11 }}>▼ {fmtH(avgNeeded - avgSleep)} short of need</span>
                : <span className="mono tnum" style={{ color: "var(--ink-4)", fontSize: 11 }}>—</span>
            }
            note={
              <>Cumulative debt <span className="serif-tab">{fmtH(d.sleepDebtCum)}</span>.
                {shortNights > 0 ? <> {shortNights} night{shortNights === 1 ? "" : "s"} below 5h 30m.</> : null}
              </>
            }
            chart={<SleepStack days={data.days} />}
          />
          <MetricRow
            eyebrow="Deep Sleep · avg / target"
            value={fmtH(d.deepAvg7d)}
            unit={`/ ${fmtH(d.deepTarget)} target`}
            baseline={`30d ${fmtH(d.deepAvg30d)}`}
            delta={<span className="mono tnum" style={{ color: "var(--amber)", fontSize: 11 }}>{deepPct.toFixed(0)}% of total</span>}
            note={
              deepMeasuredNights > 0
                ? <>Below target on <span className="serif-tab">{deepShortNights} / {deepMeasuredNights}</span> night{deepMeasuredNights === 1 ? "" : "s"}. {deepShortNights / deepMeasuredNights >= 0.5 ? "GH release likely blunted." : "Restorative depth largely intact."}</>
                : <>Deep-sleep readings unavailable this week.</>
            }
            chart={<TrendBars data={data.days.map((x) => x.sleep.deep)} color="var(--ink-3)" highlight="var(--ink)" />}
          />
          <MetricRow
            eyebrow="Strain Load · weekly total"
            value={d.totalStrain.toFixed(1)}
            unit={`· ${d.padelSessions} sessions`}
            baseline={d.strainRecRatio ? `ratio ${d.strainRecRatio.toFixed(2)} · target ≤ 1.0` : `target ≤ 1.0`}
            delta={
              d.strainRecRatio > 1.0
                ? <span className="mono tnum" style={{ color: "var(--red)", fontSize: 11 }}>▲ ratio {d.strainRecRatio.toFixed(2)} (over budget)</span>
                : <span className="mono tnum" style={{ color: "var(--green)", fontSize: 11 }}>● ratio {d.strainRecRatio.toFixed(2)} (within budget)</span>
            }
            note={
              d.strainRecRatio > 1.3
                ? <>Strain : Recovery imbalance. Training capacity exceeded.</>
                : d.strainRecRatio > 1.0
                  ? <>Slight strain : recovery overhang. Watch for cumulative load next week.</>
                  : <>Strain absorbed cleanly. Capacity available for added load.</>
            }
            chart={
              <div className="flex items-end gap-1" style={{ height: 36 }}>
                {data.days.map((x, i) => {
                  const v = x.strain.score;
                  const high = v >= 14;
                  return <div key={i} className="flex-1" style={{
                    height: `${(v / 21) * 100}%`,
                    background: high ? "var(--red)" : v >= 8 ? "var(--amber)" : "var(--ink-3)",
                    opacity: high ? 0.9 : 0.7, minHeight: 2,
                  }} />;
                })}
              </div>
            }
          />
        </div>
      </div>

      {/* 4-week context strip */}
      <div className="mt-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-12 metric-block">
          <Eyebrow>Four-week context · {data.patient.week}</Eyebrow>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-5">
            <FourWeek title="HRV (ms)" data={d.hrv4wkTrend} format={(v) => v.toFixed(1)} sev="red" />
            <FourWeek title="RHR (bpm)" data={d.rhr4wkTrend} format={(v) => v.toFixed(1)} sev="amber" />
            <FourWeek title="Recovery (%)" data={d.recovery4wkTrend} format={(v) => v.toFixed(0)} sev={d.recovery4wkTrend[d.recovery4wkTrend.length-1] >= 67 ? "green" : d.recovery4wkTrend[d.recovery4wkTrend.length-1] >= 34 ? "amber" : "red"} />
            <FourWeek title="Sleep debt (h)" data={d.sleepDebt4wkTrend} format={(v) => v.toFixed(1)} sev={d.sleepDebt4wkTrend[d.sleepDebt4wkTrend.length-1] >= 10 ? "red" : d.sleepDebt4wkTrend[d.sleepDebt4wkTrend.length-1] >= 5 ? "amber" : "green"} inverted />
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricRow = ({ eyebrow, value, unit, delta, note, chart, baseline }) => (
  <div style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
    <div className="grid grid-cols-12 gap-4 items-center">
      <div className="col-span-12 md:col-span-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="serif-tab" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>{value}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{unit}</span>
        </div>
        <div style={{ marginTop: 4 }}>{delta}</div>
        {baseline && <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.06em", marginTop: 3, opacity: 0.7 }}>{baseline.toUpperCase()}</div>}
      </div>
      <div className="col-span-12 md:col-span-4">{chart}</div>
      <div className="col-span-12 md:col-span-4 mono" style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
        {note}
      </div>
    </div>
  </div>
);

const FourWeek = ({ title, data, format, sev, inverted }) => {
  const last = data[data.length - 1];
  const first = data[0];
  const delta = last - first;
  const sevColor = sev === "red" ? "var(--red)" : sev === "amber" ? "var(--amber)" : "var(--green)";
  return (
    <div>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</div>
      <div className="flex items-end gap-1 mt-3" style={{ height: 32 }}>
        {data.map((v, i) => {
          const max = Math.max(...data); const min = Math.min(...data) * 0.85;
          const pct = ((v - min) / (max - min)) * 100;
          const isLast = i === data.length - 1;
          return <div key={i} className="flex-1" style={{
            height: `${Math.max(pct, 8)}%`,
            background: isLast ? sevColor : "var(--ink-4)",
            opacity: isLast ? 1 : 0.55, minHeight: 2,
          }} />;
        })}
      </div>
      <div className="flex items-baseline justify-between mt-2">
        <span className="serif-tab" style={{ fontSize: 22 }}>{format(last)}</span>
        <span className="mono tnum" style={{ fontSize: 11, color: inverted ? (delta > 0 ? "var(--red)" : "var(--green)") : (delta > 0 ? "var(--green)" : "var(--red)") }}>
          {delta > 0 ? "+" : ""}{format(delta)}
        </span>
      </div>
    </div>
  );
};

window.HRSection1 = { Header, Verdict, Pulse };
