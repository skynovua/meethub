export type Meetup = {
  id: string
  title: string
  description: string
  date: string
  address: string
  organizerId: string
  banner: string
}

export const meetups: Meetup[] = [
  {
    id: "1",
    title: "React Meetup",
    description: "A meetup for React developers",
    date: "2023-07-15",
    address: "New York, NY",
    organizerId: "1",
    banner: "",
  },
  {
    id: "2",
    title: "Node.js Meetup",
    description: "A meetup for Node.js developers",
    date: "2023-07-20",
    address: "San Francisco, CA",
    organizerId: "1",
    banner: "",
  },
];

