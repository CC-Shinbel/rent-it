import React from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import WipPage from './pages/WipPage';
import HomePage from './pages/HomePage';
import ClientLoginPage from './client/ClientLoginPage';
import ClientShellLayout from './client/ClientShellLayout';
import ClientDashboardPage from './client/ClientDashboardPage';
import ClientCatalogPage from './client/ClientCatalogPage';
import ClientFavoritesPage from './client/ClientFavoritesPage';

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/wip" element={<WipPage />} />
        <Route path="/login" element={<ClientLoginPage />} />


        <Route
          path="/client/dashboard"
          element={(
            <ClientShellLayout>
              <ClientDashboardPage />
            </ClientShellLayout>
          )}
        />
        <Route
          path="/client/catalog"
          element={(
            <ClientShellLayout>
              <ClientCatalogPage />
            </ClientShellLayout>
          )}
        />

        <Route
          path="/client/favorites"
          element={(
            <ClientShellLayout>
              <ClientFavoritesPage />
            </ClientShellLayout>
          )}
        />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
