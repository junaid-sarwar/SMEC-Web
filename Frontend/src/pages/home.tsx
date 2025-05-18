import { Link } from "react-router-dom"
import { ArrowRight, MapPin, Award, Code, Gamepad2, Brain, Palette, BotIcon as Robot } from "lucide-react"
import { Button } from "../components/ui/button"
import EventSchedule from "../components/event-schedule"
import TeamSection from "../components/team-section"
import GallerySection from "../components/gallery-section"

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center mix-blend-overlay"></div>
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-block rounded-lg bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
              Annual Competition Event
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Speed Mind Execution <span className="text-teal-300">Competition</span>
            </h1>
            <p className="max-w-[700px] text-lg md:text-xl text-white/80">
              Hosted annually by the Department of Computer Science and IT at Sir Syed University of Engineering and
              Technology (SSUET), Karachi.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Button size="lg" className="bg-white text-teal-900 hover:bg-white/90" asChild>
                <Link to="/register">Register Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white bg-white/10" asChild>
                <a href="https://www.facebook.com/SMEC.SSUET" target="_blank" rel="noreferrer">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="mt-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Award className="mr-2 h-4 w-4 text-teal-300" />
              <span>Brand of the Year Award for three consecutive years</span>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Categories */}
      <section className="py-16 bg-white w-full" id="categories">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Competition Categories</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-[700px]">
              Showcase your skills in various tech domains and compete with the best minds
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Coding Competition",
                desc: "Solve complex programming challenges against the clock",
                icon: Code,
              },
              {
                title: "Gaming Tournament",
                desc: "Compete in popular esports titles for gaming glory",
                icon: Gamepad2,
              },
              { title: "Tech Quiz", desc: "Test your knowledge of technology and computer science", icon: Brain },
              { title: "Design Challenge", desc: "Create stunning UI/UX designs and graphics", icon: Palette },
              { title: "Robotics Contest", desc: "Build and program robots to complete specific tasks", icon: Robot },
              {
                title: "Project Showcase",
                desc: "Present your innovative tech projects to industry experts",
                icon: Award,
              },
            ].map((category, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-900">
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{category.title}</h3>
                <p className="mb-4 text-gray-500">{category.desc}</p>
                <Button className="w-full" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Schedule */}
      <section className="py-16 bg-gray-50" id="schedule">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Event Schedule</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-[700px]">
              Plan your participation with our detailed event timeline
            </p>
          </div>
          <EventSchedule />
        </div>
      </section>

      {/* Team & Organizers */}
      <section className="py-16 bg-white" id="team">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Team & Organizers</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-[700px]">
              Meet the dedicated team behind SMEC who make this event possible
            </p>
          </div>
          <TeamSection />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50" id="gallery">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Event Gallery</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-[700px]">Relive the moments from our previous events</p>
          </div>
          <GallerySection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Participate?</h2>
            <p className="mt-4 text-lg text-white/80 max-w-[700px]">
              Join hundreds of students in this exciting competition and showcase your skills
            </p>
            <Button size="lg" className="mt-6 bg-white text-teal-900 hover:bg-white/90" asChild>
              <Link to="/register">
                Register Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SMEC</h3>
              <p className="text-gray-400">
                Speed Mind Execution Competition - Annual tech competition hosted by the Department of Computer Science
                and IT at SSUET.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <address className="not-italic text-gray-400">
                <p className="flex items-start mb-2">
                  <MapPin className="mr-2 h-5 w-5 shrink-0 text-gray-400" />
                  <span>Sir Syed University of Engineering and Technology, Karachi, Pakistan</span>
                </p>
                <p className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>smec@ssuet.edu.pk</span>
                </p>
              </address>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/SMEC.SSUET"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/smec.ssuet"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/smec-ssuet"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} SMEC - SSUET. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
