// Validates the Subagent roles ecosystem: subagents/, roles/, architecture/, core/, standards/, testing/
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const subagentsDir = join(root, "subagents");
const rolesDir = join(root, "roles");
const skillsDir = join(root, "skills");
const archDir = join(root, "architecture");
const coreDir = join(root, "core");
const standardsDir = join(root, "standards");
const testingDir = join(root, "testing");

let failed = false;

console.log("=== FigCraft Multi-Agent Ecosystem Validator ===\n");

// 1. Check Architecture files
const requiredArchFiles = ["agent-hierarchy.md", "communication-flow.md", "responsibility-matrix.md"];
for (const f of requiredArchFiles) {
  const p = join(archDir, f);
  if (!existsSync(p) || statSync(p).size === 0) {
    console.error(`FAIL: Missing or empty architecture file: architecture/${f}`);
    failed = true;
  }
}
console.log(`[OK] Architecture files: ${requiredArchFiles.length} verified.`);

// 2. Check Core files
const requiredCoreFiles = ["orchestrator.md", "shared-instructions.md"];
for (const f of requiredCoreFiles) {
  const p = join(coreDir, f);
  if (!existsSync(p) || statSync(p).size === 0) {
    console.error(`FAIL: Missing or empty core file: core/${f}`);
    failed = true;
  }
}
console.log(`[OK] Core governance files: ${requiredCoreFiles.length} verified.`);

// 3. Check Standards files
const requiredStandardsFiles = ["naming-conventions.md", "output-standards.md", "quality-control.md"];
for (const f of requiredStandardsFiles) {
  const p = join(standardsDir, f);
  if (!existsSync(p) || statSync(p).size === 0) {
    console.error(`FAIL: Missing or empty standard file: standards/${f}`);
    failed = true;
  }
}
console.log(`[OK] Standards specifications: ${requiredStandardsFiles.length} verified.`);

// 4. Check Testing files
const requiredTestingFiles = ["test-cases.md", "validation-report.md"];
for (const f of requiredTestingFiles) {
  const p = join(testingDir, f);
  if (!existsSync(p) || statSync(p).size === 0) {
    console.error(`FAIL: Missing or empty testing file: testing/${f}`);
    failed = true;
  }
}
console.log(`[OK] Testing documents: ${requiredTestingFiles.length} verified.\n`);

// 5. Check Subagents & Roles
const expectedSubagents = [
  "lead-orchestrator",
  "ui-architect",
  "design-system-engineer",
  "frontend-engineer",
  "mobile-ui-specialist",
  "vector-graphics-specialist",
  "interaction-motion-engineer",
  "data-diagram-architect",
  "automation-script-specialist",
  "asset-exporter",
  "visual-qa-auditor",
  "independent-acceptance-judge"
];

console.log("Subagent Name".padEnd(32) + "Files".padEnd(10) + "Role Card".padEnd(12) + "Status");
console.log("-".repeat(60));

for (const name of expectedSubagents) {
  const agentDir = join(subagentsDir, name);
  const roleCard = join(rolesDir, `${name}.md`);
  let hasRole = existsSync(roleCard) && statSync(roleCard).size > 0;
  let fileCount = 0;
  
  if (existsSync(agentDir) && statSync(agentDir).isDirectory()) {
    const requiredDocs = ["instructions.md", "responsibilities.md", "inputs-outputs.md"];
    for (const doc of requiredDocs) {
      const docPath = join(agentDir, doc);
      if (existsSync(docPath) && statSync(docPath).size > 0) {
        fileCount++;
      } else {
        console.error(`  FAIL: Missing or empty ${name}/${doc}`);
        failed = true;
      }
    }
  } else {
    console.error(`  FAIL: Missing agent directory: subagents/${name}`);
    failed = true;
  }

  if (!hasRole) {
    console.error(`  FAIL: Missing role card: roles/${name}.md`);
    failed = true;
  }

  const stat = (fileCount === 3 && hasRole) ? "PASS" : "FAIL";
  console.log(`${name.padEnd(32)}${String(fileCount + "/3").padEnd(10)}${(hasRole ? "OK" : "MISSING").padEnd(12)}${stat}`);
}

// 6. Check Role skill linkages
console.log("\nVerifying Role-to-Skill Linkages...");
const availableSkills = new Set(readdirSync(skillsDir));
for (const name of expectedSubagents) {
  const roleCard = join(rolesDir, `${name}.md`);
  if (!existsSync(roleCard)) continue;
  const content = readFileSync(roleCard, "utf8");
  const matches = content.match(/-\s+(figcraft-[a-z-]+)/g) || [];
  for (const m of matches) {
    const skillName = m.replace(/-\s+/, "").trim();
    if (!availableSkills.has(skillName)) {
      console.error(`FAIL: Role ${name}.md references unknown skill: ${skillName}`);
      failed = true;
    }
  }
}
console.log(`[OK] All subagent role skill linkages verified.`);

console.log("\n" + (failed ? "Validation FAILED with errors." : "All subagent ecosystem checks PASSED successfully!"));
process.exit(failed ? 1 : 0);
