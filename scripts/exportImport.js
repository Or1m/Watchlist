function exportData() {
    var finalJason = {};

    for (var i = 0; i < localStorage.length; i++)
    {
        var myKey = localStorage.key(i);
        var jason = JSON.parse(localStorage.getItem(myKey));
        finalJason[myKey] = jason;
    }

    saveData(finalJason, "data.json");

    showToast("Export successful");
}

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = JSON.stringify(data),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());


function importData() {
    var input = document.createElement('input');
    input.type = 'file';

    var a = 0;

    input.onchange = e => { 
        var file = e.target.files[0]; 

        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            var jason = JSON.parse(content);
            var keys = Object.keys(jason);

            if(document.getElementById("replacee").checked) {
                localStorage.clear();
                a = 1;
            }

            for (var i = 0; i < keys.length; i++) {
                var myDate = new Date();
                var myKey = myDate.getTime() + i;
                localStorage.setItem(myKey, JSON.stringify(jason[keys[i]]));
            }

            showShows();

            if(a)
                showToast("Data replaced");
            else
                showToast("New data appended");
        }
    }

    input.click();
}