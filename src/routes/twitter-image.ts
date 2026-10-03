import { createFileRoute } from "@tanstack/react-router";
import { profileImageResponse } from "~/og/profile-image";

export const Route = createFileRoute("/twitter-image")({
  server: { handlers: { GET: () => profileImageResponse() } },
});
