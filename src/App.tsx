import "./App.css";
import { AuthProvider } from "./app/auth/AuthProvider";
import { Layout } from "./app/layout/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { SupabaseProvider } from "./lib/supabase/SupabaseProvider";

function App() {
  return (
    <Router>
      <SupabaseProvider>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </SupabaseProvider>
    </Router>
  );
}

export default App;
