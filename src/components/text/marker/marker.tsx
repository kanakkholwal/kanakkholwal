"use client";

import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/cn";
import {
	MARKER_SHAPES,
	MARKER_STAGGER_MS,
	type MarkerTone,
	type MarkerVariant,
	marker,
} from "./variants";

export type { MarkerTone, MarkerVariant };

export interface MarkerProps {
	children?: ReactNode;
	variant?: MarkerVariant;
	/** Ink colour; `auto` picks the style's own tone. */
	tone?: MarkerTone;
	/** Draw in once scrolled into view; off renders the mark finished. */
	animate?: boolean;
	/** Controlled: whether the mark is drawn. Omit to draw on first view. */
	drawn?: boolean;
	/** One stroke's draw time. */
	durationMs?: number;
	delayMs?: number;
	className?: string;
}

export function Marker({
	children,
	variant = "wavy",
	tone = "auto",
	animate = true,
	drawn: drawnProp,
	durationMs = 700,
	delayMs = 0,
	className,
}: MarkerProps) {
	const id = useId().replace(/:/g, "");
	const rootRef = useRef<HTMLSpanElement>(null);
	const [seen, setSeen] = useState(false);
	const drawn = drawnProp ?? seen;
	const styles = marker({ variant, tone });
	const shape = MARKER_SHAPES[variant];

	useEffect(() => {
		if (!animate || drawnProp !== undefined) return;
		const node = rootRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry?.isIntersecting) return;
			setSeen(true);
			observer.disconnect();
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, [animate, drawnProp]);

	const timing = (extra = 0, scale = 1) =>
		({
			"--marker-duration": `${durationMs * scale}ms`,
			"--marker-delay": `${delayMs + extra}ms`,
		}) as CSSProperties;
	const flag = drawn ? "" : undefined;

	return (
		<span
			ref={rootRef}
			data-slot="marker"
			data-variant={variant}
			className={cn(styles.root(), className)}
		>
			<span className={styles.content()}>{children}</span>
			{shape.kind === "bar" ? (
				<span aria-hidden="true" className={styles.decoration()}>
					<span
						data-drawn={flag}
						className={cn(styles.bar(), animate && "marker-sweep")}
						style={timing()}
					/>
				</span>
			) : (
				<svg
					aria-hidden="true"
					fill="none"
					preserveAspectRatio="none"
					viewBox={shape.viewBox}
					data-drawn={shape.kind === "fill" ? flag : undefined}
					className={cn(
						styles.decoration(),
						shape.kind === "fill" && animate && "marker-sweep",
					)}
					style={shape.kind === "fill" ? timing(0, 1.1) : undefined}
				>
					<defs>
						<filter id={`${id}-hard`} x="-30%" y="-30%" width="160%" height="160%">
							<feTurbulence
								type="fractalNoise"
								baseFrequency={0.045}
								numOctaves={2}
								seed={4}
								result="n"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="n"
								scale={2.6}
								xChannelSelector="R"
								yChannelSelector="G"
							/>
						</filter>
						<filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
							<feTurbulence
								type="fractalNoise"
								baseFrequency={0.035}
								numOctaves={2}
								seed={11}
								result="n"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="n"
								scale={1.5}
								xChannelSelector="R"
								yChannelSelector="G"
							/>
						</filter>
					</defs>
					{shape.kind === "fill" ? (
						<path d={shape.d} fill="currentColor" filter={`url(#${id}-soft)`} />
					) : (
						shape.strokes.map((stroke) => (
							<path
								key={stroke.d}
								d={stroke.d}
								pathLength={1}
								stroke="currentColor"
								strokeWidth={stroke.width}
								strokeLinecap="round"
								strokeLinejoin={stroke.join}
								opacity={animate ? undefined : stroke.opacity}
								filter={`url(#${id}-${stroke.rough})`}
								data-drawn={flag}
								className={animate ? "marker-stroke" : undefined}
								style={
									{
										...timing(stroke.second ? MARKER_STAGGER_MS : 0),
										"--marker-opacity": stroke.opacity ?? 1,
									} as CSSProperties
								}
							/>
						))
					)}
				</svg>
			)}
		</span>
	);
}
