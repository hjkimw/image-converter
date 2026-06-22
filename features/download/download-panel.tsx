"use client";

import { CheckCircle2, Clock3, Download, Play, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/media/format";
import { cn } from "@/lib/utils";

type DownloadPanelProps = {
  selectedCount: number;
  selectedSize: number;
  convertedCount: number;
  pendingCount: number;
  failedCount: number;
  conversionCount: number;
  downloadableCount: number;
  isProcessing: boolean;
  onConvertSelected: () => void;
  onDownloadSelected: () => void;
};

export function DownloadPanel({
  selectedCount,
  selectedSize,
  convertedCount,
  pendingCount,
  failedCount,
  conversionCount,
  downloadableCount,
  isProcessing,
  onConvertSelected,
  onDownloadSelected,
}: DownloadPanelProps) {
  const isConvertDisabled = conversionCount === 0 || isProcessing;
  const isDownloadDisabled = downloadableCount === 0 || isProcessing;
  const helperText = getHelperText(selectedCount, downloadableCount, isProcessing);
  const hasSelection = selectedCount > 0;

  return (
    <section className="shrink-0 rounded-md border border-border bg-card px-3 py-2">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-center">
        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0" aria-live="polite">
            {hasSelection ? (
              <>
                <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                  <h3 className="truncate text-sm font-semibold leading-5">{selectedCount}개 선택됨</h3>
                  <span className="sr-only">{selectedCount}개 항목 선택됨</span>
                  <p className="font-brand-mono text-xs leading-5 text-muted-foreground">{formatBytes(selectedSize)}</p>
                </div>
                <p className="truncate text-xs leading-5 text-muted-foreground">{helperText}</p>
              </>
            ) : (
              <span className="sr-only">선택된 항목 없음</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <StatusPill icon={CheckCircle2} tone="converted" value={convertedCount} label="converted" />
            <StatusPill icon={Clock3} tone="pending" value={pendingCount} label="pending" />
            <StatusPill icon={XCircle} tone="failed" value={failedCount} label="failed" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button className="w-full" disabled={isConvertDisabled} size="sm" variant="secondary" onClick={onConvertSelected}>
            <Play data-icon="inline-start" />
            변환 ({conversionCount})
          </Button>
          <Button className="w-full" disabled={isDownloadDisabled} size="sm" onClick={onDownloadSelected}>
            <Download data-icon="inline-start" />
            다운로드 ({downloadableCount})
          </Button>
        </div>
      </div>
    </section>
  );
}

function StatusPill({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: typeof CheckCircle2;
  tone: "converted" | "pending" | "failed";
  value: number;
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-center gap-2 border-l border-border px-2 text-xs leading-5",
        tone === "converted" && "text-emerald-300",
        tone === "pending" && "text-amber-300",
        tone === "failed" && "text-red-300",
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span className="font-brand-mono truncate font-semibold text-foreground">
        {value} {label}
      </span>
    </div>
  );
}

function getHelperText(selectedCount: number, downloadableCount: number, isProcessing: boolean) {
  if (isProcessing) {
    return "변환 중...";
  }

  if (selectedCount === 0) {
    return "";
  }

  if (downloadableCount === 0) {
    return "먼저 선택 항목을 변환하세요.";
  }

  return "변환 완료 항목만 다운로드합니다.";
}
