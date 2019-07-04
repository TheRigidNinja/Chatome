import firebase from "../../node_modules/firebase";

 // Firebase Config KEY
  var firebaseConfig = {
    apiKey: "AIzaSyBa292saQfeQuy-uSq0kur6Zu2UeUdmfuQ",
    authDomain: "chatapp-66db3.firebaseapp.com",
    databaseURL: "https://chatapp-66db3.firebaseio.com",
    projectId: "chatapp-66db3",
    storageBucket: "chatapp-66db3.appspot.com",
    messagingSenderId: "545363742777",
    appId: "1:545363742777:web:dc3890605187645d"
  };

const fire = firebase.initializeApp(firebaseConfig);

export default fire; 