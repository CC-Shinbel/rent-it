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
import ClientShellLayout from './client/ClientShellLayout.jsx';
import ClientDashboardPage from './client/ClientDashboardPage.jsx';
import ClientCatalogPage from './client/ClientCatalogPage.jsx';
import ClientCartPage from './client/ClientCartPage.jsx';
import ClientFavoritesPage from './client/ClientFavoritesPage';
import ClientMyRentalsPage from './client/ClientMyRentalsPage.jsx';
import ClientCheckoutPage from './client/ClientCheckoutPage.jsx';
import ClientBookingHistoryPage from './client/ClientBookingHistoryPage.jsx';
import ClientReturnsPage from './client/ClientReturnsPage.jsx';
import ClientPendingPage from './client/ClientPendingPage.jsx';
import ClientProfilePage from './client/ClientProfilePage.jsx';
import ClientContactPage from './client/ClientContactPage.jsx';
import ClientItemDetailPage from './client/ClientItemDetailPage.jsx';

const THEME_KEY = 'rentit-theme';

function applyTheme(theme) {
  const value = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', value);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(saved);
}

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
  React.useEffect(() => {
    initTheme();
  }, []);

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

          path="/client/cart"

          element={(

            <ClientShellLayout>

              <ClientCartPage />

            </ClientShellLayout>

          )}

        />



        <Route

          path="/client/checkout"

          element={(

            <ClientShellLayout>

              <ClientCheckoutPage />

            </ClientShellLayout>

          )}

        />



        <Route
          path="/client/myrentals"
          element={(
            <ClientShellLayout>
              <ClientMyRentalsPage />
            </ClientShellLayout>
          )}
        />

        <Route
          path="/client/bookinghistory"
          element={(
            <ClientBookingHistoryPage />
          )}
        />
        <Route
          path="/client/returns"
          element={(
            <ClientReturnsPage />
          )}
        />
        <Route
          path="/client/pending"
          element={(
            <ClientShellLayout>
              <ClientPendingPage />
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

        <Route
          path="/client/item/:id"
          element={(
            <ClientShellLayout>
              <ClientItemDetailPage />
            </ClientShellLayout>
          )}
        />

        <Route
          path="/client/profile"
          element={(
            <ClientShellLayout>
              <ClientProfilePage />
            </ClientShellLayout>
          )}
        />

        <Route
          path="/client/contact"
          element={(
            <ClientShellLayout>
              <ClientContactPage />
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

