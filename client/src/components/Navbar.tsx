import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Flame,
  Menu,
  X,
  PhoneCall,
  User,
  LogOut,
  MapPin,
  Bot,
  FileText,
  Clock,
  HeartHandshake,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickDialOpen, setQuickDialOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const { activeSOS } = useEmergency();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard', authRequired: true },
    { label: 'Emergency SOS', path: '/emergency', highlight: true },
    { label: 'ResQ AI', path: '/assistant' },
    { label: 'Nearby Help', path: '/nearby-help' },
    { label: 'Contacts', path: '/contacts', authRequired: true },
    { label: 'Report Incident', path: '/report', authRequired: true },
    { label: 'History', path: '/history', authRequired: true },
  ];

  const visibleLinks = navLinks.filter((item) => !item.authRequired || Boolean(currentUser));

  return (
    <>
      <header
        id="main-app-header"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            id="brand-logo-link"
            to={currentUser ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                ResQ<span className="text-rose-600">Now</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight">
                Emergency Response
              </span>
            </div>
          </Link>

          {/* Active SOS badge in navbar if SOS active */}
          {activeSOS && (
            <Link
              to="/emergency"
              id="active-sos-navbar-pill"
              className="hidden md:inline-flex items-center gap-2 px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-bold shadow-md shadow-rose-300 animate-pulse hover:bg-rose-700 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Active Emergency Request #{activeSOS.id.slice(-5)}
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-200 transition-all hover:scale-105"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Quick Dial & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick emergency call button */}
            <button
              id="quick-emergency-dial-btn"
              type="button"
              onClick={() => setQuickDialOpen(!quickDialOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 border border-rose-200 transition-colors"
              title="View Emergency Phone Numbers"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Call Dispatch</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  id="profile-nav-link"
                  to="/profile"
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors ${
                    location.pathname === '/profile' ? 'bg-slate-100' : ''
                  }`}
                  title={userProfile?.fullName || 'Profile'}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline font-medium max-w-[120px] truncate">
                    {userProfile?.fullName || 'My Account'}
                  </span>
                </Link>
                <button
                  id="nav-logout-btn"
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  id="nav-login-btn"
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  id="nav-register-btn"
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-panel"
            className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg"
          >
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    link.highlight
                      ? 'bg-rose-600 text-white font-bold'
                      : isActive
                      ? 'bg-rose-50 text-rose-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.highlight && <ShieldAlert className="w-4 h-4" />}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Quick Dial Emergency Dispatch Popover */}
      {quickDialOpen && (
        <div
          id="quick-dial-overlay"
          className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setQuickDialOpen(false)}
        >
          <div
            id="quick-dial-card"
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-rose-100 p-5 text-slate-800 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Emergency Hotlines</h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickDialOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-3">
              One-tap direct dial for local verified emergency services.
            </p>
            <div className="space-y-2">
              <a
                href="tel:911"
                className="flex items-center justify-between p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-950 font-bold transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs">
                    911
                  </span>
                  <span className="text-sm">US / Canada Emergency</span>
                </div>
                <span className="text-xs text-rose-600 underline">Tap to Call</span>
              </a>

              <a
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-semibold transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs">
                    112
                  </span>
                  <span className="text-sm">European Union / International</span>
                </div>
                <span className="text-xs text-slate-600 underline">Tap to Call</span>
              </a>

              <a
                href="tel:988"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-semibold transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs">
                    988
                  </span>
                  <span className="text-sm">Suicide &amp; Crisis Lifeline</span>
                </div>
                <span className="text-xs text-slate-600 underline">Tap to Call</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation for Rapid Thumb Access */}
      <nav
        id="mobile-bottom-navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex items-center justify-around shadow-lg"
      >
        <Link
          to={currentUser ? '/dashboard' : '/'}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            location.pathname === '/dashboard' || location.pathname === '/'
              ? 'text-rose-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/assistant"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            location.pathname === '/assistant' ? 'text-rose-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>ResQ AI</span>
        </Link>

        {/* Big SOS button in center */}
        <Link
          to="/emergency"
          id="mobile-bottom-sos-btn"
          className="relative -top-4 w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-300 active:scale-95 transition-transform"
        >
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </Link>

        <Link
          to="/nearby-help"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            location.pathname === '/nearby-help' ? 'text-rose-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Nearby</span>
        </Link>

        <Link
          to={currentUser ? '/contacts' : '/login'}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            location.pathname === '/contacts' ? 'text-rose-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Contacts</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
