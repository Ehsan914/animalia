import { execSync } from "node:child_process";
import { TEST_DATABASE_URL } from "./testDatabase.js";

// Bring the test database's schema up to date once per run.
export default function setup() {
    execSync("npx prisma migrate deploy", {
        env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
        stdio: "pipe",
    });
}
