var releaseDate;
var clickedKey = 0;
            
function showShows() {
    $("#myShowsList").empty();

    for (var i = 0; i < localStorage.length; i++)
    {
        var myKey = localStorage.key(i);
        var jason = JSON.parse(localStorage.getItem(myKey));
        
        var onsItem = document.createElement('ons-list-item');
        onsItem.setAttribute('modifier', "tappable"); 
        onsItem.setAttribute('onclick', "itemClick("+myKey+")");
        onsItem.setAttribute('expandable');

        var onsItemChild = document.createElement('div');
        onsItemChild.classList.add('expandable-content');

        addHeader(onsItem, jason);

        var card = document.createElement("ons-card");
        card.setAttribute('style', "padding-right: 5em;position: relative;"); 
        card.classList.add("detect-area");
        
        card.innerHTML = "<p><span class='header2'> Description: </span></p>" + jason.description;
    
        if(jason.trailerId.length) {
            addPlayer(card, jason.trailerId);
        }

        addCalendar(card, jason);
        onsItemChild.append(card);
        
        if(!jason.imageSource.length){
            jason.imageSource = "resources/placeholder.png";
        }

        addPreviewImage(jason.imageSource, onsItem);
        addFabIcon(onsItemChild, myKey);

        onsItem.appendChild(onsItemChild);
        document.getElementById('myShowsList').appendChild(onsItem); 
        
        showMyWatchList();
    }
}

function addPlayer(card, trailer) {
    var bigdiv = document.createElement("div");
    bigdiv.classList.add("container");

    var div = document.createElement("div");
    div.classList.add("iframe-container");

    var header = document.createElement("p");
    header.setAttribute("style", "margin-top: 2em");
    header.innerHTML = "<span class='header2'> Trailer:</span>";

    var playerEl = document.createElement("iframe");
    playerEl.setAttribute("src", "https://www.youtube.com/embed/" + trailer);

    div.appendChild(playerEl);
    bigdiv.appendChild(div);

    card.appendChild(header);
    card.appendChild(bigdiv);
}

function addCalendar(card, jason) {
    var release = jason.releaseDate;
    if (release === undefined || release === null) {
        var temp = new Date(); 
        release = temp.getDate() + "-" + (temp.getMonth() + 1) + "-" + temp.getFullYear();
    }

    var div = document.createElement("div");
    div.setAttribute("title", "Add to Calendar");
    div.classList.add("addeventatc");
    div.setAttribute("style", "margin-top: 2em;")

    var start = document.createElement("span");
    start.classList.add("start");
    start.innerHTML = release;

    var title = document.createElement("span");
    title.classList.add("title");
    title.innerHTML = jason.name;

    var description = document.createElement("span");
    description.classList.add("description");
    description.innerHTML = jason.description;

    div.innerHTML = "Add to Calendar";
    div.append(start, title, description);

    card.appendChild(div);
}

function addFabIcon(onsItemChild, myKey) {
    var fab = document.createElement("ons-fab")
    fab.setAttribute('onclick', "remShow("+myKey+");");
    fab.setAttribute('style', "background-color: red");
    fab.setAttribute('position', "bottom right")

    var fabIcon = document.createElement("ons-icon");
    fabIcon.setAttribute('icon', "fa-times");

    fab.appendChild(fabIcon);
    onsItemChild.appendChild(fab);
}

function addPreviewImage(imgSource, onsItem) {
    var imgElement = document.createElement("img");
    imgElement.setAttribute("src", imgSource);

    var previewImg = document.createElement("div");
    previewImg.classList.add("left");
    previewImg.appendChild(imgElement);
    onsItem.appendChild(previewImg);
}

function addHeader(onsItem, jason) {
    var myDateString;
    if (jason.releaseDate === undefined || jason.releaseDate === null) {
        myDateString = "unknown"; 
    }
    else {
        var temp = new Date(jason.releaseDate);
        myDateString = temp.getDate() + ". " + (temp.getMonth() + 1) + ". " + temp.getFullYear();
    }

    var par = document.createElement("p");
    par.setAttribute("style", "width: 100%; font-size: 120%; margin-top: 0.5em; margin-bottom: 1.0em")
    par.innerHTML = "Name: <span class='header2 nobr'>" + jason.name + "</span>";

    par2 = document.createElement("p");
    par2.setAttribute("style", "width: 100%; margin-bottom: 0.1em;")
    par2.innerHTML = "Last season: <span class='header2'>" + jason.numberOfSeasons + "</span>";
    par3 = document.createElement("p");
    par3.setAttribute("style", "width: 100%; margin-bottom: 0.1em; margin-top: 0.1em;")
    par3.innerHTML = "Watched seasons: <span class='header2'>" + jason.watchedSeasons + "</span>";
    par4 = document.createElement("p");
    par4.setAttribute("style", "width: 100%; margin-bottom: 0.1em; margin-top: 0.1em;")
    par4.innerHTML = "Release date: <span class='header2 nobr'>" + myDateString + "</span>";

    onsItem.append(par, par2, par3, par4);
}

function addShow() {
    var myKey;
    if(!clickedKey) {
        var myDate = new Date();
        myKey = myDate.getTime();
    }
    else {
        myKey = clickedKey;
    }

    var name = $("#name").val();
    var imgsrc = $("#imageSrc").val();
    var description = $("#textarea").val();
    var seasons = $("#seasons").val();
    var watched = $("#watched").val();
    var trailerId = $("#trailerId").val();

    var jason = {name : name, releaseDate : releaseDate, imageSource : imgsrc, description : description, numberOfSeasons: seasons, trailerId: trailerId, watchedSeasons: watched};

    var filled = 0;
    var nums = 0;
    if(name.length && seasons.length && watched.length && description.length) {
        filled = 1;

        if(!isNaN(parseInt(seasons)) && !isNaN(parseInt(watched)) && parseInt(watched) <= parseInt(seasons)) {
            nums = 1;
        }
        else {
            showToast('Invalid inputs!');
        }
    }
    else {
        showToast('Please fill at least first four text fields!');
    }

    if(nums && filled) {
        localStorage[myKey] = JSON.stringify(jason);

        showShows();
        closeDialog();
    }
}

//--------------------------------------------------------

function openDialog(edit = 0) {
    if(!edit)
        clickedKey = 0;

    document.getElementById("addShow").show();
}

function closeDialog() {
    document.getElementById("addShow").hide();

    let elements = ['name', 'seasons', 'watched', 'textarea', 'trailerId', 'imageSrc', 'dateInput']

    for (var i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).value = "";
    }
}

function setReleaseDate(myDate)
{   
    releaseDate = myDate;
}

function remShow(key) {
    localStorage.removeItem(key);
    showShows();
    showToast("Show removed");
}

function itemClick(key)
{
    clickedKey = key;
}

function edit()
{
    var jason = JSON.parse(localStorage.getItem(clickedKey));

    var release = new Date(jason.releaseDate);
    var month = getlength(release.getMonth() + 1) > 1 ? (release.getMonth() + 1).toString() : "0" + (release.getMonth() + 1).toString();
    var day = getlength(release.getDate()) > 1 ? (release.getDate()).toString() : "0" + (release.getDate()).toString();

    var rel = release.getFullYear() + "-" + month + "-" + day;
    console.log(rel);

    let elements = ['name', 'seasons', 'watched', 'textarea', 'trailerId', 'imageSrc', 'dateInput']

    let inputs = [jason.name, jason.numberOfSeasons, jason.watchedSeasons, jason.description, jason.trailerId, jason.imageSource, rel]

    openDialog(1);

    for (var i = 0; i < elements.length; i++) {
        document.getElementById(elements[i]).value = inputs[i];
    }
}

function getlength(number) {
    return number.toString().length;
}

document.addEventListener('hold', function(event) {
    if (event.target.matches('.detect-area')) {
        edit();
    }
});