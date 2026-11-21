import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;