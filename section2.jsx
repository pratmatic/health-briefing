/* global React, WEEK_DATA, HRPrimitives */
const { useState: uS2 } = React;
const {
  SectionMarker, Eyebrow, Sev, Delta, TrendArrow,
} = window.HRPrimitives;

/* ============================================================
   03 · THE WEEK IN DETAIL — daily timeline
   ============================================================ */

const recColor = (s) => s >= 67 ? "var(--green)" : s >= 34 ? "var(--amber)" : "var(--red)";
const recSev = (s) => s >= 67 ? "green" : s >= 34 ? "amber" : "red";

const Timeline = ({ data }) => {
  const [active, setActive] = uS2(5); // Saturday by default — the worst day

  const day = data.days[active];
  return (
    <section id="week" className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <SectionMarker n={3} label="The Week in Detail" />

      <div className="grid grid-cols-12 gap-8">
        {/* Daily strip — 12 cols, full width */}
        <div className="col-span-12">
          <div className="grid grid-cols-7" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
            {data.days.map((d, i) => (
              <DayCell key={d.day} d={d} idx={i} active={i === active} onHover={setActive} />
            ))}
          </div>
        </div>

        {/* Detail panel for active day */}
        <div className="col-span-12 lg:col-span-8 mt-2">
          <DayDetail d={day} />
        </div>

        {/* Side: weekly aggregates */}
        <aside className="col-span-12 lg:col-span-4 mt-2">
          <div className="annot" style={{ borderLeft: "1px solid var(--line)", paddingLeft: 18 }}>
            <Eyebrow className="mb-3">Pattern recognition</Eyebrow>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <PatternRow label="Late dinner (>21:30)" value="3 / 7" sev="amber" />
              <PatternRow label="Alcohol intake" value="6 units" sev="amber" />
              <PatternRow label="Skipped meals" value="3 / 7" sev="amber" />
              <PatternRow label="Padel sessions" value="4 / 7" sev="red" />
              <PatternRow label="Rest days" value="2 / 7" sev="red" />
              <PatternRow label="Supplements complete" value="4 / 7" sev="amber" />
              <PatternRow label="Sleep onset >23:30" value="4 / 7" sev="amber" last />
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
};

const DayCell = ({ d, idx, active, onHover }) => {
  const sev = recSev(d.recovery.score);
  return (
    <div
      className={`timeline-cell ${active ? "active" : ""}`}
      onMouseEnter={() => onHover(idx)}
      onClick={() => onHover(idx)}
      style={{
        borderRight: idx < 6 ? "1px solid var(--line)" : "none",
        padding: "18px 14px 16px",
        position: "relative",
        minHeight: 220,
      }}
    >
      <div className="flex items-baseline justify-between">
        <span className="serif" style={{ fontSize: 18, letterSpacing: "-0.01em" }}>{d.day}</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{d.date}</span>
      </div>

      {/* Recovery */}
      <div style={{ marginTop: 14 }}>
        <div className="flex items-baseline gap-2">
          <span className="dot" style={{ background: recColor(d.recovery.score), boxShadow: `0 0 0 3px color-mix(in oklch, ${recColor(d.recovery.score)} 20%, transparent)` }} />
          <span className="serif-tab" style={{ fontSize: 28, letterSpacing: "-0.02em", color: "var(--ink)" }}>{d.recovery.score}</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>%</span>
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>recovery</div>
        {/* Typical-range band */}
        <div style={{ position: "relative", height: 4, marginTop: 6, background: "var(--line-soft)" }}>
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: "42%", width: "36%",
            background: "var(--ink-4)", opacity: 0.35,
          }} />
          <div style={{
            position: "absolute", top: -2, bottom: -2,
            left: `${d.recovery.score}%`, width: 1.5,
            background: recColor(d.recovery.score),
          }} />
        </div>
        <div className="mono" style={{ fontSize: 9, color: "var(--ink-4)", letterSpacing: "0.06em", marginTop: 3, opacity: 0.7 }}>typical 42–78</div>
      </div>

      {/* Sleep mini bar */}
      <div style={{ marginTop: 14 }}>
        <div className="flex items-baseline gap-1">
          <span className="serif-tab" style={{ fontSize: 14, color: "var(--ink-2)" }}>{d.sleep.total.toFixed(1)}</span>
          <span className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)" }}>h sleep · {d.sleep.deep.toFixed(2)}h deep</span>
        </div>
        <div style={{ height: 2, background: "var(--line-soft)", marginTop: 4 }}>
          <div style={{ height: "100%", width: `${(d.sleep.total / 9) * 100}%`, background: d.sleep.total < 6 ? "var(--red)" : d.sleep.total < 7 ? "var(--amber)" : "var(--green)" }} />
        </div>
      </div>

      {/* Workout */}
      <div style={{ marginTop: 12 }}>
        {d.workout ? (
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-2)", letterSpacing: "0.04em" }}>
              <span style={{ color: "var(--amber)" }}>●</span> {d.workout.sport.toUpperCase()} · {d.workout.min}m
            </div>
            <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)" }}>strain {d.workout.strain.toFixed(1)} · max {d.workout.max}</div>
          </div>
        ) : (
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.04em" }}>○ REST</div>
        )}
      </div>

      {/* Food flags */}
      <div style={{ marginTop: 10, display: "flex", gap: 4, flexWrap: "wrap" }}>
        {d.food.late && <Flag>late dinner</Flag>}
        {d.food.alcohol > 0 && <Flag sev="amber">{d.food.alcohol === 1 ? "1 drink" : `${d.food.alcohol} drinks`}</Flag>}
        {d.food.skipped && <Flag>skip {d.food.skipped.toLowerCase()}</Flag>}
      </div>

      {/* Supps */}
      <div style={{ marginTop: 10 }}>
        <div className="flex items-center gap-1">
          {[0,1,2,3,4,5,6].map((i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: 1,
              background: i < d.supps.taken ? "var(--ink-2)" : "var(--line)",
            }} />
          ))}
          <span className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)", marginLeft: 4 }}>{d.supps.taken}/7</span>
        </div>
      </div>
    </div>
  );
};

const Flag = ({ children, sev }) => (
  <span className="mono" style={{
    fontSize: 9, padding: "2px 6px",
    border: `1px solid ${sev === "amber" ? "var(--amber-dim)" : "var(--line)"}`,
    color: sev === "amber" ? "var(--amber)" : "var(--ink-3)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  }}>{children}</span>
);

const DayDetail = ({ d }) => {
  return (
    <div style={{ padding: "20px 0" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <Eyebrow>Day in focus</Eyebrow>
          <div className="serif" style={{ fontSize: 26, letterSpacing: "-0.015em", marginTop: 2 }}>{d.day} · {d.date}</div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="serif-tab" style={{ fontSize: 38, color: recColor(d.recovery.score) }}>{d.recovery.score}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>recovery</span>
        </div>
      </div>

      <div className="rule" />

      <div className="grid grid-cols-12 gap-6 mt-5">
        <DetailMetric label="HRV" value={d.recovery.hrv.toFixed(1)} unit="ms" />
        <DetailMetric label="RHR" value={d.recovery.rhr} unit="bpm" />
        <DetailMetric label="SpO₂" value={d.recovery.spo2.toFixed(1)} unit="%" />
        <DetailMetric label="Skin temp" value={`${d.recovery.skinTemp.toFixed(1)}`} unit="°C" />

        <DetailMetric label="Sleep" value={d.sleep.total.toFixed(2)} unit="h" />
        <DetailMetric label="Deep" value={d.sleep.deep.toFixed(2)} unit="h" />
        <DetailMetric label="REM" value={d.sleep.rem.toFixed(2)} unit="h" />
        <DetailMetric label="Efficiency" value={d.sleep.eff.toFixed(1)} unit="%" />
      </div>

      <div className="rule-soft" style={{ marginTop: 22, marginBottom: 20 }} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <Eyebrow className="mb-2">Strain & training</Eyebrow>
          <div className="mono" style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
            <div>Day strain · <span className="serif-tab" style={{ color: "var(--ink)" }}>{d.strain.score.toFixed(1)}</span></div>
            <div>Energy · <span className="serif-tab" style={{ color: "var(--ink)" }}>{(d.strain.kj / 1000).toFixed(1)}</span> MJ</div>
            <div>Avg HR · <span className="serif-tab" style={{ color: "var(--ink)" }}>{d.strain.avg}</span> bpm · max <span className="serif-tab" style={{ color: "var(--ink)" }}>{d.strain.max}</span></div>
            {d.workout && <div style={{ marginTop: 4, color: "var(--amber)" }}>{d.workout.sport} · {d.workout.min} min · strain {d.workout.strain.toFixed(1)}</div>}
            {!d.workout && <div style={{ color: "var(--ink-4)" }}>No workout · rest day</div>}
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <Eyebrow className="mb-2">Nutrition & compliance</Eyebrow>
          <div className="mono" style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
            <div>Dinner · <span style={{ color: "var(--ink)" }}>{d.food.dinner}</span></div>
            {d.food.note && <div style={{ color: "var(--amber)" }}>Note · {d.food.note}</div>}
            {d.food.skipped && <div style={{ color: "var(--ink-3)" }}>Skipped · {d.food.skipped}</div>}
            <div>Supplements · <span className="serif-tab" style={{ color: d.supps.taken === 7 ? "var(--green)" : d.supps.taken >= 5 ? "var(--amber)" : "var(--red)" }}>{d.supps.taken}/7</span>
              {d.supps.missed.length > 0 && <span style={{ color: "var(--ink-4)" }}> · missed {d.supps.missed.join(", ")}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailMetric = ({ label, value, unit }) => (
  <div className="col-span-6 md:col-span-3">
    <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</div>
    <div className="flex items-baseline gap-1 mt-1">
      <span className="serif-tab" style={{ fontSize: 22, letterSpacing: "-0.01em" }}>{value}</span>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{unit}</span>
    </div>
  </div>
);

const PatternRow = ({ label, value, sev, last }) => (
  <li style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 0",
    borderBottom: last ? "none" : "1px dashed var(--line-soft)",
  }}>
    <span style={{ color: "var(--ink-2)" }}>{label}</span>
    <span className="serif-tab" style={{
      color: sev === "red" ? "var(--red)" : sev === "amber" ? "var(--amber)" : "var(--ink)",
      fontSize: 14,
    }}>{value}</span>
  </li>
);

window.HRSection2 = { Timeline };
