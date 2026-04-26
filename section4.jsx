/* global React, HRPrimitives */
const { SectionMarker, Eyebrow, Sev } = window.HRPrimitives;

/* ============================================================
   06 · SUPPLEMENT & COMPLIANCE SCORECARD
   ============================================================ */

const Supplements = ({ data }) => {
  const dayLabels = data.days.map((d) => d.day);
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
              const taken = (day) => {
                const dayData = data.days.find((dd) => dd.day === day);
                if (!dayData) return false;
                if (dayData.supps.taken === 7) return true;
                if (dayData.supps.missed.includes("All")) return false;
                return !dayData.supps.missed.some((m) => s.name.toLowerCase().includes(m.toLowerCase()));
              };
              const rate = s.taken / s.total;
              const rateColor = rate === 1 ? "var(--green)" : rate >= 0.7 ? "var(--amber)" : "var(--red)";
              return (
                <div key={s.name} className="grid grid-cols-12 items-center" style={{ padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div className="col-span-5">
                    <div className="serif" style={{ fontSize: 16 }}>{s.name}</div>
                    {s.critical && <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>critical</div>}
                  </div>
                  <div className="col-span-7 grid grid-cols-9 gap-1 items-center">
                    {dayLabels.map((d) => {
                      const ok = taken(d);
                      return (
                        <div key={d} style={{
                          height: 18, background: ok ? "var(--ink)" : "transparent",
                          border: ok ? "none" : "1px solid var(--line)",
                          opacity: ok ? 0.92 : 1,
                        }} />
                      );
                    })}
                    <div className="mono tnum" style={{ gridColumn: "span 2", textAlign: "right", color: rateColor, fontSize: 13, fontWeight: 500 }}>
                      {s.taken}/{s.total}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mono mt-3" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.06em", textAlign: "right" }}>
            WEEK {Math.round((44 / 49) * 100)}% · 30D BASELINE {data.derived.suppsAvg30d}%
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="annot" style={{ borderLeft: "1px solid var(--line)", paddingLeft: 18 }}>
            <Eyebrow className="mb-3">Compliance flag</Eyebrow>
            <p className="prose" style={{ color: "var(--ink-2)", fontSize: 14 }}>
              <strong>Magnesium</strong> missed Friday and Saturday — both nights had the week's worst sleep efficiency (89.3% and 87.8%) and the highest disturbance counts.
            </p>
            <p className="prose" style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 8 }}>
              <strong>Saturday</strong> all supplements missed, including thyroid medication. This is the single highest-risk gap of the week — Thyronorm half-life means same-day misses can echo into next-day TSH variability.
            </p>
            <div className="rule-soft" style={{ margin: "16px 0" }} />
            <div className="grid grid-cols-3 gap-3">
              <CompTotal label="Critical" value="21/21" sev="green" />
              <CompTotal label="Adjuncts" value="23/28" sev="amber" />
              <CompTotal label="Overall" value="44/49" sev="amber" />
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
            Order this week: <strong>TSH, FT3, FT4, total + free testosterone, SHBG, LH, FSH, fasting insulin, ApoB, hsCRP.</strong> Reasoning: TSH still elevated 33 days after last test (suggests under-replacement); testosterone work-up overdue given symptomatic low-T; ApoB + fasting insulin to re-baseline against intervention.
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
