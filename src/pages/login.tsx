"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { toast } from "sonner"
import { Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { useUser } from '../components/context/user-context'

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      console.log("Login attempt:", values)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check for admin login
      if (values.email === "admin@smec.edu.pk" && values.password === "admin123") {
        // Set authentication state in localStorage
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            name: "Admin User",
            email: values.email,
            role: "administrator",
          }),
        )

        toast("Login Successful", {
          description: "Welcome to the SMEC admin dashboard.",
        })



        // Redirect to admin dashboard
        navigate("/admin")
        return
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === values.email)

      if (!user) {
        toast("Login Failed", {
          description: "Invalid credentials.",
          style: { backgroundColor: "#fee2e2", color: "#b91c1c" }, // optional
        })

        setIsSubmitting(false)
        return
      }

      // In a real app, you would hash and verify the password
      // For demo, we're just checking if the user exists
      const success = await login(values.email, values.password)

      if (success) {
        toast(
          "Login Successful", {
          description: `Welcome back, ${user.fullName}!`,
        })

        // Redirect to home page
        navigate("/")
      } else {
        toast("Login Failed",{
          description: "Invalid credentials. Please try again.",
          style: { backgroundColor: "#fee2e2", color: "#b91c1c" }, 
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast("Login Failed",{
        description: "There was an error logging in. Please try again.",
        style: { backgroundColor: "#fee2e2", color: "#b91c1c" }, 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <div className="inline-block rounded-full bg-purple-100 p-2 text-purple-600">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Log in to your SMEC account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          <p>For admin access, use:</p>
          <p className="font-medium">Email: admin@smec.edu.pk</p>
          <p className="font-medium">Password: admin123</p>
        </div>
      </div>
    </div>
  )
}
