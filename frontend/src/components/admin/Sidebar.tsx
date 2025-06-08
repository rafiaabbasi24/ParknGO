import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck2,
  ParkingSquare,
  BarChart2,
  Settings,
  X,
  LogOut,
  ListChecks,
  Users,
  Menu,
  ChevronsLeft,

  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Vehicle Category", path: "/admin/category", icon: ParkingSquare },
  { label: "Bookings", path: "/admin/bookings", icon: CalendarCheck2 },
  { label: "Parking Lot", path: "/admin/parkinglot", icon: ParkingSquare },
  { label: "Manage Vehicle", path: "/admin/vehicle", icon: ListChecks },
  { label: "Reports", path: "/admin/reports", icon: BarChart2 },
  { label: "Reg Users", path: "/admin/registered-users", icon: Users },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-50 md:hidden rounded-lg bg-white dark:bg-black backdrop-blur-sm shadow-md border-0"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Backdrop for Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "flex h-full flex-col border-r border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 transition-all duration-300 z-50",
          isMobile && "fixed left-0 top-0 bottom-0 p-4 shadow-xl",
          !isMobile && "relative p-2",
          collapsed && !isMobile ? "w-[70px]" : "w-[240px]",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-2 py-2">
          {(!collapsed || isMobile) && (
            <NavLink
              to="/admin/dashboard"
              className="text-2xl font-bold tracking-tighter text-black dark:text-white"
            >
              EAZY
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent font-extrabold">
                PARKING
              </span>
            </NavLink>
          )}
          {collapsed && !isMobile && (
            <NavLink
              to="/admin/dashboard"
              className="text-2xl mx-auto font-bold  text-black dark:text-white"
            >
              <Car className="h-8 w-8 text-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400" />
            </NavLink>
          )}

          {/* Collapse Button for Desktop */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background",
                collapsed && "rotate-180"
              )}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Close Button for Mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex h-10 items-center gap-2 rounded-lg px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
                  isActive &&
                    "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium",
                  collapsed && !isMobile && "justify-center px-0"
                )
              }
            >
              <item.icon
                className={cn("h-5 w-5", ({ isActive }: any) =>
                  isActive ? "text-blue-600 dark:text-blue-400" : ""
                )}
              />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        
          <div className="mt-auto flex items-center justify-between px-2 py-2">
            <NavLink
              to="/logout"
              className={cn(
                "flex items-center w-full gap-2 rounded-lg p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
                collapsed && !isMobile && "justify-center px-0"
              )}
            >
              <LogOut className="h-5 w-5" />
              {(!collapsed || isMobile) && <span>Logout</span>}
            </NavLink>
          </div>
        </div>
    </>
  );
}
