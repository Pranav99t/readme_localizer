import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [navData, setNavData] = useState(null);
  const { isAuthenticated } = useAuth();

  const handleNavigate = useCallback((page, data = null) => {
    setNavData(data);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
        page_location: window.location.href,
        page_path: `/${currentPage}`
      });
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} navData={navData} />;
      case 'dashboard':
        return isAuthenticated
          ? <DashboardPage onNavigate={handleNavigate} />
          : <AuthPage onNavigate={handleNavigate} navData={{ returnTo: 'dashboard' }} />;
      case 'project':
        return isAuthenticated
          ? <ProjectPage onNavigate={handleNavigate} navData={navData} />
          : <AuthPage onNavigate={handleNavigate} navData={{ returnTo: 'project', ...navData }} />;
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <div className="app-background"></div>
      <div className="grid-overlay"></div>
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
