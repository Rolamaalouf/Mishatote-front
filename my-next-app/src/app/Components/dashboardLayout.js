import ProtectAdminRoute from "@/app/Components/protectedroute";
import AdminSidebar from "./adminSidebar";

const Dashboard = () => {
  return (
    <ProtectAdminRoute>
      <AdminSidebar>
        <h1>Admin Dashboard</h1>
      </AdminSidebar>
    </ProtectAdminRoute>
  );
};

export default Dashboard;
