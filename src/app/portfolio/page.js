"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import './style.css'

export default function PortfolioPage() {
  const [items, setItems] = useState([])
  const [sliderIndexes, setSliderIndexes] = useState({})
  const [modalImageList, setModalImageList] = useState([])
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    const { data } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setItems(data)
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
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-left">
          <img src="/img/logo-hitam-01.png" alt="Logo" className="logo-img" />
        </div>
        <nav className="main-nav">
          <a href="/home">About Me</a>
          <a href="/portfolio">Project</a>
          <a href="/comments">Testimoni</a>
        </nav>
        <span className="brand">KannoHouse</span>
      </header>

      {/* Main Portfolio */}
      <main className="portfolio-main">
        <h2 className="portfolio-title">Portofolio</h2>
        <div className="portfolio-grid">
          {items.map((item) => (
            <div className="portfolio-card" key={item.id}>
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
            </div>
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
      </main>
    </div>
  )
}
