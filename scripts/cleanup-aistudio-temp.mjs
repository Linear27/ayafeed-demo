import { access, mkdir, readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, ".tmp", "aistudio");
const ROOT_TEMP_PATTERNS = [/^aistudio-.+/i, /^\.tmp-sync-.+/i, /^\.tmp-head-.*\.bin$/i];
const RETENTION_ARG = process.argv.find((arg) => arg.startsWith("--retention-days="));
const RETENTION_DAYS = Number.parseInt(RETENTION_ARG?.split("=")[1] ?? "", 10);
const RETENTION_DAYS_SAFE =
  Number.isFinite(RETENTION_DAYS) && RETENTION_DAYS >= 0 ? RETENTION_DAYS : 7;

function isRootTempFile(name) {
  return ROOT_TEMP_PATTERNS.some((pattern) => pattern.test(name));
}

async function ensureTargetDir() {
  await mkdir(TARGET_DIR, { recursive: true });
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function withTimestampSuffix(fileName) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${base}-${stamp}${ext}`;
}

async function moveRootTempFiles() {
  const entries = await readdir(ROOT, { withFileTypes: true });
  let moved = 0;

  for (const entry of entries) {
    if (!entry.isFile() || !isRootTempFile(entry.name)) {
      continue;
    }

    const source = path.join(ROOT, entry.name);
    let destination = path.join(TARGET_DIR, entry.name);
    if (await pathExists(destination)) {
      destination = path.join(TARGET_DIR, withTimestampSuffix(entry.name));
    }

    await rename(source, destination);
    moved += 1;
  }

  return moved;
}

async function cleanupExpiredFiles() {
  const entries = await readdir(TARGET_DIR, { withFileTypes: true });
  const cutoffTime = Date.now() - RETENTION_DAYS_SAFE * 24 * 60 * 60 * 1000;
  let removed = 0;

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const filePath = path.join(TARGET_DIR, entry.name);
    const fileStat = await stat(filePath);
    if (fileStat.mtimeMs >= cutoffTime) {
      continue;
    }

    await rm(filePath, { force: true });
    removed += 1;
  }

  return removed;
}

async function main() {
  await ensureTargetDir();
  const moved = await moveRootTempFiles();
  const removed = await cleanupExpiredFiles();

  console.log(
    `[aistudio-temp] moved ${moved} file(s), removed ${removed} expired file(s), retention=${RETENTION_DAYS_SAFE} day(s), dir=.tmp/aistudio/`,
  );
}

main().catch((error) => {
  console.error("[aistudio-temp] cleanup failed:", error);
  process.exitCode = 1;
});
