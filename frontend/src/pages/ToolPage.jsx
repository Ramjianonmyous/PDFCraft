import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Info } from 'lucide-react';
import { getToolById } from '../utils/tools';
import FileUploader from '../components/FileUploader';
import { useAuth } from '../context/AuthContext';

export default function ToolPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  const { user, isPro } = useAuth();
  const [extraFields, setExtraFields] = useState({});

  if (!tool) return <Navigate to="/tools" replace />;

  const renderExtraFields = () => {
    if (tool.id === 'split-pdf') {
      return (
        <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>Split Options</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ val: 'all', label: 'Every page' }, { val: 'range', label: 'Custom ranges' }].map(opt => (
              <button key={opt.val} onClick={() => setExtraFields({ mode: opt.val })}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 500,
                  background: (extraFields.mode || 'all') === opt.val ? 'var(--gradient-accent)' : 'var(--bg-input)',
                  color: (extraFields.mode || 'all') === opt.val ? 'white' : 'var(--text-secondary)',
                  border: (extraFields.mode || 'all') === opt.val ? 'none' : '1px solid var(--border)',
                  transition: 'var(--transition)',
                }}>
                {opt.label}
              </button>
            ))}
          </div>
          {extraFields.mode === 'range' && (
            <input
              className="input"
              placeholder="e.g. 1-3, 4-6, 7"
              style={{ marginTop: '12px' }}
              onChange={(e) => setExtraFields({ mode: 'range', ranges: e.target.value })}
            />
          )}
        </div>
      );
    }

    if (tool.id === 'rotate-pdf') {
      return (
        <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>Rotation Angle</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ val: '90', label: '90° Right' }, { val: '-90', label: '90° Left' }, { val: '180', label: '180°' }].map(opt => (
              <button key={opt.val} onClick={() => setExtraFields({ angle: opt.val })}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 500,
                  background: (extraFields.angle || '90') === opt.val ? 'var(--gradient-accent)' : 'var(--bg-input)',
                  color: (extraFields.angle || '90') === opt.val ? 'white' : 'var(--text-secondary)',
                  border: (extraFields.angle || '90') === opt.val ? 'none' : '1px solid var(--border)',
                  transition: 'var(--transition)',
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (tool.id === 'watermark-pdf') {
      return (
        <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>Watermark Settings</p>
          <input className="input" placeholder="Watermark text (e.g. CONFIDENTIAL)"
            style={{ marginBottom: '12px' }}
            onChange={e => setExtraFields(p => ({ ...p, text: e.target.value }))} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Opacity</label>
              <input type="range" min="0.1" max="1" step="0.1" defaultValue="0.3"
                style={{ width: '100%' }}
                onChange={e => setExtraFields(p => ({ ...p, opacity: e.target.value }))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Font Size</label>
              <input type="range" min="20" max="100" step="5" defaultValue="60"
                style={{ width: '100%' }}
                onChange={e => setExtraFields(p => ({ ...p, fontSize: e.target.value }))} />
            </div>
          </div>
        </div>
      );
    }

    if (tool.id === 'protect-pdf') {
      return (
        <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>Password Protection</p>
          <input className="input" type="password" placeholder="Set password"
            style={{ marginBottom: '12px' }}
            onChange={e => setExtraFields(p => ({ ...p, userPassword: e.target.value }))} />
          <input className="input" type="password" placeholder="Confirm password"
            onChange={e => setExtraFields(p => ({ ...p, ownerPassword: e.target.value }))} />
        </div>
      );
    }

    if (tool.id === 'compress-pdf') {
      return (
        <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>Compression Level</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ val: 'low', label: 'Low (Best Quality)' }, { val: 'medium', label: 'Medium' }, { val: 'high', label: 'High (Smallest)' }].map(opt => (
              <button key={opt.val} onClick={() => setExtraFields({ quality: opt.val })}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 500,
                  background: (extraFields.quality || 'medium') === opt.val ? 'var(--gradient-accent)' : 'var(--bg-input)',
                  color: (extraFields.quality || 'medium') === opt.val ? 'white' : 'var(--text-secondary)',
                  border: (extraFields.quality || 'medium') === opt.val ? 'none' : '1px solid var(--border)',
                  transition: 'var(--transition)',
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        {/* Back button */}
        <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '32px', transition: 'var(--transition)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
          <ArrowLeft size={16} /> Back to Tools
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: tool.gradient,
              border: `1px solid ${tool.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: tool.color,
              flexShrink: 0,
            }}>
              {tool.icon}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>{tool.name}</h1>
                {tool.premium && <span className="badge badge-pro"><Crown size={10} /> Pro</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{tool.description}</p>
            </div>
          </div>

          {/* Premium gate */}
          {tool.premium && !isPro && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.05))',
                border: '1px solid rgba(251,191,36,0.2)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '12px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Crown size={18} color="#fbbf24" />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pro Feature</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Upgrade to unlock unlimited access</p>
                </div>
              </div>
              <Link to="/pricing" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.875rem' }}>
                Upgrade — from ₹1/mo
              </Link>
            </motion.div>
          )}

          {/* Coming soon */}
          {tool.comingSoon && (
            <div style={{
              padding: '16px 20px',
              background: 'rgba(148,163,184,0.06)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '24px',
            }}>
              <Info size={18} color="var(--text-muted)" />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                This tool is coming soon. We're working hard to bring it to you!
              </p>
            </div>
          )}
        </motion.div>

        {/* Extra fields */}
        {!tool.comingSoon && renderExtraFields()}

        {/* Uploader */}
        {!tool.comingSoon && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <FileUploader
              tool={tool}
              acceptedTypes={tool.accepts}
              multiFile={tool.multiFile}
              extraFields={extraFields}
            />
          </motion.div>
        )}

        {/* Info */}
        <div style={{ marginTop: '48px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>🔒 Your files are safe</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: 1.7 }}>
            All uploaded files are encrypted in transit using TLS. Files are automatically deleted from our servers after 2 hours. We never access or share your documents.
          </p>
        </div>
      </div>
    </main>
  );
}
