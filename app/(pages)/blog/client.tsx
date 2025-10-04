"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Image from "next/image";
import { PostType } from "~/api/medium";



type Props = {
  posts: PostType[];
  now: number;
};

export default function AnimatedMediumPosts({ posts, now }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-10 mx-auto max-w-4xl"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {posts.map((post) => (
        <motion.div
          key={post.link}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <PostCard post={post} now={now} />
        </motion.div>
      ))}
    </motion.div>
  );
}
function PostCard({
  post,
  now,
}: {
  post: PostType;
  now: number;
}) {
  const isRecent = now - post.pubDate.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <a
      className="group mx-auto flex max-w-3xl flex-col gap-4 border-b border-dashed py-10 px-3 lg:flex-row-reverse lg:items-center hover:bg-card/20 rounded-2xl transition"
      href={post.link}
      target="_blank"
      rel="noreferrer noopener"
    >
      {post.thumbnail && (
        <div className="relative z-1 h-44 w-full overflow-hidden rounded-sm lg:h-28 lg:w-48">
          <Image
            alt={post.title}
            src={post.thumbnail}
            // width={540}
            // height={480}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}
      <div className="w-full">
        <div className="flex items-center gap-3">
          <time
            className="text-muted-foreground text-xs"
            dateTime={post.pubDate.toISOString()}
          >
            {post.pubDate.toDateString()}
          </time>
          {isRecent && (
            <span className="rounded-sm bg-emerald-500/15 px-1.5 py-0.5 text-xs text-green-500">
              Recently released
            </span>
          )}
        </div>
        <h3 className="relative mt-3 text-xl font-bold">{post.title}</h3>
        <p className="mt-1 text-sm text-neutral-900 dark:text-white/75 line-clamp-3">
          {post.snippet}
        </p>
        <div className="mt-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Clock className="text-green-400 w-4 h-4" />
              <p className="text-xs whitespace-nowrap">{post.readingTime}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs lg:text-sm">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                className="inline-flex items-center justify-center border w-fit whitespace-nowrap shrink-0 gap-2 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-black dark:text-white font-mono border-white-3 dark:bg-neutral-900 dark:border-white/[0.14] bg-white-2 [a&]:hover:bg-primary/90 rounded-sm px-1.5 py-0.5 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
