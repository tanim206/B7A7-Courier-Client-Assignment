"use client";

import { useState } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";

interface IProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
}

/* ==========================================
   CONFIRMATION BEFORE A DESTRUCTIVE ACTION
   THE OWNER OWNS THE OPEN STATE SO THE TRIGGER
   CAN BE ANY BUTTON WITHOUT FORWARDING REFS
   ========================================== */

export function ConfirmAction({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = true,
  isPending,
  onConfirm,
}: IProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant={destructive ? "destructive" : "default"}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {trigger}
      </Button>

      <SheetContent side="bottom">
        <SheetHeader>
          <div className="flex items-center gap-2">
            {destructive && (
              <TriangleAlertIcon className="size-5 text-destructive" />
            )}
            <SheetTitle>{title}</SheetTitle>
          </div>

          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending && <Spinner />}
            {confirmLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
