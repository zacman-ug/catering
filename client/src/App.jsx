import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminRoute from './components/admin/AdminRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import CateringPage from './pages/CateringPage.jsx';
import SchoolPage from './pages/SchoolPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import BookPage from './pages/BookPage.jsx';
import MenusPage from './pages/MenusPage.jsx';
import QuotePage from './pages/QuotePage.jsx';
import ChecklistPage from './pages/ChecklistPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import CaseStudiesPage from './pages/CaseStudiesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catering" element={<CateringPage />} />
        <Route path="school" element={<SchoolPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="menus" element={<MenusPage />} />
        <Route path="quote" element={<QuotePage />} />
        <Route path="checklist" element={<ChecklistPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="case-studies" element={<CaseStudiesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
