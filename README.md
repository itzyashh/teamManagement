# Team Management App

A mobile application for creating and managing teams, built with React Native, Expo, and Firebase.

## Screenshots

<div style="display: flex; flex-direction: row; overflow-x: auto; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/17bac470-5ae4-477e-aefe-f6b7aafb3d8b" width="200" />
  <img src="https://github.com/user-attachments/assets/ef09fcb2-3436-4d4e-b4c4-57a4b06861b5" width="200" />
  <img src="https://github.com/user-attachments/assets/0ad623a9-d95f-4606-a33a-a83ebd015567" width="200" />
  <img src="https://github.com/user-attachments/assets/f9499e09-b7e3-4d0c-a880-40cfd6b2bb0e" width="200" />
  <img src="https://github.com/user-attachments/assets/fafeda69-0ac2-49fc-b9f5-8e42db47eb64" width="200" />
</div>

## Features

- User authentication (login/register)
- Create and manage teams
- Invite team members via username or email
- Assign player positions and roles
- Upload team logo
- Team member management
- Firebase integration for data storage and authentication

## Tech Stack

- React Native
- Expo Router for navigation
- Firebase Authentication
- Firebase Firestore for database
- Firebase Storage for file uploads
- Redux Toolkit for state management
- NativeWind (TailwindCSS for React Native)
- TypeScript

## Getting Started

### Prerequisites

- Node.js
- Yarn package manager
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
```
yarn install
```
3. Start the development server:
```
yarn start
```

## Project Structure

- `/src/app` - Main application screens
- `/src/app/(auth)` - Authentication screens
- `/src/app/(protected)` - Protected routes requiring authentication
- `/src/components` - Reusable components
- `/src/services` - API services for Firebase
- `/src/redux` - Redux state management
- `/src/types` - TypeScript type definitions
