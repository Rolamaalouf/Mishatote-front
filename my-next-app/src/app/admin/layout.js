"use client";

import Sidebar from "@/app/Components/sidebar";
import ProtectAdminRoute from "@/app/Components/protectedroute";

const Dashboard = ({ children }) => {
  return (
    <ProtectAdminRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 flex flex-col">{children}</main>

      </div>
    </ProtectAdminRoute>
  );
};

export default Dashboard;


