"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { type DialogSize, type DialogVariant, dialogFrame, dialogWidth } from "./variants";

export type { DialogSize, DialogVariant };

type Ctx = {
  size: DialogSize;
  variant: DialogVariant;
  /** The rim slot below the surface; DialogFooter portals into it. */
  footerEl: HTMLDivElement | null;
  setFooterEl: (el: HTMLDivElement | null) => void;
};

const DialogCtx = createContext<Ctx | null>(null);

function useDialog() {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error("Dialog parts must be used inside <Dialog>");
  return ctx;
}

export function Dialog({
  children,
  open,
  defaultOpen = false,
  size = "md",
  variant = "default",
  dismissOnBackdrop = true,
  onOpenChange,
}: {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  size?: DialogSize;
  variant?: DialogVariant;
  dismissOnBackdrop?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [footerEl, setFooterEl] = useState<HTMLDivElement | null>(null);

  const ctx = useMemo(() => ({ size, variant, footerEl, setFooterEl }), [size, variant, footerEl]);

  return (
    <DialogCtx.Provider value={ctx}>
      <DialogPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(next) => onOpenChange?.(next)}
        disablePointerDismissal={!dismissOnBackdrop}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogCtx.Provider>
  );
}

export function DialogTrigger({ className, ...props }: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" className={cn("inline-flex", className)} {...props} />;
}

export function DialogContent({ className, children }: ComponentProps<typeof DialogPrimitive.Popup>) {
  const dialog = useDialog();
  const styles = dialogFrame({ variant: dialog.variant });

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop data-slot="dialog-backdrop" className={styles.backdrop()} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-variant={dialog.variant}
        className={cn(
          styles.popup(),
          styles.panel(),
          "w-[min(32rem,calc(100vw-2rem))]",
          dialogWidth({ size: dialog.size }),
          className,
        )}
      >
        {dialog.variant === "framed" ? (
          <>
            {/* Inset frame: the body sits on a lighter surface, the footer in the rim below it. */}
            <div className={styles.body()}>{children}</div>
            <div ref={dialog.setFooterEl} className="empty:hidden" />
          </>
        ) : (
          <>
            {children}
            <div ref={dialog.setFooterEl} className="empty:hidden" />
          </>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  const dialog = useDialog();
  const node = (
    <div
      data-slot="dialog-footer"
      className={cn(dialogFrame({ variant: dialog.variant }).footer(), className)}
      {...props}
    />
  );
  // Rendered into the frame rim below the surface once that slot exists.
  return dialog.footerEl ? createPortal(node, dialog.footerEl) : null;
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "flex items-center gap-2 font-semibold text-foreground text-lg [&>svg]:size-5 [&>svg]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export function DialogClose({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      aria-label={children ? undefined : "Close"}
      className={cn(!children && dialogFrame().close(), className)}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
          <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </DialogPrimitive.Close>
  );
}
