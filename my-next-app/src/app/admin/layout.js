import Sidebar from "@/app/Components/sidebar";
import ProtectAdminRoute from "../Components/protectedroute";

const Dashboard = () => {
  return (
    <ProtectAdminRoute>
      <Sidebar>
        <h1>Admin Dashboard</h1>
      </Sidebar>
    </ProtectAdminRoute>
  );
};

export default Dashboard;

