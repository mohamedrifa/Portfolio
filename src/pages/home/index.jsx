import React, { useMemo } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta } from "../../content_option";
import { Link } from "react-router-dom";

export const Home = () => {
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <div className="hero container">
          {/* Media panel */}
          <div
            className="hero__media"
            style={{ backgroundImage: `url(${introdata.your_img_url})` }}
            role="img"
            aria-label={introdata.title}
          />

          {/* Text column */}
          <div className="hero__content">
            <h2>{introdata.title}</h2>

            <h1>
              {!prefersReduced ? (
                <span className="typewriter">
                  <Typewriter
                    options={{
                      strings: [
                        introdata.animated.first,
                        introdata.animated.second,
                        introdata.animated.third,
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 10,
                    }}
                  />
                </span>
              ) : (
                <span className="typewriter">{introdata.animated.first}</span>
              )}
            </h1>

            <p className="hero__tagline">{introdata.description}</p>

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
