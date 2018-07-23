const admin = require("firebase-admin");
const functions = require('firebase-functions');

const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://countdowndevfest2018.firebaseio.com"
});

exports.addPlanet = functions.firestore
        .document('planets/{planetId}')
        .onCreate((snap, context) => {
            const newPlanet = snap.data();
            // Do something
        });

exports.updatePlanet = functions.firestore
        .document('planets/{planetId}')
        .onUpdate((change, context) => {
            const updatePlanet = change.after.data();
            const previousplanet = change.before.data();
            // Do something
        })