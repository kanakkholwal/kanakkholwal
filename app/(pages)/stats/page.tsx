import { cn } from '@/lib/utils'
import { SearchParams } from 'nuqs/server'
import { Suspense } from 'react'
import {
  NPMDownloads,
  NPMDownloadsSkeleton,
  NPMStats,
  NPMStatsSkeleton
} from './_components/downloads'
import { StarHistoryGraph, StarHistoryGraphSkeleton } from './_components/stars'
import { RepoBeatsActivityGraph } from './_components/stars.client'
import { Versions } from './_components/versions'
import { Widget } from './_components/widget'
import { WidgetSkeleton } from './_components/widget.skeleton'
import { statsConfig } from './config'
import { getVersions, sumVersions } from './lib/versions'
import { loadSearchParams } from './searchParams'

export const dynamic = 'force-dynamic'

type StatsPageProps = {
  searchParams: Promise<SearchParams>
}

export default function StatsPage({ searchParams }: StatsPageProps) {
  return (
    <div className="mx-auto max-w-[88rem] px-4">
      <h1 className="sr-only">Project Stats</h1>
      <section className="my-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Suspense fallback={<StarHistoryGraphSkeleton />}>
          <StarHistoryGraph />
        </Suspense>
        <Widget className={cn("h-auto flex-col gap-2", statsConfig.flags.repoBeats ? "flex" : "hidden")}>
          {statsConfig.flags.repoBeats && <RepoBeatsActivityGraph />}
          <div className="flex flex-1 items-center gap-6 p-4">
            <Suspense fallback={<NPMStatsSkeleton />}>
              <NPMStats />
            </Suspense>
          </div>
        </Widget>
        <Suspense fallback={<NPMDownloadsSkeleton />}>
          <NPMDownloads />
        </Suspense>
        {statsConfig.flags.versionAdoptionGraph && (<Suspense fallback={<WidgetSkeleton />}>
          <VersionsLoader searchParams={searchParams} />
        </Suspense>)}
      </section>
    </div>
  )
}

// --

type VersionsLoaderProps = {
  searchParams: Promise<SearchParams>
}

async function VersionsLoader({ searchParams }: VersionsLoaderProps) {
  const { pkg, beta } = await loadSearchParams(searchParams)
  const allVersions = await getVersions(beta)
  const pkgVersions = pkg === 'both' ? sumVersions(allVersions) : allVersions
  // @ts-expect-error
  const versionsToShow = Object.entries(pkgVersions.at(-1)?.[pkg] ?? {})
    .slice(0, 5)
    .map(([key, _]) => key)
  return (
    <Suspense
      fallback={<div className="animate-pulse text-center">Loading...</div>}
    >
      <Versions
        records={pkgVersions.map(v => ({
          date: v.date,
          // @ts-ignore
          ...v[pkg]
        }))}
        versions={versionsToShow}
      />
    </Suspense>
  )
}
