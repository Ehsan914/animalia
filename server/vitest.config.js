import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globalSetup: "./test/globalSetup.js",
        setupFiles: ["./test/setup.js"],
        // Every file shares one test database.
        fileParallelism: false,
        coverage: {
            include: ["app.js", "lib/**", "middleware/**", "routes/**"],
        },
    },
});
