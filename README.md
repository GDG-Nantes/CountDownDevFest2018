[ ![Codeship Status for GDG-Nantes/CountDownDevFest2018](https://app.codeship.com/projects/94ea8c60-ad04-0136-155a-0611d2b1dc9a/status?branch=master)](https://app.codeship.com/projects/309492)

# CountDownDevFest2018
Count Down project for DevFest Nantes 2018


# Stack

This project use :

* VueJS
* Firebase Hosting
* Firebase Firestore
* Firebase Auth


# Install

to install, simply run `yarn install`

# Developp

to start to developp, simply run `npm run serve`

## How to contribute (where is F...ing code!?)

The VueJS application is in `/src` directory. The vue app is a single page application that switch the user between the game `/` (Attendee interaction) and the countdown `/countdown` (the main screen).
The `public` directory contains a webworker where all the logic of planet manipulation runs.
The `functions` directory contains an endpoint. For the moment useless (I will maybe drop it).

# Deploy

todo