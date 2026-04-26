/* global React, ReactDOM, WEEK_DATA, HRSection1, HRSection2, HRSection3, HRSection4 */
const { useState, useEffect, useRef } = React;

const App = () => {
  const [section, setSection] = useState("verdict");
  const data = window.WEEK_DATA;

  // Scroll spy
  useEffect(() => {
    const ids = ["verdict", "pulse", "week", "nutrition", "supplements", "signals", "connections", "bloodwork", "actions"];
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      // Map sub-sections to the nav buckets
      const navBucket = (
        current === "nutrition" || current === "supplements" ? "week" :
        current === "bloodwork" ? "connections" :
        current
      );
      setSection(navBucket);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <HRSection1.Header data={data} currentSection={section} onJump={jump} />

      <main>
        <div className="reveal" style={{ animationDelay: "0ms" }}>
          <HRSection1.Verdict data={data} />
        </div>
        <div className="reveal" style={{ animationDelay: "120ms" }}>
          <HRSection1.Pulse data={data} />
        </div>
        <div className="reveal" style={{ animationDelay: "180ms" }}>
          <HRSection2.Timeline data={data} />
        </div>
        <div className="reveal" style={{ animationDelay: "200ms" }}>
          <HRSection2b.Nutrition data={data} />
        </div>
        <div className="reveal" style={{ animationDelay: "220ms" }}>
          <HRSection4.Supplements data={data} />
        </div>
        <div className="reveal" style={{ animationDelay: "260ms" }}>
          <HRSection3.Signals data={data} />
        </div>
        <div className="reveal" style={{ animationDelay: "300ms" }}>
          <HRSection3.Connections data={data} />
        </div>
        <div className="reveal" style={{ animationDelay: "340ms" }}>
          <HRSection4.Bloodwork data={data} />
        </div>
        <div className="reveal" style={{ animationDelay: "380ms" }}>
          <HRSection4.Actions data={data} />
        </div>
      </main>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
