import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from 'js-cookie';

interface User {
  id?: string;
  name?: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE";
  roles?: string[];
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const userSlice: StateCreator<UserState> = (set) => ({
  user: null,
  setUser: (user: User) => {
    set({ user });
  },
  clearUser: () => {
    Cookies.remove('User');
    Cookies.remove('Token');
    Cookies.remove('RefreshToken');
    set({ user: null });
  },
});

export const UserStore = create(
  persist(
    userSlice,
    {
      name: 'user-storage',
    }
  )
);