import { routeTree } from "@/routeTree.gen";
import { createBrowserHistory, createRouter } from "@tanstack/react-router";


const history = createBrowserHistory();

export const router = createRouter({
  defaultPendingMinMs: 0,
  routeTree,
  history,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
