import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import {
  PiBookOpenDuotone,
  PiGlobeDuotone,
  PiLinkedinLogoDuotone,
  PiMediumLogoDuotone,
  PiUserSoundDuotone,
  PiXLogoDuotone
} from "react-icons/pi";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Nexo Docs",
      transparentMode: "top",
    },
    themeSwitch: {
      enabled: true,
      mode: "light-dark-system",
    },
    searchToggle: {
      enabled: true,
    },
    githubUrl: "https://github.com/kanakkholwal",
    links: [
      { text: "Documentation", url: "/docs", icon: <PiBookOpenDuotone /> },

      {
        text: "Website",
        url: "https://nexonauts.com",
        icon: <PiGlobeDuotone />,
      },
      { text: "Portfolio", url: "https://kanak.eu.org", icon: <PiUserSoundDuotone /> },
      {
        text: "Twitter",
        url: "https://x.com/kanakkholwal",
        icon: <PiXLogoDuotone />,
        secondary: true,
        type: "icon",
      },
      {
        text: "Medium",
        url: "https://kanakkholwal.medium.com",
        icon: <PiMediumLogoDuotone />,
        secondary: true,
        type: "icon",
      },
      {
        text: "LinkedIn",
        url: "https://www.linkedin.com/in/kanak-kholwal",
        icon: <PiLinkedinLogoDuotone />,
        secondary: true,
        type: "icon",
      },
    ],
  };
}
