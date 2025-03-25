import { Note } from "~/pages/note/note";
import type { Route } from "../+types/root";

export function meta() {
  return [
    { title: "Note" },
    {
      name: "description",
      content: "Note page",
    },
  ];
}

export function loader() {
  return { message: "Loading..." };
}

export default function NotePage({ params }: Route.LoaderArgs) {
  if (!params.id) return <div>No id</div>;
  return <Note id={params.id} />;
}
