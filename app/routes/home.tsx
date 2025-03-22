import { HomePage } from "../pages/home/home";

export function meta() {
  return [
    { title: "Notes Homepage" },
    {
      name: "description",
      content:
        "Welcome to Surfe Notes! Create and manage notes in a brand new way!",
    },
  ];
}

export function loader() {
  return { message: "Loading..." };
}

export default function Home() {
  return <HomePage />;
}
