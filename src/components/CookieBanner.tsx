"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 shadow-lg">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          This website uses cookies to ensure you get the best experience on our website. 
          By continuing to use this site, you agree to our 
          <Link href="/privacy" className="text-primary hover:underline ml-1">Privacy Policy</Link>.
        </p>
        <button 
          onClick={accept}
          className="whitespace-nowrap bg-foreground text-background px-6 py-2 text-sm font-medium rounded-md hover:bg-foreground/90 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
