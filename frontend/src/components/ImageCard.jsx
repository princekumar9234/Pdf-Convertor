import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiRotateCw } from 'react-icons/fi'
import { HiArrowsUpDown } from 'react-icons/hi2'

export default function ImageCard({ file, index, onRemove, onRotate, isDragging }) {
  const [rotation, setRotation] = useState(0)

  const handleRotate = () => {
    const newRot = (rotation + 90) % 360
    setRotation(newRot)
    onRotate(index, newRot)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: isDragging ? 0.6 : 1, scale: isDragging ? 0.95 : 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="image-card group aspect-square cursor-grab active:cursor-grabbing"
    >
      {/* Image */}
      <div className="w-full h-full overflow-hidden">
        <img
          src={file.preview}
          alt={file.file.name}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `rotate(${rotation}deg)` }}
          draggable={false}
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        {/* Rotate */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); handleRotate() }}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-700 shadow-lg hover:bg-white transition-colors"
          title="Rotate 90°"
        >
          <FiRotateCw size={15} />
        </motion.button>

        {/* Drag handle */}
        <motion.div
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-700 shadow-lg cursor-grab"
          title="Drag to reorder"
        >
          <HiArrowsUpDown size={15} />
        </motion.div>

        {/* Remove */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onRemove(index) }}
          className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
          title="Remove"
        >
          <FiX size={15} />
        </motion.button>
      </div>

      {/* Page number badge */}
      <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur flex items-center justify-center">
        <span className="text-white text-xs font-bold">{index + 1}</span>
      </div>

      {/* Rotation badge */}
      {rotation > 0 && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-brand-500/90 backdrop-blur">
          <span className="text-white text-xs font-bold">{rotation}°</span>
        </div>
      )}
    </motion.div>
  )
}
