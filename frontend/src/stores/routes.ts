import { routeHooks } from "../interfaces"

export const routes: routeHooks[] = [
  {
    routeName: "Home",
    routeUrl: "/",
  },
   {
    routeName: "Credentials",
    routeUrl: "credentials",
  }, 
  {
    routeName: "Presentations",
    routeUrl: "presentations",
  },
  {
    routeName: "Messages",
    routeUrl: "messages",
  },
  {
    routeName: 'Connections',//be cool if we could use a cog
    routeUrl: "connections",
  }
]
