"use client";

import { Mail, MessageSquare } from "lucide-react";

export function ContactSection() {
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
              <a href="#" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 bg-card border border-border rounded-none shadow-sm">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="font-medium">brianmuema928@gmail.com</span>
              </a>
              <a href="#" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 bg-card border border-border rounded-none shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
                <span className="font-medium">linkedin.com/in/brian-michael-0386a7335</span>
              </a>
              <a href="#" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 bg-card border border-border rounded-none shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </div>
                <span className="font-medium">github.com/brianmuema</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form className="bg-card border border-border p-8 rounded-none shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full p-3 bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full p-3 bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full p-3 bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all"
                  placeholder="Data Project Collaboration"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full p-3 bg-background border border-border rounded-none focus:outline-none focus:border-foreground transition-all resize-none"
                  placeholder="Tell me about your project or problem..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium py-3 rounded-none transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                onClick={(e) => e.preventDefault()}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
