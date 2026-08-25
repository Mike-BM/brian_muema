import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">About Me</h2>
            <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed max-w-none">
              <p>
                I am a data professional with a strong foundation in <strong>Economics and Statistics</strong>, 
                focused on developing practical expertise in <strong>Data Analytics and Data Science</strong>.
              </p>
              <p>
                My approach to data is rooted in statistical thinking and business problem solving. I believe 
                that data without a narrative is just numbers. I specialize in turning complex datasets into 
                clear, actionable insights through data analysis, data visualization, and data storytelling.
              </p>
              <p>
                Using tools like Python, SQL, and Machine Learning, I build scalable data-driven solutions 
                and continuously expand my skill set to stay at the forefront of the industry.
              </p>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 bg-card border border-border p-6 rounded-lg shadow-sm">
              <span className="font-semibold text-foreground text-center">Economics & Statistics</span>
              <ArrowRight className="text-muted-foreground hidden sm:block h-5 w-5" />
              <ArrowRight className="text-muted-foreground sm:hidden h-5 w-5 rotate-90" />
              <span className="font-semibold text-foreground text-center">Data Analytics</span>
              <ArrowRight className="text-muted-foreground hidden sm:block h-5 w-5" />
              <ArrowRight className="text-muted-foreground sm:hidden h-5 w-5 rotate-90" />
              <span className="font-semibold text-foreground text-center">Data Science</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
