// store/useAuthStore.js
import { create } from "zustand";
import API from "../api/axios";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    // ✅ 1. Fetch user from token on refresh
    fetchCurrentUser: async () => {
        set({ loading: true });

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                set({ user: null, loading: false });
                return;
            }

            const res = await API.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            set({ user: res.data.user, loading: false });
        } catch (err) {
            console.error("Fetch current user failed:", err);
            set({ user: null, loading: false });
        }
    },

    // ✅ 2. Login
    login: async (email, password) => {
        const res = await API.post("/auth/login", { email, password });

        const { user, token } = res.data;
        localStorage.setItem("token", token);
        set({ user });
        return user;
    },

    // ✅ 3. Register
    register: async (formData) => {
        await API.post("/auth/signup", formData);
    },

    // ✅ 4. Logout
    logout: () => {
        localStorage.removeItem("token"); // No need to call backend logout
        set({ user: null });
    },
}));
