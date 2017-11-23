
let url = "https://www.forverkliga.se/JavaScript/api/crud.php";
let ajax = new XMLHttpRequest();
let requestBtn = document.getElementById("requestBtn");
let addBookBtn = document.getElementById("addBookBtn");
let apiKey = document.getElementById("apiKey");
let receivedKey = "No key requested yet";

let titleBox = document.getElementById("titleBox");
let authorBox = document.getElementById("authorBox");

let listOfBooks = document.getElementById("listOfBooks");
let viewBookBtn = document.getElementById("viewBookBtn");

window.addEventListener("load", function(event) {
    apiKey.innerHTML = receivedKey;
    ajax.open('get', url);
    ajax.send();
});

requestBtn.addEventListener('click', function(event) {
    ajax.open('get', url + "?requestKey");
    ajax.onreadystatechange = function(event) {
        if(ajax.readyState == 4 && ajax.status == 200) {
            console.log("Request Key Succeeded!");
            let JSONobject = JSON.parse(ajax.responseText);
            receivedKey = JSONobject.key;
            apiKey.innerHTML = receivedKey;
        }
    }
    ajax.send();
});

addBookBtn.addEventListener('click', function(event) {
    
    let title = titleBox.value;
    let author = authorBox.value;
    
    ajax.open('get', url + "?op=insert&key=" + receivedKey + "&title=" + title + "&author=" + author);
    ajax.onreadystatechange = function(event) {
        if(ajax.readyState == 4 && ajax.status == 200) {
            console.log(ajax.responseText);
        }
    }
    ajax.send();
});

viewBookBtn.addEventListener("click", function(event) {
    ajax.open("get", url + "?op=select&key=" + receivedKey);
    ajax.onreadystatechange = function(event) {
        if(ajax.readyState == 4 && ajax.status == 200) {
            console.log(ajax.responseText);
            let jsonObject = ajax.responseText;
            listOfBooks.innerHTML = jsonObject;
        }
    }
    ajax.send();
});


