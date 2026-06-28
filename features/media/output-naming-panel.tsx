"use client";

import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOutputFilename } from "@/lib/media/filenames";
import type { UploadedMedia } from "@/types/media";

type OutputNamingPanelProps = {
  template: string;
  checkedCount: number;
  selectedItem?: UploadedMedia;
  outputFormat?: string;
  onTemplateChange: (template: string) => void;
  onApplyToChecked: () => void;
};

const TOKENS = ["{name}", "{width}", "{height}", "{format}", "{index}"];

export function OutputNamingPanel({
  template,
  checkedCount,
  selectedItem,
  outputFormat,
  onTemplateChange,
  onApplyToChecked,
}: OutputNamingPanelProps) {
  const previewName = selectedItem
    ? createOutputFilename({
        originalName: selectedItem.name,
        format: outputFormat ?? getResultFormat(selectedItem),
        width: selectedItem.result?.width ?? selectedItem.metadata?.width,
        height: selectedItem.result?.height ?? selectedItem.metadata?.height,
        index: 1,
        template,
      })
    : "파일을 선택하면 미리보기가 표시됩니다.";

  return (
    <section className="rounded-md border border-border bg-background p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-5">Output naming</h3>
          <p className="text-xs leading-5 text-muted-foreground">템플릿으로 변환 결과 이름을 정리합니다.</p>
        </div>
        <Button disabled={checkedCount === 0} size="sm" variant="secondary" onClick={onApplyToChecked}>
          <Wand2 data-icon="inline-start" />
          체크 항목에 적용
        </Button>
      </div>
      <div className="grid gap-2">
        <Input
          aria-label="Filename template"
          value={template}
          onChange={(event) => onTemplateChange(event.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {TOKENS.map((token) => (
            <span
              key={token}
              className="font-brand-mono rounded-sm border border-border bg-secondary px-1.5 py-1 text-[11px] text-muted-foreground"
            >
              {token}
            </span>
          ))}
        </div>
        <p className="font-brand-mono truncate rounded-sm bg-secondary px-2 py-1.5 text-xs text-muted-foreground">
          {previewName}
        </p>
      </div>
    </section>
  );
}

function getResultFormat(item: UploadedMedia) {
  const resultExtension = item.result?.outputName.split(".").pop();

  if (resultExtension) {
    return resultExtension.toLowerCase();
  }

  if (item.type === "video") {
    return "mp4";
  }

  return "webp";
}
