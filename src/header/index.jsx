// HeadermainGlass.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Themetoggle from "../components/themetoggle";
import { db } from "../config/firebase";
import { ref, get, child } from "firebase/database";

const CACHE_KEY = "rifayath_data";

export default function Headermain() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  // ✅ Scroll + Set hash
  const scrollNavigate = (id) => {
    window.location.hash = id;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  // Theme
  const readTheme = () =>
    document.documentElement.getAttribute("data-theme") || "light";
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    setTheme(readTheme());
    return () => observer.disconnect();
  }, []);

  // Firebase
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setName(data.name);
      } catch {}
    }

    get(child(ref(db), "users/fNbNlQ9o3sef4cst0CTVsaqOiym2/name"))
      .then((snap) => snap.exists() && setName(snap.val()))
      .catch(console.error);
  }, []);

  // Colors
  const glass =
    theme === "dark"
      ? {
          bg: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))",
          stroke: "rgba(255,255,255,0.16)",
          hover: "rgba(255,255,255,0.10)",
          text: "#ffffff",
          brand: "#f9fafb",
          shadow: "0 12px 30px rgba(0,0,0,0.35)",
          active: "rgba(255,255,255,0.12)",
        }
      : {
          bg: "linear-gradient(180deg, rgba(255,255,255,0.60), rgba(255,255,255,0.45))",
          stroke: "rgba(0,0,0,0.08)",
          hover: "rgba(0,0,0,0.06)",
          text: "#0b1220",
          brand: "#0b1220",
          shadow: "0 12px 30px rgba(0,0,0,0.12)",
          active: "rgba(0,0,0,0.08)",
        };

  // Mobile
  const initialMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 900;
  }, []);
  const [isMobile, setIsMobile] = useState(initialMobile);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close drawer on hash change
  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [location.hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Styles
  const wrapper = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
    display: "flex",
    justifyContent: "center",
    padding: "15px 10px",
  };

  const pill = {
    width: "100%",
    maxWidth: 1200,
    borderRadius: 16,
    padding: "8px 10px",
    background: glass.bg,
    border: `1px solid ${glass.stroke}`,
    boxShadow: glass.shadow,
    backdropFilter: "blur(10px) saturate(1.1)",
    WebkitBackdropFilter: "blur(10px) saturate(1.1)",
  };

  const inner = { display: "flex", alignItems: "center", gap: 12 };

  const brand = {
    fontWeight: 800,
    color: glass.brand,
    fontSize: 18,
    marginLeft: 6,
    cursor: "pointer",
  };

  const linksDesktop = {
    marginLeft: "auto",
    display: isMobile ? "none" : "flex",
    gap: 10,
  };

  const linkBase = {
    color: glass.text,
    textDecoration: "none",
    fontWeight: 700,
    padding: "10px 12px",
    borderRadius: 12,
    transition: "180ms",
  };

  const currentHash = location.hash || "#home";
  const [hovered, setHovered] = useState(null);

  const NavButton = ({ id, label, index }) => (
    <div
      onClick={() => scrollNavigate(id)}
      style={{
        ...linkBase,
        cursor: "pointer",
        background:
          currentHash === `#${id}`
            ? glass.active
            : hovered === index
            ? glass.hover
            : "transparent",
        transform:
          currentHash === `#${id}` || hovered === index
            ? "translateY(-2px)"
            : "none",
      }}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      {label}
    </div>
  );

  // Mobile Panel
  const mobilePanel = {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    padding: 10,
    borderRadius: 12,
    background: glass.bg,
    border: `1px solid ${glass.stroke}`,
    backdropFilter: "blur(10px)",
    opacity: open ? 1 : 0,
    transform: open ? "scale(1)" : "scale(0.95)",
    pointerEvents: open ? "auto" : "none",
    display: isMobile ? "block" : "none",
    zIndex: 1250,
  };

  return (
    <div style={wrapper}>
      <div style={pill}>
        <div style={inner}>
          {/* Brand */}
          <span style={brand} onClick={() => scrollNavigate("home")}>
            {name}
          </span>

          {/* Desktop Nav */}
          <nav style={linksDesktop}>
            <NavButton id="home" label="Home" index={0} />
            <NavButton id="projects" label="Projects" index={1} />
            <NavButton id="about" label="About" index={2} />
            <NavButton id="contact" label="Contact" index={3} />
          </nav>

          <div style={{ marginLeft: 8, display: "flex", gap: 10 }}>
            <Themetoggle />

            {/* Hamburger */}
            <button
              onClick={() => setOpen((s) => !s)}
              style={{
                display: isMobile ? "inline-flex" : "none",
                background: "transparent",
                border: "none",
                padding: 8,
                cursor: "pointer",
              }}
            >
              ☰
            </button>
          </div>

          {/* Mobile Links */}
          <div style={mobilePanel}>
            <NavButton id="home" label="Home" />
            <NavButton id="projects" label="Projects" />
            <NavButton id="about" label="About" />
            <NavButton id="contact" label="Contact" />
          </div>
        </div>
      </div>
    </div>
  );
}
