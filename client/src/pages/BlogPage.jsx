import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/ui/Hero.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import SeoHead from '../components/SeoHead.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';

export default function BlogPage() {
  const fetchPosts = useCallback(() => api.getBlogPosts(), []);
  const { data, loading } = useApi(fetchPosts);

  return (
    <>
      <SeoHead title="Recipes & Blog" description="Cook with Chef Godwin — recipes and catering tips." path="/blog" />
      <Hero title="Recipes & Blog" subtitle="Cook with Chef Godwin at home." />
      <section className="py-16 max-w-4xl mx-auto px-4">
        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {(data || []).map((post) => (
              <article key={post.id} className="bg-white border border-stone-200 rounded-xl p-5">
                <h2 className="font-display text-xl font-bold text-brand-900">
                  <Link to={`/blog/${post.slug}`} className="hover:text-brand-700">{post.title}</Link>
                </h2>
                <p className="text-sm text-stone-600 mt-2">{post.excerpt}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
