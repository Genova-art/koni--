import { useState } from "react";
import { COLORS } from "../data/constants";
import { getStoredMessages, saveStoredMessages } from "../services/localData";
import { FadeIn, GoldDivider, SectionLabel } from "./UI";

const kontakItems = [
  { icon: "🏛️", label: "Alamat", val: "Gedung KONI, Jl. Pintu I GBKS, Senayan, Jakarta Pusat 10270" },
  { icon: "☎", label: "Telepon", val: "(021) 574-1527 / 574-1528" },
  { icon: "✉", label: "Email", val: "sekretariat@koni.or.id" },
  { icon: "🌐", label: "Website", val: "www.koni.or.id" },
];

const initialForm = {
  nama: "",
  email: "",
  institusi: "",
  kategori: "Informasi Umum",
  pesan: "",
};

export default function Kontak() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const setValue = (key) => (event) => {
    setForm({ ...form, [key]: event.target.value });
    setSent(false);
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.nama.trim()) nextErrors.nama = "Nama wajib diisi";
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = "Email tidak valid";
    if (!form.pesan.trim() || form.pesan.trim().length < 12) {
      nextErrors.pesan = "Pesan minimal 12 karakter";
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const savedMessages = getStoredMessages();
    saveStoredMessages([
      { ...form, tanggal: new Date().toISOString() },
      ...savedMessages,
    ]);

    window.dispatchEvent(new CustomEvent("koni-toast", {
      detail: { msg: "✅ Pesan berhasil terkirim! Kami akan segera menghubungi Anda.", type: "success" }
    }));

    setErrors({});
    setSent(true);
    setForm(initialForm);
  };

  return (
    <section id="kontak" style={{ background: "#FFFFFF", padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel label="Hubungi Kami" />
          <h2 style={{
            color: COLORS.navy,
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
            margin: "0 0 0.5rem",
          }}>
            Kontak &amp; Alamat
          </h2>
          <GoldDivider />
        </FadeIn>

        <div className="kontak-grid">
          <FadeIn delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {kontakItems.map((item) => (
                <div key={item.label} style={{
                  alignItems: "flex-start",
                  background: COLORS.gray,
                  borderLeft: `3px solid ${COLORS.gold}`,
                  borderRadius: 8,
                  display: "flex",
                  gap: 16,
                  padding: "1rem 1.25rem",
                }}>
                  <span style={{ flexShrink: 0, fontSize: 22 }}>{item.icon}</span>
                  <div>
                    <div style={{
                      color: COLORS.merah,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      marginBottom: 3,
                      textTransform: "uppercase",
                    }}>
                      {item.label}
                    </div>
                    <div style={{ color: COLORS.navy, fontSize: 14, lineHeight: 1.5 }}>
                      {item.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <form className="contact-form" onSubmit={handleSubmit} style={{
              background: COLORS.gray,
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 12,
              padding: "2rem",
            }}>
              <h3 style={{
                color: COLORS.navy,
                fontFamily: "Georgia, serif",
                fontSize: 20,
                margin: "0 0 1.5rem",
              }}>
                Kirim Pesan
              </h3>

              {sent && (
                <div style={{
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: 6,
                  color: "#15803d",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: "1rem",
                  padding: "10px 12px",
                }}>
                  Pesan berhasil disimpan. Tim KONI akan menindaklanjuti pesan Anda.
                </div>
              )}

              <div style={{ display: "grid", gap: "1rem" }}>
                <Field
                  error={errors.nama}
                  onChange={setValue("nama")}
                  placeholder="Nama Lengkap"
                  value={form.nama}
                />
                <Field
                  error={errors.email}
                  onChange={setValue("email")}
                  placeholder="Email"
                  type="email"
                  value={form.email}
                />
                <Field
                  onChange={setValue("institusi")}
                  placeholder="Institusi / Organisasi"
                  value={form.institusi}
                />
                <select value={form.kategori} onChange={setValue("kategori")} style={inputStyle}>
                  <option>Informasi Umum</option>
                  <option>Pendaftaran Anggota</option>
                  <option>Kerja Sama</option>
                  <option>Media & Publikasi</option>
                </select>
                <div>
                  <textarea
                    onChange={setValue("pesan")}
                    placeholder="Pesan"
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                    value={form.pesan}
                  />
                  {errors.pesan && <ErrorText text={errors.pesan} />}
                </div>
                <button type="submit" style={{
                  background: `linear-gradient(135deg, ${COLORS.merah}, #8B0000)`,
                  border: "none",
                  borderRadius: 6,
                  boxShadow: "0 4px 20px rgba(204,0,0,0.35)",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: 13,
                  textTransform: "uppercase",
                }}>
                  Kirim Pesan
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Field({ error, ...props }) {
  return (
    <div>
      <input {...props} style={inputStyle} />
      {error && <ErrorText text={error} />}
    </div>
  );
}

function ErrorText({ text }) {
  return <div style={{ color: COLORS.merah, fontSize: 11, marginTop: 5 }}>{text}</div>;
}

const inputStyle = {
  background: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 6,
  boxSizing: "border-box",
  color: COLORS.navy,
  fontSize: 14,
  outline: "none",
  padding: "11px 14px",
  width: "100%",
};
