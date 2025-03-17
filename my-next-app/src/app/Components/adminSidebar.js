import Link from "next/link";

const AdminSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-pink-800 text-white p-5 fixed">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link href="/dashboardProduct/orders" className="hover:underline">
            Orders
          </Link>
        </li>
        <li>
          <Link href="/dashboardProduct/cart" className="hover:underline">
            Cart
          </Link>
        </li>
        <li>
          <Link href="/dashboardProduct/categories" className="hover:underline">
            Categories
          </Link>
        </li>
        <li>
          <Link href="/dashboardProduct" className="hover:underline">
            Products
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
