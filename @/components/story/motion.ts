// Shared motion tokens so every story component eases the same way.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const springSoft = { type: "spring", stiffness: 260, damping: 28 } as const;
