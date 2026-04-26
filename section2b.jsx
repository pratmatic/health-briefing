/* global React, HRPrimitives, WEEK_DATA */
const { SectionMarker, Eyebrow } = window.HRPrimitives;

/* ============================================================
   3.5 · NUTRITION SUMMARY
   Sits between Daily Timeline (§03) and Body Signals (§04)
   ============================================================ */

const Nutrition = ({ data }) => {
  const N = data.nutrition;
  const d = data.derived;
  const target = d.proteinTarget;

  const sum = (k) => N.reduce((a, x) => a + x[k], 0);
  const avg = (k) => sum(k) / N.length;
  const avgCal = avg("cal");
  const avgP = avg("protein");
  const avgC = avg("carbs");
  const avgF = avg("fat");

  const hitTarget = N.filter((x) => x.protein >= target).length;

  return (
    <section id="nutrition" className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <SectionMarker n={4} label="Nutrition Summary · estimated" />

      <div className="grid grid-cols-12 gap-8 mb-6">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="display-2" style={{ maxWidth: "22ch" }}>
            Carbohydrate-led, protein-starved. <em style={{ color: "var(--gold)", fontStyle: "italic" }}>One day</em> hit target.
          </h2>
        </div>
        <div className="col-span-12 lg:col-span-5 annot" style={{ borderLeft: "1px solid var(--line)", paddingLeft: 18 }}>
          Macros below are AI-estimated from a free-text food log — not measured. Treat as directional. The protein gap is the most actionable signal here, given the muscle-mass goal and testosterone baseline.
        </div>
      </div>

      {/* Weekly aggregate strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <Aggregate label="Avg calories"  value={`~${Math.round(avgCal)}`}        unit="kcal" base={`30d ~${d.caloriesAvg30d}`} />
        <Aggregate label="Avg protein"   value={`~${Math.round(avgP)}`}          unit="g"    base={`30d ~${d.proteinAvg30d}g · target ${target}g`} highlight sev={avgP < target ? "red" : "green"} />
        <Aggregate label="Avg carbs"     value={`~${Math.round(avgC)}`}          unit="g"    base={`30d ~${d.carbsAvg30d}g`} />
        <Aggregate label="Avg fat"       value={`~${Math.round(avgF)}`}          unit="g"    base={`30d ~${d.fatAvg30d}g`} last />
      </div>

      {/* Protein tracker pull-quote */}
      <div className="grid grid-cols-12 gap-8 mt-8">
        <div className="col-span-12 lg:col-span-4">
          <Eyebrow>Protein vs target</Eyebrow>
          <div className="serif" style={{ fontSize: 30, marginTop: 4, color: "var(--ink)", letterSpacing: "-0.015em" }}>
            <span className="serif-tab" style={{ color: "var(--red)" }}>{hitTarget}</span>
            <span style={{ color: "var(--ink-3)" }}> of </span>
            <span className="serif-tab">7</span>
            <span style={{ color: "var(--ink-3)" }}> days at {target}g</span>
          </div>
          <p className="annot mt-3" style={{ maxWidth: "32ch" }}>
            With testosterone at the floor of physiology and a stated muscle-mass goal, sub-100g protein days are net catabolic. The 30-day average sits at ~{d.proteinAvg30d}g — a structural shortfall, not a one-off week.
          </p>
        </div>

        {/* Daily protein bars vs target */}
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-7 gap-2" style={{ height: 140, alignItems: "end" }}>
            {N.map((n) => {
              const pct = Math.min((n.protein / 160) * 100, 100);
              const hit = n.protein >= target;
              const targetPct = (target / 160) * 100;
              return (
                <div key={n.day} className="flex flex-col-reverse" style={{ height: "100%", position: "relative" }}>
                  {/* bar */}
                  <div style={{
                    height: `${pct}%`,
                    background: hit ? "var(--green)" : n.protein >= 80 ? "var(--amber)" : "var(--red)",
                    opacity: 0.85,
                  }} />
                  {/* target line */}
                  <div style={{
                    position: "absolute", left: 0, right: 0, bottom: `${targetPct}%`,
                    borderTop: "1px dashed var(--ink-3)", opacity: 0.55,
                  }} />
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {N.map((n) => (
              <div key={n.day} className="text-center">
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.08em" }}>{n.day[0]}</div>
                <div className="serif-tab" style={{ fontSize: 14, color: n.protein >= target ? "var(--green)" : "var(--ink)" }}>
                  <span style={{ color: "var(--ink-4)", fontSize: 11, marginRight: 1 }}>~</span>{n.protein}
                </div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>g</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3" style={{ paddingTop: 10, borderTop: "1px solid var(--line-soft)" }}>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", letterSpacing: "0.08em" }}>
              <span style={{ borderTop: "1px dashed var(--ink-3)", display: "inline-block", width: 18, verticalAlign: "middle", marginRight: 6, opacity: 0.6 }} />
              TARGET {target}G
            </span>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em" }}>
              30D AVG ~{d.proteinAvg30d}G · {Math.round((avgP / target) * 100)}% OF TARGET THIS WEEK
            </span>
          </div>
        </div>
      </div>

      {/* Daily ledger */}
      <div className="mt-10">
        <Eyebrow className="mb-3">Daily ledger · estimates</Eyebrow>
        <div style={{ borderTop: "1px solid var(--line)" }}>
          {/* header */}
          <div className="grid grid-cols-12 gap-2 items-center mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.1em", padding: "10px 0", borderBottom: "1px solid var(--line-soft)", textTransform: "uppercase" }}>
            <div className="col-span-2">DAY</div>
            <div className="col-span-1 text-right">CAL</div>
            <div className="col-span-1 text-right">PROTEIN</div>
            <div className="col-span-1 text-right">CARBS</div>
            <div className="col-span-1 text-right">FAT</div>
            <div className="col-span-2">LAST MEAL</div>
            <div className="col-span-4">FLAGS</div>
          </div>

          {N.map((n) => {
            const proteinShort = n.protein < target;
            return (
              <div key={n.day} className="grid grid-cols-12 gap-2 items-center" style={{ padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <div className="col-span-2">
                  <span className="serif" style={{ fontSize: 16 }}>{n.day}</span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)", marginLeft: 8 }}>{n.date}</span>
                </div>
                <NCell value={`~${n.cal}`}          unit="kcal" />
                <NCell value={`~${n.protein}`}      unit="g" sev={proteinShort ? (n.protein < 75 ? "red" : "amber") : "green"} />
                <NCell value={`~${n.carbs}`}        unit="g" />
                <NCell value={`~${n.fat}`}          unit="g" />
                <div className="col-span-2 mono tnum" style={{ fontSize: 12, color: n.late ? "var(--amber)" : "var(--ink-2)" }}>
                  {n.lastMeal}{n.late && <span style={{ color: "var(--amber)", marginLeft: 6 }}>· late</span>}
                </div>
                <div className="col-span-4 flex gap-1 flex-wrap">
                  {n.flags.length === 0 && <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>—</span>}
                  {n.flags.map((f) => <NFlag key={f}>{f}</NFlag>)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 annot" style={{ fontSize: 10.5 }}>
          <span style={{ color: "var(--ink-4)" }}>~</span> indicates AI estimate from food log · not measured · directional only.
          <span className="divider-dot mono">·</span>
          30d weekly avg: {d.lateDinners30d.toFixed(1)} late dinners, {d.alcoholDays30d.toFixed(1)} alcohol days.
        </div>
      </div>
    </section>
  );
};

const Aggregate = ({ label, value, unit, base, last, highlight, sev }) => {
  const sevColor = sev === "red" ? "var(--red)" : sev === "green" ? "var(--green)" : "var(--ink)";
  return (
    <div style={{
      padding: "20px 22px",
      borderRight: last ? "none" : "1px solid var(--line-soft)",
    }}>
      <Eyebrow style={{ color: highlight ? "var(--ink-2)" : "var(--ink-3)" }}>{label}</Eyebrow>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="serif-tab" style={{ fontSize: 32, letterSpacing: "-0.02em", color: highlight ? sevColor : "var(--ink)" }}>{value}</span>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{unit}</span>
      </div>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.04em", marginTop: 4 }}>{base}</div>
    </div>
  );
};

const NCell = ({ value, unit, sev }) => {
  const c = sev === "red" ? "var(--red)" : sev === "amber" ? "var(--amber)" : sev === "green" ? "var(--green)" : "var(--ink)";
  return (
    <div className="col-span-1 text-right">
      <span className="serif-tab" style={{ fontSize: 15, color: c }}>
        <span style={{ color: "var(--ink-4)", fontSize: 11 }}>~</span>
        {value.replace("~", "")}
      </span>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)", marginLeft: 3 }}>{unit}</span>
    </div>
  );
};

const NFlag = ({ children }) => {
  const isAlcohol = /alcohol/i.test(children);
  const isLate = /late/i.test(children);
  const color = isAlcohol ? "var(--amber)" : isLate ? "var(--amber)" : "var(--ink-3)";
  return (
    <span className="mono" style={{
      fontSize: 9.5, padding: "2px 6px",
      border: `1px solid color-mix(in oklch, ${color} 50%, var(--line))`,
      color, letterSpacing: "0.06em", textTransform: "uppercase",
    }}>{children}</span>
  );
};

window.HRSection2b = { Nutrition };
