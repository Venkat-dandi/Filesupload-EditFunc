import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { ProjectProvider } from "./context/ProjectContext.jsx"; // Import ProjectProvider
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* Wrap the whole app inside BrowserRouter */}
      <AuthProvider> {/* Wrap AuthProvider to provide authentication */}
        <ProjectProvider>{/* Wrap App with ProjectProvider */}
          <App />
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
