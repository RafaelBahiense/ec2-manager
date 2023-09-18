import { Router, Route, RootRoute } from "@tanstack/react-router";

import Home from "@/app/Home";
import Login from "@/app/Login";
import Root from "@/app/Root";

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

// Create an index route
const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <div>Not Found</div>,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([homeRoute, loginRoute, notFoundRoute]);

// Create the router using your route tree
export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
