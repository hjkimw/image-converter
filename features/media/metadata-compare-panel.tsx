"use client";

import type { UploadedMedia } from "@/types/media";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadataComparison } from "@/lib/media/metadata-comparison";

type MetadataComparePanelProps = {
  item?: UploadedMedia;
};

export function MetadataComparePanel({ item }: MetadataComparePanelProps) {
  if (!item) {
    return null;
  }

  const rows = buildMetadataComparison(item);

  return (
    <Card>
      <CardHeader className="border-b border-border p-4">
        <CardTitle>Before / After</CardTitle>
        <CardDescription>변환 전/후 메타데이터와 출력 상태를 비교합니다.</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[0.85fr_1fr_1fr] border-b border-border bg-secondary px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>Field</span>
            <span>Before</span>
            <span>After</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[0.85fr_1fr_1fr] border-b border-border px-3 py-2 text-xs last:border-b-0"
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-brand-mono truncate text-foreground">{row.before}</span>
              <span className="font-brand-mono truncate text-foreground">{row.after}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
