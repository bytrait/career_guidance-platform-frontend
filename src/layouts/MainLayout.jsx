import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

function MainLayout() {

  const handleLogout = () => {
    window.location.href = "http://127.0.0.1:3000";
  };

  return (
    <div
      className="py-6"
      style={{
        background: "linear-gradient(50deg, #F4F5F8 0%, #F4F5F8 60%, #4140FE 100%)"
      }}
    >
      <main>
        <Navbar onLogout={handleLogout} />
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
