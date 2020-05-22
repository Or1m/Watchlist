"use strict";
var x = document.getElementById("myAudio"); 

document.addEventListener('init', function(event) {
    var page = event.target;
    
    if (page.id === 'watchlist') {
        showMyWatchList();
    } 
    else if (page.id === 'myshows') {
        showShows();

        $("#searchBar").keyup(function(){
            var value = $(this).val().toLowerCase();
            $("#myShowsList ons-list-item").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                
            });
        });
    }
});

function playAudio() { 
    x.play(); 
    showToast("Playing relaxing music")
} 

function pauseAudio() { 
    x.pause(); 
    showToast("Pausing relaxing music")
}

var showToast = function(message) {
    ons.notification.toast(message, {
        timeout: 2000
    });
};

function get_joke_of_the_day(target) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jason = JSON.parse(this.responseText);
            var joke = [jason.contents.jokes[0].description, jason.contents.jokes[0].joke.text];
            
            showPopover(target, joke);
        }
    };
    xhttp.open("GET", "https://api.jokes.one/jod?category=animal", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("X-JokesOne-Api-Secret", "");
    xhttp.send();
}

var showPopover = function(target, joke) {
    
    var pop = document.getElementById('popP');

    pop.innerHTML = "<p>" + joke[0] + ":</p>" + "<p>" + joke[1] + "</p>";
    
    document.getElementById('popover').show(target);
};
  
var hidePopover = function() {
    document.getElementById('popover').hide();
};