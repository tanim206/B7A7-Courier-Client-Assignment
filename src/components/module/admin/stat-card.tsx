"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  isPending?: boolean;
  tone?: "default" | "success" | "warning" | "danger";
}

const toneClasses: Record<NonNullable<IProps["tone"]>, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  danger: "bg-destructive/10 text-destructive",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  isPending,
  tone = "default",
}: IProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-xs text-muted-foreground">{label}</p>

          {isPending ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <p className="truncate text-2xl font-semibold tracking-tight">
              {value}
            </p>
          )}

          {hint && !isPending && (
            <p className="truncate text-xs text-muted-foreground">{hint}</p>
          )}
        </div>

        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}
