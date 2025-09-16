import React from "react";
import { Navbar } from "./Navbar";
import { AppRoutes } from "../routes/AppRoutes";


export const Layout: React.FC = () => {
  return (
    <div id="layout" className="min-h-screen bg-gray-50">
      <Navbar title="Neurosens" />
      <main className="flex-1">
        <AppRoutes />
      </main>
    </div>
  );
};
