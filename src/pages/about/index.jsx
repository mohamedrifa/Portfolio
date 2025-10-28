import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataabout, meta, worktimeline, skills, services } from "../../content_option";

export const About = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>About | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">About me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {/* Intro */}
        <Row className="sec_sp about-intro">
          <Col lg="5">
            <h3 className="color_sec py-4">{dataabout.title}</h3>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <p className="about-text">{dataabout.aboutme}</p>
          </Col>
        </Row>

        {/* Work Timeline */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Work Timeline</h3>
          </Col>
          <Col lg="7">
            <ul className="timeline">
              {worktimeline.map((item, i) => (
                <li className="timeline-item" key={i}>
                  <div className="timeline-dot" aria-hidden />
                  <div className="timeline-card">
                    <div className="timeline-top">
                      <h5 className="timeline-role">{item.jobtitle}</h5>
                      <span className="timeline-date">{item.date}</span>
                    </div>
                    <div className="timeline-where">{item.where}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* Skills */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Skills</h3>
          </Col>
          <Col lg="7">
            <div className="skills-wrap">
              {skills.map((s, i) => (
                <div className="skill-row" key={i}>
                  <div className="skill-head">
                    <h4 className="skill-name">{s.name}</h4>
                    <span className="skill-val">{s.value}%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {/* Services */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Services</h3>
          </Col>
          <Col lg="7">
            <div className="services-grid">
              {services.map((srv, i) => (
                <article className="service-card" key={i}>
                  <h5 className="service__title">{srv.title}</h5>
                  <p className="service_desc">{srv.description}</p>
                </article>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
