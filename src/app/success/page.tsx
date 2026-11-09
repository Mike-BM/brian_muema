import Link from 'next/link';

export const metadata = {
  title: 'Message Sent | Brian Muema Michael',
  robots: 'noindex, nofollow',
};

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <svg className="h-20 w-20 text-green-500 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <h1 className="text-4xl font-bold text-foreground mb-4">Message Received!</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Thank you for reaching out. I&apos;ve received your message and will get back to you as soon as possible to discuss your data needs.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
