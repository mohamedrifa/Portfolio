import React, { useMemo, useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { ref, get, child } from "firebase/database";

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

  useEffect(() => {
    // 1️⃣ Try loading from cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch {
        console.warn("Invalid cached data, ignoring...");
      }
    }

    // 2️⃣ Always refresh from Firebase in background
    setLoading(true);
    get(child(ref(db), "users/fNbNlQ9o3sef4cst0CTVsaqOiym2"))
      .then((snap) => {
        if (snap.exists()) {
          const freshData = snap.val();
          setData(freshData);
          // 3️⃣ Update cache
          localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        } else {
          console.warn("⚠️ No data found at", "users/fNbNlQ9o3sef4cst0CTVsaqOiym2");
        }
      })
      .catch((err) => console.error("❌ Firebase fetch error:", err))
      .finally(() => setLoading(false));
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
            content={`I’m ${data.name}, a developer and designer passionate about building cool stuff.`}
          />
        </Helmet>

        <div className="hero container">
          {/* Media panel */}
          <div
            className="hero__media"
            style={{
              backgroundImage: `url(${data.profileImg || "https://images.unsplash.com/photo-1514790193030-c89d266d5a9d"})`,
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
