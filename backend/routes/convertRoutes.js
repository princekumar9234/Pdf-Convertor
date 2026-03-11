const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { 
  convertToPDF, 
  downloadPDF, 
  getUserConversions,
  pdfToImage,
  serveTempImage 
} = require('../controllers/convertController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rate limiting - conversion (stricter)
const convertLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { success: false, message: 'Conversion limit reached. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Image to PDF
router.post('/convert', convertLimiter, optionalAuth, upload.array('images', 20), convertToPDF);

// PDF to Image
router.post('/pdf-to-image', convertLimiter, optionalAuth, upload.single('pdf'), pdfToImage);

// Helpers
router.get('/download/:filename', downloadPDF);
router.get('/user/conversions', protect, getUserConversions);
router.get('/temp/:filename', serveTempImage);

module.exports = router;
