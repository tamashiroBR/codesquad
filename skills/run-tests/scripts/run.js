#!/usr/bin/env node
// Verification runner. Detects the project's stack from its manifest and runs the
// real test / lint / typecheck commands, printing a structured pass/fail summary.
//
// Supported: Node (incl. React & React Native), Python, Java (Maven & Gradle), Go.
// A tool that isn't installed is reported as SKIP (a gap), not FAIL — so a missing
// linter never masquerades as a broken build. Pass an explicit command to override:
//   node run.js "mvn -q test"
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const arg = process.argv[2];

function readJSON(p) {
  try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; }
}
function has(...files) { return files.some((f) => existsSync(f)); }

// → { name, gates: { lint, typecheck, test } } with command strings (or null = gap).
function detectStack() {
  // Node / React / React Native — package.json is the signal (RN & web React are Node-based)
  if (existsSync("package.json")) {
    const pkg = readJSON("package.json") || {};
    const s = pkg.scripts || {};
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const name = deps["react-native"] ? "react-native" : deps["react"] ? "react" : "node";
    const eslintCfg = has(".eslintrc", ".eslintrc.js", ".eslintrc.cjs", ".eslintrc.json",
                          ".eslintrc.yaml", ".eslintrc.yml", "eslint.config.js", "eslint.config.mjs");
    return {
      name,
      gates: {
        lint: s.lint ? "npm run lint" : eslintCfg ? "npx --no-install eslint ." : null,
        typecheck: s.typecheck ? "npm run typecheck" : existsSync("tsconfig.json") ? "npx --no-install tsc --noEmit" : null,
        test: s.test ? "npm test" : null,
      },
    };
  }
  // Python
  if (has("pyproject.toml", "setup.py", "setup.cfg", "requirements.txt", "pytest.ini", "tox.ini")) {
    return { name: "python", gates: { lint: "ruff check .", typecheck: "mypy .", test: "pytest -q" } };
  }
  // Java — Maven
  if (existsSync("pom.xml")) {
    return { name: "java-maven", gates: { lint: null, typecheck: "mvn -q -B compile", test: "mvn -q -B test" } };
  }
  // Java / Kotlin — Gradle (prefer the wrapper)
  if (has("build.gradle", "build.gradle.kts", "settings.gradle", "settings.gradle.kts")) {
    const g = existsSync("gradlew") ? "./gradlew" : existsSync("gradlew.bat") ? "gradlew.bat" : "gradle";
    return { name: "gradle", gates: { lint: `${g} -q check -x test`, typecheck: `${g} -q compileJava`, test: `${g} -q test` } };
  }
  // Go
  if (existsSync("go.mod")) {
    return { name: "go", gates: { lint: "go vet ./...", typecheck: null, test: "go test ./..." } };
  }
  return null;
}

function run(label, cmd) {
  process.stdout.write(`\n▶ ${label}: ${cmd}\n`);
  try {
    execSync(cmd, { stdio: "inherit" });
    return { label, cmd, ok: true };
  } catch (e) {
    const msg = e && (e.stderr ? String(e.stderr) : String(e.message || ""));
    const missing = (e && e.status === 127) || /not found|not recognized|command not found|ENOENT/i.test(msg);
    return { label, cmd, ok: missing ? null : false, missing: !!missing };
  }
}

const results = [];
if (arg && arg.includes(" ")) {
  results.push(run("custom", arg));
} else {
  const stack = detectStack();
  if (!stack) {
    process.stdout.write(
      '\n— no recognized manifest (package.json, pyproject.toml, pom.xml, build.gradle, go.mod).\n' +
      '  Pass an explicit command, e.g.: node run.js "mvn -q test"\n',
    );
    process.exit(1);
  }
  process.stdout.write(`\n• stack: ${stack.name}\n`);
  const order = arg ? [arg] : ["lint", "typecheck", "test"];
  for (const g of order) {
    const cmd = stack.gates[g];
    if (cmd) results.push(run(g, cmd));
    else process.stdout.write(`\n— ${g}: not configured for ${stack.name} (gap)\n`);
  }
}

const failed = results.filter((r) => r.ok === false);
const missing = results.filter((r) => r.missing);
process.stdout.write("\n=== Summary ===\n");
for (const r of results) {
  const tag = r.ok === true ? "PASS" : r.ok === false ? "FAIL" : "SKIP (tool missing)";
  process.stdout.write(`${tag}  ${r.label}\n`);
}
if (missing.length) {
  process.stdout.write(`\n${missing.length} gate(s) skipped — tool not installed.\n`);
}
process.exit(failed.length ? 1 : 0);
