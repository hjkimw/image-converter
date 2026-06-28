import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ArchiveNamingPanel } from "./archive-naming-panel";

describe("ArchiveNamingPanel", () => {
  it("edits the zip archive base name and previews the final filename", () => {
    const onArchiveNameChange = vi.fn();

    render(<ArchiveNamingPanel archiveName="campaign export" onArchiveNameChange={onArchiveNameChange} />);

    expect(screen.getByText("Archive naming")).toBeInTheDocument();
    expect(screen.getByText("campaign export.zip")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Archive filename"), {
      target: { value: "client-delivery" },
    });

    expect(onArchiveNameChange).toHaveBeenCalledWith("client-delivery");
  });
});
