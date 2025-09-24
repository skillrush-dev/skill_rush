// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import "./index.css";
import "./styles.css";
import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found - make sure there's an element with id='root' in index.html");
}

createRoot(container).render(
  <StrictMode>
    <Toaster position="top-right" richColors />
    <App />
  </StrictMode>
);
