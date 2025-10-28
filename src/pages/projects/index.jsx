import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container } from "react-bootstrap";
import { dataportfolio, meta } from "../../content_option";

export const Projects = () => {
  return (
    <HelmetProvider>
      <Container className="Projects">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Projects | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <header className="projects-header">
          <h1 className="display-4">Projects</h1>
          <hr className="t_border my-4 ml-0 text-left" />
        </header>

        <section className="project-grid">
          {dataportfolio.map((item, i) => {
            const {
              img,
              title = "Untitled Project",
              description = "No description provided.",
              link,
              stack, // array or string (e.g., ["React", "Node"] or "React, Node"
            } = item || {};

            const stackArray = Array.isArray(stack)
              ? stack
              : typeof stack === "string"
              ? stack.split(",").map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <article className="project-card" key={i}>
                <a
                  className="project-thumb"
                  href={link || "#"}
                  target={link ? "_blank" : "_self"}
                  rel="noreferrer"
                  aria-label={`Open ${title}`}
                >
                  {/* aspect-ratio keeps cards neat even with different image sizes */}
                  <img src={img} alt={title} loading="lazy" />
                </a>

                <div className="project-body">
                  <h3 className="project-title">{title}</h3>

                  <p className="project-desc">
                    {description}
                  </p>

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
