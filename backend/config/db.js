const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // timeout after 5s instead of hanging
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Failed: ${error.message}`);
    console.warn('⚠️  Running WITHOUT MongoDB — auth & history features disabled.');
    console.warn('    Start MongoDB to enable full functionality.\n');
    // Do NOT exit — the PDF conversion still works without MongoDB
  }
};

module.exports = connectDB;
