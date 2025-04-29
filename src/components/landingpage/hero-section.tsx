import Link from "next/link"
import { ArrowRight, ChevronRight, Mail} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TextEffect } from "@/components/motion-primitives/text-effect"
import { AnimatedGroup } from "@/components/motion-primitives/animated-group"
import HypermailAppMockup from "./hypermail-ui-mockup"

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export default function HeroSection() {
  return (
    <>
      <main className="overflow-hidden">
        <div aria-hidden className="absolute inset-0 isolate hidden opacity-65 contain-strict max-h-[800px] lg:block">
          {/* Background gradients with indigo tones for Hypermail theme */}
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(244,76%,85%,.08)_0,hsla(244,76%,55%,.04)_50%,hsla(244,76%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(244,76%,85%,.06)_0,hsla(244,76%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(244,76%,85%,.04)_0,hsla(244,76%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              {/* Background can be re-enabled if needed */}
              <></>
            </AnimatedGroup>
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#link"
                    className="hover:bg-background hover:border-indigo-300 bg-indigo-50/20 dark:bg-indigo-900/10 group mx-auto flex w-fit items-center gap-4 rounded-full border border-indigo-200 dark:border-indigo-800/30 p-1 pl-4 shadow-md shadow-indigo-950/5 transition-colors duration-300"
                  >
                    <span className="text-indigo-700 dark:text-indigo-300 flex items-center text-sm">
                      <Mail className="mr-2 size-4" /> Introducing Hypermail Beta
                    </span>
                    <span className="block h-4 w-0.5 border-l bg-indigo-300 dark:bg-indigo-700"></span>

                    <div className="bg-background group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800 size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-indigo-600 dark:text-indigo-300" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-indigo-600 dark:text-indigo-300" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 text-balance text-6xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100 md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Your New <span className="text-indigo-600 dark:text-indigo-400">Futuristic</span> AI Email Client
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg text-gray-600 dark:text-gray-300"
                >
                  Experience email reimagined for the modern era. Hypermail uses advanced AI to make your inbox smarter, faster, and more efficient than ever before.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div key={1} className="bg-indigo-600/10 rounded-[calc(var(--radius-xl)+0.125rem)] border border-indigo-200 dark:border-indigo-800/30 p-0.5">
                    <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 text-base">
                      <Link href="/sign-up">
                        <span className="text-nowrap flex items-center">Get Started <ArrowRight className="ml-2 size-4" /></span>
                      </Link>
                    </Button>
                  </div>
                  {/* <Button key={2} asChild size="lg" variant="ghost" className="h-10.5 rounded-xl px-5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20">
                    <Link href="#link">
                      <span className="text-nowrap">Watch Demo</span>
                    </Link>
                  </Button> */}
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-indigo-400/10 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-indigo-200/40 dark:border-indigo-800/40 p-4 shadow-lg shadow-indigo-950/15 ring-1">
                  {/* Hypermail UI mockup - dark mode */}
                  <HypermailAppMockup/>

                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link href="/" className="block text-sm text-indigo-600 dark:text-indigo-400 duration-150 hover:opacity-75">
                <span>Trusted by Leading Companies</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
              <div className="flex">
                <img
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nvidia.svg"
                  alt="Nvidia Logo"
                  height="20"
                  width="auto"
                />
              </div>

              <div className="flex">
                <img
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/column.svg"
                  alt="Column Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/github.svg"
                  alt="GitHub Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nike.svg"
                  alt="Nike Logo"
                  height="20"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                  alt="Lemon Squeezy Logo"
                  height="20"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/laravel.svg"
                  alt="Laravel Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-7 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/lilly.svg"
                  alt="Lilly Logo"
                  height="28"
                  width="auto"
                />
              </div>

              <div className="flex">
                <img
                  className="mx-auto h-6 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/openai.svg"
                  alt="OpenAI Logo"
                  height="24"
                  width="auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}