import { routeHooks } from "../interfaces";

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
  // {
  //   routeName: "Messages",
  //   routeUrl: "messages",
  //   heroIcon: "../assets/outlineChatAlt2.svg",
  // },
  // {
  //   routeName: "Connections", // be cool if we could use a cog
  //   routeUrl: "connections",
  //   heroIcon: "../assets/outlineUser.svg",
  // },
];
