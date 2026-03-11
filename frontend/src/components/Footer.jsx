import { Link } from 'react-router-dom'
import { HiSparkles } from 'react-icons/hi2'
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <HiSparkles className="text-white text-sm" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                Pixel<span className="gradient-text">PDF</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              The most powerful image to PDF converter. Fast, secure, and free to start.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: FiGithub, href: '#' },
                { icon: FiTwitter, href: '#' },
                { icon: FiLinkedin, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-brand-100 dark:hover:bg-brand-950/50 hover:text-brand-600 dark:hover:text-brand-400 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Product</h4>
            <ul className="space-y-2">
              {[
                { label: 'Convert Images', to: '/convert' },
                { label: 'Pricing', to: '#pricing' },
                { label: 'Features', to: '#features' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Account</h4>
            <ul className="space-y-2">
              {[
                { label: 'Sign Up Free', to: '/signup' },
                { label: 'Login', to: '/login' },
                { label: 'Dashboard', to: '/dashboard' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {year} PixelPDF. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Built with ❤️ using React & Node.js
          </p>
        </div>
      </div>
    </footer>
  )
}
