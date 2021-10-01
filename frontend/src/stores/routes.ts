import type { routeHooks } from "../interfaces";

export const Routes: routeHooks[] = [
  {
    routeName: "Home",
    routeUrl: "/",
    heroIcon: "",
  },
  {
    routeName: "Wallet",
    routeUrl: "credentials",
    heroIcon: "./assets/icons/wallet.svg",
  },
  {
    routeName: "Presentations",
    routeUrl: "presentations",
    heroIcon: "./assets/icons/inbox-full.svg",
  },
  // {
  //   routeName: "Messages",
  //   routeUrl: "messages",
  //   heroIcon: "./assets/icons/chat-bubble-dots.svg",
  // },
  // {
  //   routeName: "Contacts", // be cool if we could use a cog
  //   routeUrl: "contacts",
  //   heroIcon: "./assets/icons/user-group.svg",
  // },
];
