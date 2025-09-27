"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { motion } from "framer-motion"
import './style.css'

export default function PortfolioPage() {
  const [items, setItems] = useState([])
  const [sliderIndexes, setSliderIndexes] = useState({})
  const [modalImageList, setModalImageList] = useState([])
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: ''
  })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [previewImages, setPreviewImages] = useState([])
  const [compressionInfo, setCompressionInfo] = useState(null)

  useEffect(() => {
    // Debug environment variables
    console.log('=== ENVIRONMENT DEBUG ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    console.log('Full Supabase Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
    console.log('Supabase client:', supabase)
    console.log('========================')
    
    // Tampilkan alert untuk debugging production
    if (process.env.NODE_ENV === 'production') {
      alert(`ENV CHECK:\nURL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\nKey exists: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`)
    }
    
    fetchPortfolio()
    
    // Test public URL generation
    testPublicUrl()
  }, [])

  const testPublicUrl = async () => {
    try {
      console.log('=== TESTING SUPABASE CONNECTION ===')
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('portfolio')
        .select('id, title')
        .limit(1)
      
      console.log('Connection test result:', { testData, testError })
      
      if (testError) {
        console.error('❌ Connection failed:', testError)
        alert(`Connection Error: ${testError.message}`)
      } else {
        console.log('✅ Connection successful!')
        console.log('Sample data:', testData)
      }
      
      // Test dengan file yang sudah ada
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl('portfolio/test.webp') // File dummy untuk test
      
      console.log('Test public URL:', data.publicUrl)
      
      // Check if URL contains correct domain
      if (data.publicUrl && !data.publicUrl.includes('localhost')) {
        console.log('✅ URL generation working correctly')
      } else {
        console.log('❌ URL generation issue detected')
      }
    } catch (error) {
      console.error('❌ Test failed:', error)
      alert(`Test Error: ${error.message}`)
    }
    console.log('================================')
  }

  const fetchPortfolio = async () => {
    try {
      console.log('Fetching portfolio data...')
      
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('Supabase response:', { data, error })
      
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      if (data) {
        // Process data to handle images as string or array
        const processedData = data.map(item => {
          let images = []
          
          try {
            // If images is a string, parse it as JSON
            if (typeof item.images === 'string') {
              images = JSON.parse(item.images)
            } else if (Array.isArray(item.images)) {
              images = item.images
            } else {
              // Fallback to image_url if images is null/undefined
              images = item.image_url ? [item.image_url] : []
            }
          } catch (error) {
            console.error('Error parsing images for item:', item.id, error)
            // Fallback to image_url if parsing fails
            images = item.image_url ? [item.image_url] : []
          }
          
          return {
            ...item,
            images: images
          }
        })
        
        console.log('Processed portfolio data:', processedData)
        console.log('Total items:', processedData.length)
        setItems(processedData)
      } else {
        console.log('No data returned from Supabase')
        setItems([])
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      setItems([])
    }
  }

  const handleNext = (itemId, images) => {
    setSliderIndexes((prev) => {
      const currentIndex = prev[itemId] ?? 0
      return {
        ...prev,
        [itemId]: (currentIndex + 1) % images.length
      }
    })
  }

  const handlePrev = (itemId, images) => {
    setSliderIndexes((prev) => {
      const currentIndex = prev[itemId] ?? 0
      return {
        ...prev,
        [itemId]: (currentIndex - 1 + images.length) % images.length
      }
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    setUploadedFiles(files)
    
    // Generate preview dan hitung kompresi
    if (files.length > 0) {
      try {
        setLoadingMessage('Membuat preview WebP...')
        setIsLoading(true)
        
        const originalSize = files.reduce((sum, file) => sum + file.size, 0)
        const webpFiles = await processFilesToWebP(files)
        const compressedSize = webpFiles.reduce((sum, file) => sum + file.size, 0)
        
        // Buat preview URLs
        const previews = await Promise.all(
          webpFiles.map(async (file) => {
            return new Promise((resolve) => {
              const reader = new FileReader()
              reader.onload = (e) => resolve({
                url: e.target.result,
                name: file.name,
                size: file.size
              })
              reader.readAsDataURL(file)
            })
          })
        )
        
        setPreviewImages(previews)
        setCompressionInfo({
          originalSize,
          compressedSize,
          savedBytes: originalSize - compressedSize,
          savedPercentage: ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
        })
        
      } catch (error) {
        console.error('Error creating preview:', error)
        alert('Gagal membuat preview gambar')
      } finally {
        setIsLoading(false)
        setLoadingMessage('')
      }
    } else {
      setPreviewImages([])
      setCompressionInfo(null)
    }
  }

  // Fungsi untuk mengkonversi gambar ke WebP dengan kompresi
  const convertToWebP = (file, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Tentukan ukuran maksimal berdasarkan jenis gambar
        let maxSize = 1920 // Default untuk portfolio
        
        // Jika gambar sangat besar, gunakan ukuran yang lebih kecil
        if (file.size > 5 * 1024 * 1024) { // > 5MB
          maxSize = 1600
          quality = 0.8 // Kurangi kualitas untuk file besar
        } else if (file.size > 2 * 1024 * 1024) { // > 2MB
          maxSize = 1800
          quality = 0.82
        }
        
        let { width, height } = img
        
        // Resize jika gambar terlalu besar
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }
        
        canvas.width = width
        canvas.height = height
        
        // Optimasi canvas untuk performa
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        // Background putih untuk transparansi
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)
        
        // Konversi ke WebP dengan kualitas yang disesuaikan
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalName = file.name.split('.')[0]
              const webpFile = new File([blob], `${originalName}.webp`, {
                type: 'image/webp',
                lastModified: Date.now()
              })
              resolve(webpFile)
            } else {
              reject(new Error('Gagal mengkonversi ke WebP'))
            }
          },
          'image/webp',
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('Gagal memuat gambar'))
      }
      
      // Load gambar
      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  // Fungsi untuk memproses semua file dan mengkonversi ke WebP
  const processFilesToWebP = async (files) => {
    const convertedFiles = []
    
    for (const file of files) {
      try {
        // Cek apakah file adalah gambar
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} bukan gambar`)
        }
        
        // Tentukan kualitas berdasarkan jenis dan ukuran file
        let quality = 0.85 // Default quality
        
        if (file.type === 'image/png') {
          quality = 0.88 // PNG biasanya perlu kualitas lebih tinggi
        } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          quality = 0.82 // JPEG sudah terkompresi, gunakan kualitas sedang
        } else if (file.type === 'image/webp') {
          // Jika sudah WebP, tetap konversi untuk optimasi ukuran
          quality = 0.80
        }
        
        // Konversi dengan kualitas yang disesuaikan
        const webpFile = await convertToWebP(file, quality)
        convertedFiles.push(webpFile)
        
        console.log(`✅ ${file.name} converted to WebP:`, {
          original: (file.size / 1024).toFixed(1) + ' KB',
          compressed: (webpFile.size / 1024).toFixed(1) + ' KB',
          saved: ((file.size - webpFile.size) / 1024).toFixed(1) + ' KB'
        })
        
      } catch (error) {
        console.error(`❌ Error converting ${file.name}:`, error)
        throw new Error(`Gagal mengkonversi ${file.name}: ${error.message}`)
      }
    }
    
    return convertedFiles
  }

  const uploadImages = async (files) => {
    // Konversi semua file ke WebP terlebih dahulu
    const webpFiles = await processFilesToWebP(files)
    
    const uploadPromises = webpFiles.map(async (file) => {
      // Gunakan ekstensi .webp untuk semua file
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.webp`
      const filePath = `portfolio/${fileName}`

      console.log('Uploading file:', filePath) // Debug log

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('Upload success:', uploadData) // Debug log

      // Dapatkan public URL dengan cara yang benar
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      console.log('Generated URL:', urlData.publicUrl) // Debug log

      // Validasi URL
      if (!urlData.publicUrl || urlData.publicUrl.includes('localhost')) {
        throw new Error('Invalid public URL generated')
      }

      return urlData.publicUrl
    })

    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.category.trim() || uploadedFiles.length === 0) {
      alert('Mohon isi semua field dan upload minimal 1 gambar')
      return
    }

    setIsLoading(true)
    try {
      // Step 1: Konversi gambar ke WebP
      setLoadingMessage('Mengkonversi gambar ke WebP...')
      const webpFiles = await processFilesToWebP(uploadedFiles)
      
      // Step 2: Upload ke Supabase
      setLoadingMessage('Mengupload gambar...')
      const imageUrls = await uploadImages(uploadedFiles)
      
      // Validate URLs
      console.log('Final image URLs:', imageUrls)
      
      // Check if any URL is invalid
      const invalidUrls = imageUrls.filter(url => 
        !url || 
        url.includes('localhost') || 
        url.includes('undefined') ||
        !url.startsWith('http')
      )
      
      if (invalidUrls.length > 0) {
        throw new Error(`Invalid URLs generated: ${invalidUrls.join(', ')}`)
      }
      
      // Calculate total file size dari file WebP yang sudah dikompress
      const totalFileSize = webpFiles.reduce((sum, file) => sum + file.size, 0)

      // Step 3: Simpan ke database
      setLoadingMessage('Menyimpan data...')
      
      console.log('Saving data with images:', imageUrls)
      
      const { error } = await supabase
        .from('portfolio')
        .insert([
          {
            title: formData.title.trim(),
            category: formData.category.trim(),
            description: formData.description.trim(),
            images: imageUrls, // This should be stored as JSON array
            image_url: imageUrls[0], // First image as main image
            file_size: totalFileSize
          }
        ])

      if (error) throw error

      // Reset form and close modal
      setFormData({ title: '', category: '', description: '' })
      setUploadedFiles([])
      setPreviewImages([])
      setCompressionInfo(null)
      setShowAddForm(false)
      
      // Refresh portfolio data
      await fetchPortfolio()
      
      // Hitung penghematan file size
      const originalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0)
      const savedBytes = originalSize - totalFileSize
      const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(1)
      
      alert(`Portfolio berhasil ditambahkan!\n✅ Gambar dikonversi ke WebP\n💾 Penghematan: ${(savedBytes / 1024 / 1024).toFixed(2)} MB (${savedPercentage}%)`)
    } catch (error) {
      console.error('Error adding portfolio:', error)
      alert('Gagal menambahkan portfolio: ' + error.message)
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <div>
      {/* === Navbar === */}
      <motion.header 
        className="navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="navbar-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img src="/img/logo-hitam-01.png" alt="Logo" className="logo-img" />
        </motion.div>
        <motion.nav 
          className="main-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href="/home">About Me</a>
          <a href="/portfolio" className="active">Project</a>
          <a href="/katalog">Katalog</a>
          <a href="/comments">Testimoni</a>
        </motion.nav>
        <motion.span 
          className="brand"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          KannoHouse
        </motion.span>
      </motion.header>

      {/* Main Portfolio */}
      <motion.main 
        className="portfolio-main"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2 
          className="portfolio-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Portofolio
        </motion.h2>
        <div className="portfolio-grid">
          {items.map((item, index) => (
            <motion.div
              className="portfolio-card"
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1 * index
              }}
              viewport={{ once: true }}
            >
              {item.images?.length > 0 && (
                <div className="portfolio-slider">
                  {item.images.length > 1 && (
                    <button
                      className="slider-btn left"
                      onClick={() => handlePrev(item.id, item.images)}
                    >
                      &lt;
                    </button>
                  )}

                  <img
                    src={item.images[sliderIndexes[item.id] ?? 0]}
                    alt={`Gambar ${item.title}`}
                    className="portfolio-image"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image load error:', e.target.src)
                      console.log('Item data:', item)
                      // Try next image in array if available
                      const currentIndex = sliderIndexes[item.id] ?? 0
                      const nextIndex = (currentIndex + 1) % item.images.length
                      if (nextIndex !== currentIndex && item.images[nextIndex]) {
                        e.target.src = item.images[nextIndex]
                      } else {
                        // Final fallback
                        e.target.src = '/img/placeholder.svg'
                      }
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', e.target.src)
                    }}
                    onClick={() => {
                      setModalImageList(item.images)
                      setModalCurrentIndex(sliderIndexes[item.id] ?? 0)
                    }}
                  />

                  {item.images.length > 1 && (
                    <button
                      className="slider-btn right"
                      onClick={() => handleNext(item.id, item.images)}
                    >
                      &gt;
                    </button>
                  )}
                </div>
              )}

              <h3 className="portfolio-card-title">{item.title}</h3>
              <p className="portfolio-card-category">{item.category}</p>
              <p className="portfolio-card-desc">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Modal Viewer */}
        {modalImageList.length > 0 && (
          <div className="modal-overlay" onClick={() => setModalImageList([])}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={modalImageList[modalCurrentIndex]}
                alt={`Gambar Preview ${modalCurrentIndex + 1}`}
                className="modal-image"
                loading="lazy"
              />
              <button className="close-btn" onClick={() => setModalImageList([])}>
                &times;
              </button>

              {modalImageList.length > 1 && (
                <>
                  <button
                    className="slider-btn left"
                    onClick={() =>
                      setModalCurrentIndex(
                        (modalCurrentIndex - 1 + modalImageList.length) % modalImageList.length
                      )
                    }
                  >
                    &lt;
                  </button>
                  <button
                    className="slider-btn right"
                    onClick={() =>
                      setModalCurrentIndex(
                        (modalCurrentIndex + 1) % modalImageList.length
                      )
                    }
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </motion.main>
    </div>
  )
}
