# CarGo - Web Application <v1.4.0>

CarGo is a web application for cargo transportation management, built with React, TypeScript, Material-UI, and Firebase.

## Recent Changes

- Integrated Firebase Firestore for data persistence
- Implemented CRUD operations for drivers and cargoes
- Added status filtering and search functionality
- Fixed cargo update functionality in Firestore
- Improved error handling for database operations
- Added loading states for async operations
- Added real-time synchronization for cargo updates across clients
- Implemented drag-and-drop functionality for cargo rearrangement
- Added user permissions system for cargo management
- Added account display with logout functionality in sidebar
- Fixed date field naming in cargo interface (pickupDateTime, deliveryDateTime)
- Added proper error handling for LocalStorage operations
- Improved logging for debugging cargo updates

## Todo

- [x] Implement user authentication with Firebase Auth
- [x] Add real-time updates using Firebase listeners
- [x] Implement batch operations for cargo updates
- [x] Add error boundaries for better error handling
- [x] Implement optimistic updates for better UX
- [x] Add form validation for cargo and driver inputs
- [x] Implement data caching for offline support
- [x] Add unit tests for critical components
- [x] Implement role-based access control
- [ ] Generate and snd Invoice
- [ ] Redisign cargo deltails (Make Page)
- [ ] Get Pictures and Documents from Firebase Storage
<<<<<<< HEAD
- [x] All Cargos filter shows all loads
=======
- [ ] All Cargos filter shows all loads (checkbox)
>>>>>>> ac6411a50f99685b460a9dc0e34d37571f491a32
- [ ] Add new Agent button in admin account
- [ ] Accounting per Agent (add filter)
- [x] Fix bug with lastLocation

## Known Issues
> All fixed

## Important commands 

`npx vite build`, `firebase deploy`