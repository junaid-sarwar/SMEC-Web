"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { UserManagement } from "../components/admin/user-management"
import { PassManagement } from "../components/admin/pass-management"
import { DashboardChart } from "../components/admin/dashboard-chart"
import { LogOut, Users, Ticket, BarChart3 } from "lucide-react"
import { toast } from "sonner"

// Mock data for charts
const passData = [
  { name: "Coding", total: 100, sold: 42, available: 58 },
  { name: "Gaming", total: 150, sold: 98, available: 52 },
  { name: "Quiz", total: 80, sold: 35, available: 45 },
  { name: "Design", total: 60, sold: 28, available: 32 },
  { name: "Robotics", total: 50, sold: 32, available: 18 },
  { name: "Project", total: 120, sold: 67, available: 53 },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null)

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const storedUser = localStorage.getItem("adminUser")

    if (!isAuthenticated) {
      navigate("/login")
    } else if (storedUser) {
      setAdminUser(JSON.parse(storedUser))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("adminUser")
    toast("Logged Out", {
  description: "You have been successfully logged out.",
})
    navigate("/login")
  }

  // Calculate summary statistics
  const totalPasses = passData.reduce((sum, item) => sum + item.total, 0)
  const soldPasses = passData.reduce((sum, item) => sum + item.sold, 0)
  const availablePasses = passData.reduce((sum, item) => sum + item.available, 0)
  const revenue = passData.reduce((sum, item) => {
    // Assuming prices from our pass management data
    const priceMap: Record<string, number> = {
      Coding: 500,
      Gaming: 400,
      Quiz: 300,
      Design: 450,
      Robotics: 600,
      Project: 350,
    }
    return sum + item.sold * (priceMap[item.name] || 0)
  }, 0)

  if (!adminUser) {
    return null // Or a loading state
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, {adminUser.name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Passes</CardTitle>
            <Ticket className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPasses}</div>
            <p className="text-xs text-gray-500">Across all events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sold Passes</CardTitle>
            <Ticket className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{soldPasses}</div>
            <p className="text-xs text-gray-500">{((soldPasses / totalPasses) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Passes</CardTitle>
            <Ticket className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{availablePasses}</div>
            <p className="text-xs text-gray-500">{((availablePasses / totalPasses) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-purple-500"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">PKR {revenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">From all sold passes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="passes" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Passes
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardChart
              data={passData}
              title="Pass Distribution by Event"
              description="Overview of total, sold, and available passes for each event"
            />
            <DashboardChart
              data={passData}
              title="Sold Passes by Event"
              description="Percentage of passes sold for each event"
              type="pie"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Pass Status</CardTitle>
              <CardDescription>Detailed breakdown of pass status for each event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {passData.map((event) => (
                  <div key={event.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{event.name}</span>
                      <span>
                        {event.sold} / {event.total} passes sold
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{
                          width: `${Math.min(100, (event.sold / event.total) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passes">
          <PassManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
