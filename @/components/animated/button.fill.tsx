import { cn } from "@/lib/utils";

export function GlowFillButton(
  props: React.ComponentProps<"button"> & {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  },
) {
  return (
    <button
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-between overflow-hidden rounded-full border border-black/30 bg-black/20 py-[3px] pr-[3px] pl-2 text-base font-medium opacity-85 backdrop-blur-xs transition-all hover:bg-transparent md:py-1 md:pr-1 md:pl-3 dark:border-white/10 dark:bg-white/10 my-10 group-hover:scale-125",
        props.className,
      )}
    >
      <span className="z-10 px-3 text-black transition-colors duration-300 group-hover:text-white dark:text-white dark:group-hover:text-black">
        {props.children}
      </span>
      <span className="absolute inset-0 translate-x-[45%] scale-0 rounded-full bg-black opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 dark:bg-white" />
      <span className="z-10 flex items-center justify-center overflow-hidden rounded-full bg-black p-2 transition-colors duration-300 group-hover:bg-transparent md:p-2.5 dark:bg-white">
        <props.icon
          className="lucide lucide-arrow-right text-white transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-0 dark:text-black"
          aria-hidden="true"
        />

        <props.icon
          className="lucide lucide-arrow-right absolute -translate-x-5 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:text-black"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
