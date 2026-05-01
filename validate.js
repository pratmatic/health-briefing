#!/usr/bin/env node
/**
 * Pre-publish smoke test for the dashboard.
 *
 * Loads data.js + every JSX file the same way index.html does, transpiles
 * via @babel/preset-react, and runs ReactDOMServer.renderToStaticMarkup on
 * the App. If any field referenced by JSX is missing from data — or any
 * component throws during render — this script exits non-zero with an
 * informative message, BEFORE git push goes out.
 *
 * Catches the class of bug where JSX references e.g. `d.daysSinceThyroid`
 * but the data shape doesn't carry it (or the component scope doesn't
 * declare `const d = data.derived`). That kind of bug renders the live
 * site as a blank black page.
 *
 * Usage:
 *   cd health-briefing/
 *   npm install        # once
 *   node validate.js   # before every git push
 */

const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");
const React = require("react");
const ReactDOM = require("react-dom");
const ReactDOMServer = require("react-dom/server");
const PropTypes = require("prop-types");

// --- Browser-like globals so the JSX files run the same way Babel-standalone runs them in the page.
global.window = global;
global.React = React;
global.ReactDOM = ReactDOM;
global.PropTypes = PropTypes;

// --- Stub Recharts (UMD bundle in the page, not installed in node_modules)
const stubComponent = (name) => function Stub(props) {
  return React.createElement("div", { "data-stub": name }, props.children || null);
};
global.Recharts = new Proxy({}, { get: (_, k) => stubComponent(String(k)) });

// --- Capture the App element instead of mounting to a real DOM
const fakeRoot = { __el: null, render(el) { this.__el = el; }, unmount() {} };
ReactDOM.createRoot = function () { return fakeRoot; };
global.document = {
  getElementById: () => ({}),
  addEventListener: () => {},
};
global.addEventListener = () => {};
global.removeEventListener = () => {};

// --- Same load order as index.html
const here = __dirname;
const order = [
  "data.js",
  "primitives.jsx",
  "section1.jsx",
  "section2.jsx",
  "section2b.jsx",
  "section3.jsx",
  "section4.jsx",
  "app.jsx",
];

const fail = (file, err) => {
  console.error("VALIDATE FAIL —", file);
  console.error("  ", err.message);
  if (err.stack) {
    const lines = err.stack.split("\n").slice(1, 8);
    for (const l of lines) console.error("  ", l.trim());
  }
  process.exit(1);
};

for (const f of order) {
  const p = path.join(here, f);
  if (!fs.existsSync(p)) fail(f, new Error("file missing"));
  let code = fs.readFileSync(p, "utf8");
  if (f.endsWith(".jsx")) {
    try {
      code = babel.transformSync(code, {
        filename: f,
        presets: [["@babel/preset-react"]],
      }).code;
    } catch (e) {
      return fail(f + " (babel)", e);
    }
  }
  try {
    new Function(code).call(global);
  } catch (e) {
    return fail(f + " (load)", e);
  }
}

if (!fakeRoot.__el) {
  fail("app.jsx", new Error("App did not call ReactDOM.createRoot.render"));
}

try {
  const html = ReactDOMServer.renderToStaticMarkup(fakeRoot.__el);
  if (!html || html.length < 1000) {
    fail("renderToStaticMarkup", new Error(`output suspiciously short (${html.length} chars)`));
  }
  console.log("validate.js — OK (rendered " + html.length + " chars)");
} catch (e) {
  fail("renderToStaticMarkup", e);
}
