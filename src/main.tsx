import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource-variable/noto-sans-armenian";
import "@fontsource-variable/noto-serif-armenian";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>,
);
