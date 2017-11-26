
let url = "https://www.forverkliga.se/JavaScript/api/crud.php";
let ajax = new XMLHttpRequest();
let requestBtn = document.getElementById("requestBtn");
let addBookBtn = document.getElementById("addBookBtn");
let addBookMessage = document.getElementById("addBookMessage");
let apiKey = document.getElementById("apiKey");
let receivedKey = "No key requested yet";

let titleBox = document.getElementById("titleBox");
let authorBox = document.getElementById("authorBox");

let listOfBooks = document.getElementById("listOfBooks");
let viewBookBtn = document.getElementById("viewBookBtn");

let changeBtn = document.getElementById("changeBtn");

let deleteBtn = document.getElementById("deleteBtn");
let deleteBookId = document.getElementById("deleteBookID");

let unsuccessfulAPIcalls = 0;

window.addEventListener("load", function(event) {
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
    
    if(title == "" || author == "" || title == "" && author == ""){
        addBookMessage.innerHTML = "Please Enter valid input";
    }
    else{
        ajax.open('get', url + "?op=insert&key=" + receivedKey + "&title=" + title + "&author=" + author);
        ajax.onreadystatechange = function(event) {
            if(ajax.readyState == 4 && ajax.status == 200) {
                let jsonObject = JSON.parse(ajax.responseText);
                if(jsonObject.status == "error") {
                    addBookMessage.innerHTML = "Error message: " + jsonObject.message + " Please try again!";
                    unsuccessfulAPIcalls++;
                    console.log("Nr of errors " + unsuccessfulAPIcalls);
                }
                else{
                    addBookMessage.innerHTML = "Book Stored with ID = " + jsonObject.id;
                }
            }
        }
        ajax.send();
    }
});

viewBookBtn.addEventListener("click", function(event) {
    ajax.open("get", url + "?op=select&key=" + receivedKey);
    
    ajax.onreadystatechange = function(event) {
        if(ajax.readyState == 4 && ajax.status == 200) {
            
            let jsonObject = JSON.parse(ajax.responseText);
            let result = "";
            if(jsonObject.status != "success"){
                unsuccessfulAPIcalls++;
                console.log("Nr of Errors: " + unsuccessfulAPIcalls);
            }
            if(jsonObject.status != "success" || jsonObject.data == undefined){
                listOfBooks.innerHTML = jsonObject.message + " Please try again!";
            }
            else if(jsonObject.data.length == 0){
                listOfBooks.innerHTML = "No books added!";
            }
            else{
            for(let i = 0; i < jsonObject.data.length; i++) {
                result += "#" + (i+1) + ", " + jsonObject.data[i].title + " by " + jsonObject.data[i].author + ", ID: " + jsonObject.data[i].id + "<br>";
            }
            listOfBooks.innerHTML = result;
        }
        }
    }
    ajax.send();
});

changeBtn.addEventListener('click', function(event) {
    let id = document.getElementById("changeID").value;
    let title = document.getElementById("changeTitle").value;
    let author = document.getElementById("changeAuthor").value;
    ajax.open('get', url + "?op=update&key=" + receivedKey +
             "&id=" + id + "&title=" + title + "&author=" + author);
    ajax.onreadystatechange = function(event) {
        if(ajax.readyState == 4 && ajax.status == 200){
            let jsonObject = JSON.parse(ajax.responseText);
            if(jsonObject.status != "success"){
                unsuccessfulAPIcalls++;
                console.log("Nr of Errors: " + unsuccessfulAPIcalls);
            }
            
            console.log(ajax.responseText);
        }
    }
    ajax.send();
});

deleteBtn.addEventListener("click", function(event) {
    let id = document.getElementById("deleteBookID").value;
    ajax.open("get", url + "?op=delete&key=" + receivedKey + "&id=" + id);
    ajax.onreadystatechange = function(event) {
        if(ajax.readyState == 4 && ajax.status == 200) {
            console.log(ajax.responseText);
            let jsonObject = JSON.parse(ajax.responseText);
            if(jsonObject.status != "success"){
                unsuccessfulAPIcalls++;
                console.log("Nr of Errors: " + unsuccessfulAPIcalls);
            }
        }
    }
    ajax.send();
});



