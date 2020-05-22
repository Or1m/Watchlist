var notif = 0;

function showMyWatchList() {
    document.getElementById("notifIcon").style.visibility = "hidden";
    notif = 0;

    $("#myWatchList").empty();
    for (var i = 0; i < localStorage.length; i++)
    {
        var myKey = localStorage.key(i);
        var jason = JSON.parse(localStorage.getItem(myKey));

        var sessionsss = parseInt(jason.numberOfSeasons);
        var watchedddd = parseInt(jason.watchedSeasons);
        var release = new Date(jason.releaseDate);

        if(sessionsss > watchedddd && release <= Date.now()) {
            var onsItem = document.createElement('ons-list-item');
            onsItem.setAttribute('modifier', "tappable"); 
            onsItem.setAttribute('expandable');

            var onsItemChild = document.createElement('div');
            onsItemChild.classList.add('expandable-content');

            if(!jason.imageSource.length){
                jason.imageSource = "resources/placeholder.png";
            }

            addHeader(onsItem, jason);
            addProgressBar(onsItemChild, sessionsss, watchedddd);
            addSeasons(onsItemChild, sessionsss, watchedddd, myKey);
            addGreenFabIcon(onsItemChild, myKey, sessionsss);
            addPreviewImage(jason.imageSource, onsItem);

            onsItem.appendChild(onsItemChild);
            document.getElementById('myWatchList').appendChild(onsItem);

            var tempDate = new Date();
            var temprel = release.getDate() + ". " + (release.getMonth() + 1) + ". " + release.getFullYear();
            var tempre2 = tempDate.getDate() + ". " + (tempDate.getMonth() + 1) + ". " + tempDate.getFullYear();

            if(temprel == tempre2) {
                notify();
            }
        }      
    }
}

function notify() {
    notif += 1;
    var elem = document.getElementById("notifIcon");
    elem.style.visibility = "visible";
    elem.innerHTML = notif.toString();
}

function addGreenFabIcon(onsItemChild, myKey, sesions) {
    var fab = document.createElement("ons-fab")
    fab.setAttribute('onclick', "saveProgress(" + myKey + "," + sesions + ");");
    fab.setAttribute('style', "background-color: green;");
    fab.setAttribute('position', "bottom right")

    var fabIcon = document.createElement("ons-icon");
    fabIcon.setAttribute('icon', "fa-check");

    fab.appendChild(fabIcon);
    onsItemChild.appendChild(fab);
}

function addProgressBar(onsItemChild, sessionsss, watchedddd) {
    var progress = document.createElement("ons-progress-bar");

    progress.setAttribute("value", watchedddd/sessionsss * 100);
    progress.setAttribute("secondary-value", 100);
    progress.setAttribute("modifier", "material");
    progress.setAttribute("style", "padding-bottom: 5em; padding-right: 0");
    
    onsItemChild.appendChild(progress);
}

function addSeasons(onsItemChild, sessionsss, watchedddd, mykey) {
    for (var i = 0; i < sessionsss; i++) {
        var span = document.createElement("span");
        span.classList.add("nobr");

        var label = document.createElement("label");  
        label.setAttribute("style", "font-size: 115%");

        var box = document.createElement("ons-checkbox");  
        box.setAttribute("input-id", mykey + i);
        box.setAttribute("id", mykey + "-" + i);
        box.setAttribute("style", "padding-right: 0.5em; padding-bottom: 1em")

        if(i < watchedddd)
            box.setAttribute("checked");

        label.appendChild(box);

        var label2 = document.createElement("label");  
        label2.setAttribute("for", mykey + i);
        label2.setAttribute("style", "padding-right: 2em");
        label2.innerHTML = "Session: " + "<span class='header2'>" + (i + 1) + "</span>";

        span.append(label, box, label2); 
        onsItemChild.appendChild(span);
    }
}

function saveProgress(myKey, sesions) {
    var counter = 0;
    for(var i = 0; i < sesions; i++) {
        if(document.getElementById(myKey + "-" + i).checked)
            counter++;
    }

    var jason = JSON.parse(localStorage.getItem(myKey));
    jason.watchedSeasons = counter.toString();

    localStorage.setItem(myKey, JSON.stringify(jason));

    showShows();
    showToast("Progress saved");
}