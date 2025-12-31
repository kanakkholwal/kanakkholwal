"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- 1. FORWARD ANIMATION (Slide New Page In From Right) ---
const pushAnimation = () => {
  // OLD PAGE: Recedes slightly to the left and darkens (Parallax)
  document.documentElement.animate(
    [
      {
        transform: "translateX(0)",
        filter: "brightness(1)",
      },
      {
        transform: "translateX(-25%)", // Moves slower than incoming page
        filter: "brightness(0.5)", // Dims out
      },
    ],
    {
      duration: 600,
      easing: "cubic-bezier(0.32, 0.72, 0, 1)", // iOS-like spring
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  // NEW PAGE: Slides in from the Right
  document.documentElement.animate(
    [
      {
        transform: "translateX(100%)", // Starts off-screen right
        boxShadow: "-20px 0px 50px rgba(0,0,0,0.5)", // Shadow to show depth
      },
      {
        transform: "translateX(0)",
      },
    ],
    {
      duration: 600,
      easing: "cubic-bezier(0.32, 0.72, 0, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};

// --- 2. BACK ANIMATION (Slide Current Page Away To Right) ---
const backAnimation = () => {
  // OLD PAGE (The one leaving): Slides out to the Right
  document.documentElement.animate(
    [
      {
        transform: "translateX(0)",
        boxShadow: "-20px 0px 50px rgba(0,0,0,0.5)",
        zIndex: 10,
      },
      {
        transform: "translateX(100%)", // Slides off-screen right
        zIndex: 10,
      },
    ],
    {
      duration: 600,
      easing: "cubic-bezier(0.32, 0.72, 0, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  // NEW PAGE (The one reappearing): Slides in from Left (Parallax Reverse)
  document.documentElement.animate(
    [
      {
        transform: "translateX(-25%)",
        filter: "brightness(0.5)",
      },
      {
        transform: "translateX(0)",
        filter: "brightness(1)",
      },
    ],
    {
      duration: 600,
      easing: "cubic-bezier(0.32, 0.72, 0, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};

// --- COMPONENTS ---

export const TransitionLink = (props: React.ComponentProps<typeof Link>) => {
  const router = useTransitionRouter();

  return (
    <Link
      {...props}
      href={props.href}
      onClick={(e) => {
        e.preventDefault();
        // Use Push Animation for standard links
        router.push(props.href.toString(), {
          onTransitionReady: pushAnimation,
        });
      }}
    />
  );
};

export function PreviousPageLink(props: ButtonProps) {
  const router = useTransitionRouter();
  const pathname = usePathname();

  return (
    <Button
      rounded="full"
      variant="ghost"
      onClick={() => {
        // Use Back Animation for going back
        const parentPath = pathname.split("/").slice(0, -1).join("/") || "/";
        
        if (window?.history?.length > 1) {
          router.back();
        } else {
          router.push(parentPath, {
            onTransitionReady: backAnimation,
          });
        }
      }}
      {...props}
    >
      <ArrowLeft className="size-4 mr-2" />
      Go Back
    </Button>
  );
}

export function ButtonLink({
  href,
  children,
  ...props
}: React.ComponentProps<typeof Button> & React.ComponentProps<typeof Link>) {
  return (
    <Button asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export function ButtonTransitionLink({
  href,
  children,
  ...props
}: React.ComponentProps<typeof Button> & React.ComponentProps<typeof Link>) {
  const router = useTransitionRouter();

  return (
    <Button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        router.push(href.toString(), {
          onTransitionReady: pushAnimation,
        });
      }}
    >
      {children}
    </Button>
  );
}

export function TransitionLinkButton({
  href,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Link> & { className?: string }) {
  const router = useTransitionRouter();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        router.push(href.toString(), {
          onTransitionReady: pushAnimation,
        });
      }}
      {...props}
    >
      {children}
    </Link>
  );
}

export function ButtonScroll(
  props: React.ComponentProps<typeof Button> & {
    targetId: string;
    offset?: number;
  }
) {
  const { targetId, offset = 50, ...rest } = props;

  const handleScroll = () => {
    const element = document.getElementById(targetId);
    if (!element) return;
    
    const y = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  return <Button {...rest} onClick={handleScroll} />;
}