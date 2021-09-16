async function startFirebase(){
    let firebaseConfig = {
        apiKey: "AIzaSyC8kYskSHz9QAFrffTUY3fFI7kg17IQNJs",
        authDomain: "yourdelivery-app.firebaseapp.com",
        databaseURL: "https://yourdelivery-app.firebaseio.com",
        projectId: "yourdelivery-app",
        storageBucket: "yourdelivery-app.appspot.com",
        messagingSenderId: "614085704008",
        appId: "1:614085704008:web:6fc7506fcdc51e359b5b7d",
        measurementId: "G-3ZGFRJXGWR"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();

      
    
}
startFirebase()