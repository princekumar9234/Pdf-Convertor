const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PAGE_SIZES = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
  Legal: [612, 1008],
};

/**
 * Optimize / copy image using Sharp
 * Always outputs a JPEG so PDFKit can embed it reliably.
 */
const optimizeImage = async (inputPath, compress = true) => {
  const outputPath = path.join(
    path.dirname(inputPath),
    `${path.basename(inputPath, path.extname(inputPath))}_opt.jpg`
  );

  let pipeline = sharp(inputPath);

  // Get metadata first
  const metadata = await pipeline.metadata();

  // Resize if extremely large (>4096px)
  if (metadata.width > 4096 || metadata.height > 4096) {
    pipeline = pipeline.resize(4096, 4096, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  if (compress) {
    pipeline = pipeline.jpeg({ quality: 85, progressive: true });
  } else {
    pipeline = pipeline.jpeg({ quality: 100 });
  }

  await pipeline.toFile(outputPath);
  return outputPath;
};

/**
 * Get image dimensions using Sharp
 */
const getImageDimensions = async (imagePath) => {
  const metadata = await sharp(imagePath).metadata();
  return { width: metadata.width || 800, height: metadata.height || 600 };
};

/**
 * Generate PDF from images using PDFKit
 */
const generatePDF = async (imagePaths, options = {}) => {
  const { pageSize = 'A4', margin = 10, compress = true } = options;

  const outputDir = path.join(__dirname, '../uploads/output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `${uuidv4()}.pdf`;
  const outputPath = path.join(outputDir, filename);

  const optimizedPaths = [];

  try {
    // Step 1: Optimize all images to JPEG
    for (const imgPath of imagePaths) {
      try {
        const optimized = await optimizeImage(imgPath, compress);
        optimizedPaths.push(optimized);
      } catch (err) {
        console.error(`Failed to optimize ${imgPath}:`, err.message);
        // Try to use the original file if optimization fails
        optimizedPaths.push(imgPath);
      }
    }

    // Step 2: Create PDF document
    const doc = new PDFDocument({
      autoFirstPage: false,
      compress: true,
      margin: 0,
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Step 3: Add each image as a page
    for (let i = 0; i < optimizedPaths.length; i++) {
      const imgPath = optimizedPaths[i];

      let dims;
      try {
        dims = await getImageDimensions(imgPath);
      } catch {
        dims = { width: 800, height: 600 };
      }

      // Calculate page size in points (PDF points = 72pt/inch)
      let pW, pH;
      if (pageSize === 'Auto') {
        // Scale to ~A4 width keeping aspect ratio
        pW = 595.28;
        pH = pW * (dims.height / dims.width);
      } else {
        [pW, pH] = PAGE_SIZES[pageSize] || PAGE_SIZES['A4'];
      }

      const marginPt = Number(margin) || 0;
      const availW = Math.max(pW - marginPt * 2, 1);
      const availH = Math.max(pH - marginPt * 2, 1);

      // Scale image to fit within the available area (preserving aspect ratio)
      const imgAspect = dims.width / dims.height;
      const pageAspect = availW / availH;

      let drawW, drawH;
      if (imgAspect > pageAspect) {
        drawW = availW;
        drawH = availW / imgAspect;
      } else {
        drawH = availH;
        drawW = availH * imgAspect;
      }

      // Center image on page
      const drawX = marginPt + (availW - drawW) / 2;
      const drawY = marginPt + (availH - drawH) / 2;

      doc.addPage({ size: [pW, pH], margin: 0 });
      doc.image(imgPath, drawX, drawY, {
        width: drawW,
        height: drawH,
        fit: [drawW, drawH],
        align: 'center',
        valign: 'center',
      });
    }

    doc.end();

    // Wait for write stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    const fileSize = fs.existsSync(outputPath)
      ? fs.statSync(outputPath).size
      : 0;

    return { filename, outputPath, size: fileSize };
  } finally {
    // Clean up optimized temp files (only the _opt.jpg files we created)
    for (const p of optimizedPaths) {
      if (p.includes('_opt.') && fs.existsSync(p)) {
        try { fs.unlinkSync(p); } catch { /* ignore */ }
      }
    }
  }
};

module.exports = { generatePDF, optimizeImage };
