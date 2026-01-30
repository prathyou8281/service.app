"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  User,
  Wrench,
  Store,
  Loader2,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Zap,
  Tag,
  Printer,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";

interface Order {
  id: number;
  service_id: number;
  vendor_id: number;
  technician_id: number | null;
  user_description: string;
  total_amount: number;
  status: string;
  created_at: string;
  cancel_reason: string | null;
  service_name: string;
  vendor_name: string;
  technician_name: string | null;
  payment_status?: string;
  payment_id?: string;
}

export default function UserOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showBill, setShowBill] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [cancelModal, setCancelModal] = useState<{ open: boolean; orderId: number | null; reason: string }>({
    open: false,
    orderId: null,
    reason: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setPaymentNotice({ type: 'success', message: 'Payment authenticated successfully. Your order is now in operation pulse.' });
      const orderId = searchParams.get('orderId');
      if (orderId) {
        // Automatically show bill/details for the new order
        setTimeout(() => setPaymentNotice(null), 10000);
      }
    } else if (paymentStatus === 'failed') {
      setPaymentNotice({ type: 'error', message: searchParams.get('message') || 'Payment authentication failed.' });
      setTimeout(() => setPaymentNotice(null), 10000);
    }
  }, [searchParams]);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch order synchronization pulse.");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    if (!cancelModal.orderId || !cancelModal.reason.trim()) return;
    setIsProcessing(true);
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_BASE_URL}/users/orders/${cancelModal.orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelModal.reason })
      });

      if (!res.ok) throw new Error("Abort protocol failed.");

      // Update local state
      setOrders(orders.map(o => o.id === cancelModal.orderId ? { ...o, status: "cancelled", cancel_reason: cancelModal.reason } : o));
      setCancelModal({ open: false, orderId: null, reason: "" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return { color: "amber", icon: Clock, label: "Verification" };
      case "assigned": return { color: "blue", icon: User, label: "Tech Dispatched" };
      case "processing": return { color: "indigo", icon: RefreshCw, label: "In Operation" };
      case "completed": return { color: "emerald", icon: CheckCircle2, label: "Fullfilled" };
      case "cancelled": return { color: "red", icon: XCircle, label: "Terminated" };
      default: return { color: "slate", icon: AlertCircle, label: status };
    }
  };

  const filteredOrders = orders.filter(o =>
    filterStatus === "all" ? true : o.status.toLowerCase() === filterStatus.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans selection:bg-indigo-100">
      {/* 🔹 PAYMENT PULSE NOTIFICATION */}
      <AnimatePresence>
        {paymentNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-6`}
          >
            <div className={`p-6 rounded-[2rem] shadow-2xl backdrop-blur-xl border ${paymentNotice.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-500 shadow-red-500/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentNotice.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {paymentNotice.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Redirection Pulse</p>
                  <p className="text-sm font-bold leading-relaxed">{paymentNotice.message}</p>
                </div>
                <button onClick={() => setPaymentNotice(null)} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                  <XCircle className="w-5 h-5 opacity-40" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 HEADER SESSION */}
      <section className="bg-white border-b border-slate-200/60 sticky top-0 z-40 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Order <span className="text-indigo-600">Timeline</span></h1>
          </div>

          <div className="flex items-center gap-2">
            {["All", "Pending", "Completed", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s.toLowerCase()
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 MAIN TIMELINE */}
      <main className="max-w-5xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing History Node...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase">No Data Found</h2>
            <p className="text-sm text-slate-400 font-medium mt-2 max-w-xs">Your operational history is currently clear. Initialize a new service request to begin tracking.</p>
            <button
              onClick={() => router.push('/explore')}
              className="mt-8 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              Initialize Search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, idx) => {
              const cfg = getStatusConfig(order.status);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={order.id}
                  className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all p-8 flex flex-col md:flex-row gap-8 items-start md:items-center"
                >
                  {/* Status Ring */}
                  <div className={`shrink-0 w-20 h-20 rounded-[1.75rem] bg-${cfg.color}-50 flex flex-col items-center justify-center border border-${cfg.color}-100 transition-colors group-hover:bg-${cfg.color}-100/50`}>
                    <cfg.icon className={`w-8 h-8 text-${cfg.color}-600`} />
                    <span className={`text-[8px] font-black uppercase tracking-tighter text-${cfg.color}-700 mt-1`}>{cfg.label}</span>
                  </div>

                  {/* Order Context */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">REF# {order.id.toString().padStart(6, '0')}</span>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 line-clamp-1 italic">
                        <Calendar className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-3 group-hover:text-indigo-600 transition-colors uppercase">
                      {order.service_name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                        <Store className="w-3.5 h-3.5 text-indigo-500" />
                        {order.vendor_name}
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                        ₹{order.total_amount.toLocaleString()} • {order.payment_status || 'Unpaid'}
                      </div>
                      {order.technician_name && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl text-emerald-700">
                          <Wrench className="w-3.5 h-3.5" />
                          {order.technician_name} (Field Expert)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Core Actions */}
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 md:flex-none bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Audit Details
                    </button>
                    {["pending", "assigned"].includes(order.status.toLowerCase()) && (
                      <button
                        onClick={() => setCancelModal({ open: true, orderId: order.id, reason: "" })}
                        className="bg-white border border-red-100 text-red-500 hover:bg-red-50 px-4 py-4 rounded-2xl transition-all"
                        title="Abort Protocol"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* 🔹 AUDIT MODAL (View Details) */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-white"
            >
              {/* Modal Top Bar */}
              <div className="p-10 pb-0 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Audit Terminal</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Order Identity Pulse: {selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-4 hover:bg-slate-50 rounded-3xl transition-colors">
                  <XCircle className="w-8 h-8 text-slate-300" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <AuditNode label="Operational Status" value={selectedOrder.status} icon={RefreshCw} color="indigo" />
                  <AuditNode label="Fulfillment Service" value={selectedOrder.service_name} icon={Zap} color="amber" />
                  <AuditNode label="Strategic Partner" value={selectedOrder.vendor_name} icon={Store} color="blue" />
                  <AuditNode label="Transaction Total" value={`₹${selectedOrder.total_amount.toLocaleString()}`} icon={CreditCard} color="emerald" />
                </div>

                {/* Description Box */}
                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Operational Requirements
                  </h4>
                  <p className="text-slate-600 font-medium leading-relaxed italic">"{selectedOrder.user_description || "No specific instructions provided in the original request pulse."}"</p>
                </div>

                {selectedOrder.cancel_reason && (
                  <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100">
                    <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Termination Logic</h4>
                    <p className="text-red-700 font-bold whitespace-pre-wrap leading-relaxed">{selectedOrder.cancel_reason}</p>
                  </div>
                )}

                {/* Payment Breakdown */}
                <div className="border-t border-slate-100 pt-8 flex items-center justify-between px-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Matrix</span>
                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none mt-1">{selectedOrder.payment_status?.toUpperCase() || 'UNVERIFIED'}</p>
                    {selectedOrder.payment_id && <p className="text-[9px] font-bold text-slate-400 mt-2">TXN: {selectedOrder.payment_id}</p>}
                  </div>
                  <button
                    onClick={() => setShowBill(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all"
                  >
                    <Printer className="w-4 h-4" /> Final Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔹 BILL MODAL (Invoice View) */}
      <AnimatePresence>
        {showBill && selectedOrder && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBill(false)} className="fixed inset-0 bg-white/80 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-none"
              style={{ fontFamily: 'monospace' }}
            >
              <div className="p-8 space-y-8 text-slate-800">
                <div className="text-center space-y-2 border-b-2 border-dashed border-slate-200 pb-8">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-sans font-black text-2xl">SH</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">ServiceHub Official Invoice</h3>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest italic">Digital Protocol: {selectedOrder.id}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black opacity-40 uppercase">Provider Identity</p>
                      <p className="text-sm font-bold uppercase">{selectedOrder.vendor_name}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black opacity-40 uppercase">Fulfillment Date</p>
                      <p className="text-sm font-bold uppercase">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="py-6 border-y-2 border-dashed border-slate-200">
                    <p className="text-[10px] font-black opacity-40 uppercase mb-4">Service Audit</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span>{selectedOrder.service_name}</span>
                        <span>₹{Number(selectedOrder.total_amount - 99).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold opacity-60">
                        <span>Platform Handling</span>
                        <span>₹99.00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold opacity-60">
                        <span>Taxes (Included)</span>
                        <span>₹0.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-lg font-black uppercase">Grand Total</p>
                    <p className="text-2xl font-black">₹{selectedOrder.total_amount.toLocaleString()}</p>
                  </div>

                  <div className="pt-8 space-y-2">
                    <p className="text-[10px] font-black opacity-40 uppercase">Payment Verification</p>
                    <div className="bg-slate-50 p-4 border border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold uppercase">{selectedOrder.payment_status || 'CASH ON DELIVERY'}</span>
                      {selectedOrder.payment_id && <span className="text-[10px] opacity-40">TXN_{selectedOrder.payment_id}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-center pt-8 border-t-2 border-dashed border-slate-200 space-y-4">
                  <p className="text-[10px] font-black opacity-60 leading-relaxed uppercase">
                    Thank you for using the ServiceHub Protocol.<br />
                    This is a computer-generated pulse verification node.
                  </p>
                  <div className="flex justify-center gap-4 no-print">
                    <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all">
                      <Download className="w-4 h-4" /> Export Protocol
                    </button>
                    <button onClick={() => setShowBill(false)} className="border border-slate-200 px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                      Terminate View
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔹 ABORT PROTOCOL MODAL (Cancel) */}
      <AnimatePresence>
        {cancelModal.open && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-950/20 backdrop-blur-sm" onClick={() => setCancelModal({ ...cancelModal, open: false })} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 border border-red-100"
            >
              <div className="w-16 h-16 bg-red-50 rounded-[1.5rem] flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">Abort Protocol</h3>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Specify the operational failure or logic behind this termination. This action is logged in the permanent record.</p>

              <textarea
                value={cancelModal.reason}
                onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                placeholder="Operational logic for termination..."
                className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-400 transition-all resize-none"
              />

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setCancelModal({ ...cancelModal, open: false })}
                  className="flex-1 bg-slate-50 text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Reject Abort
                </button>
                <button
                  disabled={!cancelModal.reason.trim() || isProcessing}
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm Abort"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuditNode({ label, value, icon: Icon, color }: any) {
  return (
    <div className={`p-6 rounded-[2rem] bg-${color}-50/50 border border-${color}-100 transition-colors hover:bg-${color}-100/50 group`}>
      <div className={`w-10 h-10 rounded-xl bg-white border border-${color}-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black text-slate-900 tracking-tight leading-none uppercase truncate`}>{value}</p>
    </div>
  );
}
