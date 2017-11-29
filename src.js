
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
            
            while(listOfBooks.firstChild) {
                listOfBooks.removeChild(listOfBooks.firstChild);
            }
            
            for(let i = 0; i < jsonObject.data.length; i++){
                let newNode = document.createElement("LI");
                
                let titleSpan = document.createElement("span");
                let inbetweenSpan = document.createElement("span");
                let authorSpan = document.createElement("span");
                let idSpan = document.createElement("span");
                
                let titleInput = document.createElement("input");
                titleInput.style.display = "none";
                titleInput.type = "text";
                titleInput.placeholder = "Enter Title";
    
                let authorInput = document.createElement("input");
                authorInput.style.display = "none";
                authorInput.type = "text";
                authorInput.placeholder = "Enter Author";
                
                titleSpan.innerHTML = jsonObject.data[i].title;
                inbetweenSpan.innerHTML = " by ";
                authorSpan.innerHTML = jsonObject.data[i].author;
                idSpan.innerHTML = ", ID: " + jsonObject.data[i].id;
                
                titleSpan.addEventListener("click", function(event) {
                    titleSpan.style.display = "none";
                    titleInput.style.display = "inline";
                    
                    titleInput.addEventListener("blur", function(event) {
                        titleSpan.innerHTML = titleInput.value;
                        titleInput.style.display = "none";
                        titleSpan.style.display = "inline";
                        
                        ajax.open("get", url + "?op=update&key=" + receivedKey + "&id=" +
                        jsonObject.data[i].id + "&title=" + titleSpan.innerHTML+ "&author=" + authorSpan.innerHTML);
                        ajax.onreadystatechange = function(event) {
                            if(ajax.status = 200 && ajax.readyState == 4){
                                console.log(ajax.response);
                            }
                        }
                        ajax.send();
                        
                    });
                });
                
                authorSpan.addEventListener("click", function(event) {
                    authorSpan.style.display = "none";
                    authorInput.style.display = "inline";
                    
                    authorInput.addEventListener("blur", function(event) {
                        authorSpan.innerHTML = authorInput.value;
                        authorInput.style.display = "none";
                        authorSpan.style.display = "inline";
                        
                        ajax.open("get", url + "?op=update&key=" + receivedKey + "&id=" +
                        jsonObject.data[i].id + "&title=" + titleSpan.innerHTML+ "&author=" + authorSpan.innerHTML);
                        ajax.onreadystatechange = function(event) {
                            if(ajax.status = 200 && ajax.readyState == 4){
                                console.log(ajax.response);
                            }
                        }
                        ajax.send();
                        
                    });
                });
                
                newNode.appendChild(titleSpan);
                newNode.appendChild(titleInput);
                newNode.appendChild(inbetweenSpan);
                newNode.appendChild(authorSpan);
                newNode.appendChild(authorInput);
                newNode.appendChild(idSpan);             
                listOfBooks.appendChild(newNode);
            }
            
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

let databasKnapp = document.getElementById("test");
databasKnapp.addEventListener("click", function(event) {
    ajax.open("get", url + "?op=select&key=" + receivedKey);
    ajax.onreadystatechange = function(event) {
        if(ajax.readyState == 4 && ajax.status == 200) {
            console.log(ajax.responseText);
        }
    }
    ajax.send();
});



