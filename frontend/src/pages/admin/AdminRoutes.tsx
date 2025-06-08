import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "./AdminDashboard";
import Category from "./AdminVehicleCategory";
import Bookings from "./AdminBookings";
import ParkingLot from "./AdminParkingLot";
import Reports from "./AdminReports";
import RegisteredUsers from "./AdminregUser";
import Settings from "./AdminSetting";
import AdminBook from "./AdminBook";
import AdminManageVehicle from "./AdminManageVehicle";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="category" element={<Category />} />
        <Route path="vehicle" element={<AdminManageVehicle />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/:id" element={<AdminBook />} />
        <Route path="parkinglot" element={<ParkingLot />} />
        <Route path="reports" element={<Reports />} />
        <Route path="registered-users" element={<RegisteredUsers />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
