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
- [x] All Cargos filter shows all loads
- [ ] Create and send Invoice (In Cargo details) 
- [ ] Redisign cargo deltails (Make Page)
- [ ] Get Pictures and Documents from Firebase Storage
- [ ] Add new Agent button in admin account
- [ ] Accounting per Agent (add filter)
- [ ] Add Save button to DriverCargos page
> When I use the Drag and Drop system it will change only in LocalStorage and save changes to Firebase only after I click on Save Button
### Todo for corporation Saas
- [ ] Rebuild Firebase (create companey accout)

```JSON
{
  "id" : "<string>"
  "name" : "<stripng> (companey name)"
  "date" : "<date> (when the companey buy the plan or get the trail)"
}
```
- [ ] Drivers and all freights need to have `comapaneyID` string in firebase  

## Known Issues
- [ ] Sometime dosn't show driver wwith visibility "All"

## Important commands 

`npx vite build`, `firebase deploy`
