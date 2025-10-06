import { ArrowRight } from "lucide-react";
import { GlowFillButton } from "./animated/button.fill";
import ShapeHero from "./kokonutui/shape-hero";
import { TransitionLink } from "./utils/link";


export function ContactSection(){
    return  <section
        id="contact"
        className="relative z-0 mt-20 flex w-full justify-center overflow-x-hidden px-4 py-20"
      >
        <ShapeHero
          title1=""
          title2=""
          description=""
          shapeClassName="opacity-30 hidden md:block"
          className="w-full min-h-full"
        >
          <div className="relative z-10 mx-auto flex w-full container flex-col items-center justify-center gap-y-2 py-10 text-center ">
            <span className="mt-4 text-2xl font-light tracking-wide text-black sm:text-4xl lg:text-5xl dark:text-white">
              <h3
                className="text-nowrap"
                style={{ opacity: 1, transform: "none" }}
              >
                FROM CONCEPT TO <span className="font-extrabold">CREATION</span>
              </h3>
              <h3
                className="mt-3 text-nowrap"
                style={{ opacity: 1, transform: "none" }}
              >
                LET{"'"}s MAKE IT{" "}
                <span className="font-extrabold">HAPPEN!</span>
              </h3>
            </span>
            <div className="group" style={{ transform: "none" }}>
              <GlowFillButton icon={ArrowRight}>
                <TransitionLink href="/contact">Get in Touch</TransitionLink>
              </GlowFillButton>
            </div>
            <p className="text-base font-semibold lg:text-2xl">
              I{"'"}m available for full-time roles &amp; freelance projects.
            </p>
            <p className="my-2 text-sm font-extralight tracking-wide text-balance opacity-75 lg:text-xl">
              I thrive on crafting dynamic web applications, and
              <br />
              delivering seamless user experiences.
            </p>
          </div>
        </ShapeHero>
      </section>
}