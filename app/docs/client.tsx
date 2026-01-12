'use client';
import { Icon } from '@/components/icons';
import { useDocsSearch } from 'fumadocs-core/search/client';
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
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useState } from 'react';

function DefaultSearchDialog(props: SharedProps) {
    const { locale } = useI18n(); // (optional) for i18n
    const { search, setSearch, query } = useDocsSearch({
        type: 'fetch',
        locale,
    });

    return (
        <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
            <SearchDialogOverlay />
            <SearchDialogContent>
                <SearchDialogHeader>
                    <SearchDialogIcon />
                    <SearchDialogInput />
                    <SearchDialogClose />
                </SearchDialogHeader>
                <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
            </SearchDialogContent>
        </SearchDialog>
    );
}
export default function SearchBox() {
    const [open, setOpen] = useState(false);
    return <>
        <button
            onClick={() => setOpen(true)}
            className="hidden md:flex items-center w-56 h-9 px-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 dark:bg-muted/20 dark:hover:bg-muted/50 hover:border-border transition-all text-sm text-muted-foreground group"
        >
            <Icon name="search" className="size-3.5 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
            </kbd>
        </button>
        <DefaultSearchDialog open={open} onOpenChange={setOpen} />
    </>
}