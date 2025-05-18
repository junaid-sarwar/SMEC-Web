"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/form"
import { Switch } from "../ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Edit, Search } from "lucide-react"

// Mock data for passes
const initialPasses = [
  {
    id: 1,
    name: "Coding Competition",
    code: "coding",
    price: 500,
    totalPasses: 100,
    soldPasses: 42,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Gaming Tournament",
    code: "gaming",
    price: 400,
    totalPasses: 150,
    soldPasses: 98,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Tech Quiz",
    code: "quiz",
    price: 300,
    totalPasses: 80,
    soldPasses: 35,
    isAvailable: true,
  },
  {
    id: 4,
    name: "Design Challenge",
    code: "design",
    price: 450,
    totalPasses: 60,
    soldPasses: 28,
    isAvailable: true,
  },
  {
    id: 5,
    name: "Robotics Contest",
    code: "robotics",
    price: 600,
    totalPasses: 50,
    soldPasses: 32,
    isAvailable: false,
  },
  {
    id: 6,
    name: "Project Showcase",
    code: "project",
    price: 350,
    totalPasses: 120,
    soldPasses: 67,
    isAvailable: true,
  },
]

const passFormSchema = z.object({
  price: z.coerce.number().min(1, { message: "Price must be at least 1." }),
  totalPasses: z.coerce.number().min(1, { message: "Total passes must be at least 1." }),
  isAvailable: z.boolean(),
})

export function PassManagement() {
  const [passes, setPasses] = useState(initialPasses)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditPassOpen, setIsEditPassOpen] = useState(false)
  const [currentPass, setCurrentPass] = useState<(typeof initialPasses)[0] | null>(null)

  const form = useForm<z.infer<typeof passFormSchema>>({
    resolver: zodResolver(passFormSchema),
    defaultValues: {
      price: 0,
      totalPasses: 0,
      isAvailable: true,
    },
  })

  const filteredPasses = passes.filter(
    (pass) =>
      pass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function handleEditPass(pass: (typeof initialPasses)[0]) {
    setCurrentPass(pass)
    form.reset({
      price: pass.price,
      totalPasses: pass.totalPasses,
      isAvailable: pass.isAvailable,
    })
    setIsEditPassOpen(true)
  }

  function onUpdatePass(values: z.infer<typeof passFormSchema>) {
    if (!currentPass) return

    // Make sure we don't set total passes below sold passes
    if (values.totalPasses < currentPass.soldPasses) {
      toast("Invalid Update",{
        description: `Total passes cannot be less than sold passes (${currentPass.soldPasses}).`,
        style: { backgroundColor: "#fee2e2", color: "#b91c1c" }, 
      })
      return
    }

    const updatedPasses = passes.map((pass) => {
      if (pass.id === currentPass.id) {
        return {
          ...pass,
          price: values.price,
          totalPasses: values.totalPasses,
          isAvailable: values.isAvailable,
        }
      }
      return pass
    })

    setPasses(updatedPasses)
    toast("Pass Updated",{
      description: `${currentPass.name} has been updated successfully.`,
    })
    setIsEditPassOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search passes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Price (PKR)</TableHead>
              <TableHead>Total Passes</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPasses.length > 0 ? (
              filteredPasses.map((pass) => (
                <TableRow key={pass.id}>
                  <TableCell className="font-medium">{pass.name}</TableCell>
                  <TableCell>{pass.price}</TableCell>
                  <TableCell>{pass.totalPasses}</TableCell>
                  <TableCell>{pass.soldPasses}</TableCell>
                  <TableCell>{pass.totalPasses - pass.soldPasses}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        pass.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pass.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => handleEditPass(pass)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  No passes found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Pass Dialog */}
      <Dialog open={isEditPassOpen} onOpenChange={setIsEditPassOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pass: {currentPass?.name}</DialogTitle>
            <DialogDescription>Update the price, availability, and total number of passes.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onUpdatePass)} className="space-y-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (PKR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Passes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    {currentPass && <FormDescription>Currently sold: {currentPass.soldPasses} passes</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Availability</FormLabel>
                      <FormDescription>Make this pass available for purchase</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Pass</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
