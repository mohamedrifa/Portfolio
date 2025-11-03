// src/routes/index.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Socialicons } from "../components/socialicons";
import Home from "../pages/home";
import Projects from "../pages/projects";
import About from "../pages/about";
import ContactMe from "../pages/contact";

export default function AppRoutes() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const section = document.getElementById(hash.substring(1));
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div className="s_c">
      <section id="home"><Home /></section>
      <section id="projects"><Projects /></section>
      <section id="about"><About /></section>
      <section id="contact"><ContactMe /></section>
      <Socialicons />
    </div>
  );
}
