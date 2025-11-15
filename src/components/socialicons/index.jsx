import React, { useEffect } from "react";
import {
  FaGithub,
  FaTwitter,
  FaFacebookF,
  FaLinkedin,
  FaYoutube,
  FaTwitch,
  FaInstagram,
  FaSnapchatGhost,
  FaTiktok,
  FaCircle,
  FaWhatsapp
} from "react-icons/fa";

import Colors from "../../constants/Colors";

const socialprofils = {
  instagram: "https://www.instagram.com/mmohamedrifayath/",
  facebook: "https://www.facebook.com/mohamed.rifayath.39",
  github: "https://github.com/mohamedrifa",
  linkedin: "https://www.linkedin.com/in/mohamed-rifayath-57481b22b/",
  whatsapp: "https://wa.me/+918903677609",
};

const ICON_MAPPING = {
  default: FaCircle,
  facebook: FaFacebookF,
  github: FaGithub,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  snapchat: FaSnapchatGhost,
  tiktok: FaTiktok,
  twitter: FaTwitter,
  twitch: FaTwitch,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
};

export const Socialicons = () => {
  const colors = Colors();
  useEffect(() => {
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [colors]);

  return (
    <div
      className="
        fixed top-1/2 left-5 -translate-y-1/2
        flex flex-col items-center gap-3 
        max-md:static max-md:flex-row max-md:justify-center max-md:gap-5 max-md:py-6"
    >
      {/* Icons */}
      <div className="flex flex-col gap-3 max-md:flex-row max-md:gap-5">
        {Object.entries(socialprofils).map(([platform, url]) => {
          const IconComponent = ICON_MAPPING[platform] || ICON_MAPPING.default;

          return (
            <div key={platform}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-(--text-color) transition hover:opacity-70"
              >
                <IconComponent className="w-4 h-4 fill-(--text-color)" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Follow Me Text */}
      <p
        className="
          text-(--text-color) text-xs font-semibold tracking-wide
          -rotate-90 mt-4
          hidden md:block
        "
      >
        Follow Me
      </p>
    </div>
  );
};
