import { motion } from 'framer-motion';
import { FileText, User, Heart, Coffee } from 'lucide-react';

export default function About() {
  return (
    <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            About PDFCraft
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            A powerful, fast, and secure platform for all your PDF needs.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: '40px' }}>
          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <FileText size={24} color="var(--accent-bright)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>The Project</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              PDFCraft was built to solve a common problem: PDF manipulation tools are often slow, bloated, or require expensive subscriptions. 
              Our goal was to create a clean, modern, and extremely fast platform where users can merge, split, compress, and convert PDFs with ease.
              We prioritize user privacy by ensuring all files are encrypted and automatically deleted after 2 hours.
            </p>
          </motion.div>

          {/* Creator Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <User size={24} color="var(--accent-bright)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Made By Ram</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Hi! I'm Ram, the developer behind PDFCraft. I am passionate about building full-stack applications that solve real-world problems with a focus on rich aesthetics and great user experience.
              This project is a result of many hours of hard work, learning, and a lot of coffee.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href="https://portfolio-2-0-kohl-five.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                View My Portfolio
              </a>
              <a href="https://github.com/Ramjianonmyous" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>
                GitHub
              </a>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', padding: '20px' }}
          >
            <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Made with <Heart size={16} color="var(--error)" fill="var(--error)" /> and <Coffee size={16} color="#964B00" /> by Ram
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
