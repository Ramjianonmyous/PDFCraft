import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, File, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../context/AuthContext';
import { useActivity } from '../context/RecentActivityContext';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (file) => {
  if (file.type === 'application/pdf') return <FileText size={20} color="#3b82f6" />;
  if (file.type.startsWith('image/')) return <Image size={20} color="#ec4899" />;
  return <File size={20} color="#94a3b8" />;
};

export default function FileUploader({
  tool,
  acceptedTypes,
  multiFile = false,
  maxSize = 52428800,
  onConvertStart,
  onConvertSuccess,
  onConvertError,
  extraFields,
}) {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { trackFileGenerated } = useActivity();

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      const msg = rejected[0].errors[0]?.message || 'File not accepted';
      toast.error(msg);
      return;
    }

    if (!multiFile) {
      setFiles(accepted.slice(0, 1));
    } else {
      setFiles((prev) => {
        const all = [...prev, ...accepted];
        return all.slice(0, 20);
      });
    }
    setResult(null);
    setError(null);
  }, [multiFile]);

  const accept = acceptedTypes.reduce((acc, ext) => {
    const mimeMap = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.tiff': 'image/tiff',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    const mime = mimeMap[ext];
    if (mime) {
      if (!acc[mime]) acc[mime] = [];
      acc[mime].push(ext);
    }
    return acc;
  }, {});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: multiFile,
    maxSize,
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please select files first');
      return;
    }

    setConverting(true);
    setProgress(0);
    setResult(null);
    setError(null);
    onConvertStart?.();

    const formData = new FormData();
    if (multiFile) {
      files.forEach((file) => formData.append('files', file));
    } else {
      formData.append('file', files[0]);
    }

    // Add extra fields
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, val]) => {
        formData.append(key, val);
      });
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 85));
    }, 200);

    try {
      const token = localStorage.getItem('pdfcraft_token');
      const response = await fetch(tool.endpoint, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));

        if (response.status === 403 && errData.upgradeRequired) {
          setError({ type: 'upgrade', message: errData.message });
          onConvertError?.(errData);
          return;
        }
        if (response.status === 401 && errData.loginRequired) {
          setError({ type: 'login', message: errData.message });
          onConvertError?.(errData);
          return;
        }

        throw new Error(errData.message || 'Conversion failed');
      }

      // Get filename from Content-Disposition
      const disposition = response.headers.get('Content-Disposition');
      let fileName = 'converted_file';
      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match) fileName = match[1];
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const resultData = { url, fileName, size: blob.size };
      setResult(resultData);
      trackFileGenerated({ ...resultData, toolId: tool.id, date: new Date().toISOString() });
      onConvertSuccess?.(resultData);
      toast.success('Conversion successful!');
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      const msg = err.message || 'Conversion failed. Please try again.';
      setError({ type: 'error', message: msg });
      toast.error(msg);
      onConvertError?.(err);
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.fileName;
    a.click();
    URL.revokeObjectURL(result.url);
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Drop Zone */}
      {!result && (
        <div
          {...getRootProps()}
          className={`drop-zone ${isDragActive ? 'active' : ''}`}
          style={{
            border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: files.length > 0 ? '32px 24px' : '60px 40px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? 'rgba(59,130,246,0.1)' : 'var(--accent-subtle)',
            transition: 'all 0.2s ease',
            boxShadow: isDragActive ? 'var(--shadow-glow)' : 'none',
          }}
        >
          <input {...getInputProps()} />

          <motion.div
            animate={{ scale: isDragActive ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{
              width: 64, height: 64,
              borderRadius: '50%',
              background: 'rgba(59,130,246,0.1)',
              border: '2px solid rgba(59,130,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Upload size={28} color="var(--accent-bright)" />
            </div>
          </motion.div>

          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
            {isDragActive ? 'Drop files here...' : `Drop ${multiFile ? 'files' : 'file'} here`}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
            or click to browse from your computer
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {acceptedTypes.map((ext) => (
              <span key={ext} style={{
                padding: '4px 10px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                {ext}
              </span>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '12px' }}>
            Max {formatBytes(maxSize)}{multiFile ? ' per file' : ''}
          </p>
        </div>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && !result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {files.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                {getFileIcon(file)}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatBytes(file.size)}
                  </div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  style={{
                    padding: '4px', background: 'transparent',
                    color: 'var(--text-muted)', borderRadius: 6,
                    transition: 'var(--transition)',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'var(--error)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}

            {/* Progress bar */}
            {converting && (
              <div className="progress-bar" style={{ marginTop: '8px' }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {multiFile && (
                <label style={{
                  flex: 1, padding: '12px',
                  background: 'var(--bg-card)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center', cursor: 'pointer',
                  fontSize: '0.875rem', color: 'var(--text-secondary)',
                  transition: 'var(--transition)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-bright)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <input type="file" style={{ display: 'none' }} multiple={multiFile} accept={acceptedTypes.join(',')}
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files || []);
                      setFiles((prev) => [...prev, ...newFiles].slice(0, 20));
                    }}
                  />
                  + Add more files
                </label>
              )}

              <button
                onClick={handleConvert}
                disabled={converting}
                className="btn btn-primary"
                style={{ flex: multiFile ? 2 : 1, justifyContent: 'center', opacity: converting ? 0.7 : 1 }}
              >
                {converting ? (
                  <><div className="spinner" /> Converting...</>
                ) : (
                  `Convert ${files.length > 1 ? `${files.length} files` : ''}`
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: '16px',
              padding: '20px',
              background: error.type === 'upgrade' ? 'rgba(251,191,36,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${error.type === 'upgrade' ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
            }}
          >
            <AlertCircle size={32} color={error.type === 'upgrade' ? '#fbbf24' : 'var(--error)'} style={{ margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>{error.message}</p>
            {error.type === 'upgrade' && (
              <a href="/pricing" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '8px' }}>
                Upgrade to Pro
              </a>
            )}
            {error.type === 'login' && (
              <a href="/login" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '8px' }}>
                Sign In
              </a>
            )}
            <button onClick={() => setError(null)} className="btn btn-ghost" style={{ display: 'block', margin: '8px auto 0' }}>
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '40px 32px',
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            </motion.div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
              Conversion Complete!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
              {result.fileName} · {formatBytes(result.size)}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleDownload} className="btn btn-primary">
                Download File
              </button>
              <button onClick={reset} className="btn btn-secondary">
                Convert Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
