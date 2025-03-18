import Sidebar from "@/app/Components/sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />
      {/* Main content area */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
