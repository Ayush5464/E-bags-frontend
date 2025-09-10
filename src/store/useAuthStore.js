import { create } from "zustand";
import API from "../api/axios";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true, // added loading state

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
            set({ user: null, loading: false });
        }
    },

    login: async (email, password) => {
        const res = await API.post("/auth/login", { email, password });
        const user = res.data.user;
        const token = res.data.token; // make sure backend returns JWT
        localStorage.setItem("token", token); // save token
        set({ user });
        return user;
    },

    register: async (formData) => {
        await API.post("/auth/signup", formData);
    },

    logout: async () => {
        await API.post("/auth/logout");
        localStorage.removeItem("token");
        set({ user: null });
    },
}));
