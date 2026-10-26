import { useBusiness } from '../context/BusinessContext.jsx';

export default function VideoHeroStrip() {
  const { business } = useBusiness();
  if (!business.videoUrl) return null;

  return (
    <section className="relative py-12 md:py-14 overflow-hidden bg-brand-900">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_50%,rgba(255,200,143,0.25),transparent_50%)]" />
      <div className="relative max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-center md:text-left">
        <div>
          <p className="eyebrow !text-brand-200 mb-2">Video</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Watch Chef Godwin in action</h2>
          <p className="text-brand-100/90 text-sm mt-2 max-w-md">Large-scale cooking, plating, and event service — straight from the kitchen.</p>
        </div>
        <a
          href={business.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary shrink-0 mx-auto md:mx-0"
        >
          Open video highlights
        </a>
      </div>
    </section>
  );
}
