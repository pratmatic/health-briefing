/* global React, HRPrimitives */
const { SectionMarker, Eyebrow, Sev } = window.HRPrimitives;

/* ============================================================
   06 · SUPPLEMENT & COMPLIANCE SCORECARD
   ============================================================ */

const Supplements = ({ data }) => {
  const dayLabels = data.days.map((d) => d.day);
  // Sample build hardcoded "44/49" / "21/21" / "23/28" and "WEEK 90%" — derive
  // them from the real supplements array + per-category totals supplied by
  // starter.py.
  const totals = (data.derived && data.derived.suppsTotalsByCategory) || null;
  const ct = totals ? totals.critical : null;
  const at = totals ? totals.adjunct  : null;
  const ot = totals ? totals.overall  : null;
  const overallPct = ot && ot.total ? Math.round((ot.taken / ot.total) * 100) : 0;
  const sevFor = (b) => (b && b.total > 0 && b.taken === b.total) ? "green" :
                        (b && b.total > 0 && b.taken / b.total >= 0.7) ? "amber" : "red";
  return (
    <section id="supplements" className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <SectionMarker n={5} label="Supplement Compliance" />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div style={{ borderTop: "1px solid var(--line)" }}>
            <div className="grid grid-cols-12 items-center" style={{ padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <div className="col-span-5 eyebrow">Supplement</div>
              <div className="col-span-7 grid grid-cols-9 gap-1">
                {dayLabels.map((d) => (
                  <div key={d} className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.08em", textAlign: "center" }}>{d[0]}</div>
                ))}
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.08em", textAlign: "right", gridColumn: "span 2" }}>RATE</div>
              </div>
            </div>

            {data.supplements.map((s) => {
              // Per-day state from starter.py: "taken" | "missed" | "no-data".
              // Falls back to inference if dayStatus isn't present (older data files).
              const statusFor = (i, day) => {
                if (Array.isArray(s.dayStatus) && s.dayStatus[i]) return s.dayStatus[i];
                if (s.missedDays && s.missedDays.includes(day)) return "missed";
                if (s.total === 0) return "no-data";
                return "taken";
              };
              const rate = s.total > 0 ? s.taken / s.total : null;
              const rateColor =
                rate === null   ? "var(--ink-4)" :
                rate === 1      ? "var(--green)" :
                rate >= 0.7     ? "var(--amber)" :
                                  "var(--red)";
              return (
                <div key={s.name} className="grid grid-cols-12 items-center" style={{ padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div className="col-span-5">
                    <div className="serif" style={{ fontSize: 16 }}>{s.name}</div>
                    {s.critical && <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>critical</div>}
                    {s.workoutOnly && <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>workout-only</div>}
                  </div>
                  <div className="col-span-7 grid grid-cols-9 gap-1 items-center">
                    {dayLabels.map((d, i) => {
                      const state = statusFor(i, d);
                      const styleByState = {
                        "taken":   { background: "var(--ink)", border: "none",                     opacity: 0.92 },
                        "missed":  { background: "transparent", border: "1px solid var(--line)",   opacity: 1 },
                        "no-data": { background: "transparent", border: "1px dashed var(--line-soft)", opacity: 0.45 },
                      };
                      const style = styleByState[state] || styleByState["no-data"];
                      return <div key={d} title={state} style={{ height: 18, ...style }} />;
                    })}
                    <div className="mono tnum" style={{ gridColumn: "span 2", textAlign: "right", color: rateColor, fontSize: 13, fontWeight: 500 }}>
                      {s.total === 0 ? "—" : `${s.taken}/${s.total}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mono mt-3" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.06em", textAlign: "right" }}>
            WEEK {overallPct}% · 30D BASELINE {data.derived.suppsAvg30d}%
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="annot" style={{ borderLeft: "1px solid var(--line)", paddingLeft: 18 }}>
            <Eyebrow className="mb-3">Compliance flag</Eyebrow>
            {(() => {
              // Worst-compliance supplement and worst-compliance day this week, derived from data.
              const supps = data.supplements || [];
              const taken = (s) => (s.total ? s.taken / s.total : 1);
              const worst = supps.filter(s => s.total > 0).sort((a,b) => taken(a) - taken(b))[0];
              const worstDay = data.days.reduce((best, d) => {
                if (!d.supps || d.supps.total === 0) return best;
                const r = d.supps.taken / d.supps.total;
                return (best === null || r < best.r) ? { day: d.day, r, taken: d.supps.taken, total: d.supps.total } : best;
              }, null);
              return (
                <>
                  {worst ? (
                    <p className="prose" style={{ color: "var(--ink-2)", fontSize: 14 }}>
                      <strong>{worst.name}</strong> — taken {worst.taken}/{worst.total} day{worst.total !== 1 ? "s" : ""} this week
                      {worst.missedDays && worst.missedDays.length ? ` (missed ${worst.missedDays.join(", ")})` : ""}.
                      {worst.critical ? " Critical medication — half-life means same-day misses echo into next-day TSH variability." : ""}
                    </p>
                  ) : null}
                  {worstDay ? (
                    <p className="prose" style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 8 }}>
                      <strong>{worstDay.day}</strong> was the lowest-compliance day ({worstDay.taken}/{worstDay.total} supplements taken). Cross-check against that day's recovery.
                    </p>
                  ) : null}
                </>
              );
            })()}
            <div className="rule-soft" style={{ margin: "16px 0" }} />
            <div className="grid grid-cols-3 gap-3">
              <CompTotal label="Critical" value={ct ? `${ct.taken}/${ct.total}` : "—"} sev={sevFor(ct)} />
              <CompTotal label="Adjuncts" value={at ? `${at.taken}/${at.total}` : "—"} sev={sevFor(at)} />
              <CompTotal label="Overall" value={ot ? `${ot.taken}/${ot.total}` : "—"} sev={sevFor(ot)} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

const CompTotal = ({ label, value, sev }) => {
  const color = sev === "green" ? "var(--green)" : sev === "amber" ? "var(--amber)" : "var(--red)";
  return (
    <div>
      <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div className="serif-tab" style={{ fontSize: 22, color, marginTop: 2 }}>{value}</div>
    </div>
  );
};

/* ============================================================
   07 · ACTIONS
   ============================================================ */

const CAT_COLOR = {
  Medical:     "var(--red)",
  Training:    "var(--amber)",
  Sleep:       "var(--gold)",
  Nutrition:   "var(--amber)",
  Supplements: "var(--green)",
  Bloodwork:   "var(--red)",
  Tracking:    "var(--ink-2)",
};

const Actions = ({ data }) => {
  const actions = data.actions;
  if (actions == null || actions.length === 0) return null;

  const sorted = [...actions].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  return (
    <section id="actions" className="page" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <SectionMarker n={9} label="Actions" />

      <div className="grid grid-cols-12 gap-8 mb-6">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="display-2" style={{ maxWidth: "22ch" }}>
            Seven moves, in order. <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Specific.</em>
          </h2>
        </div>
        <div className="col-span-12 lg:col-span-5 annot" style={{ borderLeft: "1px solid var(--line)", paddingLeft: 18 }}>
          Ranked by priority. If you can only do three this week — do 1, 2, and 3.
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)" }}>
        {sorted.map((a, i) => {
          const num = String(a.priority ?? (i + 1)).padStart(2, "0");
          return (
            <div key={i} className="grid grid-cols-12 gap-4 items-baseline" style={{ padding: "20px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <div className="col-span-12 md:col-span-1">
                <span className="serif-tab" style={{ fontSize: 38, color: "var(--ink-3)", letterSpacing: "-0.02em" }}>{num}</span>
              </div>
              <div className="col-span-12 md:col-span-7">
                <div className="serif" style={{ fontSize: 19, lineHeight: 1.4, color: "var(--ink)", maxWidth: "60ch" }}>{a.text}</div>
              </div>
              <div className="col-span-6 md:col-span-2">
                <Eyebrow>Category</Eyebrow>
                <div className="mono" style={{ fontSize: 12, color: CAT_COLOR[a.category] || "var(--ink-2)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3 }}>
                  ● {a.category}
                </div>
              </div>
              <div className="col-span-6 md:col-span-2">
                <Eyebrow>Timeframe</Eyebrow>
                <div className="serif" style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 3 }}>{a.timeframe}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ============================================================
   08 · BLOODWORK TRACKER
   ============================================================ */

const Bloodwork = ({ data }) => {
  const d = data.derived;
  return (
    <section id="bloodwork" className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <SectionMarker n={8} label="Bloodwork Tracker" />
      {/* order: 8 bloodwork → 9 actions */}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <Eyebrow>Days since last panel</Eyebrow>
          <div className="serif-tab mt-2" style={{ fontSize: 64, letterSpacing: "-0.025em", color: "var(--amber)" }}>
            {data.derived.daysSinceBlood}
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em" }}>
            COMPREHENSIVE · TARGET ≤ 90
          </div>

          <div className="rule-soft" style={{ margin: "20px 0" }} />

          <Eyebrow>Days since last thyroid</Eyebrow>
          <div className="serif-tab mt-2" style={{ fontSize: 40, color: "var(--green)" }}>
            {data.derived.daysSinceThyroid}
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em" }}>
            TSH · TARGET ≤ 60 ON TITRATION
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Eyebrow className="mb-3">Recent baselines · last comprehensive panel</Eyebrow>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1" style={{ borderTop: "1px solid var(--line)" }}>
            {data.bloods.map((b) => {
              const color = b.sev === "red" ? "var(--red)" : b.sev === "amber" ? "var(--amber)" : "var(--green)";
              return (
                <div key={b.marker} style={{ padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div className="flex items-baseline justify-between">
                    <span className="mono" style={{ fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.04em" }}>{b.marker}</span>
                    <span className="dot" style={{ background: color, width: 6, height: 6 }} />
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="serif-tab" style={{ fontSize: 18, color: "var(--ink)" }}>{b.value}</span>
                    <span className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)" }}>{b.unit}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)", marginTop: 2 }}>
                    ref {b.range}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rule-soft" style={{ margin: "20px 0" }} />

          <Eyebrow className="mb-2">Recommended next panel</Eyebrow>
          <p className="prose" style={{ fontSize: 14 }}>
            Order this week: <strong>TSH, FT3, FT4, total + free testosterone, SHBG, LH, FSH, fasting insulin, ApoB, hsCRP.</strong> Reasoning: TSH last checked <span className="mono tnum">{d.daysSinceThyroid}</span> days ago{d.daysSinceThyroid >= 60 ? " — overdue for retest given persistent elevation" : ""}; full panel <span className="mono tnum">{d.daysSinceBlood}</span> days ago{d.daysSinceBlood >= 90 ? " — re-baseline against intervention" : ""}.
          </p>
        </div>
      </div>

      {/* Colophon */}
      <div className="rule" style={{ marginTop: 56, marginBottom: 18 }} />
      <div className="grid grid-cols-12 gap-4 items-baseline">
        <div className="col-span-12 md:col-span-6">
          <span className="serif" style={{ fontSize: 14, color: "var(--ink-3)" }}>The Briefing · Weekly Health Intelligence · {data.patient.dateRange}</span>
        </div>
        <div className="col-span-12 md:col-span-6 mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textAlign: "right" }}>
          PREPARED FOR {data.patient.name.toUpperCase()} · ISSUE 17 · NEXT BRIEFING SUNDAY MAY 03
        </div>
      </div>
    </section>
  );
};

window.HRSection4 = { Supplements, Actions, Bloodwork };
