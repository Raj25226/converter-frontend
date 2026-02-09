'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Image, Music, FileSpreadsheet, ArrowRight, Zap, Shield, Smartphone, Star, Clock, LogIn, UserPlus, User, LogOut } from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const converters = [
    {
      title: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files',
      icon: FileText,
      url: '/pdf-to-word',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500',
      badge: 'Most Popular',
    },
    {
      title: 'JPG to PNG',
      description: 'Convert JPG images to PNG format',
      icon: Image,
      url: '/jpg-to-png',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-500',
      badge: 'Fast',
    },
    {
      title: 'MP4 to MP3',
      description: 'Extract audio from video files',
      icon: Music,
      url: '/mp4-to-mp3',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500',
      badge: 'HD Quality',
    },
    {
      title: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to PDF documents',
      icon: FileSpreadsheet,
      url: '/excel-to-pdf',
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-500',
      badge: 'Professional',
    },
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Convert your files in seconds with our optimized conversion engine',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Files are automatically deleted after 30 minutes for your security',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Works perfectly on any device - desktop, tablet, or mobile',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  const stats = [
    { value: '100K+', label: 'Files Converted' },
    { value: '50+', label: 'Countries' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '24/7', label: 'Available' },
  ]

  return (
    <div className="flex-1">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                File Converter
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-8">
              <Star className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">Free & Secure File Conversion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Convert Your Files
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Instantly & Free
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Professional file conversion made simple. No registration, no software installation, 
              and your files are automatically deleted after 30 minutes.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Converter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {converters.map((converter, index) => {
              const Icon = converter.icon
              return (
                <Link
                  key={converter.url}
                  href={converter.url}
                  className="group animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card card-hover h-full p-6 relative overflow-hidden">
                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-semibold px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                        {converter.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-14 h-14 ${converter.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {converter.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {converter.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      Convert now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Gradient border on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${converter.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`}></div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Quick Info Banner */}
          <div className="card p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Auto-Delete Protection</span>
            </div>
            <p className="text-blue-100">
              All uploaded files are automatically deleted after 30 minutes to protect your privacy
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Converter?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the fastest and most secure file conversion tool on the web
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="card p-8 text-center card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Convert your files in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload File', desc: 'Select or drag & drop your file' },
              { step: '2', title: 'Convert', desc: 'Click convert and wait a few seconds' },
              { step: '3', title: 'Download', desc: 'Download your converted file' },
            ].map((item, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">File Converter</h3>
              <p className="text-gray-400">
                Fast, secure, and free online file conversion tool. No registration required.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Converters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
                <li><Link href="/jpg-to-png" className="hover:text-white transition-colors">JPG to PNG</Link></li>
                <li><Link href="/mp4-to-mp3" className="hover:text-white transition-colors">MP4 to MP3</Link></li>
                <li><Link href="/excel-to-pdf" className="hover:text-white transition-colors">Excel to PDF</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Security</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>SSL Encrypted</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Auto-delete after 30 min</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>No data storage</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 File Converter. All files are processed securely and deleted after 30 minutes.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}