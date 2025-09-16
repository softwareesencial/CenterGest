import "./App.css";
import { AuthProvider } from "./app/auth/AuthProvider";
import { Layout } from "./app/layout/Layout";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;
