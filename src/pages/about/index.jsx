import React, { useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { db } from "../../config/firebase";
import { ref, get, child } from "firebase/database";

const CACHE_KEY = "rifayath_data";

export const About = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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
          console.warn("⚠️ No data found at specified path");
        }
      })
      .catch((err) => console.error("❌ Firebase fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading && !data)
    return <div className="hero container text-center py-5 text-muted">Loading...</div>;
  if (!data)
    return <div className="hero container text-center py-5 text-muted">No data found.</div>;

  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <title>About | {data.name}</title>
        </Helmet>

        {/* Header */}
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">About Me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {/* Summary */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">{data.title}</h3>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <p
              className="about-text"
              dangerouslySetInnerHTML={{
                __html: data.summary.replace(/\r?\n/g, "<br/>"),
              }}
            ></p>
          </Col>
        </Row>

        {/* Skills */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Skills</h3>
          </Col>
          <Col lg="7">
            {data.skills?.map((skill, i) => (
              <p
                key={i}
                className="about-text"
                dangerouslySetInnerHTML={{ __html: skill }}
              ></p>
            ))}
          </Col>
        </Row>

        {/* Experience */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Experience</h3>
          </Col>
          <Col lg="7">
            <ul className="timeline">
              {data.experience?.map((exp, i) => (
                <li className="timeline-item" key={i}>
                  <div className="timeline-dot" />
                  <div className="timeline-card">
                    <div className="timeline-top">
                      <h5 className="timeline-role">{exp.role}</h5>
                      <span className="timeline-date">
                        {exp.from} – {exp.to}
                      </span>
                    </div>
                    <div className="timeline-where">
                      {exp.company} | {exp.location}
                    </div>
                    <p
                      className="timeline-summary"
                      dangerouslySetInnerHTML={{
                        __html: exp.summary.replace(/;/g, "<br/>"),
                      }}
                    ></p>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* Education */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Education</h3>
          </Col>
          <Col lg="7">
            <ul className="timeline">
              {data.education?.map((edu, i) => (
                <li className="timeline-item" key={i}>
                  <div className="timeline-dot" />
                  <div className="timeline-card">
                    <div className="timeline-top">
                      <h5 className="timeline-role">{edu.stream}</h5>
                      <span className="timeline-date">
                        {edu.from} – {edu.to}
                      </span>
                    </div>
                    <div className="timeline-where">{edu.institute}</div>
                    <p className="timeline-summary">
                      Grade / CGPA: <strong>{edu.percentage}</strong>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* Certifications */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Certifications</h3>
          </Col>
          <Col lg="7">
            <ul className="cert-list">
              {data.certifications?.map((cert, i) => (
                <li key={i} className="cert-item" style={{ marginBottom: "10px" }}>
                  <span>• {cert.name}</span>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-btn"
                      style={{
                        marginLeft: "10px",
                        padding: "2px 10px",
                        borderRadius: "8px",
                        backgroundColor: "var(--secondary-color)",
                        color: "var(--h3-text)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                      }}
                    >
                      View
                    </a>
                  ) }
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        {/* Contact Info */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Contact</h3>
          </Col>
          <Col lg="7">
            <p className="about-text">
              <strong>Address:</strong> {data.address}
              <br />
              <strong>Email:</strong> {data.email}
              <br />
              <strong>Phone:</strong> {data.phone}
            </p>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
