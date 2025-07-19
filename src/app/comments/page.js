"use client";

import React, { useEffect, useState } from "react";
import { supabase } from '../../../lib/supabaseClient'
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

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase.from("comments").select("*").order("created_at", { ascending: false });
      if (!error) setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  const uploadImageToSupabase = async (file) => {
    const fileName = `${Date.now()}.webp`;
    const webpBlob = await resizeImageToWebP(file, 1000, 1000);

    const { error: uploadError } = await supabase.storage.from("comments-images").upload(fileName, webpBlob);
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return null;
    }
    const { data: publicUrl } = supabase.storage.from("comments-images").getPublicUrl(fileName);
    return publicUrl?.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const imageUrl = file ? await uploadImageToSupabase(file) : "";
    const { error } = await supabase.from("comments").insert([
      { name, comment, jenis_order, image_url: imageUrl },
    ]);
    if (!error) {
      alert("Testimoni berhasil dikirim!");
      setName("");
      setJenisOrder("");
      setComment("");
      setFile(null);
      setShowModal(false);
      window.location.reload();
    } else {
      alert("Gagal mengirim testimoni");
    }
    setIsSubmitting(false);
  };

  return (
    <>
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

      <main className="comment-page">
        <section className="comment-header">
          <button className="open-modal-btn" onClick={() => setShowModal(true)}>
            + Tambah Testimoni
          </button>
          <h2>My <strong>Testimonial</strong></h2>
        </section>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>×</button>
              <h3>Kirim Testimoni</h3>
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Jenis Order (fanart/design)" value={jenis_order} onChange={(e) => setJenisOrder(e.target.value)} required />
                <textarea placeholder="Komentar" value={comment} onChange={(e) => setComment(e.target.value)} required />
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
                    {isSubmitting ? 'Mengirim...' : 'Kirim'}
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
              <div
                key={item.id}
                className={`testimonial-card fade-in ${i % 2 === 1 ? 'highlight' : ''}`}
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt="design result"
                    className="testimonial-image"
                    onClick={() => {
                      setModalImageList([item.image_url]);
                      setModalCurrentIndex(0);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <p>"{item.comment}"</p>
                <div className="line" />
                <h4>{item.name}</h4>
                <span>{item.jenis_order}</span>
              </div>
            ))}
          </div>
        </section>

        {modalImageList.length > 0 && (
          <div className="modal-overlay" onClick={() => setModalImageList([])}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={modalImageList[modalCurrentIndex]}
                className="modal-image"
                alt="preview"
                style={{ maxHeight: '80vh', maxWidth: '90vw', borderRadius: '12px' }}
              />
              <button
                className="close-btn"
                onClick={() => setModalImageList([])}
                style={{ position: 'absolute', top: 12, right: 16, fontSize: '2rem', background: 'none', border: 'none', color: '#333' }}
              >×</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
