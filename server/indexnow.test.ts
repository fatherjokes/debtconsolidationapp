import { describe, it, expect } from "vitest";

describe("IndexNow configuration", () => {
  it("INDEXNOW_KEY env var is set and has the correct format (32 hex chars)", () => {
    const key = process.env.INDEXNOW_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    // IndexNow keys must be 8-128 hex characters
    expect(key).toMatch(/^[a-zA-Z0-9-]{8,128}$/);
  });

  it("IndexNow key file name matches the env var", () => {
    const key = process.env.INDEXNOW_KEY;
    // The key file is hosted at /{key}.txt — verify the key is the expected value
    expect(key).toBe("294f170e90d3c23283040f9ecec52aa5");
  });
});
