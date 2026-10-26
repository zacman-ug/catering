import Hero from '../components/ui/Hero.jsx';
import QuoteEstimator from '../components/QuoteEstimator.jsx';
import SeoHead from '../components/SeoHead.jsx';

export default function QuotePage() {
  return (
    <>
      <SeoHead title="Quote Estimator" description="Estimate your catering budget in UGX." path="/quote" />
      <Hero title="Quote Estimator" subtitle="Get a rough UGX range instantly — final quote confirmed after menu planning." />
      <section id="quote-tool" className="scroll-target py-16">
        <div className="max-w-3xl mx-auto px-4">
          <QuoteEstimator />
        </div>
      </section>
    </>
  );
}
