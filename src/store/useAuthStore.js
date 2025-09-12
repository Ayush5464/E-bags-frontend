import { create } from "zustand";
import API from "../api/axios";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    fetchCurrentUser: async () => {
        set({ loading: true });
        try {
            const res = await API.get("/auth/me", { withCredentials: true });
            set({ user: res.data.user, loading: false });
        } catch (err) {
            set({ user: null, loading: false });
        }
    },

    login: async (email, password) => {
        const res = await API.post("/auth/login", { email, password }, { withCredentials: true });
        set({ user: res.data.user });
        return res.data.user;
    },

    register: async (formData) => {
        await API.post("/auth/signup", formData, { withCredentials: true });
    },

    logout: async () => {
        await API.post("/auth/logout", {}, { withCredentials: true });
        set({ user: null });
    },
}));
