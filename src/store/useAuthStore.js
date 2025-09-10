import { create } from "zustand";
import API from "../api/axios";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    fetchCurrentUser: async () => {
        set({ loading: true });
        try {
            const res = await API.get("/auth/me");
            set({ user: res.data.user });
        } catch (err) {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await API.post("/auth/login", { email, password });
            set({ user: res.data.user });
        } catch (err) {
            set({ user: null });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

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
