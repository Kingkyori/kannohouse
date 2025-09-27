"use client";

import React, { useEffect, useState } from "react";
import { supabase } from '../../../lib/supabaseClient';
import { motion } from "framer-motion";
import "./style.css";

const resizeImageToWebP = (file, maxWidth = 1000, maxHeight = 1000) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/webp", 0.8);
    };

    reader.readAsDataURL(file);
  });
};

export default function CommentsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [jenis_order, setJenisOrder] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalImageList, setModalImageList] = useState([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Debug environment variables untuk comments
    console.log('=== COMMENTS DEBUG ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    console.log('========================')
    
    const fetchTestimonials = async () => {
      try {
        console.log('Fetching testimonials...')
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .order("created_at", { ascending: false });
        
        console.log('Testimonials response:', { data, error })
        
        if (error) {
          console.error('Error fetching testimonials:', error)
        } else {
          console.log('Testimonials fetched successfully:', data?.length, 'items')
          setTestimonials(data || [])
        }
      } catch (error) {
        console.error('Fetch testimonials error:', error)
        setTestimonials([])
      }
    };
    
    fetchTestimonials();
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const uploadImageToSupabase = async (file) => {
    try {
      console.log('Starting image upload...', file.name)
      
      const fileName = `${Date.now()}.webp`;
      const webpBlob = await resizeImageToWebP(file, 1000, 1000);
      
      console.log('WebP conversion completed, uploading to storage...')

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Gunakan bucket 'images' yang sama seperti portfolio
        .upload(`comments/${fileName}`, webpBlob);
      
      console.log('Upload result:', { uploadData, uploadError })

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(`comments/${fileName}`);
      
      console.log('Generated public URL:', urlData.publicUrl)
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi dropdown jenis order
    if (!jenis_order) {
      alert('Silahkan pilih jenis order terlebih dahulu');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting form submission...')
      console.log('Form data:', { name, jenis_order, comment, hasFile: !!file })
      
      let imageUrl = "";
      
      if (file) {
        console.log('Uploading image...')
        imageUrl = await uploadImageToSupabase(file);
        console.log('Image uploaded successfully:', imageUrl)
      }
      
      console.log('Inserting to database...')
      const { data, error } = await supabase
        .from("comments")
        .insert([{
          name: name.trim(),
          comment: comment.trim(),
          jenis_order: jenis_order.trim(),
          image_url: imageUrl
        }]);
      
      console.log('Database insert result:', { data, error })
      
      if (error) {
        console.error('Database insert error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error;
      }
      
      alert("Testimoni berhasil dikirim!");
      
      // Reset form
      setName("");
      setJenisOrder("");
      setComment("");
      setFile(null);
      setDropdownOpen(false);
      setShowModal(false);
      
      // Refresh testimonials
      console.log('Refreshing testimonials...')
      const { data: refreshData, error: refreshError } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!refreshError) {
        setTestimonials(refreshData || []);
        console.log('Testimonials refreshed successfully')
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      alert(`Gagal mengirim testimoni: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
          <a href="/katalog">Katalog</a>
          <a href="/comments" className="active">Testimoni</a>
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

      <motion.main 
        className="comment-page"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.section 
          className="comment-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button className="open-modal-btn" onClick={() => setShowModal(true)}>
            + Tambah Testimoni
          </button>
          <h2>My <strong>Testimonial</strong></h2>
        </motion.section>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>×</button>
              <h3>Kirim Testimoni</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="dropdown-container">
                  <div 
                    className={`dropdown-header ${dropdownOpen ? 'open' : ''}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setDropdownOpen(!dropdownOpen);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <span className={jenis_order ? 'selected' : 'placeholder'}>
                      {jenis_order || 'Pilih Jenis Order'}
                    </span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {dropdownOpen && (
                    <div className="dropdown-options">
                      <div 
                        className="dropdown-option"
                        onClick={() => {
                          setJenisOrder('Design');
                          setDropdownOpen(false);
                        }}
                      >
                        Design
                      </div>
                      <div 
                        className="dropdown-option"
                        onClick={() => {
                          setJenisOrder('Fanart');
                          setDropdownOpen(false);
                        }}
                      >
                        Fanart
                      </div>
                    </div>
                  )}
                </div>
                <textarea
                  placeholder="Komentar"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <div className="form-actions">
                  <label className="custom-file-label">
                    Pilih Gambar
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Mengirim..." : "Kirim"}
                  </button>
                </div>
                {file && <span className="selected-file-name">{file.name}</span>}
              </form>
            </div>
          </div>
        )}

        <section className="testimonial-section">
          <div className="testimonial-grid">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.id}
                className={`testimonial-card fade-in ${i % 2 === 1 ? "highlight" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1 * i
                }}
                viewport={{ once: true }}
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={`Hasil desain untuk ${item.name}`}
                    className="testimonial-image"
                    onClick={() => {
                      setModalImageList([item.image_url]);
                      setModalCurrentIndex(0);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <p>&quot;{item.comment}&quot;</p>
                <div className="line" />
                <h4>{item.name}</h4>
                <span>{item.jenis_order}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {modalImageList.length > 0 && (
          <div className="modal-overlay" onClick={() => setModalImageList([])}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={modalImageList[modalCurrentIndex]}
                className="modal-image"
                alt="Preview Gambar"
                style={{
                  maxHeight: "80vh",
                  maxWidth: "90vw",
                  borderRadius: "12px",
                }}
              />
              <button
                className="close-btn"
                onClick={() => setModalImageList([])}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 16,
                  fontSize: "2rem",
                  background: "none",
                  border: "none",
                  color: "#333",
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </motion.main>
    </>
  );
}
