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

  // Scroll navigation
  const scrollNavigate = (id) => {
    window.location.hash = id;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  // Theme detection
  const readTheme = () =>
    document.documentElement.getAttribute("data-theme") || "light";
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setTheme(readTheme())
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Firebase name fetch
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setName(JSON.parse(cached).name);
      } catch {}
    }

    get(child(ref(db), "users/fNbNlQ9o3sef4cst0CTVsaqOiym2/name"))
      .then((snap) => snap.exists() && setName(snap.val()))
      .catch(console.error);
  }, []);

  const isMobile = window.innerWidth <= 900;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const currentHash = location.hash || "#home";

  const LinkBtn = ({ id, label }) => (
    <div
      onClick={() => scrollNavigate(id)}
      className={`
        px-4 py-2 rounded-lg font-semibold transition-all
        ${currentHash === `#${id}`
          ? "bg-black bg-opacity-10 dark:bg-white/10 -translate-y-0.5"
          : "hover:bg-black hover:bg-opacity-5 dark:hover:bg-white/10"}
      `}
    >
      {label}
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-1200 flex justify-center px-3 py-4">
      <div
        className={`
          w-full max-w-[1200px] rounded-2xl py-2 px-4 shadow-xl border-[0.5px]
          backdrop-blur-xl saturate-150
          ${theme === "dark"
            ? "border-white/15"
            : "border-black/10"}
        `}
      >
        <div className="flex items-center gap-3">
          {/* Brand */}
          <span
            className="font-extrabold text-lg cursor-pointer"
            onClick={() => scrollNavigate("home")}
          >
            {name}
          </span>

          {/* Desktop Links */}
          <nav className="ml-auto hidden md:flex gap-2">
            <LinkBtn id="home" label="Home" />
            <LinkBtn id="projects" label="Projects" />
            <LinkBtn id="about" label="About" />
            <LinkBtn id="contact" label="Contact" />
          </nav>

          {/* Right icons */}
          <div className="flex gap-3 ml-auto md:ml-3 justify-center items-center">
            <Themetoggle />

            {/* Mobile Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 text-xl"
            >
              ☰
            </button>
          </div>

          {/* Mobile Drawer */}
          {isMobile && (
            <div
              className={`
                absolute top-[110%] right-0 p-3 w-40 rounded-2xl border-[0.5px] shadow-lg
                backdrop-blur-xl transition-all
                ${open
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"}
                ${theme === "dark"
                  ? "bg-white/5 border-white/15"
                  : "bg-white/60 border-black/10"}
              `}
            >
              <div className="flex flex-col gap-1">
                <LinkBtn id="home" label="Home" />
                <LinkBtn id="projects" label="Projects" />
                <LinkBtn id="about" label="About" />
                <LinkBtn id="contact" label="Contact" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
