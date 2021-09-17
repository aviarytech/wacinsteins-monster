import type { routeHooks } from "../interfaces";

export const Routes: routeHooks[] = [
  {
    routeName: "Home",
    routeUrl: "/",
    heroIcon: "",
  },
  {
    routeName: "Credentials",
    routeUrl: "credentials",
    heroIcon: "./assets/icons/badge.svg",
  },
  {
    routeName: "Presentations",
    routeUrl: "presentations",
    heroIcon: "../assets/icons/document.svg",
  },
  {
    routeName: "Messages",
    routeUrl: "messages",
    heroIcon: "./assets/icons/conversation.svg",
  },
  {
    routeName: "Contacts", // be cool if we could use a cog
    routeUrl: "contacts",
    heroIcon: "../assets/icons/user.svg",
  },
];
