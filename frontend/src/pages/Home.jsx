import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, Star, CheckCircle, Lock } from 'lucide-react';
import { TOOLS, getPopularTools } from '../utils/tools';
import ToolCard from '../components/ToolCard';

const STATS = [
  { value: '50M+', label: 'Files Processed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '190+', label: 'Countries' },
  { value: '4.9★', label: 'User Rating' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Our cloud-powered engine processes files in seconds, not minutes.',
    color: '#fbbf24',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    desc: 'All files are encrypted in transit and automatically deleted after 2 hours.',
    color: '#10b981',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    desc: 'Access all tools from any device — desktop, tablet, or mobile browser.',
    color: '#3b82f6',
  },
];

export default function Home() {
  const toolsRef = useRef(null);
  const popularTools = getPopularTools();

  return (
    <main style={{ paddingTop: '80px' }}>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', position: 'relative' }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px',
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 100,
              marginBottom: '32px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--accent-bright)',
              letterSpacing: '0.05em',
            }}>
              <Star size={12} fill="currentColor" />
              TRUSTED BY MILLIONS WORLDWIDE
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              fontWeight: 800,
              marginBottom: '24px',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
            }}>
              Every PDF Tool
              <br />
              <span className="gradient-text">You'll Ever Need</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: '560px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}>
              Merge, split, compress, convert — all your PDF tasks handled in seconds.
              Professional quality with a clean, distraction-free interface.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/tools" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Explore All Tools <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Get Started Free
              </Link>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px' }}>
              No credit card required · 5 free conversions daily
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '32px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                style={{ textAlign: 'center', padding: '16px' }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  background: 'var(--gradient-text)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '4px',
                }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Tools ─────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0' }} ref={toolsRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '48px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ color: 'var(--accent-bright)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Most Used
                </p>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  Popular Tools
                </h2>
              </div>
              <Link to="/tools" className="btn btn-secondary">
                View All {TOOLS.length} Tools <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            {popularTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
              Built for performance
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              Everything you need to work with PDFs, built with speed and privacy at the core.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '32px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: 56, height: 56,
                  borderRadius: 16,
                  background: `${feature.color}14`,
                  border: `1px solid ${feature.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <feature.icon size={24} color={feature.color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{
              maxWidth: 600,
              margin: '0 auto',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.05))',
              border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 'var(--radius-xl)',
            }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
                Start converting for free
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
                Get 5 free conversions daily. Upgrade to Pro for unlimited access to all tools.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/tools" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  Start for Free <ArrowRight size={18} />
                </Link>
                <Link to="/pricing" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  View Pricing
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
                {['No credit card', 'Cancel anytime', 'GDPR compliant'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <CheckCircle size={13} color="var(--success)" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
