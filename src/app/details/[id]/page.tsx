"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { meetups, type Meetup } from "../../../data/meetups"
import Image from "next/image"

export default function Details({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [meetup, setMeetup] = useState<Meetup | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    } else {
      const foundMeetup = meetups.find((m) => m.id === params.id)
      if (foundMeetup) {
        setMeetup(foundMeetup)
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, router, params.id])

  const handleEdit = () => {
    router.push(`/edit/${meetup?.id}`)
  }

  const handleCancel = () => {
    // In a real app, you'd want to make an API call here
    alert("Meetup cancelled")
    router.push("/dashboard")
  }

  if (!meetup) return null

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <Card>
        <CardHeader>
          <CardTitle>{meetup.title}</CardTitle>
          <CardDescription>
            {meetup.date} - {meetup.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meetup.bannerImage && (
            <div className="mb-4">
              <Image src={meetup.bannerImage || "/placeholder.svg"} alt={meetup.title} width={400} height={200} />
            </div>
          )}
          <p>{meetup.description}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleEdit} className="mr-2">
            Edit
          </Button>
          <Button variant="destructive" onClick={handleCancel}>
            Cancel Meetup
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

