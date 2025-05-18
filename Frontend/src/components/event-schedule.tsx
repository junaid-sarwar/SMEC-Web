import { Card, CardContent } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Clock, MapPin } from "lucide-react"

export default function EventSchedule() {
  const scheduleData = {
    "Day 1": [
      { time: "09:00 AM - 10:00 AM", event: "Opening Ceremony", location: "Main Auditorium" },
      { time: "10:30 AM - 12:30 PM", event: "Coding Competition (Round 1)", location: "Lab 1, 2, 3" },
      { time: "12:30 PM - 01:30 PM", event: "Lunch Break", location: "Cafeteria" },
      { time: "01:30 PM - 03:30 PM", event: "Tech Quiz Preliminaries", location: "Seminar Hall" },
      { time: "04:00 PM - 06:00 PM", event: "Gaming Tournament (Day 1)", location: "Gaming Arena" },
    ],
    "Day 2": [
      { time: "09:00 AM - 11:00 AM", event: "Design Challenge", location: "Design Studio" },
      { time: "11:30 AM - 01:30 PM", event: "Robotics Contest Setup", location: "Robotics Lab" },
      { time: "01:30 PM - 02:30 PM", event: "Lunch Break", location: "Cafeteria" },
      { time: "02:30 PM - 04:30 PM", event: "Coding Competition (Round 2)", location: "Lab 1, 2" },
      { time: "05:00 PM - 07:00 PM", event: "Gaming Tournament (Day 2)", location: "Gaming Arena" },
    ],
    "Day 3": [
      { time: "09:00 AM - 11:00 AM", event: "Robotics Contest Finals", location: "Main Hall" },
      { time: "11:30 AM - 01:00 PM", event: "Tech Quiz Finals", location: "Seminar Hall" },
      { time: "01:00 PM - 02:00 PM", event: "Lunch Break", location: "Cafeteria" },
      { time: "02:00 PM - 04:00 PM", event: "Project Showcase", location: "Exhibition Area" },
      { time: "05:00 PM - 07:00 PM", event: "Closing Ceremony & Prize Distribution", location: "Main Auditorium" },
    ],
  }

  return (
    <Tabs defaultValue="Day 1" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="Day 1">Day 1</TabsTrigger>
        <TabsTrigger value="Day 2">Day 2</TabsTrigger>
        <TabsTrigger value="Day 3">Day 3</TabsTrigger>
      </TabsList>
      {Object.entries(scheduleData).map(([day, events]) => (
        <TabsContent key={day} value={day} className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="sm:w-1/3 font-medium flex items-center mb-2 sm:mb-0">
                      <Clock className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="sm:w-2/3">
                      <h3 className="font-bold text-lg">{event.event}</h3>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-teal-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
