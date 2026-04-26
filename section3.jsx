/* global React, HRPrimitives */
const { useState: uS3 } = React;
const { SectionMarker, Eyebrow, Sev } = window.HRPrimitives;

/* ============================================================
   04 · BODY SIGNALS — written analysis
   ============================================================ */

const Signals = ({ data }) => {
  const signals = data.bodySignals;

  if (signals == null) {
    return (
      <section id="signals" className="page" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <SectionMarker n={6} label="Body Signals" />
        <p className="annot" style={{ color: "var(--ink-3)" }}>Body signals analysis unavailable.</p>
      </section>
    );
  }
  if (signals.length === 0) return null;

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
            {signals.map((s, i) => (
              <li key={i} style={{ borderBottom: "1px solid var(--line-soft)", padding: "14px 0", display: "flex", alignItems: "baseline", gap: 12 }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", width: 22 }}>04.{i+1}</span>
                <span className={`dot dot-${s.severity}`} />
                <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.system}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {signals.map((s, i) => (
            <article key={i} style={{ paddingTop: i === 0 ? 0 : 28, paddingBottom: 28, borderTop: i === 0 ? "1px solid var(--line)" : "1px solid var(--line-soft)" }}>
              <header className="flex items-baseline gap-3 mb-3">
                <span className={`dot dot-${s.severity}`} style={{ marginTop: 8 }} />
                <Eyebrow>{s.system}</Eyebrow>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginLeft: "auto" }}>04.{i+1}</span>
              </header>
              <div className="prose">
                {(s.paragraphs || []).map((p, j) => (
                  <p key={j} dangerouslySetInnerHTML={{ __html: p }} />
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

const URGENCY_TO_SEV = { high: "red", medium: "amber", low: "green" };

const Connections = ({ data }) => {
  const [open, setOpen] = uS3({ 0: true });
  const connections = data.connections;

  if (connections == null || connections.length === 0) return null;

  const limited = connections.slice(0, 4);

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
          The highest-leverage links between this week's data and the underlying physiology. Click any card to expand the full interpretation.
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)" }}>
        {limited.map((c, i) => {
          const sev = URGENCY_TO_SEV[c.urgency] || "amber";
          const priority = i + 1;
          const firstSentence = (c.interpretation || "").match(/^[^.!?]+[.!?]/);
          const title = firstSentence ? firstSentence[0].trim() : (c.signal || c.interpretation || "");
          return (
            <ConnectionCard
              key={i}
              c={c}
              sev={sev}
              priority={priority}
              title={title}
              isOpen={!!open[i]}
              onToggle={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
            />
          );
        })}
      </div>
    </section>
  );
};

const ConnectionCard = ({ c, sev, priority, title, isOpen, onToggle }) => {
  const sevColor = sev === "red" ? "var(--red)" : sev === "amber" ? "var(--amber)" : "var(--green)";
  const hasNutrition = c.nutrition != null && c.nutrition !== "" && c.nutrition !== "—";
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
            <span style={{ color: sevColor }}>●</span> 0{priority}
          </div>
          <div className="col-span-11 md:col-span-9">
            <Eyebrow>Connection · priority {priority}</Eyebrow>
            <h3 className="kicker" style={{ marginTop: 4, color: "var(--ink)" }}>{title}</h3>
            {c.signal && <p className="mt-1" style={{ color: "var(--ink-2)", fontSize: 14 }}>{c.signal}</p>}
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
            <Triad label="Whoop signal" value={c.signal || "—"} />
            <Triad label="Blood / lab" value={c.marker || "—"} last={!hasNutrition} />
            {hasNutrition && <Triad label="Nutrition link" value={c.nutrition} last />}
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
