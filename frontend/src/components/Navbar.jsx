import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/RecentActivityContext';
import {
  FileText, ChevronDown, Menu, X, Zap, User,
  LogOut, Settings, LayoutDashboard, Crown
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isPro } = useAuth();
  const { activities } = useActivity();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Tools', href: '/tools' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px 0',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        background: scrolled ? 'rgba(8, 12, 20, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'var(--gradient-accent)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59,130,246,0.3)',
          }}>
            <FileText size={18} color="white" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}>
            PDF<span style={{ color: 'var(--accent-bright)' }}>Craft</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                color: location.pathname === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: location.pathname === link.href ? 'var(--accent-subtle)' : 'transparent',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text-primary)';
                if (location.pathname !== link.href) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                if (location.pathname !== link.href) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isPro && (
            <Link to="/pricing" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}>
              <Zap size={14} color="#fbbf24" />
              Upgrade
            </Link>
          )}

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--gradient-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'white',
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                {isPro && <span className="badge badge-pro" style={{ padding: '2px 6px', fontSize: '0.6rem' }}><Crown size={10} /> Pro</span>}
                <ChevronDown size={14} color="var(--text-secondary)" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      padding: '8px',
                      minWidth: 200,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                    {[
                      { icon: Settings, label: 'Settings', href: '/settings' },
                    ].map((item) => (
                      <Link key={item.href} to={item.href} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: 8,
                        fontSize: '0.875rem', color: 'var(--text-secondary)',
                        transition: 'var(--transition)',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <item.icon size={15} />
                        {item.label}
                      </Link>
                    ))}
                    
                    {/* Recent Activities */}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0 12px 6px' }}>RECENT FILES</div>
                      {activities.filter(a => a.type === 'file_generated').slice(0, 3).map((activity) => (
                        <div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '0.8rem' }}>
                          <FileText size={14} color="var(--accent-bright)" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                              {activity.file.fileName}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      {activities.filter(a => a.type === 'file_generated').length === 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '4px 12px' }}>No recent files</div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                      <button onClick={logout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: 8, background: 'transparent',
                        fontSize: '0.875rem', color: 'var(--error)', transition: 'var(--transition)',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.875rem' }}>Get Started</Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', marginTop: '16px', background: 'var(--bg-secondary)' }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '1rem', borderBottom: '1px solid var(--border)' }}>
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                  <Link to="/login" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Get Started</Link>
                </div>
              ) : (
                <button onClick={logout} style={{ textAlign: 'left', padding: '12px 0', color: 'var(--error)', background: 'none', fontSize: '1rem' }}>
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
}
