import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PreviewPanel } from "./preview-panel";
import type { UploadedMedia } from "@/types/media";

describe("PreviewPanel", () => {
  it("renders before and after metadata below the preview panes", () => {
    render(<PreviewPanel item={createConvertedImage()} />);

    expect(screen.getByText("Before metadata")).toBeInTheDocument();
    expect(screen.getByText("After metadata")).toBeInTheDocument();
    expect(screen.getByText("640 x 480")).toBeInTheDocument();
    expect(screen.getByText("320 x 240")).toBeInTheDocument();
    expect(screen.getByText("sample-320x240.webp")).toBeInTheDocument();
  });

  it("shows an after metadata placeholder before conversion", () => {
    const item = createConvertedImage();
    delete item.result;

    render(<PreviewPanel item={item} />);

    expect(screen.getByText("변환 후 표시")).toBeInTheDocument();
  });

  it("supports zooming the preview media and returning to fit", () => {
    render(<PreviewPanel item={createConvertedImage()} />);

    expect(screen.getByText("100%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("110%")).toBeInTheDocument();
    expect(screen.getAllByAltText("sample.png")[0]).toHaveStyle({ transform: "scale(1.1)" });

    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    expect(screen.getByText("100%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fit preview" }));
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});

function createConvertedImage() {
  return {
    id: "image",
    file: new File(["x"], "sample.png", { type: "image/png" }),
    type: "image",
    name: "sample.png",
    size: 4096,
    mimeType: "image/png",
    objectUrl: "blob:sample",
    metadata: {
      width: 640,
      height: 480,
      format: "png",
      hasAlpha: true,
    },
    status: "completed",
    progress: 100,
    result: {
      blob: new Blob(["x"], { type: "image/webp" }),
      objectUrl: "blob:result",
      outputName: "sample-320x240.webp",
      size: 1024,
      mimeType: "image/webp",
      width: 320,
      height: 240,
    },
    warnings: [],
  } as UploadedMedia;
}
