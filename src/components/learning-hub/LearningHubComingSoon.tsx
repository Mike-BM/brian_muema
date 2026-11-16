import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  FolderGit2,
  Library,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

/**
 * Public placeholder for the Learning Hub.
 * It deliberately contains only short, generic hints about what each tab will offer.
 * No real lessons, links, resources or learner data are rendered or sent to the browser.
 */
const TEASERS = [
  {
    icon: Compass,
    title: "Learning Paths",
    hint: "Guided, step-by-step journeys in Data Analysis and Data Science, built to take you from the basics to real work.",
  },
  {
    icon: Library,
    title: "Learning Resources",
    hint: "Handy guides, templates and practice material you can learn from at your own pace.",
  },
  {
    icon: Users,
    title: "Workshops",
    hint: "Hands-on learning sessions, online and in person, with time for your questions.",
  },
  {
    icon: FolderGit2,
    title: "Practical Projects",
    hint: "Build-it-yourself projects on real-world style data that you can proudly add to your portfolio.",
  },
  {
    icon: Trophy,
    title: "Learner Showcase",
    hint: "A spotlight on the work and wins of people learning in this community.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Shelf",
    hint: "A hand-picked shelf of trusted places to keep growing once you've started.",
  },
];

export function LearningHubComingSoon() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Coming Soon</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              Learning Hub <br className="hidden sm:inline" />
              <span className="text-primary">Stay Tuned.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
              I&apos;m putting the finishing touches on a space for practical learning in Data Analysis and Data
              Science. It will be updated soon.
            </p>
            <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
              Here&apos;s a little preview of what&apos;s coming in each tab.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 shadow-sm"
              >
                Message me to be notified
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/70 shadow-sm"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {TEASERS.map(({ icon: Icon, title, hint }) => (
              <div
                key={title}
                className="bg-card border border-border p-6 rounded-lg shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/15 text-foreground/70 border border-border">
                    Coming soon
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
