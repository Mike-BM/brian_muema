import { GraduationCap, Award } from "lucide-react";

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

  const education = [
    {
      institution: "Chuka University",
      degree: "Economics and Statistics",
      focus: "Foundation in statistical analysis, economic theory, and quantitative methods.",
    }
  ];

  const certifications = [
    {
      institution: "PLP Academy",
      course: "Software Development / AI for Software Engineering",
      year: "2024"
    },
    {
      institution: "Moringa School",
      course: "AI for Software Development Advanced",
      year: "2024"
    },
    {
      institution: "[Institution]",
      course: "Data Analytics Training",
      year: "2023"
    }
  ];

  return (
    <section id="skills" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Skills Section */}
        <div className="max-w-4xl mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Technical Skills
          </h2>
          <div className="h-1 w-20 bg-primary rounded" />
        </div>

        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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

        {/* Education and Certifications Section */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-border">
          
          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Education</h2>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-card border border-border p-6 rounded-none"
                >
                  <h3 className="text-xl font-bold text-foreground">{edu.institution}</h3>
                  <p className="text-lg font-medium text-primary mb-2">{edu.degree}</p>
                  <p className="text-muted-foreground">{edu.focus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-8 w-8 text-foreground" />
              <h2 className="text-3xl font-bold text-foreground">Certifications</h2>
            </div>
            
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-card border border-border p-5 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-foreground">{cert.course}</h3>
                    <p className="text-sm text-muted-foreground">{cert.institution}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-muted border border-border rounded-none w-fit">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
