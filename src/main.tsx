import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

function mount(el: HTMLElement) {
  createRoot(el).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

function init() {
  const devRoot = document.getElementById("root");
  if (devRoot) {
    mount(devRoot);
    return;
  }

  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>("[data-address-generator]"),
  );
  nodes.forEach((node) => mount(node));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
