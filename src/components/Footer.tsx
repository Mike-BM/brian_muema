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
        
        <div className="flex gap-4 flex-wrap justify-center md:justify-end mt-4 md:mt-0">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">GitHub</a>
          <a href="https://linkedin.com/in/brian-michael-0386a7335" className="text-sm font-medium text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.facebook.com/share/1HZX6YzmQR/" className="text-sm font-medium text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.instagram.com/m_brian.ke?igsi=MTl6NXdwNGJyZWc0dg==" className="text-sm font-medium text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://wa.me/254793706054" className="text-sm font-medium text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="mailto:brianmuema928@gmail.com" className="text-sm font-medium text-muted-foreground hover:text-foreground">Email</a>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Brian Muema. All rights reserved.
      </div>
    </footer>
  );
}
