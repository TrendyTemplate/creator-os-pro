import React from "react";
import {createRoot} from "react-dom/client";
import {AppProvider} from "./context/AppContext";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/main.css";
createRoot(document.getElementById("root")).render(<ErrorBoundary><AppProvider><App/></AppProvider></ErrorBoundary>);
