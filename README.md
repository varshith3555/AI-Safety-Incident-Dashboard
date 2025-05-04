# AI Safety Incident Dashboard

A dashboard application for tracking and analyzing AI safety incidents.

## Technologies Used

- **Frontend**: React.js with TypeScript
- **Backend**: Express.js (Node.js)
- **Styling**: Tailwind CSS with Shadcn UI components
- **Data Management**: React Query
- **Routing**: Wouter

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed on your machine
- Git for version control

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/varshith3555/AI-Safety-Incident-Dashboard.git
   cd AI-Safety-Incident-Dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/db` - Database models and configuration
- `/shared` - Shared types and utilities

## Build for Production

```
npm run build
npm run start
```

## Design Decisions

- **Unified Server/Client Setup**: The project uses a unified setup where both the frontend and backend run on the same port (5000), simplifying deployment and development.

- **TypeScript**: Used throughout the project to provide type safety and improve development experience.

- **Component Library**: Utilized Shadcn UI components with Tailwind CSS for a consistent and accessible user interface.

- **API Structure**: RESTful API endpoints are prefixed with `/api` to clearly separate them from frontend routes.

## License

[MIT License](LICENSE) 