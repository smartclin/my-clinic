const fs = require("node:fs");

const input = "lanyard-glb-data.ts";
const output = "lanyard.glb";

const text = fs.readFileSync(input, "utf8");

const prefix = "base64,";
const start = text.indexOf(prefix);

if (start === -1) {
	throw new Error("Could not find base64 data URI in file");
}

const b64Start = start + prefix.length;
const b64End = text.indexOf("'", b64Start); // If the file uses single quotes

if (b64End === -1) {
	throw new Error("Could not find end of base64 string");
}

const base64 = text.slice(b64Start, b64End);
const buffer = Buffer.from(base64, "base64");

fs.writeFileSync(output, buffer);

console.log(`Wrote ${output}: ${buffer.length} bytes`);
