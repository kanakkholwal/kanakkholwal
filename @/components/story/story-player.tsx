"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";
import { useNarration } from "./use-narration";

// Drop a loop here (e.g. "/story/ambient.mp3") to enable the music bed. Left
// null so there is no 404 until a track exists; ducking/mute are wired either way.
const MUSIC_SRC: string | null = null;
const MUSIC_VOLUME = 0.35;
const MUSIC_DUCKED = 0.12;

type BeatRegistration = { id: string; el: HTMLElement; text: string };
type PlayStatus = "idle" | "playing" | "paused";

type StoryPlayerValue = {
  mode: "explore" | "play";
  status: PlayStatus;
  activeBeatId: string | null;
  muted: boolean;
  progress: { index: number; total: number };
  registerBeat: (beat: BeatRegistration) => () => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggleMute: () => void;
};

const StoryPlayerContext = createContext<StoryPlayerValue | null>(null);

export function useStoryPlayer() {
  const ctx = useContext(StoryPlayerContext);
  if (!ctx) throw new Error("useStoryPlayer must be used inside <StoryPlayer>");
  return ctx;
}

export function StoryPlayer({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const { speak, cancel } = useNarration();

  const beats = useRef(new Map<string, BeatRegistration>());
  const runId = useRef(0);
  const cursor = useRef(0);
  const mutedRef = useRef(false);
  const musicRef = useRef<HTMLAudioElement>(null);

  const [mode, setMode] = useState<"explore" | "play">("explore");
  const [status, setStatus] = useState<PlayStatus>("idle");
  const [activeBeatId, setActiveBeatId] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState({ index: 0, total: 0 });

  const registerBeat = useCallback((beat: BeatRegistration) => {
    beats.current.set(beat.id, beat);
    return () => {
      beats.current.delete(beat.id);
    };
  }, []);

  const orderedBeats = () =>
    [...beats.current.values()].sort(
      (a, b) =>
        a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top,
    );

  const scrollToBeat = useCallback(
    (el: HTMLElement) =>
      new Promise<void>((resolve) => {
        const offset = -Math.max(0, (window.innerHeight - el.clientHeight) / 2);
        if (!lenis || reduce) {
          el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
          window.setTimeout(resolve, reduce ? 0 : 650);
          return;
        }
        lenis.scrollTo(el, { offset, duration: 1.1, onComplete: () => resolve() });
      }),
    [lenis, reduce],
  );

  const setMusicPlaying = useCallback((playing: boolean) => {
    const audio = musicRef.current;
    if (!audio) return;
    audio.volume = mutedRef.current ? 0 : MUSIC_VOLUME;
    if (playing) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const duck = useCallback((ducked: boolean) => {
    const audio = musicRef.current;
    if (audio) audio.volume = mutedRef.current ? 0 : ducked ? MUSIC_DUCKED : MUSIC_VOLUME;
  }, []);

  const stop = useCallback(() => {
    runId.current += 1;
    cancel();
    setMusicPlaying(false);
    lenis?.start();
    setStatus("idle");
    setMode("explore");
    setActiveBeatId(null);
  }, [cancel, lenis, setMusicPlaying]);

  const runFrom = useCallback(
    async (start: number) => {
      const list = orderedBeats();
      if (!list.length) return;
      const myRun = (runId.current += 1);
      setStatus("playing");
      for (let i = start; i < list.length; i++) {
        if (runId.current !== myRun) return;
        cursor.current = i;
        setActiveBeatId(list[i].id);
        setProgress({ index: i, total: list.length });
        await scrollToBeat(list[i].el);
        if (runId.current !== myRun) return;
        duck(true);
        await speak(list[i].text, mutedRef.current ? 0 : 1);
        duck(false);
        if (runId.current !== myRun) return;
        await new Promise((r) => window.setTimeout(r, 280));
      }
      if (runId.current === myRun) stop();
    },
    [duck, scrollToBeat, speak, stop],
  );

  const play = useCallback(() => {
    setMode("play");
    setMusicPlaying(true);
    runFrom(0);
  }, [runFrom, setMusicPlaying]);

  const pause = useCallback(() => {
    runId.current += 1;
    cancel();
    setMusicPlaying(false);
    setStatus("paused");
  }, [cancel, setMusicPlaying]);

  const resume = useCallback(() => {
    setMusicPlaying(true);
    runFrom(cursor.current);
  }, [runFrom, setMusicPlaying]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      const audio = musicRef.current;
      if (audio) audio.volume = next ? 0 : MUSIC_VOLUME;
      return next;
    });
  }, []);

  useEffect(() => stop, [stop]);

  return (
    <StoryPlayerContext.Provider
      value={{ mode, status, activeBeatId, muted, progress, registerBeat, play, pause, resume, stop, toggleMute }}
    >
      {children}
      {MUSIC_SRC && <audio ref={musicRef} src={MUSIC_SRC} loop preload="auto" />}
      <PlayerBar
        status={status}
        muted={muted}
        progress={progress}
        onPlay={play}
        onPause={pause}
        onResume={resume}
        onStop={stop}
        onToggleMute={toggleMute}
      />
    </StoryPlayerContext.Provider>
  );
}

function PlayerBar({
  status,
  muted,
  progress,
  onPlay,
  onPause,
  onResume,
  onStop,
  onToggleMute,
}: {
  status: PlayStatus;
  muted: boolean;
  progress: { index: number; total: number };
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onToggleMute: () => void;
}) {
  const playing = status === "playing";
  const active = status !== "idle";
  const pct = progress.total ? ((progress.index + 1) / progress.total) * 100 : 0;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <motion.div
        layout
        className="flex items-center gap-1 rounded-full border border-border/60 bg-card/80 p-1.5 shadow-lg backdrop-blur-md"
      >
        {!active ? (
          <button
            type="button"
            onClick={onPlay}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Play className="size-4 fill-current" />
            Play the story
          </button>
        ) : (
          <>
            <IconButton
              label={playing ? "Pause" : "Resume"}
              onClick={playing ? onPause : onResume}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
            </IconButton>

            <div className="flex items-center gap-2 px-2">
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {String(progress.index + 1).padStart(2, "0")}/{String(progress.total).padStart(2, "0")}
              </span>
              <div className="h-1 w-24 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${pct}%` }}
                  transition={{ ease: EASE, duration: 0.4 }}
                />
              </div>
            </div>

            <IconButton label={muted ? "Unmute" : "Mute"} onClick={onToggleMute}>
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </IconButton>
            <IconButton label="Exit story" onClick={onStop}>
              <X className="size-4" />
            </IconButton>
          </>
        )}
      </motion.div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-full text-muted-foreground",
        "transition-colors hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
