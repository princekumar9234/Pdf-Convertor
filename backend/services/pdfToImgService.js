const { pdf } = require('pdf-to-img');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AdmZip = require('adm-zip');

/**
 * Convert PDF pages to Images
 * @param {string} pdfPath - Path to the PDF file
 * @param {string} format - 'png' or 'jpg'
 * @returns {Promise<Object>} - Object containing image entries and zip info
 */
const convertPDFToImages = async (pdfPath, format = 'png') => {
  const outputDir = path.join(__dirname, '../uploads/temp');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const documentId = uuidv4();
  const images = [];
  const imagePaths = [];

  try {
    let pageNum = 1;
    const document = await pdf(pdfPath, { scale: 2 }); // Scale 2 for better quality

    for await (const page of document) {
      const fileName = `${documentId}_page_${pageNum}.${format}`;
      const filePath = path.join(outputDir, fileName);
      
      await fs.promises.writeFile(filePath, page);
      
      images.push({
        id: pageNum,
        filename: fileName,
        url: `/api/temp/${fileName}` // Corrected URL for the frontend
      });
      imagePaths.push(filePath);
      pageNum++;
    }

    // Create a ZIP of all images
    const zip = new AdmZip();
    imagePaths.forEach((p, index) => {
      zip.addLocalFile(p, undefined, `page_${index + 1}.${format}`);
    });

    const zipName = `${documentId}_all_images.zip`;
    const zipPath = path.join(__dirname, '../uploads/output', zipName);
    
    if (!fs.existsSync(path.join(__dirname, '../uploads/output'))) {
      fs.mkdirSync(path.join(__dirname, '../uploads/output'), { recursive: true });
    }
    
    zip.writeZip(zipPath);

    return {
      images,
      zipInfo: {
        filename: zipName,
        total: images.length
      }
    };
  } catch (error) {
    console.error('PDF to Image Service Error:', error);
    throw error;
  }
};

module.exports = { convertPDFToImages };
