import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import HashScrollHandler from '../routing/HashScrollHandler.jsx';
import OfflineBar from '../OfflineBar.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded">Skip to content</a>
      <HashScrollHandler />
      <OfflineBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
