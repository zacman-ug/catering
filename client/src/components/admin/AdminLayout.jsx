import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-brand-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold">Chef Godwin Admin</p>
            <p className="text-xs text-brand-100">Bookings, enrollments & messages</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-brand-100 hover:text-white">View site</Link>
            <button type="button" onClick={logout} className="font-semibold">Log out</button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
