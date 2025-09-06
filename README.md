# React URL Shortener

A user-friendly React application that provides core URL shortening functionality with client-side analytics and routing.

## About The Project

This React app allows users to shorten URLs with optional custom shortcodes and validity periods. It features client-side routing for redirection, persistent storage, usage analytics, and robust input validation. The UI is built with Material UI, ensuring responsiveness and clarity.

## Features

- Shorten up to 5 URLs concurrently with optional custom shortcodes.
- Set validity period (in minutes) for each shortened URL (default 30 minutes).
- Click tracking with timestamps, source referrer, and location info.
- Client-side routing redirects shortened URLs to original links.
- Detailed statistics page displaying all shortened URLs and click data.
- Robust client-side validation and error handling.
- Logging middleware tracking app events in localStorage.
- Fully client-side with persistent data using localStorage.
- Styled using Material UI components and theming.

## Built With

- React 18
- React Router DOM
- Material UI (MUI)
- JavaScript (ES6+)
- localStorage for persistence

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation
1. Clone the repo:
   git clone https://github.com/harshitha-shetty11/22701A3055.git
2.Navigate to project directory:
  cd url-shortener
3. Install dependencies:
  npm install
4. Run the development server:
   npm start



   Screenhots of Files
   <img width="1907" height="824" alt="image" src="https://github.com/user-attachments/assets/d8e51376-3705-47b6-89ed-34fd4c3c0da1" />
<img width="1898" height="801" alt="image" src="https://github.com/user-attachments/assets/6d22a41f-1931-401b-a613-f9a8590b2720" />

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Enter one or more URLs to shorten.
- Optionally specify a custom shortcode and the validity period in minutes.
- Click "Shorten URLs" to create short links.
- Use the "View Statistics" page to monitor usage and click data.
- Access shortened links via `http://localhost:3000/your-shortcode`.
