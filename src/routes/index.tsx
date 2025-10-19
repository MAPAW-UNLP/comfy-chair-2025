import { createFileRoute } from "@tanstack/react-router";
import Inicio from "@/components/reviews/Index";

function Index() {
  return (
    <div className="p-4">
      <Inicio />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
