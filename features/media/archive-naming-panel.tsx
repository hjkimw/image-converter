"use client";

import { Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getArchiveFilename } from "@/lib/media/archive";

type ArchiveNamingPanelProps = {
  archiveName: string;
  onArchiveNameChange: (name: string) => void;
};

export function ArchiveNamingPanel({ archiveName, onArchiveNameChange }: ArchiveNamingPanelProps) {
  return (
    <section className="rounded-md border border-border bg-background p-3">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border bg-secondary text-primary">
          <Archive aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-5">Archive naming</h3>
          <p className="text-xs leading-5 text-muted-foreground">여러 결과를 받을 때 생성되는 ZIP 이름입니다.</p>
        </div>
      </div>
      <div className="grid gap-2">
        <Input
          aria-label="Archive filename"
          value={archiveName}
          onChange={(event) => onArchiveNameChange(event.target.value)}
        />
        <p className="font-brand-mono truncate rounded-sm bg-secondary px-2 py-1.5 text-xs text-muted-foreground">
          {getArchiveFilename(archiveName)}
        </p>
      </div>
    </section>
  );
}
