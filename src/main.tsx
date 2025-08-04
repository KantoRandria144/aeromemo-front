import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
<AuthProvider>
    <Router>
      <App />
    </Router>
</AuthProvider>

);
