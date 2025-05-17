"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Pass = {
  id: string
  eventId: string
  eventName: string
  purchaseDate: string
  quantity: number
}

type Event = {
  id: string
  name: string
  date: string
  time: string
  location: string
}

type User = {
  id: string
  fullName: string
  email: string
  avatar: string
  passes: Pass[]
  events: Event[]
}

type UserContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = () => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadUser()

    // Add event listener for storage changes
    window.addEventListener("storage", loadUser)

    return () => {
      window.removeEventListener("storage", loadUser)
    }
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: User) => u.email === email)

    if (user) {
      setUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      // Dispatch storage event to notify other tabs
      window.dispatchEvent(new Event("storage"))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    // Dispatch storage event to notify other tabs
    window.dispatchEvent(new Event("storage"))
  }

  const refreshUser = () => {
    loadUser()
  }

  return <UserContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
