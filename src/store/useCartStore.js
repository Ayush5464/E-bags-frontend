import { create } from "zustand";
import API from "../api/axios";

export const useCartStore = create((set) => ({
    cart: null,
    loading: false,

    fetchCart: async () => {
        set({ loading: true });
        try {
            const res = await API.get("/cart");
            set({ cart: res.data });
        } catch (err) {
            console.error("Fetch cart failed", err);
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (product, quantity = 1) => {
        try {
            await API.post("/cart", { product, quantity });
            await useCartStore.getState().fetchCart(); // refresh cart
        } catch (err) {
            console.error("Add to cart failed", err);
        }
    },

    removeFromCart: async (productId) => {
        try {
            await API.delete(`/cart/${productId}`);
            await useCartStore.getState().fetchCart();
        } catch (err) {
            console.error("Remove from cart failed", err);
        }
    },

    clearCart: async () => {
        try {
            await API.delete("/cart");
            await useCartStore.getState().fetchCart();
        } catch (err) {
            console.error("Clear cart failed", err);
        }
    },
}));
