// Tests truncate tables, so they only ever run against a database whose name
// ends in _test. Override with TEST_DATABASE_URL.
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
    ?? "postgresql://animalia:animalia@localhost:5432/animalia_test";

if (!new URL(TEST_DATABASE_URL).pathname.endsWith("_test")) {
    throw new Error(`Refusing to run tests against ${TEST_DATABASE_URL}: database name must end in _test`);
}
