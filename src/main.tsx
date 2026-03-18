console.log('[main] App starting — build timestamp:', new Date().toISOString());
console.log('[main] All VITE_ env vars:', Object.fromEntries(
  Object.entries(import.meta.env).filter(([k]) => k.startsWith('VITE_'))
));

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
