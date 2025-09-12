import { create } from "zustand";
import API from "../api/axios";
import toast from "react-hot-toast";

export const useOrderStore = create((set) => ({
    orders: [],
    myOrders: [],
    loading: false,

    // Fetch all orders (admin)
    fetchOrders: async () => {
        set({ loading: true });
        try {
            const res = await API.get("/orders", { withCredentials: true });
            set({ orders: res.data });
        } catch (err) {
            toast.error("Failed to fetch orders");
            console.error("Fetch orders failed", err);
        } finally {
            set({ loading: false });
        }
    },

    // Fetch current user's orders
    fetchMyOrders: async () => {
        set({ loading: true });
        try {
            const res = await API.get("/orders/my-orders", { withCredentials: true });
            set({ myOrders: res.data });
        } catch (err) {
            toast.error("Failed to fetch your orders");
            console.error("Fetch my orders failed", err);
        } finally {
            set({ loading: false });
        }
    },

    // Place a new order
    placeOrder: async (orderData) => {
        set({ loading: true });
        try {
            const res = await API.post("/orders", orderData, { withCredentials: true });
            toast.success("Order placed successfully!");
            // Optionally refresh my orders
            await useOrderStore.getState().fetchMyOrders();
            return res.data;
        } catch (err) {
            toast.error("Failed to place order");
            console.error("Place order failed", err);
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    // Update order (admin)
    updateOrder: async (orderId, updateData) => {
        set({ loading: true });
        try {
            const res = await API.put(`/orders/${orderId}`, updateData, { withCredentials: true });
            toast.success("Order updated successfully");
            // Refresh orders
            await useOrderStore.getState().fetchOrders();
            return res.data;
        } catch (err) {
            toast.error("Failed to update order");
            console.error("Update order failed", err);
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    // Delete order (admin)
    deleteOrder: async (orderId) => {
        set({ loading: true });
        try {
            await API.delete(`/orders/${orderId}`, { withCredentials: true });
            toast.success("Order deleted successfully");
            await useOrderStore.getState().fetchOrders();
        } catch (err) {
            toast.error("Failed to delete order");
            console.error("Delete order failed", err);
        } finally {
            set({ loading: false });
        }
    },
}));
