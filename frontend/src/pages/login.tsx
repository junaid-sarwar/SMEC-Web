"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useAuth } from "../components/context/user-context";

// Zod schema for validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Admin hardcoded login
      if (values.email === "admin@smec.edu.pk" && values.password === "admin123") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("adminUser", JSON.stringify({
          name: "Admin User",
          email: values.email,
          role: "administrator",
        }));

        toast("Login Successful", {
          description: "Welcome to the SMEC admin dashboard.",
        });

        navigate("/admin");
        return;
      }

      const success = await login(values.email, values.password);

      if (!success) throw new Error("Invalid credentials");

      toast("Login Successful", {
        description: "Welcome back!",
      });

      navigate("/");
    } catch (error: any) {
      toast("Login Failed", {
        description: error.message || "An error occurred during login.",
        style: { backgroundColor: "#fee2e2", color: "#b91c1c" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
  );
}
