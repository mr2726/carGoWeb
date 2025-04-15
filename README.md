# CarGo - Web Application

CarGo is a web application for cargo transportation management, built with React, TypeScript, Material-UI, and Firebase.

## Features

- Driver and cargo management
- Real-time cargo status tracking
- Automatic data updates via Firebase
- Modern and responsive interface
- Cargo filtering and search
- Detailed cargo and driver information

## Technologies

- React
- TypeScript
- Material-UI
- Firebase (Firestore)
- Zustand (state management)
- React Router
- Date-fns

## Installation and Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory and add your Firebase credentials:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the application:
```bash
npm start
```

## Project Structure

- `src/components` - React components
- `src/pages` - Application pages
- `src/services` - Firebase services
- `src/store` - State management (Zustand)
- `src/types` - TypeScript types
- `src/config` - Firebase configuration

## Key Features

- Real-time data updates
- Optimized Firebase queries
- Responsive design
- User-friendly interface
- Efficient state management

## Recent Changes

- Integrated Firebase Firestore for data persistence
- Implemented CRUD operations for drivers and cargoes
- Added status filtering and search functionality
- Fixed cargo update functionality in Firestore
- Improved error handling for database operations
- Added loading states for async operations

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and project setup

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/store` - Zustand store for state management
- `/src/services` - Firebase and other service integrations
- `/src/types` - TypeScript interfaces and types
- `/src/config` - Application configuration

## Technologies Used

- React
- TypeScript
- Material-UI
- Zustand (State Management)
- React Router
- DnD Kit (Drag and Drop)
- Date-fns (Date manipulation)
- Firebase/Firestore (Database)

## Known Issues

- Cargo updates may fail if the document doesn't exist in Firestore
- Need to handle concurrent updates better
- Loading states could be more granular

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

If you encounter issues with cargo updates:
1. Check that the cargo ID matches between local state and Firestore
2. Verify that all required fields are present in the update
3. Check Firebase Console for any permission issues
4. Look for any error messages in the browser console
