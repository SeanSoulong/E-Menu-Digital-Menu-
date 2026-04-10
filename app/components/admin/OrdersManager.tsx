"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { Order } from "../../data/types";
import * as XLSX from "xlsx";

interface OrdersManagerProps {
  onOrderUpdated?: () => void;
}

export default function OrdersManager({ onOrderUpdated }: OrdersManagerProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editFormData, setEditFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    quantity: 1,
  });

  // Sorting and Pagination states
  const [sortBy, setSortBy] = useState<
    "id" | "customer_name" | "created_at" | "total_price" | "status"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?status=${filter}&limit=1000`);
      const data = await response.json();
      setAllOrders(data.orders || []);
      setOrders(data.orders || []);

      if (filter === "all" && data.orders) {
        const pending = data.orders.filter(
          (o: Order) => o.status === "pending"
        ).length;
        const confirmed = data.orders.filter(
          (o: Order) => o.status === "confirmed"
        ).length;
        const completed = data.orders.filter(
          (o: Order) => o.status === "completed"
        ).length;
        const cancelled = data.orders.filter(
          (o: Order) => o.status === "cancelled"
        ).length;
        setStats({ pending, confirmed, completed, cancelled });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and Sort orders
  const getFilteredAndSortedOrders = () => {
    let filtered = [...allOrders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer_phone.includes(searchTerm) ||
          order.id.toString().includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "customer_name":
          aValue = a.customer_name;
          bValue = b.customer_name;
          break;
        case "total_price":
          aValue = parseFloat(a.total_price?.replace(/[^0-9.-]/g, "") || "0");
          bValue = parseFloat(b.total_price?.replace(/[^0-9.-]/g, "") || "0");
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  const filteredAndSortedOrders = getFilteredAndSortedOrders();
  const totalItems = filteredAndSortedOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredAndSortedOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, filter]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchOrders();
        if (onOrderUpdated) onOrderUpdated();

        if (newStatus === "confirmed") {
          alert(
            language === "en"
              ? "✓ Order confirmed! Stock has been deducted."
              : "✓ បានបញ្ជាក់ការបញ្ជាទិញ! ស្តុកត្រូវបានកាត់បន្ថយ។"
          );
        } else if (newStatus === "cancelled") {
          alert(
            language === "en"
              ? "Order cancelled. Stock has been restored if it was deducted."
              : "បានបោះបង់ការបញ្ជាទិញ។ ស្តុកត្រូវបានស្តារឡើងវិញ។"
          );
        }
      } else {
        alert(
          language === "en" ? `Error: ${data.error}` : `កំហុស: ${data.error}`
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert(
        language === "en"
          ? "Failed to update order status"
          : "មិនអាចធ្វើបច្ចុប្បន្នភាពស្ថានភាពការបញ្ជាទិញបានទេ"
      );
    } finally {
      setUpdating(null);
    }
  };

  const updateOrderInfo = async (
    orderId: number,
    updatedData: Partial<Order>
  ) => {
    setUpdating(orderId);
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, ...updatedData }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchOrders();
        if (onOrderUpdated) onOrderUpdated();
        alert(
          language === "en"
            ? "✓ Order updated successfully!"
            : "✓ បានធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញដោយជោគជ័យ!"
        );
        setEditingOrder(null);
      } else {
        alert(
          language === "en" ? `Error: ${data.error}` : `កំហុស: ${data.error}`
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert(
        language === "en"
          ? "Failed to update order"
          : "មិនអាចធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញបានទេ"
      );
    } finally {
      setUpdating(null);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (
      !confirm(
        language === "en"
          ? "Are you sure you want to delete this order? This action cannot be undone."
          : "តើអ្នកពិតជាចង់លុបការបញ្ជាទិញនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។"
      )
    ) {
      return;
    }

    setDeleting(orderId);
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchOrders();
        if (onOrderUpdated) onOrderUpdated();
        alert(
          language === "en"
            ? "Order deleted successfully!"
            : "បានលុបការបញ្ជាទិញដោយជោគជ័យ!"
        );
      } else {
        const data = await response.json();
        alert(
          language === "en" ? `Error: ${data.error}` : `កំហុស: ${data.error}`
        );
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert(
        language === "en"
          ? "Failed to delete order"
          : "មិនអាចលុបការបញ្ជាទិញបានទេ"
      );
    } finally {
      setDeleting(null);
    }
  };

  const startEdit = (order: Order) => {
    setEditingOrder(order);
    setEditFormData({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address || "",
      quantity: order.quantity,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      updateOrderInfo(editingOrder.id, {
        customer_name: editFormData.customer_name,
        customer_phone: editFormData.customer_phone,
        customer_address: editFormData.customer_address,
        quantity: editFormData.quantity,
      });
    }
  };

  const handleSort = (
    field: "id" | "customer_name" | "created_at" | "total_price" | "status"
  ) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const exportToExcel = () => {
    const exportData = filteredAndSortedOrders.map((order) => ({
      "Order ID": order.id,
      Product: order.item_name,
      Quantity: order.quantity,
      "Customer Name": order.customer_name,
      "Customer Phone": order.customer_phone,
      "Customer Address": order.customer_address,
      "Total Price": order.total_price,
      Status: order.status,
      Date: new Date(order.created_at).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `orders_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: language === "en" ? "Pending" : "កំពុងរង់ចាំ",
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: language === "en" ? "Confirmed" : "បានបញ្ជាក់",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: language === "en" ? "Completed" : "បានបញ្ចប់",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: language === "en" ? "Cancelled" : "បានបោះបង់",
      },
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>
    );
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    const container = document.getElementById("orders-container");
    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0E4123] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {language === "en" ? "Order Management" : "ការគ្រប់គ្រងការបញ្ជាទិញ"}
          </h2>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-[#0E4123] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {language === "en" ? "All" : "ទាំងអស់"} ({allOrders.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === "confirmed"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Confirmed ({stats.confirmed})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              Completed ({stats.completed})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === "cancelled"
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              Cancelled ({stats.cancelled})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={
                language === "en"
                  ? "Search by Order ID, Customer name, or Phone..."
                  : "ស្វែងរកតាមលេខបញ្ជាទិញ ឈ្មោះអតិថិជន ឬលេខទូរស័ព្ទ..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
          <div
            className="rounded-2xl shadow-2xl p-6 max-w-md w-full relative"
            style={{
              backgroundColor: theme.cardBackgroundColor,
              color: theme.textColor,
            }}
          >
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: theme.textColorSecondary }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2
              className="text-xl font-bold mb-4"
              style={{ color: theme.textColor }}
            >
              {language === "en" ? "Edit Order" : "កែសម្រួលការបញ្ជាទិញ"} #
              {editingOrder.id}
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.textColor }}
                >
                  {language === "en" ? "Customer Name" : "ឈ្មោះអតិថិជន"}
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.customer_name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      customer_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: `${theme.primaryColor}40`,
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.textColor }}
                >
                  {language === "en" ? "Phone Number" : "លេខទូរស័ព្ទ"}
                </label>
                <input
                  type="tel"
                  required
                  value={editFormData.customer_phone}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      customer_phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: `${theme.primaryColor}40`,
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.textColor }}
                >
                  {language === "en"
                    ? "Delivery Address"
                    : "អាសយដ្ឋានដឹកជញ្ជូន"}
                </label>
                <textarea
                  value={editFormData.customer_address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      customer_address: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none"
                  style={{
                    borderColor: `${theme.primaryColor}40`,
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.textColor }}
                >
                  {language === "en" ? "Quantity" : "បរិមាណ"}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editFormData.quantity}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: `${theme.primaryColor}40`,
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    backgroundColor: `${theme.textColorSecondary}20`,
                    color: theme.textColor,
                  }}
                >
                  {language === "en" ? "Cancel" : "បោះបង់"}
                </button>
                <button
                  type="submit"
                  disabled={updating === editingOrder.id}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {updating === editingOrder.id ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : language === "en" ? (
                    "Save Changes"
                  ) : (
                    "រក្សាទុក"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {orders.length === 0 && filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-gray-500">
            {language === "en" ? "No orders found" : "មិនមានការបញ្ជាទិញ"}
          </p>
        </div>
      ) : (
        <>
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {language === "en" ? "Sort by:" : "តម្រៀបតាម:"}
              </span>
              <button
                onClick={() => handleSort("id")}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  sortBy === "id"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-800 bg-gray-100"
                }`}
              >
                ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSort("customer_name")}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  sortBy === "customer_name"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-800 bg-gray-100"
                }`}
              >
                {language === "en" ? "Customer" : "អតិថិជន"}{" "}
                {sortBy === "customer_name" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSort("total_price")}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  sortBy === "total_price"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-800 bg-gray-100"
                }`}
              >
                {language === "en" ? "Total" : "សរុប"}{" "}
                {sortBy === "total_price" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSort("created_at")}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  sortBy === "created_at"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-800 bg-gray-100"
                }`}
              >
                {language === "en" ? "Date" : "កាលបរិច្ឆេទ"}{" "}
                {sortBy === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSort("status")}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  sortBy === "status"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-800 bg-gray-100"
                }`}
              >
                {language === "en" ? "Status" : "ស្ថានភាព"}{" "}
                {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {language === "en" ? "Export to Excel" : "នាំចេញទៅ Excel"}
            </button>
          </div>

          <div className="overflow-x-auto" id="orders-container">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("id")}
                  >
                    ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {language === "en" ? "Product" : "ផលិតផល"}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("customer_name")}
                  >
                    {language === "en" ? "Customer" : "អតិថិជន"}{" "}
                    {sortBy === "customer_name" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {language === "en" ? "Qty" : "បរិមាណ"}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("total_price")}
                  >
                    {language === "en" ? "Total" : "សរុប"}{" "}
                    {sortBy === "total_price" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("status")}
                  >
                    {language === "en" ? "Status" : "ស្ថានភាព"}{" "}
                    {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort("created_at")}
                  >
                    {language === "en" ? "Date" : "កាលបរិច្ឆេទ"}{" "}
                    {sortBy === "created_at" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {language === "en" ? "Actions" : "សកម្មភាព"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate">
                      {order.item_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer_phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.total_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          disabled={updating === order.id}
                          className="px-2 py-1 border rounded-lg text-sm"
                          style={{ borderColor: `${theme.primaryColor}40` }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">
                            Confirm (Deduct Stock)
                          </option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => startEdit(order)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title={
                            language === "en"
                              ? "Edit Order"
                              : "កែសម្រួលការបញ្ជាទិញ"
                          }
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          disabled={deleting === order.id}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title={
                            language === "en"
                              ? "Delete Order"
                              : "លុបការបញ្ជាទិញ"
                          }
                        >
                          {deleting === order.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  {language === "en" ? "Showing" : "កំពុងបង្ហាញ"}{" "}
                  {startIndex + 1} - {Math.min(endIndex, totalItems)}{" "}
                  {language === "en" ? "of" : "នៃ"} {totalItems}{" "}
                  {language === "en" ? "orders" : "ការបញ្ជាទិញ"}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {language === "en" ? "Previous" : "មុន"}
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {language === "en" ? "Next" : "បន្ទាប់"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {language === "en" ? "Show:" : "បង្ហាញ:"}
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border rounded-lg text-sm"
                    style={{ borderColor: `${theme.primaryColor}40` }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
