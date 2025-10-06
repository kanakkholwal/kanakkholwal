"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const TransitionLink = (props: React.ComponentProps<typeof Link>) => {
  const router = useTransitionRouter();

  return (
    <Link
      {...props}
      href={props.href}
      onClick={(e) => {
        e.preventDefault();
        router.push(props.href.toString(), {
          onTransitionReady: pageAnimation,
        });
      }}
    />
  );
};

const pageAnimation = () => {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        scale: 1,
        transform: "translateY(0)",
      },
      {
        opacity: 0.5,
        scale: 0.9,
        transform: "translateY(-100px)",
      },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    },
  );

  document.documentElement.animate(
    [
      {
        transform: "translateY(100%)",
      },
      {
        transform: "translateY(0)",
      },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    },
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
        window?.history?.length > 1
          ? router.back()
          : router.push(pathname.split("/").splice(-1).join("/"));
      }}
      {...props}
    >
      <ArrowLeft />
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
          onTransitionReady: pageAnimation,
        });
      }}
    >
      {children}
    </Button>
  );
}

export function ButtonScroll(
  props: React.ComponentProps<typeof Button> & {
    targetId: string;
    offset?: number;
  },
) {
  const { targetId, offset = 50, ...rest } = props;

  const handleScroll = () => {
    const element = document.getElementById(targetId);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <Button {...rest} onClick={handleScroll} />;
}
