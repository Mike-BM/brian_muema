export function ExperienceSection() {
  const experiences = [
    {
      title: "Data Analyst",
      company: "[Company Name]",
      period: "2024 - Present",
      description: "Perform data cleaning, exploratory data analysis, and statistical modeling to generate business insights. Developed dynamic dashboards using Power BI and Tableau for stakeholder reporting.",
      isVolunteer: false
    },
    {
      title: "Data Science Intern",
      company: "[Company Name]",
      period: "2023 - 2024",
      description: "Assisted in building predictive machine learning models using Python and Scikit-learn. Processed and analyzed large datasets to identify key trends and correlations.",
      isVolunteer: false
    },
    {
      title: "Volunteer Data Analyst",
      company: "[Organization Name]",
      period: "2023",
      description: "Provided data analysis support for community-driven projects. Cleaned and structured datasets for better accessibility and reporting.",
      isVolunteer: true
    }
  ];

  return (
    <section id="experience" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Experience
          </h2>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 md:pl-0"
              >
                <div className="md:grid md:grid-cols-4 gap-4 items-start">
                  <div className="mb-2 md:mb-0 md:col-span-1 md:text-right md:pr-8">
                    <span className="text-sm font-semibold text-primary">{exp.period}</span>
                  </div>
                  <div className="md:col-span-3 border-l-2 border-primary/30 pl-8 pb-8 relative">
                    <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1"></div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      {exp.title}
                      {exp.isVolunteer && (
                        <span className="text-xs px-2 py-1 bg-muted border border-border text-foreground rounded-none font-medium">Volunteer Experience</span>
                      )}
                    </h3>
                    <h4 className="text-lg font-medium text-muted-foreground mb-4">{exp.company}</h4>
                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
