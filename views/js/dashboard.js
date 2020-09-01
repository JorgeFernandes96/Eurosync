
function myFunction(){
   var ul = document.getElementById('test');
   ul.onclick = function(event) {
       var target = getEventTarget(event);
       var userName = target.innerHTML;
       sessionStorage.setItem('User', userName.trim());
       $.ajax({
        type: 'get',
        url: '/enviarUser',
        data: {
            User: userName.trim()
        },
        success: function(response) {
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
       location.href = "/allData";
   };
}

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement; 
}

$(document).ready(function() {
     var list = document.getElementsByClassName("something");
     for (var j = 0; j < list.length; j++) {
        list[j].setAttribute("id", "userName" + j);
       } 
});