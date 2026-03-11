import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { FiUploadCloud, FiImage, FiFileText } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

export default function DropZone({ 
  onFilesAdded, 
  hasFiles, 
  accept = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  },
  label = 'images',
  maxFiles = 20,
  formats = ['JPG', 'PNG', 'WEBP']
}) {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const reasons = rejectedFiles.map((f) => {
          if (f.errors[0]?.code === 'file-too-large') return `${f.file.name}: File too large (max 20MB)`
          if (f.errors[0]?.code === 'file-invalid-type') return `${f.file.name}: Invalid file type`
          return f.file.name
        })
        reasons.forEach(r => console.warn('Upload Error:', r))
        // Show the first error if any
        if (reasons.length > 0) {
          // You could use a toast here if you want
        }
      }
      if (acceptedFiles.length > 0) {
        onFilesAdded(acceptedFiles)
      }
    },
    [onFilesAdded]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize: MAX_SIZE,
    maxFiles,
    multiple: maxFiles > 1,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        {...getRootProps()}
        className={`relative rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden
          ${isDragReject
            ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
            : isDragActive
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01] shadow-glow'
            : 'border-gray-200 dark:border-gray-700 hover:border-brand-400/60 hover:bg-brand-50/30 dark:hover:bg-brand-950/10'
          }
          ${hasFiles ? 'py-8' : 'py-16 md:py-24'}
        `}
      >
        <input {...getInputProps()} />

        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-200/30 dark:bg-brand-900/20 rounded-full animate-blob" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-200/30 dark:bg-accent-900/20 rounded-full animate-blob animation-delay-2000" />
        </div>

        <div className="relative flex flex-col items-center gap-4 text-center px-4">
          {/* Icon */}
          <motion.div
            animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-all ${
              isDragReject
                ? 'bg-red-500'
                : 'bg-gradient-to-br from-brand-500 to-accent-500 shadow-brand-500/30'
            }`}
          >
            {isDragActive ? (
              <HiSparkles className="text-white text-3xl" />
            ) : (
              <FiUploadCloud className="text-white text-3xl" />
            )}
          </motion.div>

          {/* Text */}
          <div>
            {isDragReject ? (
              <p className="text-lg font-semibold text-red-600">Invalid file type</p>
            ) : isDragActive ? (
              <p className="text-lg font-semibold gradient-text">Drop your {label} here!</p>
            ) : (
              <>
                <p className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {hasFiles ? `Add more ${label}` : `Drop ${label} here`}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  or <span className="text-brand-600 dark:text-brand-400 font-medium underline underline-offset-2">browse files</span>
                </p>
              </>
            )}
          </div>

          {/* Supported formats */}
          {!isDragActive && (
            <div className="flex flex-wrap justify-center gap-2">
              {formats.map((fmt) => (
                <span key={fmt} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {fmt === 'PDF' ? <FiFileText size={10} /> : <FiImage size={10} />} {fmt}
                </span>
              ))}
              <span className="px-3 py-1 rounded-full text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900">
                Max 20MB / file {maxFiles > 1 ? `· Up to ${maxFiles} files` : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
