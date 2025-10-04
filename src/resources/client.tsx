"use client";
import ResourceCard from "@/components/card.resource";
import { ResponsiveContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { ResourceFrontMatter } from "~/lib/markdown/mdx";

export function CategoryFilter({ categories }: { categories: string[] }) {
  const [category, setCategory] = useQueryState(
    "type",
    parseAsStringEnum(categories),
  );
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {["", ...categories].map((cat, index) => (
        <Button
          key={`category-${index}`}
          variant={category === cat ? "default_light" : "outline"}
          onClick={() => setCategory(cat)}
          rounded="full"
          size="sm"
        >
          {cat || "All Resources"}
        </Button>
      ))}
    </div>
  );
}

export function ResourcesList({
  resources,
  className,
  showImage,
}: {
  resources: ResourceFrontMatter[];
  className?: string;
  showImage?: boolean;
}) {
  const [category, _] = useQueryState(
    "category",
    parseAsStringEnum(resources.map((r) => r.category || "")),
  );

  const [tag] = useQueryState("tag");
  const [type] = useQueryState(
    "type",
    parseAsStringEnum(resources.map((r) => r.type || "")),
  );
  const [results, setResults] = useState<ResourceFrontMatter[]>([]);

  // Memoized Fuse.js instance

  useEffect(() => {
    let filteredResources: ResourceFrontMatter[] = [];

    if (category && category.trim() !== "") {
      filteredResources = filteredResources.filter(
        (resource) =>
          resource.category?.toLowerCase() === category.toLowerCase(),
      );
    }
    if (tag && tag.trim() !== "") {
      filteredResources = filteredResources.filter(
        (resource) =>
          Array.isArray(resource.tags) && resource.tags.includes(tag),
      );
    }
    if (type && type.trim() !== "") {
      filteredResources = filteredResources.filter(
        (resource) => resource.type?.toLowerCase() === type.toLowerCase(),
      );
    }
    setResults(filteredResources);
  }, [resources, category, tag, type]);

  return (
    <ResponsiveContainer
      className={cn(
        "px-3 pr-4 lg:px-6 @md:grid-cols-1 @5xl:grid-cols-3",
        className,
      )}
      role="list"
      aria-label="List of resources"
    >
      {results.map((frontmatter) => (
        <div key={frontmatter.slug} role="listitem">
          <ResourceCard
            {...frontmatter}
            type={frontmatter.type}
            title={frontmatter.title}
            slug={frontmatter.slug}
            summary={frontmatter.summary}
            tags={frontmatter.tags}
            coverImage={frontmatter.coverImage}
            date={frontmatter.date}
            readingTime={frontmatter.readingTime}
            category={frontmatter.category}
            showImage={showImage}
          />
        </div>
      ))}
    </ResponsiveContainer>
  );
}
