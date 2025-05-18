import { Linkedin, Mail } from "lucide-react"

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Dr. Sajid Hussain",
      role: "Event Chair",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "https://linkedin.com/in/",
      email: "chair@smec.edu.pk",
    },
    {
      name: "Prof. Aisha Khan",
      role: "Faculty Coordinator",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "https://linkedin.com/in/",
      email: "coordinator@smec.edu.pk",
    },
    {
      name: "Bilal Ahmed",
      role: "Technical Lead",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "https://linkedin.com/in/",
      email: "tech@smec.edu.pk",
    },
    {
      name: "Sara Malik",
      role: "Marketing Head",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "https://linkedin.com/in/",
      email: "marketing@smec.edu.pk",
    },
    {
      name: "Usman Ali",
      role: "Logistics Manager",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "https://linkedin.com/in/",
      email: "logistics@smec.edu.pk",
    },
    {
      name: "Fatima Zahra",
      role: "Student Coordinator",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "https://linkedin.com/in/",
      email: "student@smec.edu.pk",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="relative w-40 h-40 mb-4 overflow-hidden rounded-full">
            <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold">{member.name}</h3>
          <p className="text-gray-500 mb-3">{member.role}</p>
          <div className="flex space-x-3">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href={`mailto:${member.email}`}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
