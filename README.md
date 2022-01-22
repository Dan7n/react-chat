
# ReactChat


ReactChat is the master thesis project for my course in front end web developement.
It is a full-stack chat application built with React and Firebase, where users can create an account and send text messages, audio and media files to each other.


## Demo

https://react-chat-aad5f.web.app/

## Features

- Sign in with email/password or with Google Auth
- Users can query the database to find other users by email or phone number
- Send and receive data in-real-time with zero delay thanks to Firebase's realtime database Cloud Firestore
- Users can record and send audio files 
- Users can upload images from their devices
- Emoji support
- Custom hooks to handle auth, media uploads, etc. 
- Responsive and cross platform
- 3D components build with react-three-fiber
- E2E testing with Cypress.io


## Tech Stack

- ReactJS with Typescript as the application client
- Firebase as the auth provder, hosting service for the demo application, and database in the form of Cloud Firestore
- SCSS, styled-components, and Material UI for styling
- react-three-fiber & react-three/drei to render the globe component on the homepage
- framer-motion as the animations library 
- lottie animations 
- CypressJS as the E2E testing library

## Installation

Clone the repository and install all dependencies 

```bash
  git clone https://github.com/Dan7n/react-chat.git
  cd react-chat
  npm install 
  npm start
```
    
## Feedback

If you have any feedback, please reach out to me at dani.ishaq@medieinstitutet.se

