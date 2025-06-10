"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

type Pass = {
  id: string;
  eventId: string;
  eventName: string;
  purchaseDate: string;
  quantity: number;
};

type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
};

type User = {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  passes: Pass[];
  events: Event[];
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  refreshUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:8080/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:8080/users/register", {
        fullName,
        email,
        password,
        confirmPassword: password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const refreshUser = () => {
    loadUser();
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, register, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
