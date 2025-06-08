
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout() {

  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar
    
      />

      {/* Main content on the right */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300`}
      >
        <Outlet />
      </main>
    </div>
  );
}
