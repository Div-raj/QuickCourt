# QuickCourt - Sports Venue Booking Platform

A modern web application for booking sports venues, connecting players, and managing sports facilities.

## Features

- 🏟️ **Venue Booking**: Find and book sports venues in your area
- 👥 **Player Connect**: Connect with other players using AI-powered message generation
- 🏆 **Events & Tournaments**: Join sports events and competitions
- 👥 **Lobbies**: Create and join sports communities
- 🏢 **Business Portal**: Venue owners can list and manage their facilities
- 👨‍💼 **Admin Panel**: Platform management and user oversight

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
   ```bash
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   
   **Get your free Gemini API key from:** [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI message generation | Yes (for Player Connect feature) |

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite

## Project Structure

```
├── components/          # Reusable UI components
├── screens/            # Page components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── image/              # Static images
```
