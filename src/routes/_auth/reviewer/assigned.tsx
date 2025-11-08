import AssignedArticlesView from "@/features/reviewer/AssignedArticles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reviewer/assigned")({
  component: AssignedArticlesView,
});
