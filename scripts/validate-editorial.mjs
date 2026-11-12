import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith(".html"));
const errors = [];

for (const file of htmlFiles) {
  const html = read(file);
  if (html.includes("assets/css/theme.css?v=20260914-3") &&
      !html.includes('href="assets/css/editorial.css?v=20261112-2"')) {
    errors.push(file + ": editorial stylesheet link missing");
  }
}
const css = read("assets/css/editorial.css");
for (const token of ["--ea-paper", "--ea-surface", "--ea-ink", "--ea-accent", "--ea-line", "--ea-focus"]) {
  if (!css.includes(token)) errors.push("Missing design token: " + token);
}
for (const marker of ['data-theme="dark"', 'prefers-reduced-motion', '.brainmap-key', '.quiz-option.correct', '.research-card']) {
  if (!css.includes(marker)) errors.push("Missing editorial selector: " + marker);
}
if (!read("assets/js/site.js").includes("aria-current', 'location'")) errors.push("TOC location indicator missing");
for (const target of ["frontal.html", "parietal.html", "temporal.html", "occipital.html", "cerebellum.html"]) {
  if (!read("brainmap.html").includes('href="' + target + '"')) errors.push("Missing atlas quick link: " + target);
}
for (const key of ["neuroArchive.learningProgress.v1", "neuroArchive.quizProgress.v1", "neuroArchive.quizSession.v1"]) {
  if (!read("assets/js/progress.js").includes(key)) errors.push("Lost progress storage key: " + key);
}
if (!read("assets/js/record-editor.js").includes("neuroArchive.records.v1")) errors.push("Lost records key");
if (!read("assets/js/site.js").includes("neuro-archive-theme")) errors.push("Lost theme key");
if (!fs.existsSync(path.join(root, "DESIGN.md"))) errors.push("DESIGN.md is missing");
for (const name of ["SUIT-Variable.woff2", "SUITE-Variable.woff2"]) {
  const filename = path.join(root, "assets/fonts", name);
  if (!fs.existsSync(filename)) { errors.push("Missing local font: " + name); continue; }
  const bytes = fs.readFileSync(filename);
  if (bytes.subarray(0, 4).toString("ascii") !== "wOF2" || bytes.length < 100000) errors.push("Invalid WOFF2: " + name);
  if (!css.includes('../fonts/' + name)) errors.push("Missing @font-face reference: " + name);
}
if (read("assets/css/theme.css").includes("fonts.googleapis.com")) errors.push("Remote Google Fonts stylesheet still referenced");
for (const name of ["SUIT-LICENSE.txt", "SUITE-LICENSE.txt"]) {
  if (!fs.existsSync(path.join(root, "assets/fonts", name))) errors.push("Missing font license: " + name);
}
if (!css.includes('font-family: "SUIT Local"') || !css.includes('font-family: "SUITE Local"')) errors.push("Local font declarations missing");


if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("PASS: editorial links, design tokens, and protected functionality checks");
