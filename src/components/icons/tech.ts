import type { IconType } from "./schema";

export type TechInfo = {
  label: string;
  /** Brand colour, used for the hover wash. */
  hex: string;
  /** Black logos switch to white in dark mode. */
  adaptive?: boolean;
};

/** Brand data for the tools in `appConfig.skills` and project stacks; each key has a `tech-<key>` icon in icons.json. */
export const TECH: Record<string, TechInfo> = {
  react: { label: "React", hex: "#61DAFB" },
  nextjs: { label: "Next.js", hex: "#000000", adaptive: true },
  svelte: { label: "Svelte", hex: "#FF3E00" },
  typescript: { label: "TypeScript", hex: "#3178C6" },
  tailwindcss: { label: "Tailwind CSS", hex: "#06B6D4" },
  vite: { label: "Vite", hex: "#9135FF" },
  tauri: { label: "Tauri", hex: "#24C8D8" },
  sass: { label: "Sass", hex: "#CC6699" },
  bootstrap: { label: "Bootstrap", hex: "#7952B3" },
  html: { label: "HTML5", hex: "#E34F26" },
  css: { label: "CSS", hex: "#663399" },
  svg: { label: "SVG", hex: "#FFB13B" },
  nodejs: { label: "Node.js", hex: "#5FA04E" },
  go: { label: "Go", hex: "#00ADD8" },
  rust: { label: "Rust", hex: "#000000", adaptive: true },
  python: { label: "Python", hex: "#3776AB" },
  express: { label: "Express", hex: "#0A0A0A", adaptive: true },
  graphql: { label: "GraphQL", hex: "#E10098" },
  bun: { label: "Bun", hex: "#000000" },
  hono: { label: "Hono", hex: "#E36002" },
  postgres: { label: "PostgreSQL", hex: "#4169E1" },
  mongodb: { label: "MongoDB", hex: "#47A248" },
  redis: { label: "Redis", hex: "#FF4438" },
  firebase: { label: "Firebase", hex: "#DD2C00" },
  drizzle: { label: "Drizzle", hex: "#C5F74F" },
  docker: { label: "Docker", hex: "#2496ED" },
  gcp: { label: "Google Cloud", hex: "#4285F4" },
  vercel: { label: "Vercel", hex: "#000000", adaptive: true },
  cloudflare: { label: "Cloudflare", hex: "#F38020" },
  git: { label: "Git", hex: "#F03C2E" },
  github: { label: "GitHub", hex: "#181717", adaptive: true },
  turborepo: { label: "Turborepo", hex: "#FF1E56" },
  figma: { label: "Figma", hex: "#F24E1E" },
  notion: { label: "Notion", hex: "#000000", adaptive: true },
  postman: { label: "Postman", hex: "#FF6C37" },
  npm: { label: "npm", hex: "#CB3837" },
  pnpm: { label: "pnpm", hex: "#F69220" },
  yarn: { label: "Yarn", hex: "#2C8EBB" },
  ffmpeg: { label: "FFmpeg", hex: "#007808" },
  wasm: { label: "WebAssembly", hex: "#654FF0" },
  expo: { label: "Expo", hex: "#1C2024", adaptive: true },
  gemini: { label: "Google Gemini", hex: "#8E75B2" },
  d3: { label: "D3", hex: "#F9A03C" },
  markdown: { label: "Markdown", hex: "#000000", adaptive: true },
  shadcnui: { label: "shadcn/ui", hex: "#000000", adaptive: true },
  betterauth: { label: "Better Auth", hex: "#FFFFFF", adaptive: true },
  babyui: { label: "Baby UI", hex: "#151515", adaptive: true },
  docvia: { label: "Docvia", hex: "#7C3AED" },
  baseui: { label: "Base UI", hex: "#EDEDED", adaptive: true },
  tectonic: { label: "Tectonic", hex: "#3F7BFF" },
  azure: { label: "Azure", hex: "#0078D4" },
  llamaindex: { label: "LlamaIndex", hex: "#8B5CF6" },
  langchain: { label: "LangChain", hex: "#7FC8FF" },
  langfuse: { label: "Langfuse", hex: "#E11D48" },
  llamacpp: { label: "llama.cpp", hex: "#737373", adaptive: true },
  anthropic: { label: "Anthropic", hex: "#D97757", adaptive: true },
  mistral: { label: "Mistral", hex: "#FA520F" },
  deepseek: { label: "DeepSeek", hex: "#4D6BFE" },
  openrouter: { label: "OpenRouter", hex: "#6467F2" },
  sqs: { label: "Amazon SQS", hex: "#FF4F8B" },
  harness: { label: "Harness", hex: "#00ADE4" },
  latex: { label: "LaTeX", hex: "#008080" },
  openai: { label: "OpenAI API", hex: "#412991", adaptive: true },
  stt: { label: "Speech-to-text", hex: "#737373", adaptive: true },
  tts: { label: "Text-to-speech", hex: "#737373", adaptive: true },
  cicd: { label: "CI/CD", hex: "#737373", adaptive: true },
  supabase: { label: "Supabase", hex: "#3ECF8E" },
  mcp: { label: "MCP", hex: "#000000", adaptive: true },
  aisdk: { label: "Vercel AI SDK", hex: "#000000", adaptive: true },
  pytorch: { label: "PyTorch", hex: "#EE4C2C" },
  huggingface: { label: "Hugging Face", hex: "#FFD21E" },
  ollama: { label: "Ollama", hex: "#000000", adaptive: true },
  langgraph: { label: "LangGraph", hex: "#7FC8FF" },
  tanstack: { label: "TanStack", hex: "#000000", adaptive: true },
  vitest: { label: "Vitest", hex: "#6E9F18" },
  biome: { label: "Biome", hex: "#60A5FA" },
  trpc: { label: "tRPC", hex: "#2596BE" },
  grpc: { label: "gRPC", hex: "#244C5A" },
  sqlite: { label: "SQLite", hex: "#003B57" },
  neon: { label: "Neon", hex: "#00E599" },
  grafana: { label: "Grafana", hex: "#F46800" },
  socketio: { label: "Socket.IO", hex: "#000000", adaptive: true },
  mongoose: { label: "Mongoose", hex: "#880000" },
  framer: { label: "Framer Motion", hex: "#0055FF", adaptive: true },
  reactemail: { label: "React Email", hex: "#737373", adaptive: true },
  nodemailer: { label: "Nodemailer", hex: "#737373", adaptive: true },
  resend: { label: "Resend", hex: "#000000", adaptive: true },
  brevo: { label: "Brevo", hex: "#0B996E" },
  sveltekit: { label: "SvelteKit", hex: "#FF3E00" },
};

export const techIcon = (slug: string) => `tech-${slug}` as IconType;

const ALIASES: Record<string, string> = {
  sveltekit: "svelte",
  svelterunes: "svelte",
  svelte5runes: "svelte",
  reactjs: "react",
  reactnative: "react",
  expressjs: "express",
  node: "nodejs",
  postgresql: "postgres",
  webassembly: "wasm",
  tailwind: "tailwindcss",
  tailwindcssv: "tailwindcss",
  cloudflareworkers: "cloudflare",
  cloudflareapi: "cloudflare",
  googlecloud: "gcp",
  npmpackage: "npm",
  vercelaisdk: "aisdk",
  framermotion: "framer",
  openaiapi: "openai",
};

/** Maps a free-text name from content ("Next.js 15", "Svelte 5") to a `TECH` key, or null. */
export function techSlug(name: string): string | null {
  const full = name.toLowerCase().replace(/[\s._/-]+/g, "");
  // Full name first so "d3" survives; then without a version suffix ("Next.js 15").
  for (const key of [full, full.replace(/\d+$/, "")]) {
    if (key in TECH) return key;
    const alias = ALIASES[key];
    if (alias && alias in TECH) return alias;
  }
  return null;
}
