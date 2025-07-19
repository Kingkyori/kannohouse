'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import './style.css'
import { motion } from "framer-motion"

export default function HomePage() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error) setTestimonials(data)
    }

    fetchData()
  }, [])

  return (
    <main>
      {/* === Navbar === */}
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


      {/* === Hero === */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="hero-left">
          <p>Hello I’m <strong>KannoHouse.</strong></p>
          <h1>
            Graphic Designer<br />
            <span className="outlined">Ilustrator</span>
          </h1>
          <p>Based In <strong>Indonesia</strong></p>
          <p className="desc">
            Saya adalah seorang desainer grafis dan ilustrator asal Indonesia yang berfokus pada visual minimalis, bersih, dan komunikatif. Melalui setiap karya, saya berusaha menghadirkan desain yang tidak hanya estetis, tetapi juga bermakna dan sesuai dengan identitas klien. Saya percaya bahwa desain yang baik mampu menyampaikan pesan tanpa perlu banyak kata.
          </p>
            <div className="socials">
              <a href="https://facebook.com/namamu" target="_blank" rel="noopener noreferrer">
                <img src="/img/icon-01.png" alt="fb" />
              </a>
              <a href="https://www.instagram.com/kannohouse_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                <img src="/img/icon-02.png" alt="IG" />
              </a>
              <a href="https://x.com/Fikuriii_" target="_blank" rel="noopener noreferrer">
                <img src="/img/icon-03.png" alt="X" />
              </a>
              <a href="https://api.whatsapp.com/send/?phone=6285183140185&text=Halo+kak+kano%2C+mau+order+fanart+dong&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                <img src="/img/icon-04.png" alt="wa" />
              </a>
            </div>
      {/* Tutup div.hero-left */}
      </div>    
        <div className="hero-right">
          <img src="/img/ilustrasi.png" alt="hero" />
        </div>
      </motion.section>


{/* === Testimonial === */}
<section className="testimonial-section">
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    My <strong>Testimonial</strong>
  </motion.h2>

  <div className="testimonial-grid">
    {Array.isArray(testimonials) && testimonials.map((item, i) => (
      <motion.div
        key={item.id}
        className={`testimonial-card ${i % 2 === 1 ? 'highlight' : ''}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.1 * (i || 0)
        }}
        viewport={{ once: true }}
      >
        {item.image_url && (
          <img src={item.image_url} alt="design result" className="testimonial-image" />
        )}
        <p>"{item.comment}"</p>
        <div className="line" />
        <h4>{item.name}</h4>
        <span>{item.jenis_order}</span>
      </motion.div>
    ))}
  </div>

  <div style={{ marginTop: '40px', textAlign: 'center' }}>
    <a href="/comments" className="see-more-btn">See More</a>
  </div>
</section>

  {/* === CTA === */}
  <motion.section
    className="cta"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <h2>
    Let's <span className="highlighted">Talk</span> For
    </h2>
    <h1>Something Special</h1>
    <p>
      Saya siap membantu mewujudkan visi kreatif Anda melalui desain yang estetis, intuitif, dan berdampak. Mari buat sesuatu yang berkesan bersama.
    </p>
        <button
          className="order-btn"
          onClick={() =>
            window.open("https://api.whatsapp.com/send/?phone=6285183140185&text=Halo+kak+kano%2C+mau+order+fanart+dong&type=phone_number&app_absent=0", "_blank")
          }
        >
          ORDER NOW
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
    </main>
  )
}
