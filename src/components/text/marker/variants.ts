import { tv, type VariantProps } from "tailwind-variants";

export const marker = tv({
	slots: {
		root: "relative inline-block whitespace-nowrap",
		content: "",
		decoration: "pointer-events-none absolute",
		bar: "",
	},
	variants: {
		variant: {
			wavy: { decoration: "bottom-[-0.4em] left-[-2%] h-[0.7em] w-[104%]" },
			circle: {
				root: "px-1",
				decoration: "inset-[-0.6em_-0.55em] h-[calc(100%+1.2em)] w-[calc(100%+1.1em)]",
			},
			highlight: {
				content: "relative z-10",
				decoration: "inset-x-[-4%] bottom-[-0.08em] z-0 h-[1.15em] w-[108%] opacity-40",
			},
			underline: { decoration: "bottom-[-0.32em] left-[-1%] h-[0.5em] w-[102%]" },
			line: {
				decoration: "bottom-[-0.18em] left-[-1%] block h-[2px] w-[102%]",
				bar: "block size-full rounded-full bg-current",
			},
			"dotted-underline": {
				decoration: "bottom-[-0.35em] left-[-1%] block h-[0.55em] w-[102%]",
				bar: "block size-full bg-[radial-gradient(circle,currentColor_1.5px,transparent_1.5px)] bg-size-[0.5em_100%] bg-position-[0_100%] bg-repeat-x",
			},
			"double-underline": { decoration: "bottom-[-0.5em] left-[-1%] h-[0.7em] w-[102%]" },
			strikethrough: {
				decoration: "top-1/2 left-[-1%] h-[0.5em] w-[102%] -translate-y-1/2",
			},
			"cross-out": {
				decoration: "top-1/2 left-[-2%] h-[1.4em] w-[104%] -translate-y-1/2",
			},
			arrow: { decoration: "bottom-[-0.45em] left-[-1%] h-[0.8em] w-[106%]" },
			bracket: {
				root: "px-[0.35em]",
				decoration:
					"inset-y-[-0.25em] left-[-0.15em] h-[calc(100%+0.5em)] w-[calc(100%+0.3em)]",
			},
			box: {
				root: "px-[0.4em]",
				decoration: "inset-[-0.4em] h-[calc(100%+0.8em)] w-[calc(100%+0.8em)]",
			},
		},
		tone: {
			auto: {},
			primary: { decoration: "text-primary" },
			muted: { decoration: "text-muted-foreground" },
			info: { decoration: "text-(--info)" },
			success: { decoration: "text-(--success)" },
			warning: { decoration: "text-(--warning)" },
			destructive: { decoration: "text-(--destructive)" },
			accent: { decoration: "text-(--chart-3)" },
		},
	},
	compoundVariants: [
		{ tone: "auto", variant: ["wavy"], class: { decoration: "text-(--chart-5)" } },
		{
			tone: "auto",
			variant: ["circle", "arrow"],
			class: { decoration: "text-(--info)" },
		},
		{ tone: "auto", variant: ["highlight"], class: { decoration: "text-(--warning)" } },
		{ tone: "auto", variant: ["underline"], class: { decoration: "text-primary" } },
		{
			tone: "auto",
			variant: ["line", "dotted-underline", "bracket"],
			class: { decoration: "text-muted-foreground" },
		},
		{
			tone: "auto",
			variant: ["double-underline"],
			class: { decoration: "text-(--success)" },
		},
		{
			tone: "auto",
			variant: ["strikethrough", "cross-out"],
			class: { decoration: "text-(--destructive)" },
		},
		{ tone: "auto", variant: ["box"], class: { decoration: "text-(--chart-2)" } },
	],
	defaultVariants: { variant: "wavy", tone: "auto" },
});

export type MarkerVariant = NonNullable<VariantProps<typeof marker>["variant"]>;
export type MarkerTone = NonNullable<VariantProps<typeof marker>["tone"]>;

type Stroke = {
	d: string;
	width: number;
	/** Which roughness filter the stroke goes through. */
	rough: "hard" | "soft";
	opacity?: number;
	/** Draws 160ms after the first stroke. */
	second?: boolean;
	join?: "round";
};

/** How each style draws: SVG strokes, a filled SVG shape swept in, or an HTML bar swept in. */
export type MarkerShape =
	| { kind: "strokes"; viewBox: string; strokes: Stroke[] }
	| { kind: "fill"; viewBox: string; d: string }
	| { kind: "bar" };

/** Hand-drawn paths per style. */
export const MARKER_SHAPES: Record<MarkerVariant, MarkerShape> = {
	wavy: {
		kind: "strokes",
		viewBox: "0 0 140 14",
		strokes: [
			{
				d: "M2,6 Q5.5,3 9,6 T17,6 T25,6 T33,6 T41,6 T49,6 T57,6 T65,6 T73,6 T81,6 T89,6 T97,6 T105,6 T113,6 T121,6 T129,6 T137,6",
				width: 2.2,
				rough: "soft",
			},
		],
	},
	circle: {
		kind: "strokes",
		viewBox: "0 0 220 64",
		strokes: [
			{
				d: "M40,40 C20,23 53,7 102,5 C153,3 207,11 211,29 C215,47 167,60 109,60 C59,60 15,53 19,35 C21,27 27,22 37,20",
				width: 3,
				rough: "hard",
			},
			{
				d: "M43,37 C28,25 58,9 105,7 C151,6 199,14 206,29 C212,45 167,57 110,58",
				width: 1.5,
				rough: "soft",
				opacity: 0.55,
				second: true,
			},
		],
	},
	highlight: {
		kind: "fill",
		viewBox: "0 0 170 26",
		d: "M4,17 C2,11 5,7 12,6 C45,2 95,2 138,4 C152,5 164,7 166,13 C167,18 163,21 155,22 C112,24 60,24 16,22 C8,21.5 4,20 4,17 Z",
	},
	underline: {
		kind: "strokes",
		viewBox: "0 0 140 10",
		strokes: [{ d: "M3,6 C40,3 100,3 137,5", width: 2.4, rough: "soft" }],
	},
	line: { kind: "bar" },
	"dotted-underline": { kind: "bar" },
	"double-underline": {
		kind: "strokes",
		viewBox: "0 0 140 16",
		strokes: [
			{ d: "M3,5 C40,2 100,2 137,4", width: 2.2, rough: "soft" },
			{
				d: "M5,12 C42,9 98,10 135,11",
				width: 1.8,
				rough: "soft",
				opacity: 0.75,
				second: true,
			},
		],
	},
	strikethrough: {
		kind: "strokes",
		viewBox: "0 0 140 10",
		strokes: [{ d: "M3,5 C40,7 100,3 137,5", width: 2.4, rough: "soft" }],
	},
	"cross-out": {
		kind: "strokes",
		viewBox: "0 0 140 40",
		strokes: [
			{ d: "M4,32 C40,10 96,30 136,8", width: 2.4, rough: "hard" },
			{
				d: "M6,10 C44,30 92,12 134,30",
				width: 2,
				rough: "soft",
				opacity: 0.7,
				second: true,
			},
		],
	},
	arrow: {
		kind: "strokes",
		viewBox: "0 0 150 18",
		strokes: [
			{ d: "M3,7 C45,3 105,4 140,8", width: 2.4, rough: "soft" },
			{
				d: "M132,3 L142,8 L131,13",
				width: 2.4,
				rough: "soft",
				second: true,
				join: "round",
			},
		],
	},
	bracket: {
		kind: "strokes",
		viewBox: "0 0 160 60",
		strokes: [
			{ d: "M18,6 C9,7 6,12 6,30 C6,48 9,53 18,54", width: 2.6, rough: "hard" },
			{
				d: "M142,6 C151,7 154,12 154,30 C154,48 151,53 142,54",
				width: 2.6,
				rough: "hard",
				second: true,
			},
		],
	},
	box: {
		kind: "strokes",
		viewBox: "0 0 200 64",
		strokes: [
			{
				d: "M12,10 C60,6 140,6 188,10 C193,26 193,40 188,54 C140,58 60,58 12,54 C7,40 7,26 12,10 Z",
				width: 2.6,
				rough: "hard",
				join: "round",
			},
		],
	},
};

/** Gap before a style's second stroke. */
export const MARKER_STAGGER_MS = 160;
