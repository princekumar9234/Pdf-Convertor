import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFileText, FiTrendingUp, FiDownload, FiArrowRight, FiCalendar, FiImage } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { convertAPI } from '../services/api'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-4`}>
        <Icon className="text-white text-xl" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-display font-bold text-3xl text-gray-900 dark:text-white">{value}</p>
    </motion.div>
  )
}

function ConversionRow({ conv, onDownload }) {
  const date = new Date(conv.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
        <FiFileText className="text-white text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 dark:text-gray-200 truncate text-sm">
          PDF Conversion — {conv.imageCount} image{conv.imageCount > 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FiCalendar size={10} /> {date}
          </span>
          <span className="flex items-center gap-1">
            <FiImage size={10} /> {conv.settings?.pageSize || 'A4'}
          </span>
          {conv.fileSize > 0 && (
            <span>{(conv.fileSize / 1024).toFixed(0)} KB</span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDownload(conv.filename)}
        className="btn-ghost text-xs text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FiDownload size={14} /> Download
      </button>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [conversions, setConversions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversions()
  }, [])

  const fetchConversions = async () => {
    try {
      const { data } = await convertAPI.getUserConversions()
      setConversions(data.data.conversions || [])
    } catch {
      toast.error('Failed to load history.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (filename) => {
    const downloadUrl = `/api/download/${filename}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Download started!');
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="badge-brand inline-flex mb-2">
              <HiSparkles /> Dashboard
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
              Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Member since {memberSince}
            </p>
          </div>
          <Link to="/convert" className="btn-primary self-start sm:self-auto">
            <HiSparkles /> New Conversion
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={FiFileText}
            label="Total Conversions"
            value={user?.conversionCount ?? 0}
            gradient="from-brand-500 to-accent-500"
            delay={0}
          />
          <StatCard
            icon={FiTrendingUp}
            label="This Month"
            value={conversions.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length}
            gradient="from-emerald-500 to-teal-500"
            delay={0.08}
          />
          <StatCard
            icon={FiDownload}
            label="Recent Downloads"
            value={conversions.slice(0, 5).reduce((sum, c) => sum + (c.downloadCount || 0), 0)}
            gradient="from-amber-500 to-orange-500"
            delay={0.16}
          />
        </div>

        {/* Conversion History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <FiFileText className="text-brand-500" />
              Conversion History
            </h2>
            {conversions.length > 0 && (
              <span className="badge-brand text-xs">
                {conversions.length} total
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 text-sm mt-3">Loading history...</p>
            </div>
          ) : conversions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mx-auto mb-4">
                <FiFileText className="text-gray-400 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">No conversions yet</h3>
              <p className="text-gray-400 text-sm mb-6">Start converting images to PDF and your history will appear here.</p>
              <Link to="/convert" className="btn-primary">
                Convert Now <FiArrowRight />
              </Link>
            </div>
          ) : (
            <div className="p-4 divide-y divide-gray-50 dark:divide-gray-800/50">
              {conversions.map((conv) => (
                <ConversionRow key={conv._id} conv={conv} onDownload={handleDownload} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
