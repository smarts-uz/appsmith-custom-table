import "./tailwind.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";

function App() {
  return (
    <div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
