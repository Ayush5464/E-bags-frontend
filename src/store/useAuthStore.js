// useAuthStore.js
import { create } from "zustand";
import API from "../api/axios";

export const useAuthStore = create((set) => ({
    user: null,

    //  Called on refresh to restore session from cookie
    fetchCurrentUser: async () => {
        try {
            const res = await API.get("/auth/me"); // should return { user: {...} }
            set({ user: res.data.user });
        } catch (err) {
            set({ user: null });
        }
    },

    login: async (email, password) => {
        const res = await API.post("/auth/login", { email, password });

        const user = res.data.user;
        set({ user }); // save user to store
        return user;   // 
    },

    register: async (formData) => {
        await API.post("/auth/signup", formData);
    },

    logout: async () => {
        await API.post("/auth/logout");
        set({ user: null });

    },
}));
