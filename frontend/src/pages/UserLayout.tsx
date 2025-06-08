import Sidebar from "@/components/user/Sidebar";
import { Outlet } from "react-router-dom";
const UserLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
