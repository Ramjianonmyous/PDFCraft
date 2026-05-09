import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';

export default function ToolCard({ tool, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={tool.comingSoon ? '#' : `/tools/${tool.id}`}
        style={{
          display: 'block',
          background: 'var(--gradient-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: tool.comingSoon ? 'default' : 'pointer',
          opacity: tool.comingSoon ? 0.7 : 1,
          position: 'relative',
          overflow: 'hidden',
          textDecoration: 'none',
          height: '100%',
        }}
        onMouseEnter={e => {
          if (!tool.comingSoon) {
            e.currentTarget.style.borderColor = tool.color + '60';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 12px 40px ${tool.color}20`;
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Background gradient effect */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '60%', height: '60%',
          background: `radial-gradient(circle at top right, ${tool.color}08, transparent)`,
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: tool.gradient,
            border: `1px solid ${tool.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: tool.color,
            flexShrink: 0,
          }}>
            {tool.icon}
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {tool.comingSoon && (
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 100,
                background: 'rgba(148,163,184,0.1)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Soon
              </span>
            )}
            {tool.premium && !tool.comingSoon && (
              <span className="badge badge-pro">
                <Lock size={9} /> Pro
              </span>
            )}
            {tool.popular && !tool.premium && (
              <span className="badge badge-free">Popular</span>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 700,
          marginBottom: '8px',
          letterSpacing: '-0.01em',
        }}>
          {tool.name}
        </h3>

        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}>
          {tool.description}
        </p>

        {/* Arrow */}
        {!tool.comingSoon && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: tool.color,
            fontSize: '0.8rem',
            fontWeight: 600,
          }}>
            Use tool <ArrowRight size={13} />
          </div>
        )}
      </Link>
    </motion.div>
  );
}
