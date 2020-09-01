var user = sessionStorage.getItem('User');
var userName;
var locations = [];
var localizoesDia = [];
var datas = [];
var txtNode;
var listNode;
var liNode;
var carregouData;
var objetosUser = [];

function initMap() {
  var myLatlng = new google.maps.LatLng(-25.363882, 131.044922);
  var mapOptions = {
    zoom: 1,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var marker = new google.maps.Marker({
    position: myLatlng,
    title: "Hello World!"
  });

  // To add the marker to the map, call setMap();
  marker.setMap(map);
}


function verLocalização() {

  var locations = sessionStorage.getItem('allLocations');
}

function getAllDataFromDb() {

  var ultimoLatLong = locations.length;

  var myLatlng = new google.maps.LatLng(locations[ultimoLatLong - 2], locations[ultimoLatLong - 1]);
  var mapOptions = {
    zoom: 4,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map, 
    title: "Hello World!"
  });

  // To add the marker to the map, call setMap();
  marker.setMap(map);

}

$(document).ready(function () {

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
  // firebase.analytics();

  userName = document.getElementById('latlong').innerText;
  var database = firebase.database();
  var allDataFromUser = database.ref('Users').child(userName);
  var list = document.getElementById('datas');
  var i = 0;
  while (list.hasChildNodes()) {  
    list.removeChild(list.firstChild);
  }
  allDataFromUser.on('value', function (snapshot) {
    var allData = snapshot.val();
    var keys = Object.keys(allData);
    keys.forEach(function (key) {
      locations.push(allData[key].lat, allData[key].log);
      objetosUser.push(allData[key]);
      var str = allData[key].dia;
      var res = str.replace(",", "");
      listNode = document.getElementById('datas'),
        liNode = document.createElement("li"),
        txtNodes = document.createTextNode(allData[key].hora + " " + res + ":" + allData[key].mes + ":" + allData[key].ano);

      if (txtNode == null || txtNode.innerText == "undefined") {
        liNode.appendChild(txtNodes);
        listNode.appendChild(liNode);
        liNode.setAttribute("id", i);
        liNode.setAttribute('onclick', 'getAllDayDirections()');
        liNode.onclick = function() {getAllDayDirections()};
        i++
        txtNode = document.createTextNode(allData[key].hora + " " + res + ":" + allData[key].mes + ":" + allData[key].ano);
      } else if (txtNodes.innerText == txtNode.innerText) {

      }else {
        liNode.appendChild(txtNodes);
        listNode.appendChild(liNode);
        liNode.setAttribute("id", i);
        i++
      }

    })
  })
});
  

function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement;
} 


function getAllDayDirections() {

  var ul = document.getElementById('datas');
  ul.onclick = function (event) {
    var target = getEventTarget(event);
    carregouData = target.innerHTML;
    printRoute(carregouData);
  }
  
}

function printRoute(carregouData){
  var res2 = carregouData.split(" ");
  res2 = res2[1];
  var latInicio;
  var logInicio;
  var latFim;
  var latInicio;
  

  for(i = 0; i < objetosUser.length; i++){
    var str = objetosUser[i].dia;
    var res = str.replace(",", "");
    var dataString =  res + ":" + objetosUser[i].mes + ":" + objetosUser[i].ano;
    if(dataString == res2){
      var lat = objetosUser[i].lat;
      var long = objetosUser[i].log;
      localizoesDia.push(lat, long);
    }else{
      continue;
    }
  }
  $('#tempo').text("Duração da Viagem: " + objetosUser[0].hora + " - " + objetosUser[objetosUser.length-1].hora);
  latInicio = localizoesDia[0];
  logInicio = localizoesDia[1];
  latFim = localizoesDia[localizoesDia.length-2];
  logFim = localizoesDia[localizoesDia.length-1];

  var myLatlng = new google.maps.LatLng(latInicio, logInicio);
  var otherLatLong = new google.maps.LatLng(latFim , logFim);

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var mapOptions = {
    zoom: 1,
    center: myLatlng
  }
  for( j = 0 ; j < localizoesDia.length-1; j ++ ){
    var markersLatLog = new google.maps.LatLng(localizoesDia[j], localizoesDia[j+1]);
    var marker = new google.maps.Marker({
      position: markersLatLog,
      map: map, 
      title: "Hello World!"
    });
  
    // To add the marker to the map, call setMap();
    marker.setMap(map);
  }
  
  directionsDisplay.setMap(map);

  calculateRoute();

  function calculateRoute() {
    var request = {
      origin: myLatlng,
      destination: otherLatLong,
      travelMode: 'DRIVING'
    }
    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        directionsDisplay.setDirections(result);
        calculateDistance(myLatlng, otherLatLong);
      }
    })
  }
}

function calculateDistance(origin, destination) {

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
    // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
    avoidHighways: false,
    avoidTolls: false
  }, callback);
}
// get distance results
function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    $('#result').html(err);
  } else {
    var origin = response.originAddresses[0];
    var destination = response.destinationAddresses[0];
    if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
      $('#result').html("Better get on a plane. There are no roads between " + origin + " and " + destination);
    } else {
      var distance = response.rows[0].elements[0].distance;
      var duration = response.rows[0].elements[0].duration;
      console.log(response.rows[0].elements[0].distance);
      var distance_in_kilo = distance.value / 1000; // the kilom
      var distance_in_mile = distance.value / 1609.34; // the mile
      var duration_text = duration.text;
      var duration_value = duration.value;
      $('#in_mile').text("Distancia em Milhas: " + distance_in_mile.toFixed(2));
      $('#in_kilo').text("Distancia em Kilometros: " + distance_in_kilo.toFixed(2));
      $('#duration_text').text("Duração em Horas: "+ duration_text);
      $('#duration_value').text("Duração em Minutos: "+ duration_value);
      $('#from').text("Origem: " + origin);
      $('#to').text("Destino : " + destination);
    }
  }
}

function maisOpcoes(){
  sessionStorage.setItem('data' , carregouData);
  sessionStorage.setItem('infoData' , objetosUser);
  sessionStorage.setItem('User' , userName);
  location.href = "/maisInformacoes";
}


