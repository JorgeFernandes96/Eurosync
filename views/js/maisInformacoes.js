var data = sessionStorage.getItem('data');
var userName = sessionStorage.getItem('User');
var locations = [];
var localizoesDia = [];
var datas = [];
var txtNode;
var listNode;
var liNode;
var carregouData;
var objetosUser = [];

$(document).ready(function () {
    console.log(userName);

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


            liNode.appendChild(txtNodes);
            listNode.appendChild(liNode);
            liNode.setAttribute("id", i);
            liNode.setAttribute('onclick', 'getAllDayDirections()');
            liNode.onclick = function () {
                getAllDayDirections()
            };
            i++
            txtNode = document.createTextNode(allData[key].hora + " " + res + ":" + allData[key].mes + ":" + allData[key].ano);

        })
    })
});

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