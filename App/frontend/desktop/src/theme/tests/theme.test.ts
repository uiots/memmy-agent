/** Theme tests. */
import { describe, expect, it } from "vitest";
import { resolveThemePreference } from "../theme-provider.js";

describe("desktop theme helpers", () => {
  it("resolves explicit light and dark preferences", () => {
    expect(resolveThemePreference("light", false)).toBe("light");
    expect(resolveThemePreference("light", true)).toBe("light");
    expect(resolveThemePreference("dark", false)).toBe("dark");
    expect(resolveThemePreference("dark", true)).toBe("dark");
  });

  it("follows the system media query for the system preference", () => {
    expect(resolveThemePreference("system", false)).toBe("light");
    expect(resolveThemePreference("system", true)).toBe("dark");
    expect(resolveThemePreference(undefined, true)).toBe("dark");
    expect(resolveThemePreference(undefined, false)).toBe("light");
  });
});
