"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { PaginationMeta } from "@/types";

interface IProps {
  meta?: PaginationMeta;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  itemLabel?: string;
}

const limitOptions = [10, 20, 50];

export function DataPagination({
  meta,
  page,
  limit,
  onPageChange,
  onLimitChange,
  itemLabel = "rows",
}: IProps) {
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  //  THE RANGE IS CALCULATED FROM THE CURRENT PAGE, NOT THE TOTAL

  const firstItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>
          Showing <span className="font-medium text-foreground">{firstItem}</span>-
          <span className="font-medium text-foreground">{lastItem}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span>{" "}
          {itemLabel}
        </span>

        <Select
          value={String(limit)}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          aria-label="Rows per page"
          className="h-8 w-20"
        >
          {limitOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon /> Previous
        </Button>

        <span className="px-1 text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
