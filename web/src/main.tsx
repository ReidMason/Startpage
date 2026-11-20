import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Button } from "@/components/ui/button";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">Startpage</h1>
      <Button variant="outline">Placeholder</Button>
    </main>
  </StrictMode>,
);
