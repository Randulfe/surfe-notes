import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("pages/layout.tsx", [
    index("routes/home.tsx"),
    route("note/:id", "routes/note.tsx"),
  ]),
] satisfies RouteConfig;
