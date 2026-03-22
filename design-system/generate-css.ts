import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { tokens } from "./tokens";
import { tokenKeyToCssVar, sidebarKeyToCssVar } from "./utils";

const GLOBALS_PATH = resolve(__dirname, "../app/globals.css");
const START_MARKER = "/* TOKENS:START */";
const END_MARKER = "/* TOKENS:END */";

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function generateRootBlock(): string {
  const lines: string[] = ["  :root {"];

  for (const [key, value] of Object.entries(tokens.colors)) {
    const cssVar = tokenKeyToCssVar(key);
    const hsl = hexToHsl(value);
    lines.push(`    ${cssVar}: ${hsl};`);
  }

  lines.push(`    --radius: ${tokens.radius};`);
  lines.push("  }");

  lines.push("  :root {");
  for (const [key, value] of Object.entries(tokens.sidebar)) {
    const cssVar = sidebarKeyToCssVar(key);
    const hsl = hexToHsl(value);
    lines.push(`    ${cssVar}: ${hsl};`);
  }
  lines.push("  }");

  return lines.join("\n");
}

function run() {
  const content = readFileSync(GLOBALS_PATH, "utf-8");
  const startIdx = content.indexOf(START_MARKER);
  const endIdx = content.indexOf(END_MARKER);

  const newBlock = `${START_MARKER}\n${generateRootBlock()}\n  ${END_MARKER}`;

  let newContent: string;
  if (startIdx !== -1 && endIdx !== -1) {
    newContent =
      content.slice(0, startIdx) +
      newBlock +
      content.slice(endIdx + END_MARKER.length);
  } else {
    newContent = content + "\n@layer base {\n" + newBlock + "\n}\n";
  }

  if (process.argv.includes("--check")) {
    if (content !== newContent) {
      console.error("globals.css is out of sync with tokens.ts. Run `npm run tokens`.");
      process.exit(1);
    }
    console.log("✓ globals.css is in sync with tokens.ts");
    return;
  }

  writeFileSync(GLOBALS_PATH, newContent);
  console.log("✓ globals.css updated from tokens.ts");
}

run();
