"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { meetups, type Meetup } from "../../data/meetups"
import { ThemeSwitcher } from "../../components/theme-switcher"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [userMeetups, setUserMeetups] = useState<Meetup[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    } else {
      setUserMeetups(meetups.filter((meetup) => meetup.organizerId === user.id))
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/signin")
  }

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Profile
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
      <Button className="mb-4" onClick={() => router.push("/edit/new")}>
        Create Meetup
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userMeetups.map((meetup) => (
          <Card key={meetup.id}>
            <CardHeader>
              <CardTitle>{meetup.title}</CardTitle>
              <CardDescription>
                {meetup.date} - {meetup.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{meetup.description}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push(`/details/${meetup.id}`)}>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

