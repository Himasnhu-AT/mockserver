import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import * as readline from "node:readline";
import semver from "semver";

// --- Configuration ---
const PORCELAIN_CMD = "git status --porcelain";
const PACKAGE_PATHS = [
  ".", // Root
  "apps/cli",
  "apps/web",
];
const CLI_PATH = "apps/cli";
const CHANGELOG_PATH = "apps/web/app/changelog/page.tsx";

// --- Global State for Cleanup ---
let originalVersion = "";
let filesModified = false;

// --- Input Helpers ---
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// --- Helpers ---
const run = (cmd: string, cwd?: string) => {
  try {
    execSync(cmd, { stdio: "inherit", cwd });
  } catch (e) {
    console.error(`\n❌ Command failed: ${cmd}`);
    // Don't exit here immediately, let the main flow handle cleanup if needed
    throw e;
  }
};

const getCurrentVersion = () => {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  return pkg.version;
};

// --- Cleanup Function ---
const restorePackageJson = () => {
  if (!filesModified || !originalVersion) return;

  console.log("\n\n🔄 Reverting package.json changes...");
  PACKAGE_PATHS.forEach((dir) => {
    const pPath = path.resolve(dir, "package.json");
    if (fs.existsSync(pPath)) {
      const pkg = JSON.parse(fs.readFileSync(pPath, "utf-8"));
      pkg.version = originalVersion;
      fs.writeFileSync(pPath, JSON.stringify(pkg, null, 2) + "\n");
      console.log(`   Reverted ${pPath} to v${originalVersion}`);
    }
  });
  console.log("Changes reverted. Exiting.");
};

// --- Signal Handling (Ctrl+C) ---
rl.on("SIGINT", () => {
  restorePackageJson();
  process.exit(0);
});

process.on("SIGINT", () => {
  restorePackageJson();
  process.exit(0);
});

// --- Main Script ---
async function release() {
  console.log("🚀 Starting Deployment Workflow...");

  // 1. Check Git Status
  const status = execSync(PORCELAIN_CMD).toString().trim();
  if (status) {
    console.log("⚠️  Uncommitted changes detected.");
    const answer = await ask(
      "Do you want to include these changes in the release commit? (y/N) ",
    );
    if (answer.toLowerCase() !== "y") {
      rl.close();
      process.exit(0);
    }
  } else {
    console.log("✔ Git directory is clean.");
  }

  // 2. Ask for Version
  const currentVer = getCurrentVersion();
  originalVersion = currentVer; // Store for revert
  console.log(`Current Version: ${currentVer}`);

  let releaseType = "";
  while (!["patch", "minor", "major", "custom"].includes(releaseType)) {
    releaseType = await ask(
      "Select release type (patch, minor, major, custom): ",
    );
  }

  let newVersion: string | null = null;
  if (releaseType === "custom") {
    newVersion = await ask("Enter version: ");
  } else {
    newVersion = semver.inc(currentVer, releaseType as semver.ReleaseType);
  }

  if (newVersion === null) {
    console.error(
      "❌ Could not increment version. Is the current version a valid semver string?",
    );
    rl.close();
    process.exit(1);
  }

  console.log(`Target Version: ${newVersion}`);

  // 3. Update package.json files
  filesModified = true; // Enable rollback mechanism
  PACKAGE_PATHS.forEach((dir) => {
    const pPath = path.resolve(dir, "package.json");
    if (fs.existsSync(pPath)) {
      const pkg = JSON.parse(fs.readFileSync(pPath, "utf-8"));
      pkg.version = newVersion;
      fs.writeFileSync(pPath, JSON.stringify(pkg, null, 2) + "\n");
      console.log(`✔ Updated ${pPath}`);
    }
  });

  // 4. Run Checks (Lint/Format/Build)
  console.log("Running checks...");
  try {
    run("pnpm lint");
    run("pnpm format");
    run("pnpm build");
  } catch (e) {
    console.error("Checks failed. Reverting changes...");
    restorePackageJson();
    rl.close();
    process.exit(1);
  }

  // 5. Update Changelog File
  console.log("Updating Changelog...");

  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const isMajor = releaseType === "major";

  const newEntry = `
  {
    version: "v${newVersion}",
    date: "${dateStr}",
    isMajor: ${isMajor},
    hash: "v${newVersion}", // Linking to Tag instead of commit hash
    changes: [
      {
        type: "new",
        text: "Release v${newVersion}",
      },
    ],
  },`;

  let changelogContent = fs.readFileSync(CHANGELOG_PATH, "utf-8");

  if (changelogContent.includes("const CHANGELOG_DATA: Release[] = [")) {
    changelogContent = changelogContent.replace(
      "const CHANGELOG_DATA: Release[] = [",
      "const CHANGELOG_DATA: Release[] = [" + newEntry,
    );
    fs.writeFileSync(CHANGELOG_PATH, changelogContent);
    console.log(`✔ Added entry to ${CHANGELOG_PATH}`);
  } else {
    console.error("❌ Could not find CHANGELOG_DATA array in file.");
    restorePackageJson();
    rl.close();
    process.exit(1);
  }

  // --- WAIT FOR USER REVIEW ---
  console.log("\n⚠️  PAUSED FOR MANUAL REVIEW");
  console.log(
    `Please open ${CHANGELOG_PATH} and update the 'changes' array with actual release notes.`,
  );
  console.log("(Press Ctrl+C to cancel and revert package versions)");
  await ask(
    "Press ENTER when you have updated the changelog and are ready to deploy...",
  );

  // 6. Commit and Tag
  console.log("Committing and Tagging...");
  try {
    run("git add .");
    run(`git commit -m "chore(release): v${newVersion}"`);
    run(`git tag v${newVersion}`);
  } catch (e) {
    console.error("Git operations failed.");
    // Note: If git add/commit fails, files are still modified.
    // We usually don't revert here automatically.
    process.exit(1);
  }

  filesModified = false; // Disable revert, changes are committed.

  // 7. Publish CLI
  console.log("\n📦 Publishing CLI to NPM...");
  const publishAnswer = await ask(
    `Do you want to publish 'apps/cli' version ${newVersion} to NPM? (y/N) `,
  );

  if (publishAnswer.toLowerCase() === "y") {
    try {
      // --no-git-checks is often useful in CI/CD or scripts where the local tag might not be pushed yet
      run("pnpm publish --access public --no-git-checks", CLI_PATH);
      console.log("✔ CLI published successfully.");
    } catch (e) {
      console.error("❌ Failed to publish CLI.");
    }
  } else {
    console.log("Skipping npm publish.");
  }

  console.log(`\n🎉 Successfully released v${newVersion}!`);
  console.log('Run "git push && git push --tags" to push changes to remote.');

  rl.close();
}

release();
