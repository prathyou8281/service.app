"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  name: string;
  email: string;
  details: string;
  vendor: string | null;
  category: string | null;
  location: string | null;
  date: string;
  status: string;
  cancelReason?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      const parsed = JSON.parse(stored).map((o: Order) => ({
        ...o,
        status: o.status || "Processing",
      }));
      setOrders(parsed);
    }
  }, []);

  const updateOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const handleCancelSubmit = () => {
    if (!cancelOrder) return;

    const updated = orders.map((o) =>
      o.date === cancelOrder.date
        ? { ...o, status: "Cancellation Processing", cancelReason }
        : o
    );
    updateOrders(updated);
    setCancelOrder(null);
    setCancelReason("");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Cancellation Processing":
        return "bg-red-100 text-red-700 border border-red-300";
      case "Processing":
      default:
        return "bg-green-100 text-green-700 border border-green-300";
    }
  };

  return (
    <div className="min-h-screen px-3 sm:px-6 md:px-10 py-8">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-lg tracking-wide">
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-lg italic">
          You have no orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition"
            >
              {/* Top Bar */}
              <div className="bg-gray-100 px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-600 gap-1 sm:gap-0">
                <p>
                  <span className="font-semibold">Order placed:</span>{" "}
                  {order.date}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4 sm:gap-6">
                {/* Order Info */}
                <div className="flex-1 space-y-2 text-sm sm:text-base">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                    {order.vendor || "General Request"}
                  </h2>
                  <p className="text-gray-600">
                    <span className="uppercase text-xs text-gray-500 mr-1">
                      Category:
                    </span>
                    {order.category || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="uppercase text-xs text-gray-500 mr-1">
                      Details:
                    </span>
                    {order.details}
                  </p>
                  <p className="text-gray-600">
                    <span className="uppercase text-xs text-gray-500 mr-1">
                      Location:
                    </span>
                    {order.location || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="uppercase text-xs text-gray-500 mr-1">
                      Customer:
                    </span>
                    {order.name} ({order.email})
                  </p>
                  {order.cancelReason && (
                    <p className="text-xs italic text-red-500 mt-1">
                      Reason: {order.cancelReason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-stretch gap-2 w-full sm:w-[160px]">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md shadow hover:from-indigo-500 hover:to-purple-500 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setCancelOrder(order)}
                    className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-red-600 border border-red-400 rounded-md hover:bg-red-50 transition"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-4">
                Order Details
              </h2>
              <div className="space-y-2 text-sm sm:text-base text-gray-700">
                <p>
                  <span className="font-semibold">Vendor:</span>{" "}
                  {selectedOrder.vendor || "General Request"}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedOrder.category || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Details:</span>{" "}
                  {selectedOrder.details}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {selectedOrder.location || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {selectedOrder.name} ({selectedOrder.email})
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedOrder.status}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 w-full sm:w-auto"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
                Cancel Order
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Please provide a reason for cancellation:
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border rounded-lg p-3 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                rows={3}
                placeholder="Enter reason..."
              />
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={() => setCancelOrder(null)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 w-full sm:w-auto"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:opacity-50 w-full sm:w-auto"
                  disabled={!cancelReason.trim()}
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
