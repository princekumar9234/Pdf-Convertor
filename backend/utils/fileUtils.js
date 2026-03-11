const fs = require('fs');
const path = require('path');

/**
 * Delete a file safely
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Failed to delete file ${filePath}:`, err.message);
  }
};

/**
 * Delete multiple files
 */
const deleteFiles = (filePaths = []) => {
  filePaths.forEach(deleteFile);
};

/**
 * Ensure directory exists
 */
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Format bytes to human readable
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Clean up temp uploads older than 1 hour
 */
const cleanupTempFiles = (uploadDir) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs < oneHourAgo) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
};

module.exports = { deleteFile, deleteFiles, ensureDir, formatBytes, cleanupTempFiles };
