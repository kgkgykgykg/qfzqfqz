import { HashRouter, Routes, Route } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import { ThemeProvider } from './context/ThemeContext';
import { ApiKeyProvider } from './context/ApiKeyContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Security from './pages/Security';
import Legal from './pages/Legal';
import EmailVerificationPortal from './components/EmailVerificationPortal';
import MaintenanceOverlay from './components/MaintenanceOverlay';

import Admin from './pages/Admin';
import Affiliate from './pages/Affiliate';
import Join from './pages/Join';
import ToolInfo from './pages/ToolInfo';
import SimplePage from './pages/SimplePage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <ApiKeyProvider>
            {/* Custom automatic email verification & activation loader */}
            <EmailVerificationPortal />
            <MaintenanceOverlay />
            
            <HashRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/security" element={<Security />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/tools/:toolId" element={<ToolInfo />} />
                <Route path="/:pageId" element={<SimplePage />} />
                <Route path="/university" element={<SimplePage />} />
                <Route path="/faq" element={<SimplePage />} />
                <Route path="/blog" element={<SimplePage />} />
                <Route path="/community" element={<SimplePage />} />
                <Route path="/promo/:promoCode" element={<Join />} />
              </Routes>
            </HashRouter>
          </ApiKeyProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
