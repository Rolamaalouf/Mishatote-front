"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { FaChartBar, FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [years, setYears] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
      if (user === undefined) return;
      if (!user || user.role !== "admin") {
          router.push("/");
      } else {
          fetchOrders();
      }
  }, [user]);

  const fetchOrders = async () => {
      try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
              withCredentials: true,
          });
          const allOrders = response.data;

          const orderYears = allOrders.map(order => new Date(order.createdAt).getFullYear());
          const uniqueYears = ["all", ...new Set(orderYears.sort((a, b) => b - a))];
          setYears(uniqueYears);

          setOrders(allOrders);
      } catch (error) {
          console.error("Error fetching orders:", error);
      }
  };

  useEffect(() => {
      fetchBestSellers();
  }, [selectedYear, selectedMonth]);

  const fetchBestSellers = async () => {
      try {
          

          const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/best-sellers?year=${selectedYear}&month=${selectedMonth}`;
 

          const response = await axios.get(url, { withCredentials: true });
 

          setTopProducts(response.data.length > 0 ? [...response.data] : []);

      } catch (error) {
          console.error("Error fetching best-selling products:", error.response?.data || error.message);
      }
  };

  useEffect(() => {
      filterOrders();
  }, [selectedYear, selectedMonth, orders]);

  const filterOrders = () => {
      let filtered = [...orders];

      if (selectedYear !== "all") {
          filtered = filtered.filter(order =>
              new Date(order.createdAt).getFullYear() === parseInt(selectedYear)
          );
      }

      if (selectedMonth !== "all") {
          filtered = filtered.filter(order =>
              new Date(order.createdAt).toLocaleString("default", { month: "long" }) === selectedMonth
          );
      }

      setFilteredOrders(filtered);
      processSalesData(filtered);
  };

  const processSalesData = (filtered) => {
      const salesSummary = {};

      filtered.forEach(order => {
          const orderDate = new Date(order.createdAt);
          const orderMonth = orderDate.toLocaleString("default", { month: "long" });

          if (!salesSummary[orderMonth]) {
              salesSummary[orderMonth] = { month: orderMonth, totalOrders: 0, totalSales: 0 };
          }

          salesSummary[orderMonth].totalOrders += 1;
          salesSummary[orderMonth].totalSales += order.total_price;
      });

      setSalesData(Object.values(salesSummary));
  };

  if (user === undefined) {
      return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  const handleYearChange = (e) => {
      const newYear = e.target.value;
      setSelectedYear(newYear);

      if (newYear === "all") {
          setSelectedMonth("all");
      }
  };

  return (
      <div className="p-8 space-y-8 min-h-screen">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-blue-500" /> Admin Dashboard
          </h1>

          {/* Filters */}
          <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md">
              <select 
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" 
                  value={selectedYear} 
                  onChange={handleYearChange}
              >
                  {years.map(year => (
                      <option key={year} value={year}>{year === "all" ? "All Years" : year}</option>
                  ))}
              </select>

              <select 
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={selectedYear === "all"}  
              >
                  {["all", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                      <option key={index} value={month}>{month}</option>
                  ))}
              </select>
          </div>

          {/* Sales & Orders Charts Side by Side */}
          <div className="grid grid-cols-2 gap-6">
              <div className="shadow-lg p-6 bg-white">
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaShoppingCart className="text-green-500" /> Total Sales ($) by Month
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `$${value}`} />
                          <Tooltip formatter={(value) => [`$${value}`, "Total Sales"]} />
                          <Legend />
                          <Bar dataKey="totalSales" fill="#4A8C8C" />
                      </BarChart>
                  </ResponsiveContainer>
              </div>

              <div className="shadow-lg p-6 bg-white">
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                      <HiTrendingUp className="text-red-500" /> Orders Trend
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="totalOrders" stroke="#E11D48" />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Top Best-Selling Products */}
          <div className="shadow-lg p-6 bg-white">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaBoxOpen className="text-yellow-500" /> Top Best-Selling Products
              </h2>
              <ul className="list-disc pl-6 text-lg text-gray-700">
                  {topProducts.length > 0 ? (
                      topProducts.map((product, index) => (
                          <li key={index} className="py-1">
                              <span className="font-bold">{product.product_name}</span> - {product.totalSales} sold
                          </li>
                      ))
                  ) : (
                      <li className="text-gray-500">No data available</li>  
                  )}
              </ul>
          </div>
      </div>
  );
};

export default DashboardPage;



 

 
