import React, { useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { db } from "../../config/firebase";
import { ref, get, child } from "firebase/database";

const CACHE_KEY = "rifayath_data";

export const ContactMe = () => {
  const [formData, setFormdata] = useState({
    email: "",
    name: "",
    message: "",
    loading: false,
    show: false,
    alertmessage: "",
    variant: "",
  });
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
          console.warn("⚠️ No data found at", "users/fNbNlQ9o3sef4cst0CTVsaqOiym2");
        }
      })
      .catch((err) => console.error("❌ Firebase fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const recipient = data?.email;
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
  };

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{data.name} | Contact</title>
          <meta name="description" content={`I’m ${data.name}, a developer passionate about building cool stuff.`} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Contact Me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="12">
            <Alert
              //show={formData.show}
              variant={formData.variant}
              className={`rounded-0 co_alert ${
                formData.show ? "d-block" : "d-none"
              }`}
              onClose={() => setFormdata({ show: false })}
              dismissible
            >
              <p className="my-0">{formData.alertmessage}</p>
            </Alert>
          </Col>
          <Col lg="5" className="mb-5">
            <h3 className="color_sec py-4">Get in touch</h3>
            <address>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${data.email}`}>
                {data.email}
              </a>
              <br />
              <br />
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${data.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {data.phone}
                </a>
              </p>
            </address>
            <p className="hero__tagline">
              {data.summary?.length > 120
                ? data.summary.slice(0, 120) + "..."
                : data.summary}
            </p>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="contact__form w-100">
              <Row>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name || ""}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <textarea
                className="form-control rounded-0"
                id="message"
                name="message"
                placeholder="Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <br />
              <Row>
                <Col lg="12" className="form-group">
                  <button className="btn ac_btn" type="submit">
                    {formData.loading ? "Sending..." : "Send"}
                  </button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={formData.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
