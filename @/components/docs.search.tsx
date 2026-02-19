"use client";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { useState } from "react";

function DocsSearchDialog(props: SharedProps) {
  const { locale } = useI18n(); // (optional) for i18n
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    locale,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay className="z-100" />
      <SearchDialogContent className="z-100 mt-20">
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
export default function DocsSearch({
  iconOnly = false,
}: {
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 px-3 rounded-lg border border-border/80 bg-card/75 hover:bg-card dark:bg-muted/50 dark:hover:bg-muted/80 hover:border-border transition-all text-sm text-muted-foreground group",
          iconOnly ? "size-8 p-2 [&>svg]:size-4" : "w-56 h-9",
        )}
      >
        <Icon
          name="search"
          className={cn(
            "size-3.5 opacity-50 group-hover:opacity-100 transition-opacity",
            iconOnly ? "size-6" : "",
          )}
        />
        {!iconOnly ? (
          <>
            <span className="flex-1 text-left">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </>
        ) : null}
      </button>
      <DocsSearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
