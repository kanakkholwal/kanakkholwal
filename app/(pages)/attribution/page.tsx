
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { appConfig } from "root/project.config";
import { generateMetadata } from "~/utils/seo";

export const metadata = generateMetadata({
  title: "Attribution | Credits",
  description: "Acknowledging the open-source giants and designers who inspired this portfolio.",
  path: "/attribution",
});

function CreditItem({ person, attribute, index }: { person: string; attribute: string; index: number }) {
  return (
    <div
      // initial={{ opacity: 0, x: -10 }}
      // whileInView={{ opacity: 1, x: 0 }}
      // transition={{ delay: index * 0.05 }}
      // viewport={{ once: true }}
      className="group flex items-center justify-between py-4 border-b border-border/40 hover:bg-muted/30 px-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* Initials Avatar */}
        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
          {person.substring(0, 2).toUpperCase()}
        </div>
        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
          {person}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-mono text-right">
          {attribute}
        </span>
      </div>
    </div>
  );
}

export default function AttributionPage() {
  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      {/* Background Texture */}
      <div className="fixed inset-0 -z-50 h-full w-full opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />
      
      <div className="relative z-10 pt-24 md:pt-32 container max-w-7xl mx-auto px-6 md:px-12 pb-24">
        
        {/* --- HEADER --- */}
        <div className="text-center space-y-6 mb-20">
          <div
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5 }}
          >
             <Badge variant="outline" className="px-3 py-1 rounded-full border-indigo-500/20 bg-indigo-500/5 text-indigo-500 backdrop-blur-md">
                <Sparkles className="size-3 mr-2 fill-indigo-500/20" />
                Community & Inspiration
             </Badge>
          </div>

          <h1 
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]"
          >
            Standing on the
            <br />
            shoulders of
            <span className="text-colorful-titanium italic ml-3">
               Giants.
            </span>
          </h1>
          
          <p 
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
             No code is written in a vacuum. This portfolio exists thanks to the open-source community and these brilliant designers.
          </p>
        </div>

        <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 md:gap-20">
          
          <div className="space-y-8">
             <div className="prose prose-zinc dark:prose-invert leading-relaxed">
                <h3 className="text-foreground font-semibold tracking-tight text-xl mb-4">
                   The Build Journey
                </h3>
                {appConfig.attribution.journey.map((item, index) => (
                   <p key={index} className="text-muted-foreground">
                      {item}
                   </p>
                ))}
             </div>

             {/* Signature */}
             <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground font-mono mb-2">Build with precision,</p>
                <div className="font-instrument-serif italic text-3xl text-foreground">
                   {appConfig.name}
                </div>
             </div>
          </div>

          {/* RIGHT: THE CREDITS (List) */}
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground font-semibold tracking-tight text-xl">
                   Credits
                </h3>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                   v1.0.0
                </span>
             </div>
             
             <div className="flex flex-col">
                {appConfig.attribution.list.map((attribution, idx) => (
                   <CreditItem 
                      key={idx} 
                      person={attribution.person} 
                      attribute={attribution.attribute} 
                      index={idx}
                   />
                ))}
             </div>

             {/* Freelance CTA Card */}
             <div 
              //  initial={{ opacity: 0, y: 20 }}
              //  whileInView={{ opacity: 1, y: 0 }}
              //  viewport={{ once: true }}
              //  transition={{ delay: 0.4 }}
               className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm relative overflow-hidden group"
             >
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-colors" />
                
                <div className="relative z-10">
                   <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Heart className="size-4 text-rose-500 fill-rose-500" />
                      Work with me
                   </h4>
                   <p className="text-sm text-muted-foreground mt-2 mb-4 leading-relaxed">
                      I build fast, SEO-optimized, and accessible web experiences. Let{"'"}s create something world-class together.
                   </p>
                   <Button variant="outline" size="sm" className="w-full bg-background/50 hover:bg-background border-indigo-500/30 hover:border-indigo-500/50" asChild>
                      <Link href={`mailto:${appConfig.emails[0]}`}>
                         Start a Project <ArrowUpRight className="size-3 ml-2" />
                      </Link>
                   </Button>
                </div>
             </div>

          </div>

        </div>

      </div>
    </main>
  );
}