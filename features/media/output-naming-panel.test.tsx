import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OutputNamingPanel } from "./output-naming-panel";
import type { UploadedMedia } from "@/types/media";

describe("OutputNamingPanel", () => {
  it("previews the filename template and applies it to checked results", () => {
    const onTemplateChange = vi.fn();
    const onApplyToChecked = vi.fn();

    render(
      <OutputNamingPanel
        checkedCount={2}
        outputFormat="webp"
        selectedItem={createItem()}
        template="{name}-{format}"
        onApplyToChecked={onApplyToChecked}
        onTemplateChange={onTemplateChange}
      />,
    );

    expect(screen.getByText("sample-webp.webp")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Filename template"), {
      target: { value: "export-{index}-{name}" },
    });
    expect(onTemplateChange).toHaveBeenCalledWith("export-{index}-{name}");

    fireEvent.click(screen.getByRole("button", { name: "체크 항목에 적용" }));
    expect(onApplyToChecked).toHaveBeenCalledOnce();
  });
});

function createItem() {
  return {
    id: "a",
    file: new File(["x"], "sample.png", { type: "image/png" }),
    type: "image",
    name: "sample.png",
    size: 1,
    mimeType: "image/png",
    objectUrl: "blob:sample",
    metadata: {
      width: 320,
      height: 240,
      format: "png",
    },
    status: "idle",
    progress: 0,
    warnings: [],
  } as UploadedMedia;
}
