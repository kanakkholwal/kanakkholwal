/* eslint-disable @next/next/no-img-element */


import { appConfig } from "root/project.config";
import { ProjectType } from "~/data/projects";

// --- TYPES ---
interface BaseTemplateProps {
  siteName?: string;
  authorName?: string;
  authorImage?: string;
  isDark?: boolean;
}
interface PortfolioTemplateProps extends BaseTemplateProps {
  title?: string;
  role?: string;
  techStack?: string[];
  status?: string;
}

interface ArticleTemplateProps extends BaseTemplateProps {
  title: string;
  date?: string;
  meta?: string; // Reading time, category, etc.
  tags?: string[];
}




const SharedLayout = ({ children, isDark = false }: { children: React.ReactNode; isDark?: boolean }) => (
  <div
    tw={`flex flex-col w-full h-full relative overflow-hidden ${isDark ? 'bg-[#09090b]' : 'bg-white'}`}
  >
    <div
      tw="absolute inset-0 bg-transparent"
      style={{
        // Uses a crisp white alpha for dark mode (tech/blueprint look) instead of muddy grey
        backgroundImage: `linear-gradient(${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb'} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        opacity: isDark ? 1 : 0.6, // Full opacity in dark mode for crisp lines, lower in light mode
      }}
    />

    <div tw="flex flex-col w-full h-full p-16 relative z-10 justify-between">
      {children}
    </div>

    <div tw={`absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-50 ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`} />
  </div>
);

export const ArticleOgTemplate = ({
  siteName = appConfig.url.replace("https://", ""),
  title,
  date,
  meta,
  tags = [],
  authorName = appConfig.name,
  authorImage = appConfig.logo,
  isDark = false,
}: ArticleTemplateProps) => (
  <SharedLayout isDark={isDark}>

    <div tw={`flex items-center justify-between w-full border-b pb-6 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
      <div tw="flex items-center">
        <div tw={`w-2 h-2 rounded-full mr-3 ${isDark ? 'bg-white' : 'bg-black'}`} />
        <span
          tw={`text-sm font-bold uppercase tracking-[0.2em] ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          {siteName}
        </span>
      </div>

      <div tw={`flex items-center text-sm font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        {date && <span tw="mr-4">{date}</span>}
        {meta && (
          <div tw="flex items-center">
            <span tw={`mr-4 ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>/</span>
            <span>{meta}</span>
          </div>
        )}
      </div>
    </div>

    <div tw="flex flex-col justify-center flex-grow py-8 relative">

      <div
        tw={`absolute top-0 -left-4 text-9xl font-black -z-10 ${isDark ? 'text-zinc-900' : 'text-zinc-50'}`}
        style={{ fontFamily: 'Inter' }}
      >
        01
      </div>

      <h1 tw={`text-7xl font-bold leading-[1.1] tracking-tight m-0 line-clamp-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
        {title}
      </h1>

      {tags.length > 0 && (
        <div tw="flex flex-wrap mt-8">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              tw={`px-3 py-1 mr-2 border rounded-md text-sm font-medium ${isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                : 'bg-zinc-50 border-zinc-100 text-zinc-500'
                }`}
              style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>

    <div tw="flex items-end justify-between w-full">

      <div tw="flex flex-col">
        <span tw={`text-xs font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-zinc-600' : 'text-zinc-300'}`}>
          Read the full article at
        </span>
        <span tw={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {appConfig.url}/docs/...
        </span>
      </div>

      <div tw={`flex items-center pl-6 py-2 pr-2 border rounded-full shadow-sm ${isDark
        ? 'bg-zinc-900 border-zinc-800'
        : 'bg-white border-zinc-100'
        }`}>

        <div tw="flex flex-col items-end justify-center mr-3">
          <span tw={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
            {authorName}
          </span>
          <span
            tw={`text-[10px] uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Author
          </span>
        </div>

        {authorImage && (
          <img
            src={authorImage}
            width="42"
            height="42"
            tw={`rounded-full border ${isDark ? 'bg-zinc-800 border-zinc-800' : 'bg-zinc-100 border-zinc-100'}`}
            alt={authorName}
          />
        )}
      </div>

    </div>
  </SharedLayout>
);


export const PortfolioOgTemplate = ({
  siteName = appConfig.url.replace("https://", ""),
  title = appConfig.name,
  role = "Full Stack Engineer",
  status = "Open for Opportunities",
  techStack = ["Next.js", "TypeScript", "System Design"],
}: PortfolioTemplateProps) => (
  <SharedLayout>
    {/* Top Row: Brand & Status */}
    <div tw="flex items-center justify-between w-full">
      <div tw="flex items-center gap-2">
        <div tw="w-3 h-3 bg-black rounded-full mr-2" />
        <span tw="text-xl font-semibold text-zinc-900 tracking-tight uppercase">
          {siteName}
        </span>
      </div>
      <div tw="flex items-center px-4 py-1 border border-zinc-200 rounded-full bg-zinc-50">
        <div tw="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
        <span tw="text-sm font-medium text-zinc-600 uppercase tracking-wide">
          {status}
        </span>
      </div>
    </div>

    {/* Middle: Hero Typography */}
    <div tw="flex flex-col items-center justify-center gap-0">
      <h1 tw="text-8xl font-black text-black m-0 tracking-tighter leading-none">
        {title}
      </h1>
      <div tw="flex items-center gap-4 mt-4">
        <span tw="h-px w-12 bg-zinc-300" />
        <span
          tw="text-5xl text-zinc-500 italic font-normal"
          style={{ fontFamily: 'Instrument Serif' }}
        >
          {role}
        </span>
        <span tw="h-px w-12 bg-zinc-300" />
      </div>
    </div>

    {/* Bottom: Stack */}
    <div tw="flex items-center justify-center w-full">
      <div tw="flex gap-8">
        {techStack.map((tech, i) => (
          <span key={i} tw="text-zinc-400 text-xl font-medium uppercase tracking-widest mr-1 last:mr-0">
            {tech}
          </span>
        ))}
      </div>
    </div>
  </SharedLayout>
);

// --- NEW TYPES ---
interface ProjectTemplateProps extends BaseTemplateProps,
  Pick<ProjectType, 'description' | 'dates' | 'status' | 'metrics'> {
  title: string;
  year?: string;
}

interface TopicTemplateProps extends BaseTemplateProps {
  topic: string; // e.g. "React" or "System Design"
  count?: number; // e.g. "12 Articles"
}

// Aesthetic: Biometric Scan / Technical Dossier
export const PortfolioProfileTemplate = ({
  siteName = "KANAK.DEV",
  title = appConfig.name,
  role = "Full Stack Engineer",
  status = "ONLINE :: OPEN FOR WORK",
  techStack = ["Next.js", "TypeScript", "Cloud Architecture"],
  authorImage = appConfig.logo, // Ensure this is an absolute URL
}: PortfolioTemplateProps) => (
  <SharedLayout>


    <div tw="flex flex-row w-full h-full items-center justify-between">

      {/* LEFT COL: Image Area 
         FIX: Added 'flex' and 'shrink-0' explicit styling.
         Reduced width slightly to 380px to ensure fit.
      */}
      <div tw="flex relative w-[380px] h-[380px] shrink-0 mr-12">

        {/* Decorative Corners (Absolute) */}
        <div tw="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-zinc-400" />
        <div tw="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-zinc-400" />

        {/* Image Container */}
        <div tw="flex w-full h-full border-4 border-black bg-zinc-200 relative overflow-hidden">
          {authorImage ? (
            <img
              src={authorImage}
              width="512"
              height="512"
              tw="w-full h-full object-cover"
              alt="Profile"
            />
          ) : (
            <div tw="flex items-center justify-center w-full h-full text-zinc-400 font-bold text-xl uppercase tracking-widest font-mono">
              NO_DATA
            </div>
          )}

          {/* Scan Line Overlay */}
          <div tw="absolute inset-0 bg-black opacity-10" />
          <div
            tw="absolute top-[80%] left-0 right-0 h-1 bg-emerald-500 opacity-60"
          />
        </div>

        {/* Caption below image */}
        <div
          tw="absolute -bottom-10 left-0 flex w-full justify-between text-xs text-zinc-500 font-bold uppercase tracking-widest"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          <span>ID: {siteName.substring(0, 5)}</span>
          <span>VERIFIED</span>
        </div>
      </div>

      {/* RIGHT COL: Personal Data Block */}
      <div tw="flex flex-col flex-grow h-full justify-center gap-8 pl-5">

        {/* Header & Status */}
        <div tw="flex flex-col items-start gap-4">
          <div
            tw="flex items-center px-3 py-1 bg-black text-white text-sm font-medium rounded-sm uppercase tracking-wider"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            <div tw="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
            {status}
          </div>
        </div>

        {/* Name & Role Typography */}
        <div tw="flex flex-col">
          {/* Splitting name for stylistic stacking if multiple words */}
          <h1 tw="text-8xl font-black text-black m-0 leading-[0.9] tracking-tighter uppercase">
            {title.split(" ")[0]}
          </h1>
          <h1 tw="text-8xl font-black text-zinc-300 m-0 leading-[0.9] tracking-tighter uppercase">
            {title.split(" ").slice(1).join(" ")}
          </h1>

          <div tw="mt-4 flex items-center gap-4">
            <div tw="h-[2px] w-16 bg-black mr-4" />
            <span
              tw="text-4xl text-zinc-600 italic"
              style={{ fontFamily: 'Instrument Serif' }}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Tech Stack List (Technical Specs style) */}
        <div tw="flex flex-col gap-2 mt-4 border-t border-zinc-300 pt-6">
          <span
            tw="text-xs text-zinc-400 uppercase tracking-widest mb-2"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Technical Specifications
          </span>
          <div tw="flex flex-wrap gap-3" style={{ fontFamily: 'JetBrains Mono' }}>
            {techStack.map((tech, i) => (
              <span key={i} tw="text-lg font-bold text-black flex items-center">
                <span tw="text-zinc-300 mr-2">/</span>
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  </SharedLayout>
);

// --- TEMPLATE 3: PROJECT CASE STUDY ---
export const ProjectOgTemplate = ({
  siteName = "CASE STUDY",
  title,
  description,
  dates = new Date().getFullYear().toString(),
  status = "Shipped",
  metrics = [],
}: ProjectTemplateProps) => (
  <SharedLayout>

    {/* Top: Status Header */}
    <div tw="flex justify-between items-center w-full border-b-2 border-zinc-900 pb-4">
      <div tw="flex items-center gap-3">
        <div
          tw={`w-3 h-3 rounded-full mr-3 ${status === "Shipped" ? "bg-emerald-500" : "bg-amber-500"}`}
        />
        <span
          tw="text-xl font-bold uppercase tracking-widest text-black"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          {status} {`//`} {dates}
        </span>
      </div>
      <span tw="text-zinc-400 font-bold tracking-widest uppercase text-xl">
        {siteName}
      </span>
    </div>

    {/* Middle: Project Identity */}
    <div tw="flex flex-col flex-grow justify-center gap-6">
      <h1 tw="text-8xl font-black text-black m-0 tracking-tighter uppercase leading-[0.9]">
        {title}
      </h1>
      <p
        tw="text-4xl text-zinc-500 italic m-0 max-w-3xl leading-tight"
        style={{ fontFamily: 'Instrument Serif' }}
      >
        {description}
      </p>
    </div>

    {/* Bottom: Metrics Grid (The "Senior Engineer" Flex) */}
    {metrics.length > 0 ? (
      <div tw="flex w-full border-t border-zinc-300 pt-6">
        {metrics.map((metric, i) => (
          <div key={i} tw="flex flex-col w-1/3 border-l border-zinc-200 pl-6 first:border-l-0 first:pl-0">
            <span
              tw="text-sm text-zinc-400 uppercase tracking-widest mb-1"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              {metric.label}
            </span>
            <span tw="text-3xl font-bold text-black">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    ) : (
      // Fallback visual if no metrics
      <div tw="flex items-center gap-2 text-zinc-300">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} tw="h-2 w-2 rounded-full bg-zinc-200" />
        ))}
      </div>
    )}
  </SharedLayout>
);

// --- TEMPLATE 4: TOPIC / TAG AGGREGATION ---
export const TopicOgTemplate = ({
  topic,
  count,
  siteName = "KNOWLEDGE BASE",
}: TopicTemplateProps) => (
  <SharedLayout>

    {/* Background Giant Text (Watermark) */}
    <div
      tw="absolute -bottom-20 -right-20 text-[300px] font-black text-zinc-100 opacity-60 z-0 leading-none whitespace-nowrap"
      style={{ transform: 'rotate(-10deg)' }}
    >
      {topic}
    </div>

    {/* Top: Breadcrumb */}
    <div
      tw="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest"
      style={{ fontFamily: 'JetBrains Mono' }}
    >
      <span tw="text-black">{siteName}</span>
      <span>/</span>
      <span>Index</span>
    </div>

    {/* Center: The Topic */}
    <div tw="relative z-10 flex flex-col justify-center h-full">
      <div tw="flex items-start">
        <span tw="text-9xl text-indigo-600 mr-4 font-light">#</span>
        <h1 tw="text-9xl font-black text-black m-0 tracking-tighter uppercase leading-none">
          {topic}
        </h1>
      </div>

      <div tw="flex items-center gap-4 mt-6">
        <div tw="h-px w-20 bg-black" />
        <span
          tw="text-4xl text-zinc-600 italic"
          style={{ fontFamily: 'Instrument Serif' }}
        >
          Curated Resources
        </span>
      </div>
    </div>

    {/* Bottom: Counter Badge */}
    <div tw="relative z-10 border-t-2 border-black pt-4 flex justify-between items-end">
      <div tw="flex flex-col">
        <span
          tw="text-sm text-zinc-400 uppercase tracking-widest"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          Total Entries
        </span>
        <span tw="text-6xl font-bold text-black leading-none mt-2">
          {count ? count.toString().padStart(2, '0') : "00"}
        </span>
      </div>

      {/* Decorative Arrow */}
      <div tw="text-6xl text-zinc-200">
        ↘
      </div>
    </div>
  </SharedLayout>
);
