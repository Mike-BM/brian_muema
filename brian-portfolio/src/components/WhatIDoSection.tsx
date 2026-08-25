import { BarChart3, PieChart, Database, BrainCircuit } from "lucide-react";

export function WhatIDoSection() {
  const services = [
    {
      title: "Data Analysis",
      description: "Transforming raw data into meaningful insights through data cleaning, exploration, statistical analysis, and interpretation.",
      icon: <BarChart3 className="h-6 w-6 text-primary mb-4" />
    },
    {
      title: "Data Visualization",
      description: "Creating interactive dashboards and visualizations that communicate complex information clearly and effectively.",
      icon: <PieChart className="h-6 w-6 text-foreground mb-4" />
    },
    {
      title: "Data Science",
      description: "Using statistics, programming, exploratory analysis, and predictive techniques to solve real-world problems.",
      icon: <Database className="h-6 w-6 text-primary mb-4" />
    },
    {
      title: "Machine Learning",
      description: "Applying machine learning techniques to identify patterns, make predictions, and develop data-driven solutions.",
      icon: <BrainCircuit className="h-6 w-6 text-foreground mb-4" />
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What I Do
          </h2>
          <div className="h-1 w-20 bg-primary rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 rounded-none border-l-2 border-border bg-card hover:border-primary transition-colors"
            >
              {service.icon}
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
