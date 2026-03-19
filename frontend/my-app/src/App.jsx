import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import AuthModal from "./components/AuthModal";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import MedicinePage from "./pages/MedicinePage";
import DoctorPage from "./pages/DoctorPage";
import HealthcarePage from "./pages/HealthcarePage";
import CartPage from "./pages/CartPage";
import ViewBooking from "./pages/ViewBooking";
import LabTest from "./pages/LabTest";
import LabBook from "./components/LabBook";

import MedicineCat from "./components/MedicineCat";
import MedicineCard from "./components/MedicineCard";
import Women from "./pages/Women";
import WomenCat from "./components/WomenCat";
import WomenCard from "./components/WomenCard";
import Children from "./pages/Children";
import ChildrenCat from "./components/ChildrenCat";
import ChildrenCard from "./components/ChildrenCard";
import MenPage from "./pages/MenPage";
import MenCategory from "./components/MenCategory";
import MenProductCard from "./components/MenProductCard";
import ElderPage from "./pages/ElderPage";
import ElderCategory from "./components/ElderCategory";
import ElderProductCard from "./components/ElderProductCard";

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Check persistence
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.clear();
      }
    }

    // 2. Scroll Reveal Observer
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out successfully");
  };

  return (
    <>
      <Header
        openLogin={() => setShowLogin(true)}
        user={user}
        handleLogout={handleLogout}
      />
      
      <CategoryNav />

      <main className={`page-content ${showLogin ? "blurred" : ""}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={
              user ? <Navigate to="/dashboard" replace /> : <PageWrapper><HomePage /></PageWrapper>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute user={user}>
                <PageWrapper><Dashboard user={user} /></PageWrapper>
              </ProtectedRoute>
            } />

            {/* Medicine */}
            <Route path="/medicine" element={<PageWrapper><MedicinePage /></PageWrapper>} />
            <Route path="/medicine/category/:category" element={<PageWrapper><MedicineCat /></PageWrapper>} />
            <Route path="/medicine/details/:id" element={<PageWrapper><MedicineCard user={user} /></PageWrapper>} />

            {/* Women */}
            <Route path="/women" element={<PageWrapper><Women /></PageWrapper>} />
            <Route path="/women/category/:category" element={<PageWrapper><WomenCat /></PageWrapper>} />
            <Route path="/women/details/:id" element={<PageWrapper><WomenCard user={user} /></PageWrapper>} />

            {/* Children */}
            <Route path="/child" element={<PageWrapper><Children /></PageWrapper>} />
            <Route path="/child/category/:category" element={<PageWrapper><ChildrenCat /></PageWrapper>} />
            <Route path="/child/details/:id" element={<PageWrapper><ChildrenCard user={user} /></PageWrapper>} />

            {/* Men */}
            <Route path="/men" element={<PageWrapper><MenPage /></PageWrapper>} />
            <Route path="/men/category/:category" element={<PageWrapper><MenCategory /></PageWrapper>} />
            <Route path="/men/details/:id" element={<PageWrapper><MenProductCard user={user} /></PageWrapper>} />

            {/* Elder */}
            <Route path="/elder" element={<PageWrapper><ElderPage /></PageWrapper>} />
            <Route path="/elder/category/:category" element={<PageWrapper><ElderCategory /></PageWrapper>} />
            <Route path="/elder/details/:id" element={<PageWrapper><ElderProductCard user={user} /></PageWrapper>} />

            {/* Others */}
            <Route path="/doctor-consult" element={<PageWrapper><DoctorPage user={user} /></PageWrapper>} />
            <Route path="/healthcare" element={<PageWrapper><HealthcarePage user={user} /></PageWrapper>} />
            <Route path="/lab-tests" element={<PageWrapper><LabTest/></PageWrapper>} />
            <Route path="/test" element={<PageWrapper><LabBook user={user}/></PageWrapper>} />
            
            <Route path="/cart" element={
              <ProtectedRoute user={user}>
                <PageWrapper><CartPage user={user}/></PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/view" element={
              <ProtectedRoute user={user}>
                <PageWrapper><ViewBooking user={user}/></PageWrapper>
              </ProtectedRoute>
            } />

            {/* Redirects */}
            <Route path="/login" element={<Navigate to={user ? "/dashboard" : "/"} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
        <ToastContainer position="top-right" autoClose={2000} />
      </main>

      <AuthModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        setUser={setUser} 
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
