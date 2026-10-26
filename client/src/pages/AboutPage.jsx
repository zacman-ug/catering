import Hero from '../components/ui/Hero.jsx';
import SeoHead from '../components/SeoHead.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function AboutPage() {
  const { business } = useBusiness();
  const credentials = business.chefCredentials || [];

  return (
    <>
      <SeoHead title="About Chef Godwin" description="Meet Godwin Kasozi — caterer and culinary educator in Kampala." path="/about" />
      <Hero title="About Chef Godwin" subtitle="Passion for food, excellence in service." />

      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 prose prose-stone">
          <h2 className="font-display text-2xl font-bold text-brand-900">Meet Godwin Kasozi</h2>
          <p className="text-stone-600 leading-relaxed">
            Chef Godwin Kasozi is a professional chef and caterer based in Kampala, Uganda.
            Known across social media as <strong>Chef Godwin Uganda</strong>, he shares recipes,
            cooking tips, and behind-the-scenes content from large-scale catering events — often
            serving hundreds of guests at weddings, introductions, and corporate functions.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Through <strong>{business.name}</strong>, Chef Godwin provides full outside catering
            services using fresh, locally sourced ingredients. His team handles everything from
            menu planning to on-site cooking and service, so you can focus on your celebration.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Recently, Chef Godwin opened the <strong>Godwin Cooking School</strong> at{' '}
            {business.address}, offering structured culinary training for home cooks and
            aspiring professional caterers.
          </p>

          {credentials.length > 0 && (
            <>
              <h3 className="font-display text-xl font-bold text-brand-900 mt-8">Experience & credentials</h3>
              <ul className="text-stone-600 space-y-2">
                {credentials.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          )}

          <h3 className="font-display text-xl font-bold text-brand-900 mt-8">What We Cater</h3>
          <ul className="text-stone-600 space-y-1">
            <li>Weddings & receptions</li>
            <li>Introduction ceremonies (Kwanjula / Kuhingira)</li>
            <li>Birthdays & graduations</li>
            <li>Corporate meetings & conferences</li>
            <li>House parties & religious gatherings</li>
          </ul>
        </div>
      </section>
    </>
  );
}
