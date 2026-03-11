const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    filename: {
      type: String,
      required: true,
    },
    originalImages: [
      {
        type: String,
      },
    ],
    imageCount: {
      type: Number,
      default: 1,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    settings: {
      pageSize: { type: String, default: 'A4' },
      margin: { type: Number, default: 10 },
      compression: { type: Boolean, default: true },
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  { timestamps: true }
);

// Auto-delete index
conversionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Conversion', conversionSchema);
