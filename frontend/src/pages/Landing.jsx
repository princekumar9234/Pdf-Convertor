import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiZap, FiShield, FiDownload, FiLayers, FiCheck } from 'react-icons/fi'
import { HiSparkles, HiPhoto, HiBolt } from 'react-icons/hi2'
import Footer from '../components/Footer'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
}

const features = [
  {
    icon: HiPhoto,
    title: 'Drag & Drop Upload',
    desc: 'Simply drag your images or click to select. Supports JPG, PNG, and WebP.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiLayers,
    title: 'Multi-Page PDF',
    desc: 'Upload multiple images and combine them into a single, perfectly formatted PDF.',
    color: 'from-brand-500 to-accent-500',
  },
  {
    icon: HiBolt,
    title: 'Lightning Fast',
    desc: 'Powered by Sharp and PDFKit for optimal performance. Conversions in seconds.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: FiShield,
    title: 'Secure & Private',
    desc: 'Files are automatically deleted after 24 hours. Your data stays yours.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: FiZap,
    title: 'Smart Compression',
    desc: 'Optional image compression to reduce file size without sacrificing quality.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: FiDownload,
    title: 'Instant Download',
    desc: 'Download your PDF instantly with one click. No email required.',
    color: 'from-rose-500 to-pink-500',
  },
]

const steps = [
  { num: '01', title: 'Upload Images', desc: 'Drag & drop or select JPG, PNG, WebP images from your device.' },
  { num: '02', title: 'Customize Settings', desc: 'Choose page size, margins, and compression options.' },
  { num: '03', title: 'Convert & Download', desc: 'Click convert and download your PDF in seconds.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-400/15 dark:bg-accent-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-cyan-400/15 dark:bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container-custom relative z-10 text-center">
          {/* Badge */}
          <motion.div {...fadeUp} className="flex justify-center mb-6">
            <div className="badge-brand px-4 py-2 text-sm font-semibold">
              <HiSparkles className="text-brand-500" />
              Free · Fast · No Watermarks
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white leading-[0.95] tracking-tight mb-6"
          >
            Ultimate PDF
            <br />
            <span className="gradient-text">Toolkit</span> for Everyone
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The fastest way to convert Images to PDF and PDF back to high-quality Images. 
            All-in-one tool for reordering, rotating, and generating perfect files in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/convert" className="btn-primary text-lg px-8 py-4 shadow-glow hover:shadow-glow-lg">
              Start Converting Free
              <FiArrowRight />
            </Link>
            <Link to="/signup" className="btn-secondary text-lg px-8 py-4">
              Create Free Account
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-400 dark:text-gray-500"
          >
            {['No signup required', '3 free conversions', 'Files deleted in 24h', 'No watermarks'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <FiCheck className="text-brand-500" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          {/* Floating UI preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative max-w-4xl mx-auto"
          >
            <div className="glass-card rounded-3xl p-6 shadow-2xl shadow-brand-500/10 border border-white/30 dark:border-gray-700/30">
              {/* Mock converter UI */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`aspect-square rounded-xl ${i % 3 === 0 ? 'bg-gradient-to-br from-brand-200 to-brand-300 dark:from-brand-800 dark:to-brand-900' : i % 3 === 1 ? 'bg-gradient-to-br from-accent-200 to-accent-300 dark:from-accent-800 dark:to-accent-900' : 'bg-gradient-to-br from-orange-200 to-amber-300 dark:from-orange-900 dark:to-amber-900'} flex items-center justify-center`}>
                    <HiPhoto className="text-white/70 text-2xl" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['A4', 'Letter'].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="btn-primary text-sm py-2 px-4 pointer-events-none">
                  Convert to PDF
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 md:right-8 glass-card rounded-2xl px-4 py-2 shadow-xl hidden sm:flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <FiCheck className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">PDF Ready!</p>
                <p className="text-xs text-gray-400">Download now</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 md:left-8 glass-card rounded-2xl px-4 py-2 shadow-xl hidden sm:flex items-center gap-2"
            >
              <HiBolt className="text-amber-500 text-xl" />
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">2.3s conversion</p>
                <p className="text-xs text-gray-400">Lightning fast</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="badge-brand inline-flex mb-4">Features</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you <span className="gradient-text">need</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A complete image-to-PDF toolkit built for speed, quality, and ease of use.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-lg mb-4`}>
                  <feat.icon className="text-white text-xl" />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="badge-brand inline-flex mb-4">How It Works</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              3 simple <span className="gradient-text">steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-brand-200 via-accent-300 to-brand-200 dark:from-brand-900 dark:via-accent-800 dark:to-brand-900" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
                  <span className="font-display font-bold text-white text-lg">{step.num}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 p-12 md:p-16 text-center"
          >
            {/* Background orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />

            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Start converting for free
              </h2>
              <p className="text-brand-200 text-lg mb-8 max-w-md mx-auto">
                No credit card required. 3 free conversions, then create a free account.
              </p>
              <Link
                to="/convert"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl hover:bg-brand-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
              >
                <HiSparkles />
                Convert Images Now
                <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
