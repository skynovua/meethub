# MeetHub

[Live Demo](https://meethub-by-skynov.vercel.app/)

MeetHub is an event management application that allows users to create, bookmark, and favorite events.

## Features

- Create and manage events
- Bookmark events for later viewing
- Like/favorite events
- Sort events by popularity or date
- User authentication
- Profile page with saved and favorite events

## Technologies Used

- React
- Next.js
- TypeScript
- React Hook Form
- Zod
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account (for image storage)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/skynovua/meethub.git
cd meethub
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory based on the `.env.example` file and fill in the required values.

```bash
cp .env.example .env
```

### Database Setup

1. Set up the database schema:

```bash
npx prisma migrate dev
```

2. Generate Prisma client:

```bash
npx prisma generate
```

### Running the Application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm run dev
```

2. Open your browser and navigate to `http://localhost:3000`.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License.
