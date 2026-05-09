const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for guest conversions
    },
    tool: {
      type: String,
      required: true,
      enum: [
        'pdf-to-jpg',
        'jpg-to-pdf',
        'pdf-to-png',
        'merge-pdf',
        'split-pdf',
        'compress-pdf',
        'rotate-pdf',
        'pdf-to-word',
        'word-to-pdf',
        'pdf-to-excel',
        'excel-to-pdf',
        'pdf-to-ppt',
        'ppt-to-pdf',
        'protect-pdf',
        'unlock-pdf',
        'watermark-pdf',
        'pdf-to-html',
        'ocr-pdf',
        'sign-pdf',
        'pdf-to-pdfa',
        'repair-pdf',
      ],
    },
    inputFiles: [
      {
        originalName: String,
        size: Number,
        mimeType: String,
        path: String,
      },
    ],
    outputFiles: [
      {
        name: String,
        size: Number,
        path: String,
        downloadUrl: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: String,
    processingTime: Number, // in milliseconds
    options: mongoose.Schema.Types.Mixed, // tool-specific options
    ipAddress: String,
    isPremiumTool: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Auto-delete records after 24 hours (files are cleaned up separately)
conversionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Conversion', conversionSchema);
