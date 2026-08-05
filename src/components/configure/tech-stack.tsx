"use client";

import { useState } from "react";
import { toast } from "sonner";
import { tokenStats } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, Server, TabletSmartphone } from "lucide-react";

const stack = [
  {
    name: "React Native",
    description: "Mobile framework — one codebase for iOS & Android.",
    icon: TabletSmartphone,
    tint: "bg-info-subtle text-info",
  },
  {
    name: "FastAPI",
    description: "Backend — async Python APIs with typed contracts.",
    icon: Server,
    tint: "bg-teal-subtle text-teal",
  },
  {
    name: "PostgreSQL",
    description: "Database — relational store for pets, visits & vaccines.",
    icon: Database,
    tint: "bg-brand-subtle text-brand",
  },
];

const llmOptions = [
  "Google Gemini Pro",
  "GPT-5",
  "Claude Opus 4",
  "Claude Sonnet 4",
  "Gemini 2.5 Pro",
];

export function TechStackTab() {
  const [models, setModels] = useState<Record<string, string>>(() =>
    Object.fromEntries(tokenStats.byModule.map((m) => [m.module, m.llm])),
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((s) => (
          <div
            key={s.name}
            className="flex flex-col rounded-xl border bg-card p-4 shadow-elevation-low"
          >
            <div className="flex items-start justify-between">
              <span
                className={`inline-flex size-9 items-center justify-center rounded-lg ${s.tint}`}
              >
                <s.icon className="size-4.5" aria-hidden />
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  toast(`Change ${s.name}`, {
                    description:
                      "Stack changes trigger a fresh setup — coming soon in this demo.",
                  })
                }
              >
                Change
              </Button>
            </div>
            <p className="mt-3 text-sm font-semibold">{s.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {s.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card shadow-elevation-low">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold">LLM per module</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Pick which model powers each generation module.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Tokens used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokenStats.byModule.map((m) => (
              <TableRow key={m.module}>
                <TableCell className="text-sm font-medium">
                  {m.module}
                </TableCell>
                <TableCell>
                  <Select
                    value={models[m.module]}
                    onValueChange={(v) => {
                      setModels((prev) => ({ ...prev, [m.module]: v }));
                      toast.success(`${m.module} now uses ${v}`);
                    }}
                  >
                    <SelectTrigger size="sm" className="w-[190px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {llmOptions.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                  {m.tokens.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
