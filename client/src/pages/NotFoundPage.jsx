import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="py-24 md:py-32 px-4 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-800 mb-4">Page not found</h1>
      <p className="text-stone-600 mb-8 max-w-md mx-auto">This page may have moved. Head back home or book catering directly.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-outline">
          Back to home
        </Link>
        <Link to="/book#booking-form" className="btn-primary">
          Book catering
        </Link>
      </div>
    </section>
  );
}
