import { describe, expect, it } from "vitest";
import { DEFAULT_IMAGE_OPTIONS } from "./media";

describe("default media options", () => {
  it("defaults image quality to 80 for optimized WebP output", () => {
    expect(DEFAULT_IMAGE_OPTIONS.quality).toBe(80);
  });
});
