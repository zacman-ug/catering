import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import SeoHead from '../components/SeoHead.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';

export default function BlogPostPage() {
  const { slug } = useParams();
  const fetchPost = useCallback(() => api.getBlogPost(slug), [slug]);
  const { data: post, loading, error } = useApi(fetchPost);

  if (loading) return <LoadingSpinner />;
  if (error || !post) return <p className="p-8 text-center">{error || 'Post not found'}</p>;

  return (
    <>
      <SeoHead title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} />
      <article className="max-w-3xl mx-auto px-4 py-16 prose prose-stone">
        <Link to="/blog" className="text-brand-700 no-underline">← Back to blog</Link>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  );
}
