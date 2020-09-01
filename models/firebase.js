 const firebase = require('firebase');
 
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyCplQRlFAp_x8KZrdyxHjaY3fpYNZe5RqA",
    authDomain: "kxleadstracker.firebaseapp.com",
    databaseURL: "https://kxleadstracker.firebaseio.com",
    projectId: "kxleadstracker",
    storageBucket: "kxleadstracker.appspot.com",
    messagingSenderId: "537941817084",
    appId: "1:537941817084:web:e7c52da1f08f0636810979",
    measurementId: "G-23ZXLNK1MB"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();


 module.exports.SigUpWithEmailAndPassword = (email, password) => {
     return firebase.auth().createUserWithEmailAndPassword(email, password)
     .then((user) => {
         return JSON.stringify(user);
     })
     .catch(function(error){
         var errorCode = error.code;
         var errorMessage = error.Message;

         if(errorCode == 'auth/weak-password'){
             return {err: 'The password is too weak'}
         }else{
             return {err: errorMessage}
         }
         return {err: error}
     });
 }

 module.exports.getAllLocationsData = function(){
    console.log("Firebase All Locations Data");
    database = firebase.database();

    var ref = database.ref('Users');
    ref.on('value', gotData, errData);
    var infoData = [];
    
    function gotData(data){
        var info = data.val();
        var keys = Object.keys(info);
        var array = [];
        for(var i = 0; i < keys.length; i++){
            var k = keys[i];
            var lat = info[k].lat
            var log = info[k].log
            var data = info[k].date
            var nome = info[k].name
            var phoneNumber = info[k].phoneNumber

            var infoData = {
                data : data, 
                latitude : lat, 
                longitude: log,
                name: nome,
                nTelefone: phoneNumber
            };
            array.push(infoData);
        }
        console.log(array);
        return array;
    }

    function errData(err){
        console.log('Error!');
        console.log(err);
    }
    
    
 }

 
