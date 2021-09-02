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
    heroIcon: "../assets/outlineBookmarkAlt.svg",
  },
  {
    routeName: "Presentations",
    routeUrl: "presentations",
    heroIcon: "../assets/outlineDocumentReport.svg",
  },
  {
    routeName: "Messages",
    routeUrl: "messages",
    heroIcon: "../assets/outlineChatAlt2.svg",
  },
  {
    routeName: "Contacts", // be cool if we could use a cog
    routeUrl: "contacts",
    heroIcon: "../assets/outlineUser.svg",
  },
];
