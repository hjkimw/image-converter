import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DownloadPanel } from "./download-panel";

describe("DownloadPanel", () => {
  it("renders split conversion and download actions with selected status counts", () => {
    const onConvertSelected = vi.fn();
    const onDownloadSelected = vi.fn();

    render(
      <DownloadPanel
        conversionCount={3}
        convertedCount={2}
        downloadableCount={2}
        failedCount={1}
        isProcessing={false}
        pendingCount={2}
        selectedCount={5}
        selectedSize={1024}
        onConvertSelected={onConvertSelected}
        onDownloadSelected={onDownloadSelected}
      />,
    );

    expect(screen.getByText("5개 선택됨")).toBeInTheDocument();
    expect(screen.getByText("1.0 KB")).toBeInTheDocument();
    expect(screen.getByText("2 converted")).toBeInTheDocument();
    expect(screen.getByText("2 pending")).toBeInTheDocument();
    expect(screen.getByText("1 failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "변환 (3)" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "다운로드 (2)" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: /ZIP/ })).not.toBeInTheDocument();

    screen.getByRole("button", { name: "변환 (3)" }).click();
    screen.getByRole("button", { name: "다운로드 (2)" }).click();

    expect(onConvertSelected).toHaveBeenCalledOnce();
    expect(onDownloadSelected).toHaveBeenCalledOnce();
  });

  it("disables download until checked items have converted results", () => {
    const onConvertSelected = vi.fn();
    const onDownloadSelected = vi.fn();

    render(
      <DownloadPanel
        conversionCount={3}
        convertedCount={0}
        downloadableCount={0}
        failedCount={0}
        isProcessing={false}
        pendingCount={3}
        selectedCount={3}
        selectedSize={2048}
        onConvertSelected={onConvertSelected}
        onDownloadSelected={onDownloadSelected}
      />,
    );

    expect(screen.getByText("3개 항목 선택됨")).toBeInTheDocument();
    expect(screen.getByText("먼저 선택 항목을 변환하세요.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "변환 (3)" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "다운로드 (0)" })).toBeDisabled();
    expect(onDownloadSelected).not.toHaveBeenCalled();
  });

  it("keeps empty selection guidance out of the visible center panel", () => {
    render(
      <DownloadPanel
        conversionCount={0}
        convertedCount={0}
        downloadableCount={0}
        failedCount={0}
        isProcessing={false}
        pendingCount={0}
        selectedCount={0}
        selectedSize={0}
        onConvertSelected={vi.fn()}
        onDownloadSelected={vi.fn()}
      />,
    );

    expect(screen.queryByText("0개 선택됨")).not.toBeInTheDocument();
    expect(screen.queryByText("다운로드할 항목을 체크하세요.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "변환 (0)" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다운로드 (0)" })).toBeDisabled();
  });

  it("supports compact fixed positioning and hides the first status divider until desktop", () => {
    render(
      <DownloadPanel
        className="fixed inset-x-3 bottom-3 xl:static"
        conversionCount={0}
        convertedCount={0}
        downloadableCount={0}
        failedCount={0}
        isProcessing={false}
        pendingCount={0}
        selectedCount={0}
        selectedSize={0}
        onConvertSelected={vi.fn()}
        onDownloadSelected={vi.fn()}
      />,
    );

    expect(screen.getByTestId("download-panel")).toHaveClass("fixed", "inset-x-3", "bottom-3", "xl:static");
    expect(screen.getByTestId("status-pill-converted")).toHaveClass("border-l-0", "xl:border-l");
    expect(screen.getByTestId("status-pill-pending")).toHaveClass("border-l");
  });

  it("places the selected summary above status counts and centers it on compact layouts", () => {
    render(
      <DownloadPanel
        conversionCount={34}
        convertedCount={0}
        downloadableCount={0}
        failedCount={0}
        isProcessing={false}
        pendingCount={34}
        selectedCount={34}
        selectedSize={4096}
        onConvertSelected={vi.fn()}
        onDownloadSelected={vi.fn()}
      />,
    );

    const summary = screen.getByTestId("download-selection-summary");
    const statusRow = screen.getByTestId("download-status-row");

    expect(summary).toHaveTextContent("34개 선택됨");
    expect(summary).toHaveClass("text-center", "lg:text-left");
    expect(summary.compareDocumentPosition(statusRow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
