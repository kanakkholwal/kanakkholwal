"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import { PostType } from "~/api/medium";

type Props = {
  posts: PostType[];
  now: number;
};

export default function AnimatedMediumPosts({ posts, now }: Props) {
  return (
    <motion.div
      className="flex flex-col gap-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
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

function PostCard({ post, now }: { post: PostType; now: number }) {
  const isRecent = now - post.pubDate.getTime() < 30 * 24 * 60 * 60 * 1000; // Extended recent to 30 days for blog cadence

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative grid md:grid-cols-[280px_1fr] gap-6 md:gap-8 p-6 rounded-3xl bg-card/30 hover:bg-card/80 border border-transparent hover:border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* 1. Thumbnail Section */}
      <div className="relative aspect-[16/9] md:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted border border-border/50">
        {post.thumbnail ? (
          <Image
            alt={post.title}
            src={post.thumbnail}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Fallback pattern if no image
           <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <span className="text-4xl font-mono opacity-10 font-bold">BLOG</span>
           </div>
        )}
        
        {/* Recent Badge (Overlay) */}
        {isRecent && (
           <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              New
           </div>
        )}
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col justify-between py-1">
        <div>
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-3">
             <div className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                <time dateTime={post.pubDate.toISOString()}>
                   {post.pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
             </div>
             <span className="h-3 w-[1px] bg-border" />
             <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-indigo-500" />
                <span>{post.readingTime || "5 min read"}</span>
             </div>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors mb-3">
            {post.title}
          </h3>

          {/* Snippet */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
            {post.snippet.replace(/<[^>]*>?/gm, '')} {/* Strip HTML tags if any */}
          </p>
        </div>

        {/* Footer: Tags & CTA */}
        <div className="flex items-center justify-between mt-6">
           <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                 <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="rounded-md px-2 py-0.5 text-[10px] font-mono font-normal bg-background border border-border/50 text-muted-foreground group-hover:border-primary/20 transition-colors"
                 >
                    #{tag}
                 </Badge>
              ))}
           </div>
           
           <div className="hidden md:flex items-center gap-1 text-xs font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Read Article <ArrowUpRight className="size-3" />
           </div>
        </div>
      </div>
    </a>
  );
}