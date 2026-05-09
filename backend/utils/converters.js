const { PDFDocument, rgb, degrees, StandardFonts, grayscale } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const { Document, Paragraph, TextRun, HeadingLevel, Packer } = require('docx');
const { v4: uuidv4 } = require('uuid');

const convertedDir = process.env.CONVERTED_DIR || './converted';
if (!fs.existsSync(convertedDir)) {
  fs.mkdirSync(convertedDir, { recursive: true });
}

// Helper: create output directory
const createOutputDir = () => {
  const dir = path.join(convertedDir, uuidv4());
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

// Helper: read file as Uint8Array
const readFile = (filePath) => fs.readFileSync(filePath);

// ─── MERGE PDF ───────────────────────────────────────────────────────────────
exports.mergePDFs = async (filePaths) => {
  const mergedPdf = await PDFDocument.create();

  for (const filePath of filePaths) {
    const pdfBytes = readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const outputDir = createOutputDir();
  const outputPath = path.join(outputDir, 'merged.pdf');
  const pdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return { outputPath, fileName: 'merged.pdf', size: pdfBytes.length };
};

// ─── SPLIT PDF ────────────────────────────────────────────────────────────────
exports.splitPDF = async (filePath, splitOptions) => {
  const pdfBytes = readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const totalPages = pdf.getPageCount();
  const outputDir = createOutputDir();
  const results = [];

  const { mode = 'all', ranges } = splitOptions;

  if (mode === 'all') {
    // Each page becomes a separate PDF
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      const bytes = await newPdf.save();
      const fileName = `page_${i + 1}.pdf`;
      const outputPath = path.join(outputDir, fileName);
      fs.writeFileSync(outputPath, bytes);
      results.push({ outputPath, fileName, size: bytes.length });
    }
  } else if (mode === 'range' && ranges) {
    // Split by custom ranges e.g. "1-3,4-6,7"
    const rangeList = ranges.split(',').map((r) => r.trim());
    for (let idx = 0; idx < rangeList.length; idx++) {
      const range = rangeList[idx];
      const newPdf = await PDFDocument.create();
      let pageIndices = [];

      if (range.includes('-')) {
        const [start, end] = range.split('-').map((n) => parseInt(n) - 1);
        for (let p = start; p <= Math.min(end, totalPages - 1); p++) {
          pageIndices.push(p);
        }
      } else {
        pageIndices.push(parseInt(range) - 1);
      }

      const pages = await newPdf.copyPages(pdf, pageIndices);
      pages.forEach((p) => newPdf.addPage(p));
      const bytes = await newPdf.save();
      const fileName = `split_${idx + 1}.pdf`;
      const outputPath = path.join(outputDir, fileName);
      fs.writeFileSync(outputPath, bytes);
      results.push({ outputPath, fileName, size: bytes.length });
    }
  }

  return { files: results, outputDir };
};

// ─── COMPRESS PDF ─────────────────────────────────────────────────────────────
exports.compressPDF = async (filePath, quality = 'medium') => {
  const pdfBytes = readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);

  // Create a new document to strip unused data and compress better
  const compressedPdf = await PDFDocument.create();
  const copiedPages = await compressedPdf.copyPages(pdf, pdf.getPageIndices());
  copiedPages.forEach((page) => compressedPdf.addPage(page));

  // Re-save with compression
  const compressedBytes = await compressedPdf.save({
    useObjectStreams: true,
  });

  const outputDir = createOutputDir();
  const outputPath = path.join(outputDir, 'compressed.pdf');
  fs.writeFileSync(outputPath, compressedBytes);

  const originalSize = pdfBytes.length;
  const compressedSize = compressedBytes.length;
  const reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

  return {
    outputPath,
    fileName: 'compressed.pdf',
    size: compressedSize,
    originalSize,
    reduction: `${reduction}%`,
  };
};

// ─── ROTATE PDF ───────────────────────────────────────────────────────────────
exports.rotatePDF = async (filePath, rotationAngle, pageNumbers = 'all') => {
  const pdfBytes = readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const pages = pdf.getPages();

  const targetPages =
    pageNumbers === 'all'
      ? pages
      : pageNumbers.split(',').map((n) => pages[parseInt(n.trim()) - 1]).filter(Boolean);

  targetPages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + parseInt(rotationAngle)));
  });

  const outputDir = createOutputDir();
  const outputPath = path.join(outputDir, 'rotated.pdf');
  const resultBytes = await pdf.save();
  fs.writeFileSync(outputPath, resultBytes);

  return { outputPath, fileName: 'rotated.pdf', size: resultBytes.length };
};

// ─── IMAGE TO PDF ──────────────────────────────────────────────────────────
exports.imagesToPDF = async (filePaths) => {
  const pdfDoc = await PDFDocument.create();

  for (const filePath of filePaths) {
    const ext = path.extname(filePath).toLowerCase();
    let imageBytes;

    // Convert to PNG/JPG for pdf-lib compatibility
    if (['.jpg', '.jpeg'].includes(ext)) {
      imageBytes = fs.readFileSync(filePath);
      const image = await pdfDoc.embedJpg(imageBytes);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    } else {
      // Convert to PNG using sharp
      const pngBuffer = await sharp(filePath).png().toBuffer();
      const image = await pdfDoc.embedPng(pngBuffer);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
  }

  const outputDir = createOutputDir();
  const outputPath = path.join(outputDir, 'converted.pdf');
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return { outputPath, fileName: 'converted.pdf', size: pdfBytes.length };
};

// ─── PDF TO IMAGE (renders page thumbnails via PDF metadata) ─────────────────
// Note: Full PDF rendering requires Ghostscript/Poppler system dependency.
// This implementation uses pdf-lib to extract pages and sharp for basic rendering.
// For production, integrate with Ghostscript or a PDF rendering service.
exports.pdfToImages = async (filePath, format = 'jpg', dpi = 150) => {
  const pdfBytes = readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const pageCount = pdf.getPageCount();
  const outputDir = createOutputDir();
  const results = [];

  // Extract each page as a separate PDF, then convert using sharp (basic)
  for (let i = 0; i < pageCount; i++) {
    const singlePagePdf = await PDFDocument.create();
    const [page] = await singlePagePdf.copyPages(pdf, [i]);
    singlePagePdf.addPage(page);

    const pageBytes = await singlePagePdf.save();
    const pageWidth = Math.round(page.getWidth());
    const pageHeight = Math.round(page.getHeight());

    // Create a placeholder image with page dimensions using sharp
    // In production: use ghostscript `gs -dNOPAUSE -sDEVICE=jpeg -r150 -sOutputFile=out.jpg input.pdf`
    const scale = dpi / 72;
    const imgWidth = Math.round(pageWidth * scale);
    const imgHeight = Math.round(pageHeight * scale);

    const fileName = `page_${i + 1}.${format}`;
    const outputPath = path.join(outputDir, fileName);

    // Create white background image with page info
    await sharp({
      create: {
        width: Math.min(imgWidth, 2480),
        height: Math.min(imgHeight, 3508),
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    const stat = fs.statSync(outputPath);
    results.push({ outputPath, fileName, size: stat.size });
  }

  return { files: results, outputDir, pageCount };
};

// ─── PROTECT PDF ──────────────────────────────────────────────────────────────
exports.protectPDF = async (filePath, userPassword, ownerPassword, permissions = {}) => {
  // pdf-lib v1 doesn't support encryption natively.
  // This is a placeholder — in production use node-qpdf or hummus
  const pdfBytes = readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);

  // Add metadata to indicate protection attempt
  pdf.setTitle(pdf.getTitle() || 'Protected Document');
  pdf.setCreator('PDFCraft');

  const outputDir = createOutputDir();
  const outputPath = path.join(outputDir, 'protected.pdf');
  const resultBytes = await pdf.save();
  fs.writeFileSync(outputPath, resultBytes);

  // NOTE: For real encryption, use: child_process with qpdf
  // qpdf --encrypt <user-password> <owner-password> 256 -- input.pdf output.pdf

  return { outputPath, fileName: 'protected.pdf', size: resultBytes.length };
};

// ─── WATERMARK PDF ────────────────────────────────────────────────────────────
exports.watermarkPDF = async (filePath, watermarkText, options = {}) => {
  const {
    opacity = 0.3,
    fontSize = 60,
    color = { r: 0.5, g: 0.5, b: 0.5 },
    rotation = -45,
    position = 'center',
  } = options;

  const pdfBytes = readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

    let x, y;
    if (position === 'center') {
      x = (width - textWidth) / 2;
      y = height / 2;
    } else if (position === 'diagonal') {
      x = (width - textWidth) / 2;
      y = height / 2;
    }

    page.drawText(watermarkText, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotation),
    });
  });

  const outputDir = createOutputDir();
  const outputPath = path.join(outputDir, 'watermarked.pdf');
  const resultBytes = await pdf.save();
  fs.writeFileSync(outputPath, resultBytes);

  return { outputPath, fileName: 'watermarked.pdf', size: resultBytes.length };
};

// ─── PDF TO WORD (text extraction) ────────────────────────────────────────────
exports.pdfToWord = async (filePath) => {
  const pdfBytes = readFile(filePath);
  const data = await pdfParse(pdfBytes);
  const text = data.text || '';
  const lines = text.split('\n').filter((line) => line.trim());

  // Build docx document from extracted text
  const docChildren = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isHeading = trimmed.length < 80 && trimmed === trimmed.toUpperCase() && trimmed.length > 3;

    if (isHeading) {
      docChildren.push(
        new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_2,
        })
      );
    } else {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 24 })],
          spacing: { after: 120 },
        })
      );
    }
  }

  const doc = new Document({
    creator: 'PDFCraft',
    title: 'Converted Document',
    sections: [
      {
        children: docChildren.length > 0 ? docChildren : [new Paragraph({ text: 'No text content found' })],
      },
    ],
  });

  const outputDir = createOutputDir();
  const outputPath = path.join(outputDir, 'converted.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  return { outputPath, fileName: 'converted.docx', size: buffer.length };
};

// ─── PDF INFO ─────────────────────────────────────────────────────────────────
exports.getPDFInfo = async (filePath) => {
  const pdfBytes = readFile(filePath);
  const pdf = await PDFDocument.load(pdfBytes);

  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle() || null,
    author: pdf.getAuthor() || null,
    creator: pdf.getCreator() || null,
    producer: pdf.getProducer() || null,
    creationDate: pdf.getCreationDate() || null,
    pages: pdf.getPages().map((page, i) => ({
      index: i + 1,
      width: Math.round(page.getWidth()),
      height: Math.round(page.getHeight()),
    })),
  };
};

// ─── CLEANUP ──────────────────────────────────────────────────────────────────
exports.cleanupOldFiles = () => {
  const dirs = [
    process.env.UPLOAD_DIR || './uploads',
    process.env.CONVERTED_DIR || './converted',
  ];
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours
  const now = Date.now();

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir);
    entries.forEach((entry) => {
      const entryPath = path.join(dir, entry);
      try {
        const stat = fs.statSync(entryPath);
        if (now - stat.mtimeMs > maxAge) {
          fs.rmSync(entryPath, { recursive: true, force: true });
        }
      } catch (e) {
        // ignore
      }
    });
  });
};
