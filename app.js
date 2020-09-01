var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
const Auth = require('./models/firebase');
const storage = require('node-sessionstorage')
var cookieParser = require('cookie-parser');

var admin = require('firebase-admin');

var serviceAccount = require("./kxleadstracker-firebase-adminsdk-xhqyr-06ab612d39.json");

var firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kxleadstracker.firebaseio.com"
});

var database = firebaseAdmin.database();

var app = express();

app.set('view engine', 'ejs')

app.use(express.static('views'));
app.set('views', __dirname + '/views');
app.use(cookieParser());
app.use(bodyParser.json({strict:false}));
app.use(bodyParser.urlencoded({extended : false}))

app.use(logger('dev'));

app.get('/', function (req, res) { 
    res.render("home");
 })

var port = process.env.port || 8080;

app.listen(port, function(){
    console.log("App running on port " + port);
})

app.post('/login', (req, res) =>{
    Auth.SigUpWithEmailAndPassword(req.body.email, req.body.password)
    .then((login) =>{
      if(!login.err){
        res.redirect('/dashboard')
      }else{
        res.redirect('/')
      }
    })
  });
  
  
  app.get('/dashboard' , (req, res) => {
    var locationsData = database.ref('Users');
  
    locationsData.on('value' , function(snapshot){
        var allData = Object.keys(snapshot.val());
      res.render('dashboard', { allData : snapshot.val()});
    })
  })

  var userName;
  app.get('/allData' , (req, res) => {
    res.render('getAllData', {userName});
  /*  var allDataFromUser = database.ref('Users').child(userName);
   
    allDataFromUser.on('value' , function(snapshot){
        var allData = snapshot.val();
        console.log(allData);
        
    })
    */
  })

  app.get('/enviarUser' , (req, res) => {
    userName = req.query.User;
  })


  app.get('/maisInformacoes', (req, res) => {
    res.render('maisInformacoes');
  })

  module.exports = app;