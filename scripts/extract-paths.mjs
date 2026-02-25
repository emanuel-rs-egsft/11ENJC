import fs from "node:fs";

const svgPath = "public/assets/sobre/pra-quem-e.svg";
const outPath = "src/components/ui/Sobre/PraQuemE.paths.ts";

const svg = fs.readFileSync(svgPath, "utf8");

// viewBox
const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 100 100";

// d="..."
const paths = [...svg.matchAll(/<path\b[^>]*\sd="([^"]+)"[^>]*>/g)].map(
  (m) => m[1],
);

const content =
  `export const PRA_QUEM_E_VIEWBOX = ${JSON.stringify(viewBox)} as const;\n` +
  `export const PRA_QUEM_E_PATHS = [\n` +
  paths.map((d) => `  ${JSON.stringify(d)},\n`).join("") +
  `] as const;\n`;

fs.writeFileSync(outPath, content, "utf8");

console.log("Gerado:", outPath);
console.log("viewBox:", viewBox);
console.log("Paths:", paths.length);
