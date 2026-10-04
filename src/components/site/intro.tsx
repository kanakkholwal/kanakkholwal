import { Image } from "@unpic/react";
import { type CSSProperties, useEffect, useState } from "react";
import { appConfig } from "root/project.config";

const GREETINGS = ["Hello", "नमस्ते", "Bonjour", "Hola", "こんにちは", "Ciao", "Hallo"];
// 3x the rendered 48px so it stays sharp on high-density screens.
const AVATAR = `https://avatars.githubusercontent.com/${appConfig.usernames.github}?s=256`;

// One timeline, shared with CSS through custom properties so it runs from first paint, before hydration.
const WORD_MS = 190;
const NAME_MS = 750;
const LIFT_MS = 700;
const GREET_END = GREETINGS.length * WORD_MS;
const LIFT_AT = GREET_END + NAME_MS;
export const INTRO_END_MS = LIFT_AT + LIFT_MS;

const SEEN_KEY = "intro";

/** Runs in <head>: a returning visitor in the same session never sees the intro, not even for a frame. */
export const INTRO_BOOT_SCRIPT = `try{if(sessionStorage.getItem("${SEEN_KEY}"))document.documentElement.classList.add("intro-done")}catch(e){document.documentElement.classList.add("intro-done")}`;

const TIMELINE = {
  "--intro-word": `${WORD_MS}ms`,
  "--intro-greet-end": `${GREET_END}ms`,
  "--intro-lift-at": `${LIFT_AT}ms`,
  "--intro-lift": `${LIFT_MS}ms`,
  "--intro-end": `${INTRO_END_MS}ms`,
} as CSSProperties;

/** First-visit greeting: hello in a few languages, the name, then the page lifts into view. */
export function Intro() {
  const [gone, setGone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const finish = () => {
      root.classList.add("intro-done");
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setGone(true);
    };
    if (root.classList.contains("intro-done")) return setGone(true);
    // The CSS clock started at navigation, so hydrating late only shortens what's left.
    const timer = setTimeout(finish, Math.max(0, INTRO_END_MS - performance.now()));
    const skip = () => {
      clearTimeout(timer);
      setSkipped(true);
      setTimeout(finish, LIFT_MS);
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="intro"
      aria-hidden="true"
      data-skipped={skipped || undefined}
      style={TIMELINE}
      className="fixed inset-0 z-[100] grid cursor-pointer select-none place-items-center bg-background text-foreground"
    >
      <p className="intro-greet col-start-1 row-start-1 flex items-center gap-3 font-medium text-3xl tracking-tight">
        <span className="size-2.5 rounded-full bg-primary" />
        <span className="grid">
          {GREETINGS.map((word, i) => (
            <span
              key={word}
              className="intro-word col-start-1 row-start-1 whitespace-nowrap"
              style={{ "--intro-i": i } as CSSProperties}
            >
              {word}
            </span>
          ))}
        </span>
      </p>
      <div className="intro-name col-start-1 row-start-1 flex items-center gap-3">
        <Image src={AVATAR} alt="avatar" width={48} height={48} className="size-12 rounded-full object-cover" />
        <span className="pixel text-4xl">kanak.</span>
      </div>
    </div>
  );
}
