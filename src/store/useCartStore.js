import { create } from "zustand";
import API from "../api/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set) => ({
    cart: [],
    loading: false,

    fetchCart: async () => {
        set({ loading: true });
        try {
            const res = await API.get("/cart", { withCredentials: true });
            set({ cart: res.data });
        } catch (err) {
            toast.error("Failed to fetch cart");
            console.error("Fetch cart failed", err);
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (product, quantity = 1) => {
        try {
            await API.post("/cart", { product, quantity }, { withCredentials: true });
            await useCartStore.getState().fetchCart();
            toast.success("Added to cart!");
        } catch (err) {
            toast.error("Failed to add to cart");
            console.error("Add to cart failed", err);
        }
    },

    removeFromCart: async (productId) => {
        try {
            await API.delete(`/cart/${productId}`, { withCredentials: true });
            await useCartStore.getState().fetchCart();
            toast.success("Removed from cart");
        } catch (err) {
            toast.error("Failed to remove item");
            console.error("Remove from cart failed", err);
        }
    },

    clearCart: async () => {
        try {
            await API.delete("/cart", { withCredentials: true });
            await useCartStore.getState().fetchCart();
            toast.success("Cart cleared");
        } catch (err) {
            toast.error("Failed to clear cart");
            console.error("Clear cart failed", err);
        }
    },
}));
