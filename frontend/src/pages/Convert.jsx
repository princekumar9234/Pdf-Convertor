import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiDownload, FiTrash2, FiSettings, FiX, FiFile } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { convertAPI } from '../services/api'
import DropZone from '../components/DropZone'
import ImageCard from '../components/ImageCard'
import GuestLimitModal from '../components/GuestLimitModal'

const PAGE_SIZES = ['A4', 'Letter', 'Legal', 'Auto']

export default function Convert() {
  const { canConvert, incrementGuestCount, isAuthenticated, updateUserCount } = useAuth()
  const navigate = useNavigate()

  const [files, setFiles] = useState([]) // { file, preview, rotation }
  const [settings, setSettings] = useState({ pageSize: 'A4', margin: 10, compression: true })
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null) // { filename }
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const onFilesAdded = useCallback((newFiles) => {
    const mapped = newFiles.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      rotation: 0,
      id: Math.random().toString(36).slice(2),
    }))
    setFiles((prev) => [...prev, ...mapped])
    setResult(null)
  }, [])

  const onRemove = (index) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const onRotate = (index, rotation) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, rotation } : f)))
  }

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
    setResult(null)
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please add at least one image.')
      return
    }

    if (!canConvert()) {
      setShowLimitModal(true)
      return
    }

    setConverting(true)
    setProgress(0)
    setResult(null)

    try {
      const formData = new FormData()
      files.forEach((f) => formData.append('images', f.file))
      formData.append('pageSize', settings.pageSize)
      formData.append('margin', String(settings.margin))
      formData.append('compression', String(settings.compression))

      const { data } = await convertAPI.convert(formData, (pct) => {
        setProgress(Math.min(pct, 90))
      })

      setProgress(100)
      setResult(data.data)

      if (!isAuthenticated) {
        incrementGuestCount()
      } else if (data.data?.totalConversions) {
        updateUserCount(data.data.totalConversions)
      }

      toast.success('PDF generated successfully! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conversion failed. Please try again.')
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!result?.filename) return
    // Using a direct link instead of fetch (blob) for better browser compatibility 
    // and to let the browser handle the filename header correctly.
    const downloadUrl = `/api/download/${result.filename}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Download started!');
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
            <HiSparkles />
            Image to PDF Converter
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Convert Images to <span className="gradient-text">PDF</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Upload, reorder, and convert your images into a professional PDF document.
          </p>
        </motion.div>

        {/* Dropzone */}
        <div className="mb-6">
          <DropZone onFilesAdded={onFilesAdded} hasFiles={files.length > 0} />
        </div>

        {/* Image Preview Grid */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiFile className="text-brand-500" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {files.length} image{files.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-sm text-gray-400">· Drag to reorder</span>
                </div>
                <button
                  onClick={clearAll}
                  className="btn-ghost text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <FiTrash2 size={14} /> Clear all
                </button>
              </div>

              {/* Reorderable grid */}
              <Reorder.Group
                axis="x"
                values={files}
                onReorder={setFiles}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
              >
                <AnimatePresence>
                  {files.map((f, index) => (
                    <Reorder.Item key={f.id} value={f}>
                      <ImageCard
                        file={f}
                        index={index}
                        onRemove={onRemove}
                        onRotate={onRotate}
                      />
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiSettings className="text-brand-500" /> PDF Settings
                  </h3>
                  <button onClick={() => setShowSettings(false)} className="btn-ghost w-8 h-8 rounded-full p-0 flex items-center justify-center">
                    <FiX size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Page Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Page Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PAGE_SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSettings(s => ({ ...s, pageSize: size }))}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                            settings.pageSize === size
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Margin */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Margin: <span className="text-brand-600">{settings.margin}pt</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={settings.margin}
                      onChange={(e) => setSettings(s => ({ ...s, margin: parseInt(e.target.value) }))}
                      className="w-full accent-brand-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>None</span>
                      <span>50pt</span>
                    </div>
                  </div>

                  {/* Compression */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Image Compression
                    </label>
                    <button
                      onClick={() => setSettings(s => ({ ...s, compression: !s.compression }))}
                      className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                        settings.compression ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                        settings.compression ? 'translate-x-7' : 'translate-x-0'
                      }`} />
                    </button>
                    <p className="text-xs text-gray-400 mt-1">
                      {settings.compression ? 'Smaller file size (recommended)' : 'Original quality'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn-secondary w-full sm:w-auto"
            >
              <FiSettings /> Settings
            </button>

            <button
              onClick={handleConvert}
              disabled={converting || files.length === 0}
              className="btn-primary w-full sm:flex-1 text-base py-3.5 relative overflow-hidden"
            >
              {converting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Converting... {progress}%
                </>
              ) : (
                <>
                  <HiSparkles />
                  Convert {files.length} image{files.length > 1 ? 's' : ''} to PDF
                </>
              )}

              {/* Progress bar */}
              {converting && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
                />
              )}
            </button>
          </motion.div>
        )}

        {/* Result card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8 glass-card rounded-3xl p-8 text-center border border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/10"
            >
              {/* Success icon */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
                PDF Ready!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                Your PDF has been generated successfully. It will be available for 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={handleDownload} className="btn-primary px-8 py-3.5 text-base shadow-glow">
                  <FiDownload /> Download PDF
                </button>
                <button
                  onClick={() => { setResult(null); clearAll() }}
                  className="btn-secondary px-6 py-3"
                >
                  Convert More
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GuestLimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />
    </div>
  )
}
