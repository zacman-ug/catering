import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { inputClass } from '../../utils/formStyles.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email, password });
      if (!res?.data?.token) {
        throw new Error('Login failed');
      }
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 section-band-warm">
      <form onSubmit={handleSubmit} className="w-full max-w-md surface-card p-8 md:p-10 space-y-5">
        <div className="text-center mb-2">
          <span className="logo-mark mx-auto mb-4" aria-hidden>CG</span>
          <h1 className="font-display text-2xl font-bold text-brand-900">Admin login</h1>
          <p className="text-sm text-stone-500 mt-1">Chef Godwin dashboard</p>
        </div>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputClass} />
        <button type="submit" disabled={loading} className="btn-primary w-full !rounded-xl">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
