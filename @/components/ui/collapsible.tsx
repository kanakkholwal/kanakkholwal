"use client"

import { cn } from "@/lib/utils"
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

function Collapsible({
    className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} className={cn("group", className)} />
}


function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}
function CollapsibleIcon({
    className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
    return  <>
    <ChevronsDownUpIcon data-slot="collapsible-icon" {...props} className={cn("group-data-[state='closed']:hidden",className)} />
    <ChevronsUpDownIcon data-slot="collapsible-icon" {...props} className={cn("group-data-[state='open']:hidden",className)} />
    
    </>
}

export { Collapsible, CollapsibleContent, CollapsibleIcon, CollapsibleTrigger }

