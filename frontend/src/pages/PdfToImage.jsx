import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiDownload, FiTrash2, FiSettings, FiFileText, FiImage, FiArrowRight, FiCheck } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { convertAPI } from '../services/api'
import DropZone from '../components/DropZone'
import GuestLimitModal from '../components/GuestLimitModal'

export default function PdfToImage() {
  const { canConvert, incrementGuestCount, isAuthenticated } = useAuth()
  
  const [pdfFile, setPdfFile] = useState(null)
  const [format, setFormat] = useState('png')
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null) // { images: [], zipFilename: '' }
  const [showLimitModal, setShowLimitModal] = useState(false)

  const onFilesAdded = useCallback((files) => {
    if (files.length > 0) {
      const file = files[0]
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a valid PDF file.')
        return
      }
      setPdfFile(file)
      setResult(null)
    }
  }, [])

  const handleConvert = async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file.')
      return
    }

    if (!canConvert()) {
      setShowLimitModal(true)
      return
    }

    setConverting(true)
    setProgress(0)
    
    try {
      const formData = new FormData()
      formData.append('pdf', pdfFile)
      formData.append('format', format)

      const { data } = await convertAPI.pdfToImage(formData, (pct) => {
        setProgress(Math.min(pct, 95))
      })

      setProgress(100)
      setResult(data.data)
      
      if (!isAuthenticated) {
        incrementGuestCount()
      }

      toast.success('PDF converted successfully! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conversion failed. Please try again.')
    } finally {
      setConverting(false)
    }
  }

  const downloadAll = () => {
    if (!result?.zipFilename) return
    const downloadUrl = `/api/download/${result.zipFilename}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Download started!');
  }

  const downloadOne = async (filename, page) => {
    try {
      // In a real app, we'd have a specific endpoint for temp images as blobs, 
      // but for simplicity we can just open or use the temp URL from the backend.
      // However, to keep it consistent with the "Download" feeling:
      const a = document.createElement('a')
      a.href = `/api/temp/${filename}`
      a.download = `Page_${page}.${format}`
      a.click()
    } catch {
      toast.error('Download failed.')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="badge-brand inline-flex mb-3">
            <HiSparkles /> PDF to Image Converter
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Convert PDF to <span className="gradient-text">Images</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Extract every page of your PDF as high-quality PNG or JPG images.
          </p>
        </motion.div>

        {!result ? (
          <div className="space-y-6">
            <DropZone 
              onFilesAdded={onFilesAdded} 
              hasFiles={!!pdfFile} 
              accept={{ 'application/pdf': ['.pdf'] }}
              label="PDF file"
              formats={['PDF']}
              maxFiles={1}
            />

            {pdfFile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <FiFileText size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-xs">
                      {pdfFile.name}
                    </h3>
                    <p className="text-sm text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    {['png', 'jpg'].map((ext) => (
                      <button
                        key={ext}
                        onClick={() => setFormat(ext)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all ${
                          format === ext 
                          ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                          : 'text-gray-500'
                        }`}
                      >
                        {ext}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleConvert}
                    disabled={converting}
                    className="btn-primary"
                  >
                    {converting ? (
                      <>Processing... {progress}%</>
                    ) : (
                      <>Convert PDF <FiArrowRight /></>
                    )}
                  </button>

                  <button 
                    onClick={() => setPdfFile(null)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiCheck className="text-emerald-500" /> Conversion Complete
                </h2>
                <p className="text-gray-500">{result.totalImages} pages extracted from PDF.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setResult(null)} className="btn-secondary">
                  Convert Another
                </button>
                <button onClick={downloadAll} className="btn-primary shadow-glow">
                  <FiDownload /> Download All (ZIP)
                </button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {result.images.map((img) => (
                <motion.div
                  key={img.id}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-2xl overflow-hidden group border border-gray-100 dark:border-gray-800"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800 relative">
                    <img 
                      src={img.url} 
                      alt={`Page ${img.id}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                      <span className="text-white text-xs font-bold">Page {img.id}</span>
                      <button 
                        onClick={() => downloadOne(img.filename, img.id)}
                        className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-brand-500 transition-colors"
                      >
                        <FiDownload size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <GuestLimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />
    </div>
  )
}
