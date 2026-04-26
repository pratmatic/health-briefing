/* global React, HRPrimitives */
const { useState: uS3 } = React;
const { SectionMarker, Eyebrow, Sev } = window.HRPrimitives;

/* ============================================================
   04 · BODY SIGNALS — written analysis
   ============================================================ */

const SIGNALS = [
  {
    id: "auto", sev: "red", system: "Autonomic / Recovery",
    title: "Sympathetic dominance has become the baseline.",
    paras: [
      "Your HRV has fallen for four consecutive weeks while RHR climbed in lockstep — a textbook autonomic mirror. The 7-day HRV mean of 38.2&nbsp;ms now sits 17.3% below your 30-day baseline and roughly 25% below the trailing six-month mean. This is not a noisy sample; the coefficient of variation (15.3%) is elevated, meaning night-to-night variability has widened, which is the autonomic system's signature when it cannot consolidate parasympathetic recovery.",
      "Your RHR rose to 65.7&nbsp;bpm — 3.6&nbsp;bpm over baseline — and skin temperature has trended a quarter-degree warmer across the same window. Together these read as a low-grade sympathetic load: residual training stress, late-window eating, and compounded sleep loss preventing the overnight vagal rebound that normally drops HR into the high-50s by 3&nbsp;AM. Sunday's recovery to 71% confirms the system can still rebound — but only when given an actual rest stimulus.",
      "<strong>Therefore:</strong> next week, target two padel sessions max, and treat HRV under 40&nbsp;ms on a given morning as a hard veto on training that day."
    ],
  },
  {
    id: "sleep", sev: "red", system: "Sleep Architecture",
    title: "You are not sleeping enough to recover, let alone adapt.",
    paras: [
      "Average sleep this week was 6.16&nbsp;h against an average sleep need of 9.91&nbsp;h. Cumulative debt now sits at <strong>15.7&nbsp;h</strong> — the equivalent of two missed nights compressed into seven. Two of those nights (Friday, Saturday) fell below 5.5&nbsp;h with onset after 1&nbsp;AM and elevated disturbances (17 and 19 respectively).",
      "Deep sleep averaged 1.22&nbsp;h against a target of 1.50&nbsp;h, and was below target on five of seven nights. Deep sleep is when growth hormone is released and tissue repair occurs — at your testosterone level (205&nbsp;ng/dL), this loss compounds an already-suppressed anabolic environment. Circadian consistency of 75% is acceptable; the issue is duration, not timing.",
      "<strong>Therefore:</strong> hard cap screens at 22:30 and meals before 21:00 four nights this coming week. Re-test deep sleep average against the 1.5&nbsp;h target."
    ],
  },
  {
    id: "load", sev: "amber", system: "Training Load",
    title: "Strain is exceeding your capacity to absorb it.",
    paras: [
      "Total weekly strain (77.3) sits well above your trailing 8-week median of 58. Four padel sessions delivered three strain readings ≥&nbsp;14 — high for a recreational racquet sport — but the actual problem is the strain-to-recovery ratio of <strong>1.58</strong>, against a target of ≤&nbsp;1.0. You are accumulating training stress faster than recovery can clear it.",
      "Rest-day recovery bounce of +18 points (Sunday) confirms your aerobic engine is still responsive. The constraint is endocrine, not cardiovascular: with TSH 6.65 and testosterone 205, your tissue repair and glycogen restoration windows are narrower than a healthy 42-year-old's would be."
    ],
  },
  {
    id: "metab", sev: "amber", system: "Metabolic / Nutrition",
    title: "Late, alcohol-flagged dinners are colonising your sleep window.",
    paras: [
      "Three of seven dinners landed after 21:30. The two latest (Fri 22:00 with two beers, Sat 22:30 with three drinks) preceded the week's two worst recovery scores — 38 and 34 respectively, with HRV bottoming at 28.9&nbsp;ms on Saturday morning. This is not coincidence: alcohol metabolism suppresses REM in the first half of the night and elevates HR for 4–6 hours post-ingestion, which is exactly what your data shows.",
      "Three skipped meals in a week, against a backdrop of borderline insulin resistance (fasting insulin 13.0, HbA1c 5.6), is the wrong trade-off. You are creating glucose volatility that downstream affects sleep quality.",
      "<strong>Therefore:</strong> two alcohol-free weeks and a 20:30 last-meal cutoff. Re-evaluate fasting insulin in 6 weeks."
    ],
  },
];

const Signals = ({ data }) => {
  return (
    <section id="signals" className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <SectionMarker n={6} label="Body Signals" />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <h2 className="display-2" style={{ maxWidth: "14ch" }}>
            Four systems, <em style={{ color: "var(--gold)", fontStyle: "italic" }}>one</em> story.
          </h2>
          <p className="prose mt-5" style={{ maxWidth: "32ch" }}>
            <span className="lede">
              Every chart this week points the same direction: a body operating without the recovery margin its endocrine baseline requires.
            </span>
          </p>

          <ul className="mt-8" style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--line)" }}>
            {SIGNALS.map((s, i) => (
              <li key={s.id} style={{ borderBottom: "1px solid var(--line-soft)", padding: "14px 0", display: "flex", alignItems: "baseline", gap: 12 }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", width: 22 }}>04.{i+1}</span>
                <span className={`dot dot-${s.sev}`} />
                <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.system}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {SIGNALS.map((s, i) => (
            <article key={s.id} style={{ paddingTop: i === 0 ? 0 : 28, paddingBottom: 28, borderTop: i === 0 ? "1px solid var(--line)" : "1px solid var(--line-soft)" }}>
              <header className="flex items-baseline gap-3 mb-3">
                <span className={`dot dot-${s.sev}`} style={{ marginTop: 8 }} />
                <Eyebrow>{s.system}</Eyebrow>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginLeft: "auto" }}>04.{i+1}</span>
              </header>
              <h3 className="display-3 mb-4" style={{ maxWidth: "32ch" }}>{s.title}</h3>
              <div className="prose">
                {s.paras.map((p, j) => (
                  <p key={j} className={j === 0 ? "" : ""} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   05 · CROSS-SYSTEM CONNECTIONS
   ============================================================ */

const CONNECTIONS = [
  {
    id: "c1", priority: 1, sev: "red",
    title: "Declining HRV × elevated TSH × low testosterone",
    summary: "Your endocrine baseline is the rate limiter on every recovery metric.",
    whoop: "HRV ↓ 17% / RHR ↑ 3.6 bpm / Recovery 49% (7d)",
    blood: "TSH 6.65 µIU/mL · FT3 2.92 · Testosterone 205 ng/dL",
    nutrition: "—",
    interpretation: "Sub-clinical Hashimoto under-replacement (TSH > 4.0 with low-normal FT3) reduces cellular thermogenesis and slows post-exercise mitochondrial recovery. Compounded by hypogonadal testosterone, the result is a smaller anabolic window each night. Whoop's recovery model assumes a healthy endocrine baseline you do not have — your 49% recovery score corresponds to roughly 65% in a euthyroid, eugonadal 42-year-old. The metric isn't lying; the prior is wrong.",
    action: "Endocrinologist visit within 7 days. Re-test TSH, FT3, FT4, total + free testosterone, SHBG, LH, FSH. Discuss Thyronorm titration to target TSH 1.0–2.0 and a TRT consult given symptomatic low-T."
  },
  {
    id: "c2", priority: 2, sev: "red",
    title: "Sleep debt × deep sleep deficit × ApoB 132",
    summary: "Cardio-metabolic risk is being amplified by chronic short sleep.",
    whoop: "Sleep avg 6.16h / debt 15.7h cumulative / deep avg 1.22h",
    blood: "LDL 156.6 · ApoB 132 · HDL 41 · Fasting insulin 13.0 · ESR 22",
    nutrition: "Pizza Fri / restaurant Sat / 6 alcohol units / 3 late dinners",
    interpretation: "Short sleep (<7h) elevates LDL, ApoB and CRP and worsens insulin sensitivity in a dose-dependent fashion — well established in the literature. You arrive at this week with ApoB already 47% above optimal and with chronic short sleep that is plausibly adding 5–10% on top. Saturday's late, heavy, alcohol-laden dinner sits on top of a fatty-liver baseline, which is the single most modifiable lever you have this quarter.",
    action: "20:30 last-meal cutoff and zero alcohol for 14 days, paired with a 22:30 device cutoff. Re-test lipid panel + fasting insulin in 6 weeks."
  },
  {
    id: "c3", priority: 3, sev: "amber",
    title: "Strain : recovery 1.58 × low testosterone × MTHFR",
    summary: "You are training as if your repair pathways are healthy. They are not.",
    whoop: "Total strain 77.3 / 4 padel sessions / strain:recovery 1.58",
    blood: "Testosterone 205 · Homocysteine 8.48 · ESR 22",
    nutrition: "Skipped lunch Wed & Sat — large strain days nearby.",
    interpretation: "MTHFR A1298C homozygosity reduces methylation efficiency, which slows clearance of training-induced inflammation. Methylfolate compliance held at 7/7, which is keeping homocysteine well-managed (8.48), but ESR 22 confirms residual inflammatory load. With testosterone at the floor of physiology, muscle protein synthesis is operating at perhaps 60–70% of an age-matched eugonadal male's. Adding a fourth padel session on Friday — your worst HRV morning of the week — is asking the system to repair on credit it doesn't have.",
    action: "Hard cap two padel sessions next week, separated by at least 48h. Add one zone-2 walk. Do not lift heavy until testosterone work-up is in hand."
  },
  {
    id: "c4", priority: 4, sev: "amber",
    title: "Magnesium misses × worst sleep efficiency",
    summary: "Two missed magnesium doses sit cleanly on top of two worst-sleep nights.",
    whoop: "Fri eff 89.3% / Sat eff 87.8% — both sub-90, week's lowest.",
    blood: "—",
    nutrition: "Late dinner + alcohol both nights.",
    interpretation: "Your two missed magnesium doses were Friday and Saturday — coincident with the week's two lowest sleep efficiencies and highest disturbance counts. Causation is uncertain; correlation is suggestive enough to enforce. Magnesium glycinate raises sleep efficiency in deficient individuals by 4–6 percentage points, and at your dose schedule it is functionally a recovery aid.",
    action: "Move magnesium to a fixed bedside ritual at 21:30 — do not depend on remembering. Re-evaluate after 14 days of full compliance."
  },
];

const Connections = ({ data }) => {
  const [open, setOpen] = uS3({ c1: true });

  return (
    <section id="connections" className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <SectionMarker n={7} label="Cross-System Connections" />

      <div className="grid grid-cols-12 gap-8 mb-6">
        <div className="col-span-12 lg:col-span-8">
          <h2 className="display-2" style={{ maxWidth: "20ch" }}>
            Where biometrics, biochemistry, and behaviour <em style={{ color: "var(--gold)", fontStyle: "italic" }}>collide</em>.
          </h2>
        </div>
        <div className="col-span-12 lg:col-span-4 annot" style={{ borderLeft: "1px solid var(--line)", paddingLeft: 18 }}>
          The four highest-leverage links between this week's data and the underlying physiology. Click any card to expand the full interpretation.
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)" }}>
        {CONNECTIONS.map((c, i) => (
          <ConnectionCard
            key={c.id}
            c={c}
            isOpen={!!open[c.id]}
            onToggle={() => setOpen((s) => ({ ...s, [c.id]: !s[c.id] }))}
          />
        ))}
      </div>
    </section>
  );
};

const ConnectionCard = ({ c, isOpen, onToggle }) => {
  const sevColor = c.sev === "red" ? "var(--red)" : c.sev === "amber" ? "var(--amber)" : "var(--green)";
  return (
    <div style={{ borderBottom: "1px solid var(--line)" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer",
          padding: "20px 0", color: "inherit",
        }}
      >
        <div className="grid grid-cols-12 gap-4 items-baseline">
          <div className="col-span-1 mono" style={{ fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.08em" }}>
            <span style={{ color: sevColor }}>●</span> 0{c.priority}
          </div>
          <div className="col-span-11 md:col-span-9">
            <Eyebrow>Connection · priority {c.priority}</Eyebrow>
            <h3 className="kicker" style={{ marginTop: 4, color: "var(--ink)" }}>{c.title}</h3>
            <p className="mt-1" style={{ color: "var(--ink-2)", fontSize: 14 }}>{c.summary}</p>
          </div>
          <div className="col-span-12 md:col-span-2 flex md:justify-end">
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em" }}>
              {isOpen ? "— COLLAPSE" : "+ EXPAND"}
            </span>
          </div>
        </div>
      </button>

      <div className="expand" style={{
        maxHeight: isOpen ? 1400 : 0,
        opacity: isOpen ? 1 : 0,
        paddingBottom: isOpen ? 28 : 0,
      }}>
        <div className="grid grid-cols-12 gap-8" style={{ paddingTop: 8 }}>
          {/* triad */}
          <div className="col-span-12 lg:col-span-5">
            <Triad label="Whoop signal" value={c.whoop} />
            <Triad label="Blood / lab" value={c.blood} />
            <Triad label="Nutrition link" value={c.nutrition} last />
          </div>
          {/* prose */}
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="mb-2">Interpretation</Eyebrow>
            <p className="prose" style={{ color: "var(--ink)" }}>
              <span style={{ color: "var(--ink-2)" }}>{c.interpretation}</span>
            </p>
            <div className="rule-soft" style={{ margin: "20px 0 16px" }} />
            <Eyebrow className="mb-2" style={{ color: sevColor }}>Recommended action</Eyebrow>
            <p className="serif" style={{ fontSize: 17, lineHeight: 1.45, color: "var(--ink)", maxWidth: "60ch" }}>
              {c.action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Triad = ({ label, value, last }) => (
  <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: last ? "none" : "1px dashed var(--line-soft)" }}>
    <Eyebrow>{label}</Eyebrow>
    <div className="mono" style={{ fontSize: 12.5, color: value === "—" ? "var(--ink-4)" : "var(--ink-2)", marginTop: 4, lineHeight: 1.55 }}>{value}</div>
  </div>
);

window.HRSection3 = { Signals, Connections };
