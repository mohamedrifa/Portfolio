// HeadermainGlass.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Themetoggle from "../components/themetoggle";
import { db } from "../config/firebase";
import { ref, get, child } from "firebase/database";

const CACHE_KEY = "rifayath_data";

export default function Headermain() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("")

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

  useEffect(() => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const data = JSON.parse(cached)
          setName(data.name);
        } catch {
          console.warn("Invalid cached data, ignoring...");
        }
      }
      get(child(ref(db), "users/fNbNlQ9o3sef4cst0CTVsaqOiym2/name"))
        .then((snap) => {
          if (snap.exists()) {
            setName(snap.val());
          } else {
            console.warn("⚠️ No data found at", USER_PATH);
          }
        })
        .catch((err) => console.error("❌ Firebase fetch error:", err))
    }, []);

  // tokens for light / dark
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

  // --- mobile handling (unchanged) ---
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

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // --- styles (now themed via `glass`) ---
  const wrapper = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 1200,
    display: "flex",
    justifyContent: "center",
    padding: "15px 10px",
    boxSizing: "border-box",
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
    boxSizing: "border-box",
  };

  const inner = { display: "flex", alignItems: "center", gap: 12 };

  const brand = {
    fontWeight: 800,
    color: glass.brand,
    letterSpacing: 0.3,
    fontSize: 18,
    userSelect: "none",
    textDecoration: "none",
    marginLeft: 6,
  };

  const linksDesktop = {
    marginLeft: "auto",
    display: isMobile ? "none" : "flex",
    alignItems: "center",
    gap: 10,
  };

  const linkBase = {
    color: glass.text,
    textDecoration: "none",
    fontWeight: 700,
    padding: "10px 12px",
    borderRadius: 12,
    transition: "transform 180ms ease, background-color 180ms ease",
    display: "inline-block",
  };

  const isActive = (path) => location.pathname === path;

  const [hovered, setHovered] = useState(null);
  const hoverBg = (i) =>
    hovered === i ? { background: glass.hover, transform: "translateY(-2px)" } : null;

  const NavLink = ({ to, children, index }) => (
    <Link
      to={to}
      style={{
        ...linkBase,
        ...(hoverBg(index) || {}),
        ...(isActive(to)
          ? { background: glass.active, transform: "translateY(-2px)" }
          : {}),
      }}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      {children}
    </Link>
  );

  // Hamburger
  const hambtn = {
    display: isMobile ? "inline-flex" : "none",
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 8,
    borderRadius: 10,
  };

  const hamburgerBox = { width: 26, height: 18, position: "relative" };
  const lineCommon = {
    position: "absolute", left: 0, right: 0, height: 2,
    background: glass.text, borderRadius: 2,
    transition: "transform 260ms cubic-bezier(.2,.9,.2,1), opacity 200ms, top 260ms",
  };
  const line1 = { ...lineCommon, top: open ? 8 : 0, transform: open ? "rotate(45deg)" : "none" };
  const line2 = { ...lineCommon, top: 8, opacity: open ? 0 : 1 };
  const line3 = { ...lineCommon, top: open ? 8 : 16, transform: open ? "rotate(-45deg)" : "none" };

  // Mobile panel
  const mobilePanel = {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    margin: "0 10px",
    padding: 10,
    borderRadius: 12,
    background: glass.bg,
    border: `1px solid ${glass.stroke}`,
    backdropFilter: "blur(10px) saturate(1.1)",
    WebkitBackdropFilter: "blur(10px) saturate(1.1)",
    boxShadow: glass.shadow,
    transformOrigin: "top right",
    transition: "transform 260ms cubic-bezier(.2,.9,.2,1), opacity 220ms ease",
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.98)",
    pointerEvents: open ? "auto" : "none",
    display: isMobile ? "block" : "none",
    zIndex: 1250,
    maxWidth: "calc(100% - 20px)",
  };

  return (
    <div style={wrapper}>
      <div style={pill}>
        <div style={inner}>
          <Link to="/" style={brand}>{name}</Link>

          <div style={{ flex: 1 }} />

          {/* Desktop links */}
          <nav aria-label="Primary" style={linksDesktop}>
            <NavLink to="/" index={0}>Home</NavLink>
            <NavLink to="/projects" index={1}>Projects</NavLink>
            <NavLink to="/about" index={2}>About</NavLink>
            <NavLink to="/contact" index={3}>Contact</NavLink>
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 8 }}>
            <Themetoggle />
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              style={hambtn}
            >
              <div style={hamburgerBox}>
                <span style={line1} />
                <span style={line2} />
                <span style={line3} />
              </div>
            </button>
          </div>

          {/* Mobile panel */}
          <div style={mobilePanel} role="menu" aria-hidden={!open}>
            <Link to="/" style={linkBase}>Home</Link>
            <Link to="/projects" style={linkBase}>Projects</Link>
            <Link to="/about" style={linkBase}>About</Link>
            <Link to="/contact" style={linkBase}>Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
