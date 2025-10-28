import React, { useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container } from "react-bootstrap";
import { db } from "../../config/firebase";
import { ref, get, child } from "firebase/database";

const CACHE_KEY = "rifayath_data";

export const Projects = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

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

  const toggleExpand = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <HelmetProvider>
      <Container className="Projects">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Projects | {data.name}</title>
          <meta
            name="description"
            content={`I’m ${data.name}, a developer passionate about building cool stuff.`}
          />
        </Helmet>

        <header className="projects-header">
          <h1 className="display-4">Projects</h1>
          <hr className="t_border my-4 ml-0 text-left" />
        </header>

        <section className="project-grid">
          {data?.projects?.map((item, i) => {
            const {
              img = item.image,
              title = item.title,
              description = item.description,
              link = item.link,
              stack = item.stack,
            } = item || {};

            const stackArray = Array.isArray(stack)
              ? stack
              : typeof stack === "string"
              ? stack.split(",").map((s) => s.trim()).filter(Boolean)
              : [];

            const expanded = expandedCards[i];

            return (
              <article className="project-card" key={i}>
                <a
                  className="project-thumb"
                  href={link || "#"}
                  target={link ? "_blank" : "_self"}
                  rel="noreferrer"
                  aria-label={`Open ${title}`}
                >
                  <img src={img} alt={title} loading="lazy" />
                </a>

                <div className="project-body">
                  <h3 className="project-title">{title}</h3>

                  <p
                    className={`project-desc ${expanded ? "expanded" : ""}`}
                    dangerouslySetInnerHTML={{
                      __html: description.replace(/;/g, "<br/>"),
                    }}
                  ></p>

                  <button
                    className="read-more-btn"
                    onClick={() => toggleExpand(i)}
                  >
                    {expanded ? "Read Less" : "Read More"}
                  </button>

                  {stackArray.length > 0 && (
                    <ul className="project-stack">
                      {stackArray.map((tech, idx) => (
                        <li className="stack-tag" key={idx}>{tech}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="project-footer">
                  {link ? (
                    <a className="project-link" href={link} target="_blank" rel="noreferrer">
                      View project
                    </a>
                  ) : (
                    <button className="project-link" disabled>Link unavailable</button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </Container>
    </HelmetProvider>
  );
};
