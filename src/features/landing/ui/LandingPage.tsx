import { Hero } from '@/features/landing/ui/components/Hero';
import { LandingBackdrop } from '@/features/landing/ui/components/LandingBackdrop';
import { LandingNavbar } from '@/features/landing/ui/components/LandingNavbar';

export function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingBackdrop />
      <LandingNavbar />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
    </div>
  );
}
