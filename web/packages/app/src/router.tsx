import { createBrowserRouter } from "react-router-dom";
import type { ComponentType } from "react";
import { lazy, createElement } from "react";
import { Suspense } from "react";
import Layout from "./components/Layout";

interface RouteModule {
  default: ComponentType;
  layout?: ComponentType;
}

const pages = import.meta.glob<RouteModule>("./pages/**/*.tsx");

function toRoutePath(path: string): string {
  return path
    .replace("./pages", "")
    .replace(/\/(index)?\.tsx$/, "")
    .replace(/\.tsx$/, "")
    .replace(/\$([a-zA-Z]+)/g, ":$1")
    .replace(/\/\//g, "/") || "/";
}

const routes = Object.entries(pages)
  .map(([path, resolver]) => {
    const element = lazy(resolver);
    const routePath = toRoutePath(path);
    return {
      path: routePath,
      element: (
        <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
          {createElement(Layout, { children: createElement(element) })}
        </Suspense>
      ),
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

export const router = createBrowserRouter(routes);
