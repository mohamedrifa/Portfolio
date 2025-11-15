import { useEffect, useState } from "react";

const lightTheme = {
  "--bg-color": "#ffffff",
  "--primary-color": "#ffffff",
  "--secondary-color": "rgba(0,0,0,0.08)",
  "--h3-text": "#4D4D4D",
  "--text-color": "#000",
  "--text-color-2": "#000",
  "--text-color-3": "rgb(204, 0, 0)",
  "--hover-glow": "#333333",
  "--overlay-color": "rgb(255 255 255 / 70%)",
};

const darkTheme = {
  "--bg-color": "#0c0c0c",
  "--primary-color": "#0d0d0d",
  "--secondary-color": "rgba(255,255,255,0.12)",
  "--h3-text": "#D1D1D1",
  "--text-color": "#fff",
  "--text-color-2": "#fff",
  "--text-color-3": "rgb(204, 0, 0)",
  "--hover-glow": "#FFFFFF",
  "--overlay-color": "rgb(12 12 12 / 63%)",
};

export default function Colors() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const readTheme = () => document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(readTheme());
    const observer = new MutationObserver(() => {
      setTheme(readTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return theme === "dark" ? darkTheme : lightTheme;
}
