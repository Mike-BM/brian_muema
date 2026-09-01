import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        It seems the page you&apos;re looking for doesn&apos;t exist, or has been moved. 
        Let&apos;s get you back on track.
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
