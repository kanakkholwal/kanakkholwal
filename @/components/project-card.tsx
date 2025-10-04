"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "./ui/button";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <Card
      className={
        "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full"
      }
    >
      <Link
        href={href || "#"}
        className={cn("block cursor-pointer", className)}
      >
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
          />
        )}
        {image && (
          <Image
            src={image}
            alt={title}
            width={640}
            height={360}
            className="h-40 w-full overflow-hidden object-cover object-top"
          />
        )}
      </Link>
      <CardHeader className="px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base">{title}</CardTitle>
          <time className="font-sans text-xs">{dates}</time>
          <div className="hidden font-sans text-xs underline print:visible">
            {link?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <div className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
            <Markdown>{description}</Markdown>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-2">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <Badge
                className="px-1 py-0 text-[10px]"
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-2 pb-2">
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links?.map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export interface ExpandableCardProps {
  cards: Array<{
    title: string;
    href?: string;
    description: string;
    dates: string;
    tags: string[];
    link?: string;
    image?: string;
    video?: string;
    links?: {
      icon: React.ReactNode;
      type: string;
      href: string;
    }[];
  }>;
}

export function ExpandableProjectCards({ cards }: ExpandableCardProps) {
  const [active, setActive] = useState<
    ExpandableCardProps["cards"][number] | boolean | null
  >(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%] flex flex-col bg-card sm:rounded-3xl overflow-hidden pt-10 md:pt-0"
            >
              <motion.div
                layoutId={`media-${active.title}-${id}`}
                className="px-3"
              >
                {active.image && (
                  <Image
                    src={active?.image}
                    alt={active?.title}
                    width={640}
                    height={360}
                    className="w-full h-80 lg:h-80 rounded-lg   md:rounded-tr-lg md:rounded-tl-lg object-cover object-top"
                  />
                )}
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-foreground text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.time
                      layoutId={`dates-${active.dates}-${id}`}
                      className="text-muted-foreground text-sm"
                    >
                      {active.dates}
                    </motion.time>
                  </div>
                  <motion.div layoutId={`cta-${active.title}-${id}`}>
                    <Button variant="rainbow" rounded="full" asChild>
                      <Link
                        href={active?.href || active?.link || "#"}
                        target="_blank"
                      >
                        Check it Out
                        <ArrowUpRight />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
                <div className="relative px-4">
                  <motion.div
                    layoutId={`description-${active.title}-${id}`}
                    className="text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    <div className="hidden font-sans text-xs underline print:visible">
                      {active.link
                        ?.replace("https://", "")
                        .replace("www.", "")
                        .replace("/", "")}
                    </div>
                    <div className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
                      <Markdown>{active.description}</Markdown>
                    </div>
                    <CardContent className="mt-auto flex flex-col px-2">
                      {active.tags && active.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {active.tags?.map((tag) => (
                            <Badge
                              className="px-1 py-0 text-[10px]"
                              variant="secondary"
                              key={tag}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="px-2 pb-2">
                      {active.links && active.links.length > 0 && (
                        <div className="flex flex-row flex-wrap items-start gap-1">
                          {active.links?.map((link, idx) => (
                            <Link href={link?.href} key={idx} target="_blank">
                              <Button
                                key={idx}
                                variant="dark"
                                size="xs"
                                className="flex gap-2 px-2 py-1 text-[10px]"
                              >
                                {link.icon}
                                {link.type}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardFooter>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className=" sm:grid-cols-2 max-w-6xl @min-7xl:max-w-4/5 mx-auto w-full grid grid-cols-1 md:grid-cols-3 items-start gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="rounded-lg bg-card text-card-foreground flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full cursor-pointer"
          >
            {
              <motion.div layoutId={`media-${card.title}-${id}`}>
                {card?.video && (
                  <video
                    src={card.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
                  />
                )}
                {card?.image && (
                  <Image
                    src={card?.image}
                    alt={card?.title}
                    width={640}
                    height={360}
                    className="h-40 w-full overflow-hidden object-cover object-top"
                  />
                )}
              </motion.div>
            }

            <div className="flex gap-4 flex-col p-2 w-full relative">
              <div className="space-y-1">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-semibold leading-none tracking-tight text-left text-base"
                >
                  {card.title}
                </motion.h3>
                <motion.time
                  layoutId={`dates-${card.dates}-${id}`}
                  className="text-muted-foreground text-left font-sans text-xs"
                >
                  {card.dates}
                </motion.time>
                <div className="hidden font-sans text-xs underline print:visible">
                  {card.link
                    ?.replace("https://", "")
                    .replace("www.", "")
                    .replace("/", "")}
                </div>
                <motion.div
                  layoutId={`cta-${card.title}-${id}`}
                  className="absolute top-2 right-2 "
                >
                  <Button
                    variant="default_light"
                    rounded="full"
                    size="icon_sm"
                    asChild
                  >
                    <Link
                      href={card?.href || card?.link || "#"}
                      target="_blank"
                    >
                      <ArrowUpRight />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
            <motion.div
              layoutId={`description-${card.title}-${id}`}
              className="mt-auto flex flex-col p-2"
            >
              <div className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
                <Markdown>{card.description}</Markdown>
              </div>
              <CardContent className="mt-auto flex flex-col px-2">
                {card.tags && card.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {card.tags?.map((tag) => (
                      <Badge
                        className="px-1 py-0 text-[10px]"
                        variant="secondary"
                        key={tag}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
