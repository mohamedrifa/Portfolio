import React, { useMemo, useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { ref, get, child } from "firebase/database";
import { lightImage, darkImage } from "../../utils/homeImage";

const CACHE_KEY = "rifayath_data";

export const Home = () => {
  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch {
        console.warn("Invalid cached data, ignoring...");
      }
    }
    setLoading(true);
    get(child(ref(db), "users/fNbNlQ9o3sef4cst0CTVsaqOiym2"))
      .then((snap) => {
        if (snap.exists()) {
          const freshData = snap.val();
          setData(freshData);
          localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        } else {
          console.warn("⚠️ No data found at", "users/fNbNlQ9o3sef4cst0CTVsaqOiym2");
        }
      })
      .catch((err) => console.error("❌ Firebase fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-color")
        .trim();
      setIsDark(bg === "#0c0c0c");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
      subtree: true,
    });
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-color")
      .trim();
    setIsDark(bg === "#0c0c0c");
    return () => observer.disconnect();
  }, []);

  if (loading && !data) {
    return (
      <div className="hero container" style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="hero container" style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
        No data found.
      </div>
    );
  }

  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{data.name}</title>
          <meta
            name="description"
            content={`I’m ${data.name}, a developer passionate about building cool stuff.`}
          />
        </Helmet>

        <div className="hero container">
          {/* Media panel */}
        <div
          className="hero__media"
          style={{
            backgroundImage: `url(${isDark ? darkImage : lightImage})`,
          }}
          role="img"
          aria-label={data.name}
        />

          {/* Text column */}
          <div className="hero__content">
            <h2>I’m {data.name}</h2>

            <h1>
              {!prefersReduced ? (
                <span className="typewriter">
                  <Typewriter
                    options={{
                      strings: [
                        "I love coding",
                        "I code cool websites",
                        "I develop mobile apps",
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 10,
                    }}
                  />
                </span>
              ) : (
                <span className="typewriter">I love coding</span>
              )}
            </h1>

            <p className="hero__tagline">
              {data.summary?.length > 120
                ? data.summary.slice(0, 120) + "..."
                : data.summary}
            </p>

            <div className="hero__actions">
              <Link to="/portfolio" className="btn btn--accent" aria-label="View my portfolio">
                My Portfolio
              </Link>
              <Link to="/contact" className="btn btn--ghost btn--alt" aria-label="Contact me">
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
