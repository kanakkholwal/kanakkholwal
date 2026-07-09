"use client";

import { useCallback, useEffect, useRef } from "react";

// Narration is isolated behind this hook so the engine never touches the speech
// API directly. Swap the body for `<audio>` playback of TTS MP3s later without
// changing the player: keep `speak(text) => Promise<void>` and `cancel()`.
export function useNarration() {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const activeRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    activeRef.current = null;
  }, [supported]);

  const speak = useCallback(
    (text: string, volume = 1) =>
      new Promise<void>((resolve) => {
        if (!supported || !text) return resolve();
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;
        utterance.volume = volume;

        // Guard against `onend` never firing (it is unreliable across browsers
        // and absent in headless), so the play loop can't stall.
        let settled = false;
        const words = text.trim().split(/\s+/).length;
        const fallback = window.setTimeout(finish, words * 500 + 3000);
        function finish() {
          if (settled) return;
          settled = true;
          window.clearTimeout(fallback);
          resolve();
        }

        utterance.onend = finish;
        utterance.onerror = finish;
        activeRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }),
    [supported],
  );

  useEffect(() => cancel, [cancel]);

  return { supported, speak, cancel };
}
