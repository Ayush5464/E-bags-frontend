import { create } from "zustand";
import API from "../api/axios";
import toast from "react-hot-toast";

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,

    fetchOrders: async () => {
        set({ loading: true });
        try {
            const res = await API.get("/orders/my-orders", { withCredentials: true });
            set({ orders: res.data });
        } catch (err) {
            toast.error("Failed to fetch orders");
            console.error("Fetch orders failed", err);
        } finally {
            set({ loading: false });
        }
    },

    createOrder: async (orderData) => {
        try {
            await API.post("/orders", orderData, { withCredentials: true });
            toast.success("Order placed!");
            await useOrderStore.getState().fetchOrders();
        } catch (err) {
            toast.error("Failed to place order");
            console.error("Create order failed", err);
        }
    },
}));
