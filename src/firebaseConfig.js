import firebase  from "firebase";

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBPyL0dnm-iiLHJn_xXA9uSVJgTZt6-wQU",
    authDomain: "naladipa-833a2.firebaseapp.com",
    projectId: "naladipa-833a2",
    storageBucket: "naladipa-833a2.appspot.com",
    messagingSenderId: "679350295777",
    appId: "1:679350295777:web:79f914191265c980476ba0"
  };

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const db = app.database();
export const auth = app.auth();
export const storage = app.storage();