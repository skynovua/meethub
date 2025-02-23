# MeetHub

[Live Demo](https://meethub-by-skynov.vercel.app/)

MeetHub is a web application for creating and managing meetups. Users can create, edit, and view meetups with details such as title, description, date, location, and banner image.

## Features

- Create new meetups
- Edit existing meetups
- View meetup details
- Upload and preview banner images

## Technologies Used

- React
- Next.js
- TypeScript
- React Hook Form
- Zod
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm

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

### Project Structure

- `src/components`: Contains React components used in the application.
  - `event-form.tsx`: Main component for creating and editing meetups.
  - `event-form-fields.tsx`: Component for rendering form fields.
- `src/actions`: Contains functions for creating and updating events.
- `src/lib/schemas`: Contains Zod schemas for form validation.
- `src/utils`: Contains utility functions.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License.

