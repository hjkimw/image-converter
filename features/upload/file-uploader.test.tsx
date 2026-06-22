import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileUploader } from "./file-uploader";
import { getMediaFolderKey } from "@/lib/media/folders";

describe("FileUploader", () => {
  it("renders the local-first upload guidance and forwards selected files", () => {
    const onFilesSelected = vi.fn();
    render(<FileUploader onFilesSelected={onFilesSelected} />);

    const input = screen.getByLabelText("Upload image or video files");
    const image = new File(["x"], "sample.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [image] } });

    expect(screen.getByText("Drop files or folders here")).toBeInTheDocument();
    expect(screen.queryByText("JPG PNG WEBP")).not.toBeInTheDocument();
    expect(screen.queryByText("MP4 WEBM")).not.toBeInTheDocument();
    expect(screen.queryByText("AVIF later")).not.toBeInTheDocument();
    expect(onFilesSelected).toHaveBeenCalledWith([image]);
  });

  it("renders a folder picker input for directory uploads", () => {
    render(<FileUploader onFilesSelected={vi.fn()} />);

    const folderInput = screen.getByLabelText("Upload a folder");

    expect(folderInput).toHaveAttribute("webkitdirectory");
    expect(folderInput).toHaveAttribute("directory");
  });

  it("marks each folder picker selection as a separate group", () => {
    const onFilesSelected = vi.fn();
    render(<FileUploader onFilesSelected={onFilesSelected} />);

    const folderInput = screen.getByLabelText("Upload a folder");
    const first = createFolderFile("a.png", "Trip/a.png");
    const second = createFolderFile("b.png", "Trip/b.png");

    fireEvent.change(folderInput, { target: { files: [first] } });
    fireEvent.change(folderInput, { target: { files: [second] } });

    const firstSelection = onFilesSelected.mock.calls[0][0];
    const secondSelection = onFilesSelected.mock.calls[1][0];

    expect(getMediaFolderKey(firstSelection[0])).not.toEqual(getMediaFolderKey(secondSelection[0]));
  });
});

function createFolderFile(name: string, relativePath: string) {
  const file = new File(["x"], name, { type: "image/png" });

  Object.defineProperty(file, "webkitRelativePath", {
    configurable: true,
    value: relativePath,
  });

  return file;
}
