import { Icons } from "@/components/icons/icons";
import { FaMedium } from "react-icons/fa6";



export const DATA = {
  
  contact: {
    email: "kanakkholwal@gmail.com",
    tel: "+123456789",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/kanakkholwal",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/kanakkholwal",
        icon: Icons.linkedin,
        navbar: true,
      },
      Twitter: {
        name: "Twitter",
        url: "https://twitter.com/kanakkholwal",
        icon: Icons.x,
        navbar: true,
      },
      Instagram: {
        name: "Instagram",
        url: "https://www.instagram.com/kanakkholwal",
        icon: Icons.instagram,
        navbar: true,
      },
      Medium: {
        name: "Medium",
        url: "https://medium.com/@kanakkholwal",
        icon: FaMedium,
        navbar: true,
      },
      Email: {
        name: "Send Email",
        url: "mailto:kanakkholwal@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
} as const;
