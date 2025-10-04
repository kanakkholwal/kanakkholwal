
export default function TechStackPage() {
    return <main className="px-4 py-16 pt-36 sm:px-8 md:px-10">
        <h2
            className="relative z-2  text-5xl font-medium tracking-tight text-balance sm:text-5xl md:mb-36 md:text-6xl text-center max-w-xl mx-auto !mb-12"
            style={{
                textShadow:
                    "rgba(255, 255, 255, 0.05) 0px 4px 8px, rgba(255, 255, 255, 0.25) 0px 8px 30px"
            }}
        >
            <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
                Coming Soon!
            </p>
            <span className="font-instrument-serif">
                <span className="md:text-6xl">The </span>{" "}
                <span className="text-colorfull animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
                    TechStack
                </span>
            </span>
        </h2>
    </main>
}