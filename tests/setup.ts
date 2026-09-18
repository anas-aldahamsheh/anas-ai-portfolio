import "@testing-library/jest-dom";

// Ensure tests have predictable default environment
Object.assign(process.env, {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  BETTER_AUTH_SECRET: "test_secret_that_is_at_least_32_characters_long_for_security",
  BETTER_AUTH_URL: "http://localhost:3000",
  ENCRYPTION_MASTER_KEY: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
});
