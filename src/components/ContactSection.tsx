"use client";

import { Mail, MessageSquare, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      // Use our internal API route that handles Resend
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
        // Remove Accept header for FormData as fetch will set the correct Content-Type with boundary
      });
      
      if (response.ok) {
        router.push("/success");
      } else {
        alert("Oops! There was a problem submitting your form.");
      }
    } catch (error) {
      alert("Oops! There was a problem submitting your form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-none mb-6">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Let&apos;s Talk Data
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have a dataset, business problem, research question, or data project? 
            Let&apos;s explore what the data can tell us.
          </p>
        </div>

        <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h3>
              <p className="text-muted-foreground mb-8">
                I am currently open to new opportunities, collaborations, and data challenges. 
                Reach out and I&apos;ll get back to you as soon as possible.
              </p>
            </div>
            
            <div className="space-y-6">
              <a href="mailto:brianmuema928@gmail.com" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 bg-card border border-border rounded-none shadow-sm flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="font-medium break-all">brianmuema928@gmail.com</span>
              </a>
              <a href="https://linkedin.com/in/brian-michael-0386a7335" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 bg-card border border-border rounded-none shadow-sm flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
                <span className="font-medium break-all">Brian Muema</span>
              </a>
              <a href="https://www.facebook.com/share/1HZX6YzmQR/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 bg-card border border-border rounded-none shadow-sm flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </div>
                <span className="font-medium break-all">Facebook</span>
              </a>
              <a href="https://www.instagram.com/m_brian.ke?igsi=MTl6NXdwNGJyZWc0dg==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 bg-card border border-border rounded-none shadow-sm flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <span className="font-medium break-all">Instagram</span>
              </a>
              <a href="https://wa.me/254793706054" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 bg-card border border-border rounded-none shadow-sm flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
                <span className="font-medium break-all">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-none shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    required
                    className="w-full p-3 bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required
                    className="w-full p-3 bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject *</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  required
                  className="w-full p-3 bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all"
                  placeholder="Data Project Collaboration"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message *</label>
                <textarea 
                  id="message" 
                  name="message"
                  required
                  rows={5}
                  className="w-full p-3 bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all resize-none"
                  placeholder="Tell me about your project or problem..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-medium py-3 rounded-none transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
