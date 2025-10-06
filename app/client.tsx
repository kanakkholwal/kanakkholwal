"use client"
import { GlowFillButton } from "@/components/animated/button.fill";
import { OrbitingCircles } from "@/components/animated/elements.orbiting";
import { CountingNumber } from "@/components/animated/text.counter";
import { RollingText } from "@/components/animated/text.rolling";
import { ShimmeringText } from "@/components/animated/text.shimmer";
import { Icon } from "@/components/icons";
import {
    ContributionGraph,
    ContributionGraphBlock,
    ContributionGraphCalendar,
    ContributionGraphFooter,
    ContributionGraphLegend,
    ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import BlurFade from "@/components/magicui/blur-fade";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ButtonLink,
    ButtonScroll,
    TransitionLink
} from "@/components/utils/link";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GitFork, Star, Users } from "lucide-react";
import { useState } from "react";
import { appConfig, resume_link } from "root/project.config";
import { Contributions } from "~/api/github";


const BLUR_FADE_DELAY = 0.04;



export function HeroSection() {
    return (
        <section
            id="hero"
            className="relative flex flex-col md:grid md:grid-cols-2 items-center justify-between gap-8 px-6 md:px-12 min-h-dvh max-w-7xl mx-auto w-full"
        >
            <div className="flex flex-col gap-4 justify-center text-center md:text-left flex-1 md:col-span-1">
                <ShimmeringText
                    text={`Hi, I'm ${appConfig.name.split(" ")[0]}`}
                    className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                />
                <RollingText
                    className="text-muted-foreground max-w-lg md:text-xl"
                    delay={BLUR_FADE_DELAY}
                    text={appConfig.description}
                    inView={true}
                    inViewOnce={false}
                />
                <div className="mt-5 flex justify-center md:justify-start items-center gap-4 w-full  flex-wrap">
                    <ButtonLink
                        variant="dark"
                        href={resume_link}
                        target="_blank"
                        effect="gooeyRight"
                        size="lg"
                        rounded="full"
                    >
                        Download Resume
                        <Icon name="arrow-up-right" />
                    </ButtonLink>
                    <GlowFillButton icon={ArrowRight} className="h-11 my-0">
                        <TransitionLink
                            href="/journey"
                        >
                            My Journey
                        </TransitionLink>
                    </GlowFillButton>
                </div>
            </div>
            <BlurFade
                delay={BLUR_FADE_DELAY}
                className="hidden sm:col-span-1 md:flex justify-center"
            >


                <div className="relative flex size-[500px] w-full flex-col items-center justify-center overflow-hidden">

                    <OrbitingCircles iconSize={40} radius={200} speed={0.5}>
                        {appConfig.skill_icons.toReversed().slice(0, appConfig.skill_icons.length / 2).map((skill, index) => (
                            <div className="size-24" key={index}>
                                <img
                                    width={200}
                                    height={200}
                                    alt={skill}
                                    className="overflow-hidden rounded-full size-full"
                                    src={`https://skillicons.dev/icons?i=${skill}`}
                                />
                            </div>
                        ))}
                    </OrbitingCircles>
                    <Avatar className="size-32 md:size-60 border-4 border-primary/20 shadow-lg">
                        <AvatarImage alt={appConfig.name} src={appConfig.logo} />
                        <AvatarFallback>{appConfig.initials}</AvatarFallback>
                    </Avatar>
                    <OrbitingCircles iconSize={30} radius={150} reverse speed={1}>
                        {appConfig.skill_icons.slice(0, appConfig.skill_icons.length / 3).map((skill, index) => (
                            <div className="size-24" key={index}>
                                <img
                                    width={200}
                                    height={200}
                                    alt={skill}
                                    className="overflow-hidden rounded-full size-full"
                                    src={`https://skillicons.dev/icons?i=${skill}`}
                                />
                            </div>
                        ))}
                    </OrbitingCircles>
                </div>
            </BlurFade>
            <div className="md:col-span-2 flex justify-center flex-col gap-4 mx-auto items-center">
                <RollingText
                    className="text-muted-foreground max-w-lg md:text-xs"
                    delay={BLUR_FADE_DELAY}
                    text="Scroll down to explore my work and experience!"
                />
                <ButtonScroll
                    variant="ghost"
                    size="icon"
                    rounded="full"
                    className="animate-bounce rotate-180"
                    targetId="work"
                    offset={100}
                >
                    <Icon name="arrow-up" />
                </ButtonScroll>
            </div>
        </section>
    );
}


export function GithubSection({ data }: { data: Contributions }) {
    const [year, setYear] = useState(Object.keys(data.total).toReversed()[0])


    return <section
        id="github"
        className="mx-auto my-24 w-full max-w-7xl px-4 mt-10 mb-32 space-y-8"
    >
        <h2
            className="text-shadow-glow relative z-2 text-5xl font-medium tracking-tight text-balance sm:text-5xl md:text-6xl mb-12 md:mb-12 text-center"

        >
            <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
                Developer Insights
            </p>
            <span className="font-instrument-serif">
                <span className="">GitHub </span>{" "}
                <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
                    Activity
                </span>
            </span>
        </h2>


        <ContributionGraph data={data.contributions[year]} className="mx-auto">
            <div className="flex justify-end items-center-safe py-2">

                <Select defaultValue={year} onValueChange={(year) => setYear(year)}>
                    <SelectTrigger className="w-auto min-w-[8rem] h-8 text-sm text-muted-foreground font-light">
                        <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(data.total).toReversed().map((year) => {
                            return (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <ContributionGraphCalendar>
                {({ activity, dayIndex, weekIndex }) => (
                    <ContributionGraphBlock
                        activity={activity}
                        dayIndex={dayIndex}
                        weekIndex={weekIndex}
                        className={cn(
                            'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
                            'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                            'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                            'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                            'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]'
                        )}
                    />
                )}
            </ContributionGraphCalendar>
            <ContributionGraphFooter>
                <ContributionGraphTotalCount>
                    {({ totalCount, year }) => (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Year {year}:</span>
                            <Badge className="ml-2">
                                {totalCount.toLocaleString()} contributions
                            </Badge>
                        </div>
                    )}
                </ContributionGraphTotalCount>
                <ContributionGraphLegend>
                    {({ level }) => (
                        <div
                            className="group relative flex h-3 w-3 items-center justify-center"
                            data-level={level}
                        >
                            <div
                                className={`h-full w-full rounded-sm border border-border ${level === 0 ? "bg-muted" : ""} ${level === 1 ? "bg-emerald-200 dark:bg-emerald-900" : ""} ${level === 2 ? "bg-emerald-400 dark:bg-emerald-700" : ""} ${level === 3 ? "bg-emerald-600 dark:bg-emerald-500" : ""} ${level === 4 ? "bg-emerald-800 dark:bg-emerald-300" : ""} `}
                            />
                            <span className="-top-8 absolute hidden rounded bg-popover px-2 py-1 text-popover-foreground text-xs shadow-md group-hover:block">
                                Level {level}
                            </span>
                        </div>
                    )}
                </ContributionGraphLegend>
            </ContributionGraphFooter>
        </ContributionGraph>
        <div className="mx-auto mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 md:p-4 bg-card border-purple-500/30 hover:bg-purple-500/5 col-span-1">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="rounded-lg p-3 bg-purple-100 dark:bg-purple-900/20">

                        <Users className="size-6 text-purple-400" />
                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-muted-foreground">Followers</p>
                        <p className="text-xl font-bold text-foreground md:text-2xl">
                            <CountingNumber from={0} to={data.stats.followers} duration={3} />
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 md:p-4 bg-card border-yellow-500/30 hover:bg-yellow-500/5 col-span-1">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="rounded-lg p-3 bg-yellow-100 dark:bg-yellow-900/20">

                        <Star className="size-6 text-yellow-400" />

                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-muted-foreground">Total Stars</p>
                        <p className="text-xl font-bold text-foreground md:text-2xl">
                            <CountingNumber from={0} to={data.stats.stars} duration={3} />
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 md:p-4 bg-card border-green-500/30 hover:bg-green-500/5 col-span-1">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="rounded-lg p-3 bg-green-100 dark:bg-green-900/20">
                        <BookOpen className="size-6 text-green-400" />
                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-muted-foreground">Public Repos</p>
                        <p className="text-xl font-bold text-foreground md:text-2xl">
                            <CountingNumber from={0} to={data.stats.repos} duration={3} />
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 md:p-4 bg-card border-blue-500/30 hover:bg-blue-500/5 col-span-1">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="rounded-lg p-3 bg-blue-100 dark:bg-blue-900/20">
                        <GitFork className="size-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="line-clamp-1 text-sm text-muted-foreground">Total Forks</p>
                        <p className="text-xl font-bold text-foreground md:text-2xl">
                            <CountingNumber from={0} to={data.stats.forks} duration={3} />
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </section>

}



export function SkillSection() {


    return (<section
        id="skills"
        className="max-w-7xl mx-auto w-full px-6 md:px-12 py-32"
    >
        <h2
            className="text-shadow-glow relative text-5xl font-medium tracking-tight text-balance sm:text-5xl md:text-6xl text-center z-30 mb-0 md:mb-0 size-full -translate-y-10"
        >
            <p className="mb-3 font-mono text-xs font-normal tracking-widest text-black/80 uppercase md:text-sm dark:text-white/70">
                My Skills
            </p>
            <span className="font-instrument-serif">
                <span className="">The Secret</span>{" "}
                <span className="text-colorful animate-gradient-x font-instrument-serif pe-2 tracking-tight italic">
                    {" "}
                    Sauce
                </span>
            </span>
        </h2>

        <div className="flex justify-center flex-wrap gap-3 mb-2 relative">
            {appConfig.skill_icons.map((skill) => {
                return <div
                    key={skill}
                    className="group no-underline transition-all duration-500 hover:-translate-y-2"
                >
                    <div className="group inline-block text-center">
                        <div className="size-28 rounded-xl border-2 p-2 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg">
                            <div
                                className="box-shadow-glow grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0] dark:border-[#5A5F661F]/10 dark:bg-[#1A1B1E]"

                            >
                                <motion.img
                                    aria-label={skill}
                                    src={`https://skillicons.dev/icons?i=${skill}`}
                                    alt={`${skill} icon`}
                                    draggable="false"
                                    unselectable="on"
                                    className="mt-2"
                                />
                                <p className="text-xs text-muted-foreground">{skill}</p>

                            </div>
                        </div>
                    </div>

                </div>
            })}

        </div>



    </section>


    );
}

