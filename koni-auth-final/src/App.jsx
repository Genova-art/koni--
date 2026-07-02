import { useState, useEffect } from "react";
import "./styles.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ThemeColorProvider } from "./context/ThemeColorContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { LangProvider } from "./components/MultiLanguage";
import AuthModal from "./components/auth/AuthModal";
import Dashboard from "./components/auth/Dashboard";
import VerifyEmailPage from "./components/auth/VerifyEmailPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import ToastContainer from "./components/ToastContainer";
import SearchModal from "./components/SearchModal";
import LoadingScreen from "./components/LoadingScreen";
import ScrollProgress from "./components/ScrollProgress";
import ChatbotKONI from "./components/ChatbotKONI";
import CustomCursor from "./components/CustomCursor";
import NewsTicker from "./components/NewsTicker";
import BookmarkPanel from "./components/BookmarkPanel";
import Konfeti from "./components/Konfeti";
import EasterEgg from "./components/EasterEgg";
import OfflineBanner from "./components/OfflineBanner";
import AccessibilityMenu from "./components/AccessibilityMenu";
import WhatsappShare from "./components/WhatsappShare";
import PresentasiMode from "./components/PresentasiMode";
import LiveScore from "./components/LiveScore";
import BadgeSystem from "./components/BadgeSystem";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Profil from "./components/Profil";
import Timeline from "./components/Timeline";
import Cabor from "./components/Cabor";
import Atlet from "./components/Atlet";
import ProgressTrackerAtlet from "./components/ProgressTrackerAtlet";
import BandingkanAtlet from "./components/BandingkanAtlet";
import GrafikPrestasi from "./components/GrafikPrestasi";
import BarRaceChart from "./components/BarRaceChart";
import HeatMapPrestasi from "./components/HeatMapPrestasi";
import PapanMedali from "./components/PapanMedali";
import MedalPodium3D from "./components/MedalPodium3D";
import PetaIndonesia from "./components/PetaIndonesia";
import AIRekomendasiCabor from "./components/AIRekomendasiCabor";
import Berita from "./components/Berita";
import Jadwal from "./components/Jadwal";
import VideoHighlight from "./components/VideoHighlight";
import KuisOlahraga from "./components/KuisOlahraga";
import Leaderboard from "./components/Leaderboard";
import SpinWheel from "./components/SpinWheel";
import Galeri from "./components/Galeri";
import Banner from "./components/Banner";
import NewsletterSubscribe from "./components/NewsletterSubscribe";
import Kontak from "./components/Kontak";
import Footer from "./components/Footer";
import { ScrollToTop } from "./components/UI";

const DARK_BG = "#080E1A";

function AppInner() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const [scrolled, setScrolled]             = useState(false);
  const [authOpen, setAuthOpen]             = useState(false);
  const [authView, setAuthView]             = useState("login");
  const [dashOpen, setDashOpen]             = useState(false);
  const [showVerify, setShowVerify]         = useState(false);
  const [showReset, setShowReset]           = useState(false);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [loading, setLoading]               = useState(true);
  const [bookmarkOpen, setBookmarkOpen]     = useState(false);
  const [welcomeKonfeti, setWelcomeKonfeti] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path   = window.location.pathname.toLowerCase();
    if (path.includes("reset-password") || params.get("resetToken")) { setShowReset(true); return; }
    if (params.get("token")) setShowVerify(true);
  }, []);

  useEffect(() => {
    const h = () => logout();
    window.addEventListener("koni-logout", h);
    return () => window.removeEventListener("koni-logout", h);
  }, [logout]);

  useEffect(() => { if (user && authOpen) { setAuthOpen(false); setDashOpen(true); } }, [user]);
  useEffect(() => { if (user?.role?.toLowerCase() === "admin") setDashOpen(true); }, [user]);

  useEffect(() => {
    const h    = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(p => !p); } };
    const openH  = () => setSearchOpen(true);
    const openBm = () => setBookmarkOpen(true);
    window.addEventListener("keydown", h);
    window.addEventListener("koni-open-search", openH);
    window.addEventListener("koni-open-bookmarks", openBm);
    return () => {
      window.removeEventListener("keydown", h);
      window.removeEventListener("koni-open-search", openH);
      window.removeEventListener("koni-open-bookmarks", openBm);
    };
  }, []);

  const handleLoadDone = () => {
    setLoading(false);
    if (!localStorage.getItem("koni-visited")) {
      localStorage.setItem("koni-visited", "1");
      setTimeout(() => setWelcomeKonfeti(true), 800);
    }
  };

  const openLogin    = () => { setAuthView("login");    setAuthOpen(true); };
  const openRegister = () => { setAuthView("register"); setAuthOpen(true); };

  if (showVerify) return <VerifyEmailPage />;
  if (showReset)  return <ResetPasswordPage />;

  return (
    <>
      {loading && <LoadingScreen onDone={handleLoadDone} />}
      <div
        data-theme={isDark ? "dark" : "light"}
        style={{
          fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
          overflowX: "hidden",
          background: isDark ? DARK_BG : "#fff",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Global UI */}
        <EasterEgg />
        <CustomCursor />
        <ScrollProgress />
        <OfflineBanner />
        <NewsTicker scrolled={scrolled} />
        <Konfeti active={welcomeKonfeti} onDone={() => setWelcomeKonfeti(false)} />

        <Navbar
          scrolled={scrolled}
          onOpenLogin={openLogin}
          onOpenRegister={openRegister}
          onOpenDashboard={() => setDashOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Sections */}
        <Hero onOpenRegister={openRegister} />
        <StatsBar />
        <Profil />
        <Timeline />
        <Cabor />
        <Atlet />
        <ProgressTrackerAtlet />
        <BandingkanAtlet />
        <AIRekomendasiCabor />
        <GrafikPrestasi />
        <BarRaceChart />
        <HeatMapPrestasi />
        <PapanMedali />
        <MedalPodium3D />
        <PetaIndonesia />
        <Berita />
        <Jadwal />
        <VideoHighlight />
        <KuisOlahraga />
        <Leaderboard />
        <SpinWheel />
        <Galeri />
        <Banner />
        <NewsletterSubscribe />
        <Kontak />
        <Footer onOpenLogin={openLogin} onOpenRegister={openRegister} />

        {/* Floating */}
        <ScrollToTop />
        <ChatbotKONI />
        <WhatsappShare />
        <PresentasiMode />
        <AccessibilityMenu />
        <BadgeSystem />
        <LiveScore />

        {/* Panels */}
        <BookmarkPanel open={bookmarkOpen} onClose={() => setBookmarkOpen(false)} />
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialView={authView} />
        {dashOpen && user && <Dashboard onClose={() => setDashOpen(false)} />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeColorProvider>
        <ThemeProvider>
          <BookmarkProvider>
            <LangProvider>
              <ToastProvider>
                <ToastContainer />
                <AppInner />
              </ToastProvider>
            </LangProvider>
          </BookmarkProvider>
        </ThemeProvider>
      </ThemeColorProvider>
    </AuthProvider>
  );
}
