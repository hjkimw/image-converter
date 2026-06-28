"use client";

import type { ImageMetadata, UploadedMedia, VideoMetadata } from "@/types/media";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes, formatDuration } from "@/lib/media/format";

type MetadataPanelProps = {
  item?: UploadedMedia;
};

export function MetadataPanel({ item }: MetadataPanelProps) {
  if (!item) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Metadata</CardTitle>
          <CardDescription>Select a file to inspect format, size, and dimensions.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const metadata = item.metadata;

  return (
    <Card>
      <CardHeader className="border-b border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Metadata</CardTitle>
          <Badge variant={item.type === "image" ? "success" : "secondary"}>{item.type.toUpperCase()}</Badge>
        </div>
        <CardDescription>{item.name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <MetadataRow label="Size" value={formatBytes(item.size)} />
          <MetadataRow label="MIME" value={item.mimeType || "Unknown"} />
          {item.type === "image" && metadata ? <ImageRows metadata={metadata as ImageMetadata} /> : null}
          {item.type === "video" && metadata ? <VideoRows metadata={metadata as VideoMetadata} /> : null}
        </dl>
      </CardContent>
    </Card>
  );
}

function ImageRows({ metadata }: { metadata: ImageMetadata }) {
  return (
    <>
      <MetadataRow label="Resolution" value={`${metadata.width} x ${metadata.height}`} />
      <MetadataRow label="Format" value={metadata.format} />
      <MetadataRow label="Alpha" value={metadata.hasAlpha ? "Likely" : "No"} />
    </>
  );
}

function VideoRows({ metadata }: { metadata: VideoMetadata }) {
  return (
    <>
      <MetadataRow label="Resolution" value={`${metadata.width} x ${metadata.height}`} />
      <MetadataRow label="Duration" value={formatDuration(metadata.duration)} />
      <MetadataRow label="FPS" value={metadata.fps ? `${metadata.fps}` : "Estimated later"} />
      <MetadataRow label="Audio" value={metadata.hasAudio === undefined ? "Unknown" : metadata.hasAudio ? "Yes" : "No"} />
    </>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-brand-mono mt-1 truncate text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
