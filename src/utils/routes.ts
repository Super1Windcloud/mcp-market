import { routeTree } from "@/routeTree.gen";
// !electron 环境不能使用 createBrowserHistory
import { createBrowserHistory, createHashHistory, createRouter } from "@tanstack/react-router";
import { isDev } from "@/utils";

const history = isDev() ? createBrowserHistory() : createHashHistory();

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
