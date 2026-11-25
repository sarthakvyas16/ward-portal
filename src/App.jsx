
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomeLeadership from "./components/HomeLeadership";
import LatestUpdates from "./components/LatestUpdates";
import Development from "./components/Development";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintTracking from "./components/ComplaintTracking";
import AboutContact from "./components/AboutContact";
import Footer from "./components/Footer";

import NewsPage from "./pages/NewsPage";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import DevelopmentPage from "./pages/DevelopmentPage";
import DevelopmentDetailsPage from "./pages/DevelopmentDetailsPage";
import NewsDetailsPage from "./pages/NewsDetailsPage";
import WardTeam from "./pages/WardTeam";
import VisitorCounter from "./components/VisitorCounter";
import { SpeedInsights } from "@vercel/speed-insights/react";

function Home() {
  return (
    <main className="min-h-screen bg-[#161316]">
      <Navbar />

      {/* Main Ward Leadership */}
      <HomeLeadership />

      {/* Latest News */}
      <LatestUpdates />

      {/* Development Works */}
      <Development />

      {/* Complaint Registration */}
      <ComplaintForm />

      {/* Complaint Tracking */}
      <ComplaintTracking />

      {/* About & Contact */}
      <AboutContact />

      {/* Footer */}
      <Footer />
    </main>
  );
}

function AdminWrapper() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("admin_token")
  );

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setLoggedIn(false);
  }

  return loggedIn ? (
    <Admin onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={() => setLoggedIn(true)} />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/admin" element={<AdminWrapper />} />
        <Route path="/development" element={<DevelopmentPage />} />
        <Route path="/development/:id" element={<DevelopmentDetailsPage />} />
        <Route path="/news/:id" element={<NewsDetailsPage />} />
        <Route path="/ward-team" element={<WardTeam />} />
      </Routes>

    <SpeedInsights />
      
    </BrowserRouter>
    
  );
}
