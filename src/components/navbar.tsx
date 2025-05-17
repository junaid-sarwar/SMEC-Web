"use client"

import * as React from "react"
import logo from '../assets/logos/smec-logo-1.png'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, LogOut, Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { useUser } from "../components/context/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { toast } from "sonner"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const location = useLocation()
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast("Logged Out",{
      description: "You have been successfully logged out.",
    })
    navigate("/")
  }

  // Calculate total passes
  const totalPasses = user?.passes ? user.passes.reduce((sum, pass) => sum + (pass.quantity || 1), 0) : 0

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/#categories" },
    { name: "Schedule", href: "/#schedule" },
    { name: "Team", href: "/#team" },
    { name: "Gallery", href: "/#gallery" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            {/* <span className="text-xl font-bold tracking-tight">SMEC</span> */}
            <img src={logo} alt="" className="h-15 w-15" />
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="p-0">
                    <div className="w-full px-2 py-1.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">My Passes</span>
                        <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                          Total: {totalPasses}
                        </span>
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {user.passes && user.passes.length > 0 ? (
                          user.passes.map((pass) => {
                            // Find the event details
                            const event = user.events?.find((e) => e.id === pass.eventId)

                            return (
                              <div key={pass.id} className="bg-muted rounded-md p-2 text-sm">
                                <div className="flex justify-between items-start">
                                  <h5 className="font-medium">{pass.eventName}</h5>
                                  {pass.quantity > 1 && (
                                    <span className="bg-teal-200 text-teal-800 text-xs px-2 py-0.5 rounded-full">
                                      x{pass.quantity}
                                    </span>
                                  )}
                                </div>
                                {event && (
                                  <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                    <p className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1 text-teal-600" />
                                      {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1 text-teal-600" />
                                      {event.time}
                                    </p>
                                    <p className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1 text-teal-600" />
                                      {event.location}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No passes purchased</p>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
        <button
          className="flex items-center justify-center rounded-md p-2 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="container text-center md:hidden">
          <div className="flex flex-col space-y-3 pb-4 pt-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col items-center gap-2 pt-2">
              {user ? (
                <div className="flex flex-col gap-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.fullName}</span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">My Passes</span>
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                        Total: {totalPasses}
                      </span>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {user.passes && user.passes.length > 0 ? (
                        user.passes.map((pass) => {
                          // Find the event details
                          const event = user.events?.find((e) => e.id === pass.eventId)

                          return (
                            <div key={pass.id} className="bg-muted rounded-md p-2 text-sm">
                              <div className="flex justify-between items-start">
                                <h5 className="font-medium">{pass.eventName}</h5>
                                {pass.quantity > 1 && (
                                  <span className="bg-teal-200 text-teal-800 text-xs px-2 py-0.5 rounded-full">
                                    x{pass.quantity}
                                  </span>
                                )}
                              </div>
                              {event && (
                                <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                  <p className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1 text-teal-600" />
                                    {new Date(event.date).toLocaleDateString()}
                                  </p>
                                  <p className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1 text-teal-600" />
                                    {event.time}
                                  </p>
                                  <p className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1 text-teal-600" />
                                    {event.location}
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No passes purchased</p>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild onClick={closeMenu}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild onClick={closeMenu}>
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
