export function SkillsSection() {
  const skillCategories = [
    {
      title: "Data Analysis",
      skills: ["Python", "Pandas", "NumPy", "Excel", "R", "SPSS", "STATA"]
    },
    {
      title: "Data Visualization",
      skills: ["Power BI", "Tableau", "Matplotlib", "Plotly", "Excel Dashboards"]
    },
    {
      title: "Data Science",
      skills: ["Statistics", "Exploratory Data Analysis", "Predictive Analytics", "Statistical Modeling", "Feature Engineering", "Scikit-learn"]
    },
    {
      title: "Machine Learning",
      skills: ["Supervised Learning", "Unsupervised Learning", "Regression", "Classification", "Model Evaluation", "TensorFlow", "Keras", "LightGBM"]
    },
    {
      title: "Data & Development",
      skills: ["SQL", "PostgreSQL", "FastAPI", "Streamlit", "Git", "GitHub"]
    }
  ];

  return (
    <section id="skills" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Technical Skills
          </h2>
          <div className="h-1 w-20 bg-primary rounded" />
        </div>

        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-card border border-border p-6 rounded-none"
            >
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, sIndex) => (
                  <span 
                    key={sIndex}
                    className="px-3 py-1 bg-muted border border-border text-foreground text-sm font-medium rounded-none hover:bg-foreground hover:text-background transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
