"use client";

import { useState, useEffect } from "react";
import { Mail, MessageSquare, Loader2, CheckCircle2, Send, HelpCircle, Users, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface LearningContactSectionProps {
  initialInquiryType?: string;
  initialWorkshop?: string;
}

export function LearningContactSection({
  initialInquiryType = "Join a Learning Program",
  initialWorkshop = "",
}: LearningContactSectionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryType, setInquiryType] = useState(initialInquiryType);
  const [learningTrack, setLearningTrack] = useState("Data Analysis");
  const [preferredFormat, setPreferredFormat] = useState("Online (Google Meet / Zoom)");
  const [selectedWorkshop, setSelectedWorkshop] = useState(initialWorkshop);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialWorkshop) {
      setSelectedWorkshop(initialWorkshop);
      setInquiryType("Register for a Workshop");
    }
  }, [initialWorkshop]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;

    const subject = `[Learning Hub] ${inquiryType} - ${name}`;
    const structuredMessage = `
--- Learning Hub Inquiry Details ---
Inquiry Type: ${inquiryType}
Learning Track: ${learningTrack}
Preferred Format: ${preferredFormat}
${selectedWorkshop ? `Selected Workshop: ${selectedWorkshop}` : ""}

Learner Name: ${name}
Learner Email: ${email}

Message / Goals:
${notes}
    `.trim();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", structuredMessage);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
        form.reset();
      } else {
        alert("There was an issue submitting your request. Please try again or reach out directly via email.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an issue submitting your request. Please try again or reach out directly via email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-registration" className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
            Get Started
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Connect, Register, or Request Training
          </h2>
          <div className="h-1 w-20 bg-primary rounded mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Whether you want to join an upcoming workshop, register for guided mentorship, request customized training for your group, or ask a question about our resources—reach out below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl">
          {/* Left Column: Direct channels and overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border p-6 rounded-none shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-foreground">Why Learn With Brian?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Practical Focus:</strong> Every session centers on working Python code and real datasets.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Statistical Rigor:</strong> Backed by training in Economics & Statistics to explain the &ldquo;why&rdquo; behind the math.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Proven Track Record:</strong> Mentored university coursemates and junior analysts who have built production portfolios.</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 border border-border p-6 rounded-none space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Direct Contact Channels
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href="mailto:brianmuema928@gmail.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="break-all">brianmuema928@gmail.com</span>
                </a>
                <a
                  href="https://wa.me/254793706054"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageSquare className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>WhatsApp: +254 793 706054</span>
                </a>
                <a
                  href="https://linkedin.com/in/brian-michael-0386a7335"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Users className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>LinkedIn: Brian Muema</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Registration Form */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="bg-card border border-green-500/30 p-8 rounded-none shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Registration Received!</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Brian has received your learning interest and will get back to you with next steps, workshop details, or scheduling availability shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border p-6 sm:p-8 rounded-none shadow-sm space-y-6"
              >
                {/* Inquiry Type Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    What would you like to do? *
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full p-3 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
                    required
                  >
                    <option value="Join a Learning Program">Join a Learning Program (Mentorship / Track)</option>
                    <option value="Register for a Workshop">Register for an Upcoming Workshop</option>
                    <option value="Request Custom / Institutional Training">Request Training for My Group / Coursemates</option>
                    <option value="Questions about Learning Resources">Questions about Learning Resources / Notes</option>
                    <option value="General Inquiry">General Learning Hub Inquiry</option>
                  </select>
                </div>

                {/* Conditional workshop input or learning track */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Track of Interest *
                    </label>
                    <select
                      value={learningTrack}
                      onChange={(e) => setLearningTrack(e.target.value)}
                      className="w-full p-3 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
                    >
                      <option value="Data Analysis">Data Analysis Path</option>
                      <option value="Data Science">Data Science Path</option>
                      <option value="Both Paths">Both Tracks</option>
                      <option value="Custom Topic">Specific Custom Topic</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Preferred Format
                    </label>
                    <select
                      value={preferredFormat}
                      onChange={(e) => setPreferredFormat(e.target.value)}
                      className="w-full p-3 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
                    >
                      <option value="Online (Google Meet / Zoom)">Online (Google Meet / Zoom)</option>
                      <option value="Physical (Nairobi / Campus)">Physical (Nairobi / Campus Lab)</option>
                      <option value="Self-Paced with Feedback">Self-Paced with Code Review</option>
                    </select>
                  </div>
                </div>

                {/* If Workshop is selected, allow naming the workshop */}
                {inquiryType === "Register for a Workshop" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Workshop Title or Date
                    </label>
                    <input
                      type="text"
                      value={selectedWorkshop}
                      onChange={(e) => setSelectedWorkshop(e.target.value)}
                      placeholder="e.g. Hands-on Exploratory Data Analysis & Storytelling"
                      className="w-full p-3 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
                    />
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="learner-name" className="text-sm font-medium text-foreground">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="learner-name"
                      name="name"
                      required
                      placeholder="e.g. Jane Doe"
                      className="w-full p-3 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="learner-email" className="text-sm font-medium text-foreground">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="learner-email"
                      name="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full p-3 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground"
                    />
                  </div>
                </div>

                {/* Message / Goals */}
                <div className="space-y-2">
                  <label htmlFor="learner-notes" className="text-sm font-medium text-foreground">
                    Your Learning Goals or Questions *
                  </label>
                  <textarea
                    id="learner-notes"
                    name="notes"
                    required
                    rows={4}
                    placeholder="Tell me a bit about your current background, your goals, or specific questions about the materials..."
                    className="w-full p-3 bg-background border border-border text-sm text-foreground focus:outline-none focus:border-foreground resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-medium py-3 rounded-none transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-foreground disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Learning Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

