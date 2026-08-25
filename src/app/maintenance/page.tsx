"use client";

import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">We&apos;ll be back soon!</h1>
        <p className="text-muted-foreground mb-8">
          Sorry for the inconvenience but we&apos;re performing some maintenance at the moment. We&apos;ll be back online shortly!
        </p>
      </div>
    </div>
  );
}
