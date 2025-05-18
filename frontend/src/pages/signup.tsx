"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import { Link } from "react-router-dom"

const formSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function SignupPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
  })

  // Generate avatar based on name
  const generateAvatar = (name: string) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    // Generate a random pastel color
    const hue = Math.floor(Math.random() * 360)
    const bgColor = `hsl(${hue}, 70%, 80%)`

    setAvatarPreview(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${encodeURIComponent(bgColor.replace("#", ""))}&color=fff`,
    )
    form.setValue(
      "avatar",
      `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${encodeURIComponent(bgColor.replace("#", ""))}&color=fff`,
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // In a real application, this would be an API call to your backend
      console.log("Form values:", values)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user in localStorage for demo purposes
      const user = {
        id: Date.now().toString(),
        fullName: values.fullName,
        email: values.email,
        avatar: values.avatar || avatarPreview,
        passes: [],
        events: [],
      }

      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if email already exists
      if (existingUsers.some((u: any) => u.email === values.email)) {
        toast("Email already exists",{
          description: "Please use a different email address or login to your account.",
          style: { backgroundColor: "#fee2e2", color: "#b91c1c" }, 
        })
        setIsSubmitting(false)
        return
      }

      // Add new user
      localStorage.setItem("users", JSON.stringify([...existingUsers, user]))

      toast("Account created!",{
        description: "You have successfully created an account. Please login.",
      })

      // Redirect to login page
      navigate("/login")
    } catch (error) {
      console.error("Signup error:", error)
      toast("Signup Failed",{
        description: "There was an error creating your account. Please try again.",
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
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-500 text-sm">Sign up to participate in SMEC events</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        if (e.target.value.length > 2) {
                          generateAvatar(e.target.value)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {avatarPreview && (
              <div className="flex justify-center my-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-200">
                  <img
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                  <FormDescription>Password must be at least 8 characters long</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
