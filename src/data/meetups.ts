export type Meetup = {
  id: string
  title: string
  description: string
  date: string
  location: string
  organizerId: string
  bannerImage?: string
}

export const meetups: Meetup[] = [
  {
    id: "1",
    title: "React Meetup",
    description: "A meetup for React developers",
    date: "2023-07-15",
    location: "New York, NY",
    organizerId: "1",
    bannerImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "Node.js Meetup",
    description: "A meetup for Node.js developers",
    date: "2023-07-20",
    location: "San Francisco, CA",
    organizerId: "1",
    bannerImage: "/placeholder.svg?height=200&width=400",
  },
];

