// Entry program for the "Fix Human Sleep: Funniest Patch Note" bounty.
//
// The contest asks for a single line that reads like a real changelog
// entry announcing that human sleep has been fixed. The server-side
// gate accepts /output/entry.txt only when it holds UTF-8 text of
// 1 to 160 characters that is not whitespace alone. The judge then
// weighs, in order: patch-note about fixing sleep, funny on one read,
// genuine release-note voice, single-line fit, and a specific
// surprising fix.
//
// The chosen line treats the familiar 3 a.m. spiral as a shipped
// module that can simply be removed. It stays terse, confident, and
// inside the character cap, and it trusts the reader to get the joke
// without a trailing explanation. Keeping the fix specific — one
// named module, removed outright — is what gives the line its
// surprise instead of a flat claim that sleep now works.

import { chmodSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";

const PATCH_NOTE = "Hotfix: removed the 3 a.m. existential dread module. It has been replaced with nothing, which was the point.";

const MIN_CHARS = 1;
const MAX_CHARS = 160;
const OUTPUT_MODE = 0o644;

function countCodePoints(text: string): number {
  // The gate counts characters, so measure code points rather than
  // UTF-16 code units. This line is plain ASCII, but the check stays
  // honest if the text ever changes.
  return [...text].length;
}

function validatePatchNote(candidate: string): void {
  if (candidate.length === 0) {
    throw new Error("patch note must not be empty");
  }
  const charCount = countCodePoints(candidate);
  if (charCount < MIN_CHARS || charCount > MAX_CHARS) {
    throw new Error(`patch note length ${charCount} outside ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("patch note must not be whitespace only");
  }
  if (candidate.includes("\n") || candidate.includes("\r")) {
    throw new Error("patch note must stay on a single line");
  }
  if (candidate !== candidate.trim()) {
    throw new Error("patch note must not carry leading or trailing whitespace");
  }
  // Reject control characters and invisible formatting that would
  // make the visible line differ from what the gate measures.
  if (/[\u0000-\u001f\u007f\ufeff\u200b-\u200d\u2028\u2029]/.test(candidate)) {
    throw new Error("patch note contains control or invisible characters");
  }
  // Round-trip through UTF-8 to prove the bytes are well formed.
  const roundTrip = Buffer.from(candidate, "utf8").toString("utf8");
  if (roundTrip !== candidate) {
    throw new Error("patch note is not clean UTF-8 text");
  }
}

function resolveOutputDirectory(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (typeof fromEnv === "string" && fromEnv.length > 0) {
    return fromEnv;
  }
  return "/output";
}

function publishEntry(note: string, outputDir: string): string {
  mkdirSync(outputDir, { recursive: true });
  const stagingPath = `${outputDir}/.entry.txt.staging`;
  const destinationPath = `${outputDir}/entry.txt`;
  // Write to a staging file first, fix its permissions, then rename
  // so readers never observe a partial entry.
  writeFileSync(stagingPath, note, { encoding: "utf8", mode: OUTPUT_MODE });
  chmodSync(stagingPath, OUTPUT_MODE);
  renameSync(stagingPath, destinationPath);
  chmodSync(destinationPath, OUTPUT_MODE);
  return destinationPath;
}

function verifyPublishedFile(path: string, expected: string): void {
  const onDisk = readFileSync(path, "utf8");
  if (onDisk !== expected) {
    throw new Error("published entry does not match the validated patch note");
  }
  if (Buffer.byteLength(onDisk, "utf8") !== Buffer.byteLength(expected, "utf8")) {
    throw new Error("published entry byte length mismatch");
  }
  const info = statSync(path);
  const actualMode = info.mode & 0o777;
  if (actualMode !== OUTPUT_MODE) {
    throw new Error(`published entry mode ${actualMode.toString(8)} is not 644`);
  }
}

validatePatchNote(PATCH_NOTE);
const targetDir = resolveOutputDirectory();
const writtenPath = publishEntry(PATCH_NOTE, targetDir);
verifyPublishedFile(writtenPath, PATCH_NOTE);
console.log(`wrote ${writtenPath} (${countCodePoints(PATCH_NOTE)} chars)`);
