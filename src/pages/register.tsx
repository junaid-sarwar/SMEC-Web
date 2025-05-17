"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { toast } from "sonner"
import { useUser } from "../components/context/user-context"

const eventSchedules = {
  coding: { date: "2023-06-15", time: "10:00 AM - 12:30 PM", location: "Lab 1" },
  gaming: { date: "2023-06-16", time: "02:00 PM - 05:00 PM", location: "Gaming Arena" },
  quiz: { date: "2023-06-15", time: "01:30 PM - 03:30 PM", location: "Seminar Hall" },
  design: { date: "2023-06-16", time: "09:00 AM - 11:00 AM", location: "Design Studio" },
  robotics: { date: "2023-06-17", time: "09:00 AM - 11:00 AM", location: "Robotics Lab" },
  project: { date: "2023-06-17", time: "02:00 PM - 04:00 PM", location: "Exhibition Area" },
  chess: { date: "2023-06-15", time: "03:00 PM - 05:00 PM", location: "Chess Hall" },
}

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  university: z.string().min(2, {
    message: "University name must be at least 2 characters.",
  }),
  studentId: z.string().min(2, {
    message: "Student ID / CNIC must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  selectedEvents: z.array(z.string()).min(1, {
    message: "Please select at least one event.",
  }),
  quantities: z.record(z.coerce.number().min(1).max(10)),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

// Mock event prices
const eventPrices = {
  coding: 500,
  gaming: 400,
  quiz: 300,
  design: 450,
  robotics: 600,
  project: 350,
  chess: 250,
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, refreshUser } = useUser()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  // Redirect if not logged in
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      toast("Login Required",{
        description: "Please log in or sign up to register for events.",
        style: { backgroundColor: "#fee2e2", color: "#b91c1c" }, 
      })
      navigate("/login")
    }
  }, [user, navigate])

  useEffect(() => {
    // Check if user is logged in
    if (user) {
      setIsLoggedIn(true)
      // Pre-fill form with user data
      form.setValue("fullName", user.fullName)
      form.setValue("email", user.email)
    } else {
      setIsLoggedIn(false)
    }
  }, [user])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      university: "",
      studentId: "",
      email: "",
      phone: "",
      selectedEvents: [],
      quantities: {},
      agreeToTerms: false,
    },
  })

  const watchSelectedEvents = form.watch("selectedEvents")
  const watchQuantities = form.watch("quantities")

  useEffect(() => {
    if (watchSelectedEvents && watchSelectedEvents.length > 0) {
      const price = watchSelectedEvents.reduce((total, eventId) => {
        const eventPrice = eventPrices[eventId as keyof typeof eventPrices] || 0
        const quantity = watchQuantities[eventId] || 1
        return total + eventPrice * quantity
      }, 0)
      setTotalPrice(price)
    } else {
      setTotalPrice(0)
    }
  }, [watchSelectedEvents, watchQuantities])

  const events = [
    { id: "coding", label: "Coding Competition", price: 500 },
    { id: "gaming", label: "Gaming Tournament", price: 400 },
    { id: "quiz", label: "Tech Quiz", price: 300 },
    { id: "design", label: "Design Challenge", price: 450 },
    { id: "robotics", label: "Robotics Contest", price: 600 },
    { id: "project", label: "Project Showcase", price: 350 },
    { id: "chess", label: "Chess Tournament", price: 250 },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast("Login Required",{
        description: "Please log in or sign up to register for events.",
        style: { backgroundColor: "#fee2e2", color: "#b91c1c" }, 
      })
      navigate("/login")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real application, this would be an API call to your backend
      console.log("Form values:", values)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // If user is logged in, update their profile
      if (isLoggedIn && user) {
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

        // Create arrays to store new events and passes
        const newEvents = []
        const newPasses = []

        // Process each selected event
        for (const eventId of values.selectedEvents) {
          // Get the event details
          const eventObj = events.find((e) => e.id === eventId)
          if (!eventObj) continue

          const eventName = eventObj.label
          const eventSchedule = eventSchedules[eventId as keyof typeof eventSchedules]
          const quantity = values.quantities[eventId] || 1

          // Check if user already has this event
          const hasEvent = currentUser.events?.some((e: any) => e.id === eventId)

          // Add event if not already added
          if (!hasEvent) {
            newEvents.push({
              id: eventId,
              name: eventName,
              date: eventSchedule.date,
              time: eventSchedule.time,
              location: eventSchedule.location,
            })
          }

          // Create new pass
          newPasses.push({
            id: `p${Date.now()}-${eventId}`,
            eventId: eventId,
            eventName: eventName,
            purchaseDate: new Date().toISOString().split("T")[0],
            quantity: quantity,
          })
        }

        // Update user with new events and passes
        const updatedUser = {
          ...currentUser,
          events: [...(currentUser.events || []), ...newEvents],
          passes: [...(currentUser.passes || []), ...newPasses],
        }

        // Update localStorage
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))

        // Update users array in localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const updatedUsers = users.map((u: any) => (u.id === currentUser.id ? updatedUser : u))
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        // Refresh user context
        refreshUser()
      }

      toast("Registration Successful!",{
        description: `You have successfully registered for ${values.selectedEvents.length} event(s). Check your email for confirmation.`,
      })

      // Redirect to home page after successful registration
      navigate("/")
    } catch (error) {
      console.error("Registration error:", error)
      toast("Registration Failed",{
        description: "There was an error submitting your registration. Please try again.",
        style: { backgroundColor: "#fee2e2", color: "#b91c1c" }, 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If not logged in, show a message or redirect
  if (!isLoggedIn) {
    return null // Return null as we're redirecting in the useEffect
  }

  return (
    <div className="container max-w-3xl py-12 px-4 md:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registration Form</h1>
          <p className="text-gray-500 mt-2">Select the events you want to participate in</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={isLoggedIn} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University / Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="SSUET" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID / CNIC</FormLabel>
                    <FormControl>
                      <Input placeholder="42201-1234567-8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} disabled={isLoggedIn} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+92 300 1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="selectedEvents"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Select Events</FormLabel>
                      <FormDescription>You can select multiple events to register for.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {events.map((event) => (
                        <FormField
                          key={event.id}
                          control={form.control}
                          name="selectedEvents"
                          render={({ field }) => {
                            const isSelected = field.value?.includes(event.id)

                            // Initialize quantity when event is selected
                            if (isSelected && !form.getValues().quantities[event.id]) {
                              form.setValue(`quantities.${event.id}`, 1)
                            }

                            return (
                              <FormItem key={event.id} className="flex flex-col space-y-3 rounded-md border p-4">
                                <div className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...field.value, event.id]
                                          : field.value?.filter((value) => value !== event.id)

                                        field.onChange(newValue)

                                        // Initialize or clear quantity when checkbox state changes
                                        if (checked) {
                                          form.setValue(`quantities.${event.id}`, 1)
                                        } else {
                                          const quantities = { ...form.getValues().quantities }
                                          delete quantities[event.id]
                                          form.setValue("quantities", quantities)
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-medium">{event.label}</FormLabel>
                                    <FormDescription className="text-xs">PKR {event.price}</FormDescription>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="pl-7">
                                    <FormField
                                      control={form.control}
                                      name={`quantities.${event.id}`}
                                      render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2">
                                          <FormLabel className="text-xs w-20">Quantity:</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min={1}
                                              max={10}
                                              className="h-8 w-20"
                                              {...field}
                                              onChange={(e) => {
                                                const value = Number.parseInt(e.target.value)
                                                field.onChange(value < 1 ? 1 : value > 10 ? 10 : value)
                                              }}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                )}
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {totalPrice > 0 && (
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Order Summary</h3>
                {watchSelectedEvents.map((eventId) => {
                  const event = events.find((e) => e.id === eventId)
                  if (!event) return null
                  const quantity = watchQuantities[eventId] || 1
                  const itemTotal = event.price * quantity

                  return (
                    <div key={eventId} className="flex justify-between text-sm mb-1">
                      <span>
                        {event.label} {quantity > 1 ? `(x${quantity})` : ""}:
                      </span>
                      <span>PKR {itemTotal}</span>
                    </div>
                  )
                })}
                <div className="flex justify-between font-medium text-base pt-2 border-t mt-2">
                  <span>Total:</span>
                  <span>PKR {totalPrice}</span>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I agree to the terms and conditions</FormLabel>
                    <FormDescription>
                      By checking this box, you agree to our{" "}
                      <a href="#" className="text-teal-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-teal-600 hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : `Register for SMEC (PKR ${totalPrice})`}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
