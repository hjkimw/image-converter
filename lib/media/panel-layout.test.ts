import { describe, expect, it } from "vitest";
import {
  clampLeftPanelWidth,
  clampSourceQueueHeight,
  DEFAULT_LEFT_PANEL_WIDTH,
  DEFAULT_SOURCE_QUEUE_HEIGHT,
  MAX_LEFT_PANEL_WIDTH,
  MAX_SOURCE_QUEUE_HEIGHT,
  MIN_LEFT_PANEL_WIDTH,
  MIN_SOURCE_QUEUE_HEIGHT,
} from "./panel-layout";

describe("left panel layout sizing", () => {
  it("clamps the source queue width to the supported desktop range", () => {
    expect(MIN_LEFT_PANEL_WIDTH).toBe(380);
    expect(DEFAULT_LEFT_PANEL_WIDTH).toBe(440);
    expect(MAX_LEFT_PANEL_WIDTH).toBe(640);
    expect(clampLeftPanelWidth(120)).toBe(MIN_LEFT_PANEL_WIDTH);
    expect(clampLeftPanelWidth(440)).toBe(440);
    expect(clampLeftPanelWidth(900)).toBe(MAX_LEFT_PANEL_WIDTH);
  });

  it("falls back to the default width for invalid input", () => {
    expect(clampLeftPanelWidth(Number.NaN)).toBe(DEFAULT_LEFT_PANEL_WIDTH);
    expect(clampLeftPanelWidth(undefined)).toBe(DEFAULT_LEFT_PANEL_WIDTH);
  });
});

describe("source queue height sizing", () => {
  it("clamps the source queue height to the supported range", () => {
    expect(MIN_SOURCE_QUEUE_HEIGHT).toBe(160);
    expect(DEFAULT_SOURCE_QUEUE_HEIGHT).toBe(320);
    expect(MAX_SOURCE_QUEUE_HEIGHT).toBe(600);
    expect(clampSourceQueueHeight(50)).toBe(MIN_SOURCE_QUEUE_HEIGHT);
    expect(clampSourceQueueHeight(400)).toBe(400);
    expect(clampSourceQueueHeight(999)).toBe(MAX_SOURCE_QUEUE_HEIGHT);
  });

  it("falls back to the default height for invalid input", () => {
    expect(clampSourceQueueHeight(Number.NaN)).toBe(DEFAULT_SOURCE_QUEUE_HEIGHT);
    expect(clampSourceQueueHeight(undefined)).toBe(DEFAULT_SOURCE_QUEUE_HEIGHT);
  });
});
