const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { generatePDF } = require('../services/pdfService');
const { convertPDFToImages } = require('../services/pdfToImgService');
const { deleteFiles } = require('../utils/fileUtils');

// Helper: check if MongoDB is connected
const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Convert images to PDF
// @route   POST /api/convert
// @access  Public (guest 3 free, logged-in unlimited)
const convertToPDF = async (req, res, next) => {
  const uploadedFiles = req.files ? req.files.map((f) => f.path) : [];

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const { pageSize = 'A4', margin = '10', compression = 'true' } = req.body;

    const options = {
      pageSize,
      margin: parseInt(margin, 10) || 0,
      compress: compression !== 'false',
    };

    // Generate PDF (this works without MongoDB)
    const { filename, outputPath, size } = await generatePDF(uploadedFiles, options);

    // Save conversion record only if MongoDB is connected
    let conversionId = null;
    if (isDBConnected()) {
      try {
        const Conversion = require('../models/Conversion');
        const User = require('../models/User');

        const conversionData = {
          filename,
          imageCount: req.files.length,
          fileSize: size,
          settings: options,
        };

        if (req.user) {
          conversionData.user = req.user._id;
          await User.findByIdAndUpdate(req.user._id, { $inc: { conversionCount: 1 } });
        }

        const conversion = await Conversion.create(conversionData);
        conversionId = conversion._id;
      } catch (dbErr) {
        console.error('DB save failed (non-fatal):', dbErr.message);
      }
    }

    // Clean up uploaded temp files
    deleteFiles(uploadedFiles);

    res.status(200).json({
      success: true,
      message: 'PDF generated successfully!',
      data: {
        filename,
        conversionId,
        imageCount: req.files.length,
        fileSize: size,
      },
    });
  } catch (error) {
    deleteFiles(uploadedFiles);
    console.error('CONVERSION CONTROLLER ERROR:', error);
    next(error);
  }
};

// @desc    Download PDF or Zip
// @route   GET /api/download/:filename
// @access  Public
const downloadPDF = async (req, res, next) => {
  try {
    const { filename } = req.params;

    // Sanitize filename - prevent path traversal
    const safeFilename = path.basename(filename);
    const validExts = ['.pdf', '.zip'];
    const ext = path.extname(safeFilename).toLowerCase();
    
    if (!validExts.includes(ext)) {
      return res.status(400).json({ success: false, message: 'Invalid file type.' });
    }

    const filePath = path.join(__dirname, '../uploads/output', safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found or expired.' });
    }

    // Update download count if DB is available (only for tracked PDF conversions)
    if (isDBConnected() && ext === '.pdf') {
      try {
        const Conversion = require('../models/Conversion');
        await Conversion.findOneAndUpdate({ filename: safeFilename }, { $inc: { downloadCount: 1 } });
      } catch { /* non-fatal */ }
    }

    // Use res.download to handle headers and filename correctly
    res.download(filePath, `PixelPDF_${safeFilename}`, (err) => {
      if (err) {
        console.error('File download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Could not download file.' });
        }
      }
    });
  } catch (error) {
    console.error('DOWNLOAD ERROR:', error);
    next(error);
  }
};

// @desc    Get user conversion history
// @route   GET /api/user/conversions
// @access  Private
const getUserConversions = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.status(200).json({
        success: true,
        data: { conversions: [], totalConversions: 0 },
        message: 'Database not connected.',
      });
    }

    const Conversion = require('../models/Conversion');
    const User = require('../models/User');

    const conversions = await Conversion.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');

    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        conversions,
        totalConversions: user?.conversionCount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Convert PDF to Images
// @route   POST /api/convert/pdf-to-image
// @access  Public (guest 3 free, logged-in unlimited)
const pdfToImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
  }

  const { format = 'png' } = req.body;
  const pdfPath = req.file.path;

  try {
    const { images, zipInfo } = await convertPDFToImages(pdfPath, format);

    res.status(200).json({
      success: true,
      message: 'PDF converted to images successfully!',
      data: {
        images,
        zipFilename: zipInfo.filename,
        totalImages: zipInfo.total,
      },
    });

    // Cleanup the uploaded PDF after conversion is done
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
  } catch (error) {
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    console.error('PDF to Image Controller Error:', error);
    next(error);
  }
};

// @desc    Serve temporary conversion images
// @route   GET /api/convert/temp/:filename
const serveTempImage = (req, res) => {
  const { filename } = req.params;
  const safeName = path.basename(filename);
  const filePath = path.join(__dirname, '../uploads/temp', safeName);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Preview not found' });
  }
};

module.exports = { 
  convertToPDF, 
  downloadPDF, 
  getUserConversions, 
  pdfToImage,
  serveTempImage 
};
