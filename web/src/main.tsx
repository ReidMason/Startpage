import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { InlineProto } from "./proto/InlineProto";
import { Proto } from "./proto/Proto";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {location.pathname !== "/proto" ? (
        <App />
      ) : new URLSearchParams(location.search).get("variant") === "inline" ? (
        <InlineProto />
      ) : (
        <Proto />
      )}
    </QueryClientProvider>
  </StrictMode>,
);
