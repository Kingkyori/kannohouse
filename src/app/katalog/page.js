'use client'
import { motion } from "framer-motion"
import { useState } from "react"
import './style.css'
import '../home/style.css'  // Import home styles for consistency

export default function KatalogPage() {
  const [sliderIndexes, setSliderIndexes] = useState({})
  const [modalImageList, setModalImageList] = useState([])
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0)

  // Data katalog desain
  const designCatalog = {
    id: 'desain',
    title: 'Katalog Desain',
    images: [
      '/img/katalog/desain/1 (1).png',
      '/img/katalog/desain/1 (2).png', 
      '/img/katalog/desain/1 (3).png',
      '/img/katalog/desain/1 (4).png',
      '/img/katalog/desain/1 (5).png',
      '/img/katalog/desain/1 (6).png'
    ]
  }

  // Data katalog art
  const artCatalog = {
    id: 'art',
    title: 'Simpel Art',
    images: [
      '/img/katalog/art/1@2x.png',
      '/img/katalog/art/4@2x.png'
    ]
  }

  // Data katalog chibi
  const chibiCatalog = {
    id: 'chibi',
    title: 'Simpel Chibi',
    images: [
      '/img/katalog/chibi/2@2x.png',
      '/img/katalog/chibi/4@2x.png'
    ]
  }

  // Data katalog line art
  const lineArtCatalog = {
    id: 'lineart',
    title: 'monocrome style',
    images: [
      '/img/katalog/lineart/5.png',
      '/img/katalog/lineart/6.png'
    ]
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

  return (
    <main>
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
          <a href="/portfolio">Project</a>
          <a href="/katalog" className="active">Katalog</a>
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

      {/* === Services Grid === */}
      <section className="services-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Layanan <strong>Terbaik</strong>
        </motion.h2>

        <div className="services-grid">
          {/* Katalog Desain sebagai service card pertama */}
          <motion.div
            className="service-card catalog-service"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0
            }}
            viewport={{ once: true }}
          >
            <div className="service-image catalog-slider-small">
              {designCatalog.images.length > 1 && (
                <button
                  className="slider-btn-small left"
                  onClick={() => handlePrev(designCatalog.id, designCatalog.images)}
                >
                  &#8249;
                </button>
              )}

              <img 
                src={designCatalog.images[sliderIndexes[designCatalog.id] ?? 0]}
                alt={designCatalog.title}
                onClick={() => {
                  setModalImageList(designCatalog.images)
                  setModalCurrentIndex(sliderIndexes[designCatalog.id] ?? 0)
                }}
              />

              {designCatalog.images.length > 1 && (
                <button
                  className="slider-btn-small right"
                  onClick={() => handleNext(designCatalog.id, designCatalog.images)}
                >
                  &#8250;
                </button>
              )}

              <div className="service-overlay">
                <button 
                  className="order-btn-small"
                  onClick={() => {
                    setModalImageList(designCatalog.images)
                    setModalCurrentIndex(sliderIndexes[designCatalog.id] ?? 0)
                  }}
                >
                  Lihat Katalog
                </button>
              </div>

              <div className="slider-dots-small">
                {designCatalog.images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot-small ${(sliderIndexes[designCatalog.id] ?? 0) === index ? 'active' : ''}`}
                    onClick={() => setSliderIndexes(prev => ({ ...prev, [designCatalog.id]: index }))}
                  />
                ))}
              </div>
            </div>
            <div className="service-content">
              <h3>Katalog Desain</h3>
              <p className="service-price">Portfolio Terbaru</p>
              <p className="service-desc">
                Koleksi desain terbaru dengan berbagai gaya dan tema. 
                <span className="image-counter-small">
                  {(sliderIndexes[designCatalog.id] ?? 0) + 1} / {designCatalog.images.length}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Katalog Art sebagai service card kedua */}
          <motion.div
            className="service-card catalog-service"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1
            }}
            viewport={{ once: true }}
          >
            <div className="service-image catalog-slider-small">
              {artCatalog.images.length > 1 && (
                <button
                  className="slider-btn-small left"
                  onClick={() => handlePrev(artCatalog.id, artCatalog.images)}
                >
                  &#8249;
                </button>
              )}

              <img 
                src={artCatalog.images[sliderIndexes[artCatalog.id] ?? 0]}
                alt={artCatalog.title}
                onClick={() => {
                  setModalImageList(artCatalog.images)
                  setModalCurrentIndex(sliderIndexes[artCatalog.id] ?? 0)
                }}
              />

              {artCatalog.images.length > 1 && (
                <button
                  className="slider-btn-small right"
                  onClick={() => handleNext(artCatalog.id, artCatalog.images)}
                >
                  &#8250;
                </button>
              )}

              <div className="service-overlay">
                <button 
                  className="order-btn-small"
                  onClick={() => {
                    setModalImageList(artCatalog.images)
                    setModalCurrentIndex(sliderIndexes[artCatalog.id] ?? 0)
                  }}
                >
                  Lihat Katalog
                </button>
              </div>

              <div className="slider-dots-small">
                {artCatalog.images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot-small ${(sliderIndexes[artCatalog.id] ?? 0) === index ? 'active' : ''}`}
                    onClick={() => setSliderIndexes(prev => ({ ...prev, [artCatalog.id]: index }))}
                  />
                ))}
              </div>
            </div>
            <div className="service-content">
              <h3>Katalog Art</h3>
              <p className="service-price">Art Collection</p>
              <p className="service-desc">
                Koleksi karya seni dengan berbagai teknik dan gaya artistic.
                <span className="image-counter-small">
                  {(sliderIndexes[artCatalog.id] ?? 0) + 1} / {artCatalog.images.length}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Katalog Chibi sebagai service card ketiga */}
          <motion.div
            className="service-card catalog-service"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.2
            }}
            viewport={{ once: true }}
          >
            <div className="service-image catalog-slider-small">
              {chibiCatalog.images.length > 1 && (
                <button
                  className="slider-btn-small left"
                  onClick={() => handlePrev(chibiCatalog.id, chibiCatalog.images)}
                >
                  &#8249;
                </button>
              )}

              <img 
                src={chibiCatalog.images[sliderIndexes[chibiCatalog.id] ?? 0]}
                alt={chibiCatalog.title}
                onClick={() => {
                  setModalImageList(chibiCatalog.images)
                  setModalCurrentIndex(sliderIndexes[chibiCatalog.id] ?? 0)
                }}
              />

              {chibiCatalog.images.length > 1 && (
                <button
                  className="slider-btn-small right"
                  onClick={() => handleNext(chibiCatalog.id, chibiCatalog.images)}
                >
                  &#8250;
                </button>
              )}

              <div className="service-overlay">
                <button 
                  className="order-btn-small"
                  onClick={() => {
                    setModalImageList(chibiCatalog.images)
                    setModalCurrentIndex(sliderIndexes[chibiCatalog.id] ?? 0)
                  }}
                >
                  Lihat Katalog
                </button>
              </div>

              <div className="slider-dots-small">
                {chibiCatalog.images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot-small ${(sliderIndexes[chibiCatalog.id] ?? 0) === index ? 'active' : ''}`}
                    onClick={() => setSliderIndexes(prev => ({ ...prev, [chibiCatalog.id]: index }))}
                  />
                ))}
              </div>
            </div>
            <div className="service-content">
              <h3>Katalog Chibi</h3>
              <p className="service-price">Chibi Style</p>
              <p className="service-desc">
                Ilustrasi karakter dengan gaya chibi yang lucu dan menggemaskan.
                <span className="image-counter-small">
                  {(sliderIndexes[chibiCatalog.id] ?? 0) + 1} / {chibiCatalog.images.length}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Katalog Line Art sebagai service card keempat */}
          <motion.div
            className="service-card catalog-service"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.3
            }}
            viewport={{ once: true }}
          >
            <div className="service-image catalog-slider-small">
              {lineArtCatalog.images.length > 1 && (
                <button
                  className="slider-btn-small left"
                  onClick={() => handlePrev(lineArtCatalog.id, lineArtCatalog.images)}
                >
                  &#8249;
                </button>
              )}

              <img 
                src={lineArtCatalog.images[sliderIndexes[lineArtCatalog.id] ?? 0]}
                alt={lineArtCatalog.title}
                onClick={() => {
                  setModalImageList(lineArtCatalog.images)
                  setModalCurrentIndex(sliderIndexes[lineArtCatalog.id] ?? 0)
                }}
              />

              {lineArtCatalog.images.length > 1 && (
                <button
                  className="slider-btn-small right"
                  onClick={() => handleNext(lineArtCatalog.id, lineArtCatalog.images)}
                >
                  &#8250;
                </button>
              )}

              <div className="service-overlay">
                <button 
                  className="order-btn-small"
                  onClick={() => {
                    setModalImageList(lineArtCatalog.images)
                    setModalCurrentIndex(sliderIndexes[lineArtCatalog.id] ?? 0)
                  }}
                >
                  Lihat Katalog
                </button>
              </div>

              <div className="slider-dots-small">
                {lineArtCatalog.images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot-small ${(sliderIndexes[lineArtCatalog.id] ?? 0) === index ? 'active' : ''}`}
                    onClick={() => setSliderIndexes(prev => ({ ...prev, [lineArtCatalog.id]: index }))}
                  />
                ))}
              </div>
            </div>
            <div className="service-content">
              <h3>Katalog Line Art</h3>
              <p className="service-price">Line Art Collection</p>
              <p className="service-desc">
                Koleksi karya line art dengan garis-garis yang bersih dan detail.
                <span className="image-counter-small">
                  {(sliderIndexes[lineArtCatalog.id] ?? 0) + 1} / {lineArtCatalog.images.length}
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === CTA Section === */}
      <motion.section
        className="cta"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>
          Let&apos;s <span className="highlighted">Work</span> Together
        </h2>
        <h1>For Your Project</h1>
        <p>
          Hubungi saya untuk konsultasi gratis dan dapatkan penawaran terbaik sesuai kebutuhan Anda. Mari wujudkan ide kreatif Anda menjadi kenyataan.
        </p>
        <button
          className="order-btn"
          onClick={() =>
            window.open("https://api.whatsapp.com/send/?phone=6285183140185&text=Halo+kak+kano%2C+mau+konsultasi+tentang+jasa+desain+dong&type=phone_number&app_absent=0", "_blank")
          }
        >
          KONSULTASI GRATIS
        </button>
      </motion.section>

      {/* === Footer === */}
      <footer className="footer">
        <div className="footer-left">
          <img src="/img/log-putih.png" alt="Logo" className="logo-img" />
          <span className="brand">KannoHouse</span>
        </div>
        <div className="footer-right">
          <div className="copyright">©Kannohouse 2025</div>
        </div>
      </footer>

      {/* === Modal Viewer === */}
      {modalImageList.length > 0 && (
        <div className="modal-overlay" onClick={() => setModalImageList([])}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImageList[modalCurrentIndex]}
              alt={`Preview ${modalCurrentIndex + 1}`}
              className="modal-image"
              loading="lazy"
            />
            <button className="close-btn" onClick={() => setModalImageList([])}>
              &times;
            </button>

            {modalImageList.length > 1 && (
              <>
                <button
                  className="slider-btn left modal-btn"
                  onClick={() =>
                    setModalCurrentIndex(
                      (modalCurrentIndex - 1 + modalImageList.length) % modalImageList.length
                    )
                  }
                >
                  &#8249;
                </button>
                <button
                  className="slider-btn right modal-btn"
                  onClick={() =>
                    setModalCurrentIndex(
                      (modalCurrentIndex + 1) % modalImageList.length
                    )
                  }
                >
                  &#8250;
                </button>
              </>
            )}

            <div className="modal-counter">
              {modalCurrentIndex + 1} / {modalImageList.length}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

