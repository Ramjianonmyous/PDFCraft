import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../utils/tools';
import ToolCard from '../components/ToolCard';

export default function Tools() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = TOOLS.filter((tool) => {
    const matchCat = activeCategory === 'all' || tool.category === activeCategory;
    const matchSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            All PDF Tools
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            {TOOLS.length} professional tools to handle every PDF task
          </p>
        </motion.div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'var(--transition)',
                  background: activeCategory === cat.id ? 'var(--gradient-accent)' : 'var(--bg-card)',
                  color: activeCategory === cat.id ? 'white' : 'var(--text-secondary)',
                  border: activeCategory === cat.id ? 'none' : '1px solid var(--border)',
                  boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                }}
              >
                {cat.label}
                <span style={{ marginLeft: '6px', opacity: 0.6, fontSize: '0.75rem' }}>({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem' }}>No tools found for "{search}"</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filtered.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
