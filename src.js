
let url = "https://www.forverkliga.se/JavaScript/api/crud.php";
let requestBtn = document.getElementById("requestBtn");
let addBookBtn = document.getElementById("addBookBtn");
let addBookMessage = document.getElementById("addBookMessage");
let apiKey = document.getElementById("apiKey");
let receivedKey = "No key requested yet";

let titleBox = document.getElementById("titleBox");
let authorBox = document.getElementById("authorBox");

let listOfBooks = document.getElementById("listOfBooks");
let viewBookBtn = document.getElementById("viewBookBtn");
let viewResult = document.getElementById("viewResult");

let changeBtn = document.getElementById("changeBtn");

let deleteBtn = document.getElementById("deleteBtn");
let deleteBookId = document.getElementById("deleteBookID");
let deleteResult = document.getElementById("deleteResult");

let searchBtn = document.getElementById("searchBtn");
let searchBookTitleInput = document.getElementById("searchBookTitle");
let searchBookResult = document.getElementById("searchResult");
let addSearchBookResult = document.getElementById("addSearchBookResult");

let unsuccessfulCalls = document.getElementById("unsuccessfulCalls");
let unsuccessfulAPIcalls = 0;

requestBtn.addEventListener('click', function(event) {
    fetch(url + "?requestKey")
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        console.log("Request key Succeeded!");
        receivedKey = json.key;
        apiKey.innerHTML = receivedKey;
    })
    .catch(function(error) {
        console.log("Error!");
        unsuccessfulAPIcalls++;
    });
});

addBookBtn.addEventListener('click', function(event) {
    
    let title = titleBox.value;
    let author = authorBox.value;
    
    if(title == "" || author == "" || title == "" && author == ""){
        addBookMessage.innerHTML = "Please Enter valid input";
    }
    else{
        fetch(url + "?op=insert&key=" + receivedKey + "&title=" + title + "&author=" + author)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            if(json.status == "error") {
                addBookMessage.innerHTML = "<p>Error, Please try again!</p>";
                unsuccessfulAPIcalls++;
                unsuccessfulCalls.innerHTML = unsuccessfulAPIcalls;
            }
            else{
                addBookMessage.innerHTML = "<p>Book Stored with ID = " + json.id + "</p>";
            }
        });
    }
});

viewBookBtn.addEventListener("click", function(event) {
    fetch(url + "?op=select&key=" + receivedKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        
        if(json.status != "success"){
            while(listOfBooks.firstChild) {
            listOfBooks.removeChild(listOfBooks.firstChild);
        }
            unsuccessfulAPIcalls++;
            unsuccessfulCalls.innerHTML = unsuccessfulAPIcalls;
            viewResult.innerHTML = "Error, please try again!";
        }
        else{
            viewResult.innerHTML = "Success";
        while(listOfBooks.firstChild) {
            listOfBooks.removeChild(listOfBooks.firstChild);
        }
        
        for(let i = 0; i < json.data.length; i++){
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
                
            titleSpan.innerHTML = json.data[i].title;
            inbetweenSpan.innerHTML = " by ";
            authorSpan.innerHTML = json.data[i].author;
            idSpan.innerHTML = ", ID: " + json.data[i].id;
                
            titleSpan.addEventListener("click", function(event) {
                titleSpan.style.display = "none";
                titleInput.style.display = "inline";
            });
                
            titleInput.addEventListener("blur", function(event) {
                
                if(titleInput.value === ""){
                    titleSpan.innerHTML = "The Title";
                }
                else{
                    titleSpan.innerHTML = titleInput.value;
                }
                
                titleInput.style.display = "none";
                titleSpan.style.display = "inline";
                        
                fetch(url + "?op=update&key=" + receivedKey + "&id=" +
                json.data[i].id + "&title=" + titleSpan.innerHTML+ "&author=" + authorSpan.innerHTML)
                .then(function(response) {
                    return response.json();
                })
                .then(function(json){
                    if(json.status == "success"){
                        viewResult.innerHTML = "Changed Title";
                    }
                    else{
                        viewResult.innerHTML = "Try again!";
                        unsuccessfulAPIcalls++;
                        unsuccessfulCalls.innerHTML = unsuccessfulAPIcalls;
                    }
                });
            });
                
            authorSpan.addEventListener("click", function(event) {
                authorSpan.style.display = "none";
                authorInput.style.display = "inline";
            });
                
            authorInput.addEventListener("blur", function(event) {
                
                if(authorInput.value === ""){
                    authorSpan.innerHTML = "The Author";
                }
                else{
                    authorSpan.innerHTML = authorInput.value;
                }
                
                authorInput.style.display = "none";
                authorSpan.style.display = "inline";
                        
                fetch(url + "?op=update&key=" + receivedKey + "&id=" +
                json.data[i].id + "&title=" + titleSpan.innerHTML+ "&author=" + authorSpan.innerHTML)
                .then(function(response) {
                    return response.json();
                })
                .then(function(json){
                    if(json.status == "success"){
                        viewResult.innerHTML = "Changed Athour";
                    }
                    else{
                        viewResult.innerHTML = "Try again!";
                        unsuccessfulAPIcalls++;
                        unsuccessfulCalls.innerHTML = unsuccessfulAPIcalls;
                    }
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
});
});

deleteBtn.addEventListener("click", function(event) {
    let id = document.getElementById("deleteBookID").value;
    fetch(url + "?op=delete&key=" + receivedKey + "&id=" + id)
    .then(function(response) {
        console.log(response);
        return response.json();
    })
    .then(function(json) {
        if(json.status != "success"){
            deleteResult.innerHTML = "Error, please try again!";
            unsuccessfulAPIcalls++;
            unsuccessfulCalls.innerHTML = unsuccessfulAPIcalls;
        }
        else{
            deleteResult.innerHTML = "Book Deleted";
        }
    });
});

searchBtn.addEventListener("click", function(event) {
    let bookTitle = searchBookTitleInput.value;
    
    bookTitle = bookTitle.split(" ").join("+");
    
    console.log(bookTitle);
    
    let libUrl = "https://openlibrary.org/search.json?title=" + bookTitle;
    fetch(libUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(json) {
        console.log(json);
        
        while(searchBookResult.firstChild) {
            searchBookResult.removeChild(searchBookResult.firstChild);
        }
        for(let i = 0; i < 5; i++) {
            let newSearchNode = document.createElement("LI");
            let newButton = document.createElement("input");
            newSearchNode.className = "searchItem";
            newButton.className = "searchButton";
            newButton.type = "button";
            newButton.value = "Add this book"
            newSearchNode.innerHTML = "<p>" + json.docs[i].title + " by " + json.docs[i].author_name + "</p>";
            
            newButton.addEventListener("click", function(event) {
                let searchedBookTitle = json.docs[i].title;
                let searchedBookAuthor = json.docs[i].author_name;
                
                fetch(url + "?op=insert&key=" + receivedKey + "&title=" + searchedBookTitle + "&author=" + searchedBookAuthor)
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    if(json.status == "success"){
                        addSearchBookResult.innerHTML = "Book added";
                    }
                    else{
                        addSearchBookResult.innerHTML = "Error, please try again";
                        unsuccessfulAPIcalls++;
                        unsuccessfulCalls.innerHTML = unsuccessfulAPIcalls;
                    }
                });
                
            });
            
            newSearchNode.appendChild(newButton);
            searchBookResult.appendChild(newSearchNode);
        }
    });
});
