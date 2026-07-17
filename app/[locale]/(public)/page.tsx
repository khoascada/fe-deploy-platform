import { EngineeringHighlights } from './components/engineering-highlights';
import { InterviewNotes } from './components/interview-notes';
import { LandingHeader } from './components/landing-header';
import { LandingHero } from './components/landing-hero';
import { ProductSnapshot } from './components/product-snapshot';

const PageLanding = () => {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <section className="mx-auto flex w-full flex-col gap-8 py-6">
        <LandingHeader />

        <div className='flex flex-col px-10 gap-8 '>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(34rem,1fr)]">
            <LandingHero />
            <ProductSnapshot />
          </div>

          <EngineeringHighlights />
          <InterviewNotes />
        </div>
      </section>
    </main>
  );
};

export default PageLanding;