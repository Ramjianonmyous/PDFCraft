const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { upload, handleUploadError, cleanupFiles } = require('../middleware/upload');
const { protect, optionalAuth, requirePro, checkConversionLimit } = require('../middleware/auth');
const Conversion = require('../models/Conversion');
const converters = require('../utils/converters');

// Premium tools list
const PREMIUM_TOOLS = [
  'pdf-to-word', 'word-to-pdf', 'pdf-to-excel', 'excel-to-pdf',
  'pdf-to-ppt', 'ppt-to-pdf', 'protect-pdf', 'unlock-pdf',
  'watermark-pdf', 'ocr-pdf', 'sign-pdf', 'pdf-to-html',
];

// Helper: send file for download
const sendFileResponse = (res, filePath, fileName) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Converted file not found' });
  }
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
};

// Helper: zip directory and send
const sendZipResponse = (res, outputDir, zipName) => {
  res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
  res.setHeader('Content-Type', 'application/zip');

  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.pipe(res);
  archive.directory(outputDir, false);
  archive.finalize();
};

// Helper: check premium access
const checkPremiumAccess = (req, res, tool) => {
  if (PREMIUM_TOOLS.includes(tool)) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Login required for this tool',
        loginRequired: true,
      });
    }
    if (req.user.plan === 'free') {
      return res.status(403).json({
        success: false,
        message: 'This tool requires a Pro plan. Upgrade to unlock.',
        upgradeRequired: true,
      });
    }
  }
  return null;
};

// ─── MERGE PDF ────────────────────────────────────────────────────────────────
router.post('/merge-pdf', optionalAuth, checkConversionLimit, upload.array('files', 20), handleUploadError, async (req, res) => {
  const start = Date.now();
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ success: false, message: 'Please upload at least 2 PDF files' });
    }

    const filePaths = req.files.map((f) => f.path);
    const result = await converters.mergePDFs(filePaths);

    if (req.user) await req.user.incrementConversions();

    await Conversion.create({
      user: req.user?._id,
      tool: 'merge-pdf',
      inputFiles: req.files.map((f) => ({ originalName: f.originalname, size: f.size, mimeType: f.mimetype, path: f.path })),
      outputFiles: [{ name: result.fileName, size: result.size, path: result.outputPath }],
      status: 'completed',
      processingTime: Date.now() - start,
      ipAddress: req.ip,
    });

    sendFileResponse(res, result.outputPath, result.fileName);
  } catch (error) {
    console.error('Merge PDF error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── SPLIT PDF ────────────────────────────────────────────────────────────────
router.post('/split-pdf', optionalAuth, checkConversionLimit, upload.single('file'), handleUploadError, async (req, res) => {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const { mode = 'all', ranges } = req.body;
    const result = await converters.splitPDF(req.file.path, { mode, ranges });

    if (req.user) await req.user.incrementConversions();

    if (result.files.length === 1) {
      sendFileResponse(res, result.files[0].outputPath, result.files[0].fileName);
    } else {
      sendZipResponse(res, result.outputDir, 'split_pages.zip');
    }
  } catch (error) {
    console.error('Split PDF error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── COMPRESS PDF ─────────────────────────────────────────────────────────────
router.post('/compress-pdf', optionalAuth, checkConversionLimit, upload.single('file'), handleUploadError, async (req, res) => {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const { quality = 'medium' } = req.body;
    const result = await converters.compressPDF(req.file.path, quality);

    if (req.user) await req.user.incrementConversions();

    res.setHeader('X-Original-Size', result.originalSize);
    res.setHeader('X-Compressed-Size', result.size);
    res.setHeader('X-Reduction', result.reduction);
    sendFileResponse(res, result.outputPath, result.fileName);
  } catch (error) {
    console.error('Compress PDF error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── ROTATE PDF ───────────────────────────────────────────────────────────────
router.post('/rotate-pdf', optionalAuth, checkConversionLimit, upload.single('file'), handleUploadError, async (req, res) => {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const { angle = 90, pages = 'all' } = req.body;
    const result = await converters.rotatePDF(req.file.path, angle, pages);

    if (req.user) await req.user.incrementConversions();
    sendFileResponse(res, result.outputPath, result.fileName);
  } catch (error) {
    console.error('Rotate PDF error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── IMAGE TO PDF ─────────────────────────────────────────────────────────────
router.post('/jpg-to-pdf', optionalAuth, checkConversionLimit, upload.array('files', 20), handleUploadError, async (req, res) => {
  const start = Date.now();
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload image files' });
    }

    const filePaths = req.files.map((f) => f.path);
    const result = await converters.imagesToPDF(filePaths);

    if (req.user) await req.user.incrementConversions();
    sendFileResponse(res, result.outputPath, result.fileName);
  } catch (error) {
    console.error('Image to PDF error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── PDF TO IMAGE ─────────────────────────────────────────────────────────────
router.post('/pdf-to-jpg', optionalAuth, checkConversionLimit, upload.single('file'), handleUploadError, async (req, res) => {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const { format = 'jpg', dpi = 150 } = req.body;
    const result = await converters.pdfToImages(req.file.path, format, dpi);

    if (req.user) await req.user.incrementConversions();

    res.setHeader('X-Page-Count', result.pageCount);

    if (result.files.length === 1) {
      sendFileResponse(res, result.files[0].outputPath, result.files[0].fileName);
    } else {
      sendZipResponse(res, result.outputDir, 'pdf_images.zip');
    }
  } catch (error) {
    console.error('PDF to image error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── PDF TO WORD (PREMIUM) ────────────────────────────────────────────────────
router.post('/pdf-to-word', optionalAuth, upload.single('file'), handleUploadError, async (req, res) => {
  const start = Date.now();
  const premiumCheck = checkPremiumAccess(req, res, 'pdf-to-word');
  if (premiumCheck) return;

  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const result = await converters.pdfToWord(req.file.path);

    if (req.user) await req.user.incrementConversions();
    sendFileResponse(res, result.outputPath, result.fileName);
  } catch (error) {
    console.error('PDF to Word error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── WATERMARK PDF (PREMIUM) ──────────────────────────────────────────────────
router.post('/watermark-pdf', optionalAuth, upload.single('file'), handleUploadError, async (req, res) => {
  const premiumCheck = checkPremiumAccess(req, res, 'watermark-pdf');
  if (premiumCheck) return;

  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const { text = 'CONFIDENTIAL', opacity = 0.3, fontSize = 60, rotation = -45 } = req.body;
    const result = await converters.watermarkPDF(req.file.path, text, {
      opacity: parseFloat(opacity),
      fontSize: parseInt(fontSize),
      rotation: parseInt(rotation),
    });

    if (req.user) await req.user.incrementConversions();
    sendFileResponse(res, result.outputPath, result.fileName);
  } catch (error) {
    console.error('Watermark PDF error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── PROTECT PDF (PREMIUM) ────────────────────────────────────────────────────
router.post('/protect-pdf', optionalAuth, upload.single('file'), handleUploadError, async (req, res) => {
  const premiumCheck = checkPremiumAccess(req, res, 'protect-pdf');
  if (premiumCheck) return;

  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const { userPassword, ownerPassword } = req.body;
    if (!userPassword) return res.status(400).json({ success: false, message: 'Password is required' });

    const result = await converters.protectPDF(req.file.path, userPassword, ownerPassword || userPassword);

    if (req.user) await req.user.incrementConversions();
    sendFileResponse(res, result.outputPath, result.fileName);
  } catch (error) {
    console.error('Protect PDF error:', error);
    res.status(500).json({ success: false, message: error.message || 'Conversion failed' });
  }
});

// ─── GET PDF INFO ─────────────────────────────────────────────────────────────
router.post('/pdf-info', optionalAuth, upload.single('file'), handleUploadError, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const info = await converters.getPDFInfo(req.file.path);
    res.json({ success: true, info, fileSize: req.file.size });
  } catch (error) {
    console.error('PDF info error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to read PDF' });
  }
});

// ─── GET CONVERSION HISTORY ───────────────────────────────────────────────────
router.get('/history', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const conversions = await Conversion.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('tool status createdAt processingTime inputFiles outputFiles');

    const total = await Conversion.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      conversions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
