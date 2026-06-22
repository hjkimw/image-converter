import { describe, expect, it } from "vitest";
import { reorderById } from "./reorder";

describe("reorderById", () => {
  it("moves the source item before the target item", () => {
    expect(reorderById(["a", "b", "c"], "c", "a")).toEqual(["c", "a", "b"]);
    expect(reorderById(["a", "b", "c"], "a", "c")).toEqual(["b", "a", "c"]);
  });

  it("keeps the original order for invalid or redundant moves", () => {
    expect(reorderById(["a", "b", "c"], "a", "a")).toEqual(["a", "b", "c"]);
    expect(reorderById(["a", "b", "c"], "x", "a")).toEqual(["a", "b", "c"]);
    expect(reorderById(["a", "b", "c"], "a", "x")).toEqual(["a", "b", "c"]);
  });
});
