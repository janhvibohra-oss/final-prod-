import { useState, useEffect } from "react";
// Import the global styles Person 1 set up
import "./styles/index.css";
import "./styles/animations.css";

// Import the shared UI components
import CustomCursor from "./components/ui/CustomCursor";
import Navbar from "./components/layout/Navbar";
import LoginModal from "./components/auth/LoginModal";

// Import the Page components (These will be built by Persons 3, 4, and 5)
// Note: You will need to create these files (even as empty shells) for the app to run!
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

export default function App() {
  // 'landing' is the default view when the site loads
  const [page, setPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [zapierReady, setZapierReady] = useState(false);

  // Restore token on reload if it exists
  useEffect(() => {
    const stored = localStorage.getItem('scaleready_token');
    if (stored) {
      setAuthToken(stored);
      setIsAuthenticated(true);
    }
  }, []);

  // Detect when the Zapier Interfaces script has registered the custom element
  useEffect(() => {
    if (customElements && customElements.get('zapier-interfaces-chatbot-embed')) {
      setZapierReady(true);
      return;
    }

    const check = () => {
      if (customElements.get('zapier-interfaces-chatbot-embed')) {
        setZapierReady(true);
        clearInterval(id);
      }
    };

    const id = setInterval(check, 500);
    return () => clearInterval(id);
  }, []);

  // Navigation functions passed as "props" to children
  const goGetStarted = () => { 
    setPage('onboarding'); 
    window.scrollTo(0, 0); 
  };
  
  const goLogin = () => { 
    setShowLogin(true); 
  };
  
  const goDashboard = () => { 
    setPage('dashboard'); 
    window.scrollTo(0, 0); 
  };

  const goHome = () => {
    setPage('landing');
    window.scrollTo(0, 0);
  };

  // When the 5-step onboarding flow is complete, send the data
  // to the backend, which relays it to the Zapier chatbot.
  const handleOnboardingComplete = async (formData) => {
    try {
     const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Surface validation or connection errors to the user
        alert(data.error || 'There was a problem submitting your information. Please try again.');
        return;
      }

      console.log('Onboarding submitted to backend/Zapier:', data);
      // Treat a successful onboarding as an authenticated session
      setIsAuthenticated(true);
      goDashboard();
    } catch (err) {
      console.error('Error submitting onboarding form:', err);
      alert('Could not reach the ScaleReady backend. Please make sure the server is running on http://localhost:5000.');
    }
  };

  return (
    <div className="app-container">
      {/* These UI elements stay visible across all pages */}
      <CustomCursor />
      <Navbar 
        onGetStarted={goGetStarted} 
        onLogin={goLogin} 
        onLogoClick={goHome}
        currentPage={page}
      />

      {/* Conditional Rendering: Show only the active page */}
      <main>
        {page === 'landing' && (
          <Landing onGetStarted={goGetStarted} onLogin={goLogin} />
        )}
        
        {page === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {page === 'dashboard' && (
          <Dashboard onGetStarted={goGetStarted} />
        )}
      </main>

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={(token) => {
          setAuthToken(token || null);
          setIsAuthenticated(true);
          setPage('dashboard');
          window.scrollTo(0, 0);
        }}
      />

      {/* Global Zapier Interfaces Chatbot popup (auto-opens when ready) */}
      {zapierReady && (
        <zapier-interfaces-chatbot-embed
          is-popup="true"
          chatbot-id="cmmhjc15s0009101rpn2y5n7m"
          auto-open="true"
        ></zapier-interfaces-chatbot-embed>
      )}
    </div>
  );
}
