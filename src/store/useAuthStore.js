import { create } from "zustand";
import API from "../api/axios";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    // Fetch current user from backend
    fetchCurrentUser: async () => {
        set({ loading: true });
        try {
            const res = await API.get("/auth/me");
            set({ user: res.data.user }); // make sure backend returns { user }
        } catch (err) {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    // Login user
    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await API.post("/auth/login", { email, password });
            set({ user: res.data.user }); // store user in Zustand
            return res.data.user; // ✅ return user for Login component
        } catch (err) {
            set({ user: null });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    // Logout user
    logout: async () => {
        set({ loading: true });
        try {
            await API.post("/auth/logout");
            set({ user: null });
        } catch (err) {
            console.error(err);
        } finally {
            set({ loading: false });
        }
    },
}));
