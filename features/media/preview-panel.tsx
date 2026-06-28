"use client";

import { useRef, useState, type PointerEvent } from "react";
import { ArrowRight, ImageIcon, Maximize2, Minus, Plus, VideoIcon } from "lucide-react";
import type { UploadedMedia } from "@/types/media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBytes, formatPercentChange } from "@/lib/media/format";
import { buildPreviewMetadata, type PreviewMetadataRow } from "@/lib/media/preview-metadata";

type PreviewPanelProps = {
  item?: UploadedMedia;
  action?: React.ReactNode;
};

export function PreviewPanel({ item, action }: PreviewPanelProps) {
  const [zoom, setZoom] = useState(100);

  if (!item) {
    return (
      <section
        data-testid="empty-preview-panel"
        className="relative flex h-[min(58svh,520px)] min-h-[360px] flex-none items-center justify-center overflow-y-auto rounded-md border border-border bg-card p-4 xl:h-auto xl:min-h-0 xl:flex-1 xl:overflow-hidden"
      >
        {action ? <div className="absolute right-4 top-4 z-10">{action}</div> : null}
        <div className="m-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-sm border border-border bg-secondary text-primary">
            <ImageIcon aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold leading-8">Queue media to begin</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              이미지 또는 짧은 영상을 추가하면 원본과 변환 결과를 같은 캔버스에서 비교합니다.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const metadata = buildPreviewMetadata(item);
  const zoomOut = () => setZoom((current) => Math.max(50, current - 10));
  const zoomIn = () => setZoom((current) => Math.min(200, current + 10));
  const fitPreview = () => setZoom(100);

  return (
    <section
      data-testid="preview-panel"
      className="flex h-[min(54svh,520px)] min-h-[320px] flex-none flex-col overflow-hidden rounded-md border border-border bg-card xl:h-auto xl:min-h-0 xl:flex-1"
    >
      <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-6">Preview canvas</h2>
          <p className="truncate text-sm leading-5 text-muted-foreground">{item.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.type === "image" ? "success" : "secondary"}>{item.type.toUpperCase()}</Badge>
          <Badge variant="muted">{item.status}</Badge>
          <Badge variant="muted">{formatBytes(item.size)}</Badge>
          {item.result ? <Badge variant="secondary">{formatPercentChange(item.size, item.result.size)}</Badge> : null}
          <PreviewZoomControls zoom={zoom} onFit={fitPreview} onZoomIn={zoomIn} onZoomOut={zoomOut} />
          {action}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto xl:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] xl:overflow-hidden">
        <PreviewPane title="Original" description={item.mimeType || "Unknown MIME"}>
          <MediaPreview item={item} src={item.objectUrl} zoom={zoom} />
          <PreviewMetadata title="Before metadata" rows={metadata.before} />
        </PreviewPane>

        <div className="flex items-center justify-center border-y border-border bg-secondary/50 py-1 xl:border-x xl:border-y-0 xl:px-2 xl:py-0">
          <div className="flex size-7 items-center justify-center rounded-sm border border-border bg-background text-primary">
            <ArrowRight aria-hidden="true" />
          </div>
        </div>

        <PreviewPane
          title="Result"
          description={item.result ? "Converted output" : "Run conversion to preview output"}
        >
          {item.result ? (
            <>
              <MediaPreview item={item} src={item.result.objectUrl} resultMimeType={item.result.mimeType} zoom={zoom} />
              <PreviewMetadata title="After metadata" rows={metadata.after} />
            </>
          ) : (
            <>
              <div className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed hairline-dashed bg-secondary/40 p-4 text-center text-sm text-muted-foreground">
                변환 결과 대기 중
              </div>
              <PreviewMetadata title="After metadata" rows={metadata.after} />
            </>
          )}
        </PreviewPane>
      </div>
    </section>
  );
}

function PreviewZoomControls({
  zoom,
  onFit,
  onZoomIn,
  onZoomOut,
}: {
  zoom: number;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <div className="flex h-8 items-center rounded-sm border border-border bg-secondary">
      <Button aria-label="Fit preview" className="h-7 px-2" size="sm" variant="ghost" onClick={onFit}>
        <Maximize2 data-icon="inline-start" />
        Fit
      </Button>
      <div className="h-5 w-px bg-border" />
      <Button aria-label="Zoom out" className="size-7 px-0" disabled={zoom <= 50} size="icon" variant="ghost" onClick={onZoomOut}>
        <Minus data-icon="inline-start" />
      </Button>
      <span className="font-brand-mono w-12 text-center text-xs leading-5 text-muted-foreground">{zoom}%</span>
      <Button aria-label="Zoom in" className="size-7 px-0" disabled={zoom >= 200} size="icon" variant="ghost" onClick={onZoomIn}>
        <Plus data-icon="inline-start" />
      </Button>
    </div>
  );
}

function PreviewPane({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid={`preview-pane-${title.toLowerCase()}`}
      className="flex h-[360px] shrink-0 flex-col gap-2 overflow-hidden p-2 sm:gap-3 sm:p-3 xl:h-auto xl:min-h-0 xl:shrink xl:flex-1"
    >
      <div className="min-w-0 shrink-0">
        <h3 className="text-sm font-semibold leading-5">{title}</h3>
        <p className="truncate text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <div
        data-testid={`preview-pane-body-${title.toLowerCase()}`}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}

function MediaPreview({
  item,
  src,
  resultMimeType,
  zoom,
}: {
  item: UploadedMedia;
  src: string;
  resultMimeType?: string;
  zoom: number;
}) {
  const [isPanning, setIsPanning] = useState(false);
  const panState = useRef({
    pointerId: 0,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const mediaStyle = {
    height: `${zoom}%`,
    width: `${zoom}%`,
  };
  const canPan = zoom > 100;
  const startPan = (event: PointerEvent<HTMLDivElement>) => {
    if (!canPan) {
      return;
    }

    event.preventDefault();
    panState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: event.currentTarget.scrollLeft,
      scrollTop: event.currentTarget.scrollTop,
    };
    setIsPanning(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const movePan = (event: PointerEvent<HTMLDivElement>) => {
    if (!isPanning || !canPan) {
      return;
    }

    const frame = event.currentTarget;
    frame.scrollLeft = panState.current.scrollLeft + (panState.current.startX - event.clientX);
    frame.scrollTop = panState.current.scrollTop + (panState.current.startY - event.clientY);
  };
  const stopPan = () => setIsPanning(false);
  const frameClassName =
    "flex h-[220px] shrink-0 overflow-auto rounded-md bg-secondary xl:min-h-[160px] xl:flex-1";
  const interactiveFrameProps = {
    onPointerCancel: stopPan,
    onPointerDown: startPan,
    onPointerMove: movePan,
    onPointerUp: stopPan,
    onLostPointerCapture: stopPan,
  };

  if (item.type === "image" || resultMimeType?.startsWith("image/")) {
    return (
      <div
        data-testid="media-preview-frame"
        className={`${frameClassName} ${canPan ? "cursor-grab active:cursor-grabbing" : ""}`}
        {...interactiveFrameProps}
      >
        <img
          alt={item.name}
          className="m-auto max-h-none max-w-none shrink-0 rounded-md object-contain transition-[height,width] duration-150"
          src={src}
          style={mediaStyle}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      data-testid="media-preview-frame"
      className={`${frameClassName} ${canPan ? "cursor-grab active:cursor-grabbing" : ""}`}
      {...interactiveFrameProps}
    >
      <video
        className="m-auto max-h-none max-w-none shrink-0 rounded-md object-contain transition-[height,width] duration-150"
        controls
        muted
        playsInline
        src={src}
        style={mediaStyle}
      >
        <VideoIcon aria-hidden="true" />
      </video>
    </div>
  );
}

function PreviewMetadata({ title, rows }: { title: string; rows: PreviewMetadataRow[] }) {
  return (
    <div className="shrink-0 rounded-md border border-border bg-background p-2">
      <h4 className="mb-2 text-xs font-semibold leading-4 text-muted-foreground">{title}</h4>
      <dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="min-w-0 rounded-sm bg-secondary px-2 py-1.5">
            <dt className="text-[11px] leading-4 text-muted-foreground">{row.label}</dt>
            <dd className="font-brand-mono truncate text-xs leading-4 text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
