/**
 * Reads tokens/Light.tokens.json and tokens/Dark.tokens.json and regenerates
 * src/styles/tokens.css with the appropriate @theme and :root blocks.
 */
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

/** backgroundSubtle → background-subtle */
function toKebab(name) {
  return name.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}

/** "color/neutral/50" → "var(--color-neutral-50)" */
function figmaAliasToVar(aliasName) {
  const parts = aliasName.split('/');
  // parts[0] is always "color"; remainder forms the CSS var suffix
  const suffix = parts.slice(1).join('-');
  return `var(--color-${suffix})`;
}

async function readTokens(filename) {
  const raw = await readFile(resolve(rootDir, 'tokens', filename), 'utf-8');
  return JSON.parse(raw);
}

function collectEntries(prefix, obj, entries) {
  if (obj.$value !== undefined) {
    const cssName = `--${prefix}`;
    const alias = obj.$extensions?.['com.figma.aliasData']?.targetVariableName;
    let cssValue;
    if (alias) {
      cssValue = figmaAliasToVar(alias);
    } else if (typeof obj.$value === 'string') {
      cssValue = obj.$value;
    } else {
      cssValue = obj.$value?.hex;
    }
    entries.push({ cssName, cssValue });
    return;
  }

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    collectEntries(`${prefix}-${toKebab(key)}`, val, entries);
  }
}

function buildEntries(tokens) {
  const entries = [];
  for (const [groupName, group] of Object.entries(tokens)) {
    if (groupName.startsWith('$')) continue;
    collectEntries(toKebab(groupName), group, entries);
  }
  return entries;
}

async function main() {
  const [light, dark] = await Promise.all([
    readTokens('Light.tokens.json'),
    readTokens('Dark.tokens.json'),
  ]);

  const lightEntries = buildEntries(light);
  const darkEntries = buildEntries(dark);

  const indent = '  ';
  const lightVars = lightEntries.map((e) => `${indent}${e.cssName}: ${e.cssValue};`).join('\n');
  const darkVars = darkEntries.map((e) => `${indent}  ${e.cssName}: ${e.cssValue};`).join('\n');
  const themeVars = lightEntries
    .map((e) => `${indent}${e.cssName}: var(${e.cssName});`)
    .join('\n');

  const css = `@import "tailwindcss";

:root {
${lightVars}

  @media (prefers-color-scheme: dark) {
${darkVars}
  }
}

@theme inline {
${themeVars}
}
`;

  await writeFile(resolve(rootDir, 'src/styles/tokens.css'), css, 'utf-8');
  console.log(`Generated src/styles/tokens.css (${lightEntries.length} tokens)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
