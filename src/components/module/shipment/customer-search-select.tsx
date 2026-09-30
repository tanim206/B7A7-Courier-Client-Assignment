"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDebouncedValue, useSearchCustomers } from "@/hooks";
import type { CustomerOption } from "@/types";

interface IProps {
  value: CustomerOption | null;
  onChange: (customer: CustomerOption | null) => void;
  invalid?: boolean;
}

export function CustomerSearchSelect({ value, onChange, invalid }: IProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebouncedValue(searchTerm);
  const { data, isFetching } = useSearchCustomers(debouncedSearch);
  const customers = data?.data ?? [];

  //  CLOSE THE DROPDOWN WHEN THE USER CLICKS OUTSIDE

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  //  A SELECTED CUSTOMER IS SHOWN AS A SUMMARY INSTEAD OF A SEARCH BOX

  if (value) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-input bg-muted/30 px-2.5 py-1.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{value.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {value.email} &middot; {value.phone}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Change customer"
          onClick={() => {
            onChange(null);
            setSearchTerm("");
          }}
        >
          <XIcon />
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          placeholder="Search by name, email or phone"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="customer-search-results"
          aria-invalid={invalid}
          className="pl-8"
        />
        {isFetching && (
          <Spinner className="absolute top-1/2 right-2.5 -translate-y-1/2" />
        )}
      </div>

      {isOpen && (
        <div
          id="customer-search-results"
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {customers.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              {debouncedSearch
                ? "No customer found"
                : "Type at least one character to search"}
            </p>
          ) : (
            customers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => {
                  onChange(customer);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {customer.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {customer.email} &middot; {customer.phone}
                  </span>
                </span>
                <CheckIcon className="size-4 shrink-0 opacity-0" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
