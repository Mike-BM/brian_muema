export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 bg-muted/50 mt-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-bold text-lg">Brian Muema</p>
          <p className="text-sm text-muted-foreground">Data Analyst | Data Science</p>
          <p className="text-sm text-muted-foreground mt-2">
            Turning Data Into Insights, Insights Into Decisions.
          </p>
        </div>
        
        <div className="flex gap-4">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">GitHub</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">LinkedIn</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Email</a>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Brian Muema. All rights reserved.
      </div>
    </footer>
  );
}
