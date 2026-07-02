import { createContext, useContext, useState } from "react";

const I18N = {
  id: {
    nav_home: "Beranda", nav_profil: "Profil", nav_cabor: "Cabang Olahraga",
    nav_atlet: "Atlet", nav_berita: "Berita", nav_kontak: "Kontak",
    nav_login: "Masuk", nav_register: "Daftar",
    hero_tag: "Kebanggaan Bangsa", hero_btn1: "Daftar Anggota", hero_btn2: "Tentang KONI",
    stats_cabor: "Cabang Olahraga", stats_atlet: "Atlet Nasional",
    stats_provinsi: "KONI Provinsi", stats_medali: "Medali Internasional",
    footer_tagline: "Merah Putih Berprestasi Bermartabat",
  },
  en: {
    nav_home: "Home", nav_profil: "Profile", nav_cabor: "Sports",
    nav_atlet: "Athletes", nav_berita: "News", nav_kontak: "Contact",
    nav_login: "Login", nav_register: "Register",
    hero_tag: "National Pride", hero_btn1: "Become Member", hero_btn2: "About KONI",
    stats_cabor: "Sports Branches", stats_atlet: "National Athletes",
    stats_provinsi: "Provincial KONI", stats_medali: "International Medals",
    footer_tagline: "Red White Excels with Dignity",
  },
};

const LangContext = createContext({ lang: "id", t: k => k, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("koni-lang") || "id");
  const t = (key) => I18N[lang]?.[key] || I18N.id[key] || key;
  const changeLang = (l) => { setLang(l); localStorage.setItem("koni-lang", l); };
  return <LangContext.Provider value={{ lang, t, setLang: changeLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      title="Ganti Bahasa / Switch Language"
      style={{
        width: 38, height: 38, borderRadius: 8,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)",
        transition: "all 0.2s", letterSpacing: "0.02em",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
    >
      {lang === "id" ? "EN" : "ID"}
    </button>
  );
}
