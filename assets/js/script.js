var searchBtnEl = document.querySelector(".search-btn");
var userInputEl = document.querySelector("#user-input");
var resultEl = document.querySelector("#result");
var descriptionEl = document.querySelector("#description");

function activateSearchBtn() {

    var childNodes = descriptionEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
      var childNode = childNodes[i];
      descriptionEl.removeChild(childNode);
    }
    var childNodes = resultEl.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
      var childNode = childNodes[i];
      resultEl.removeChild(childNode);
    }
    

    var userInput = userInputEl.value;
    // userInputEl.value = " ";

    console.log(userInput);
    var baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';
    var finalUrl = `${baseUrl}?query=${encodeURIComponent(userInput)}&apiKey=96dedef6d4244eee817b8f5cc4b3179f`;
    fetch(finalUrl, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.results.length);
            for (var i = 0; i < data.results.length; i++) {
                var tag = document.createElement('a');
                tag.setAttribute("href", "#");
                tag.setAttribute("style", "display: inline; margin-bottom:20px; margin-left:20px; margin-right:80px");
                tag.setAttribute("data-id", data.results[i].id);
                tag.textContent = data.results[i].title;
                console.log(data.results[i].title);
                var img = document.createElement('img');
                var source = data.results[i].image
                img.setAttribute("src", source);
                resultEl.appendChild(img);
                resultEl.appendChild(tag);
            }
        });
        
}

resultEl.addEventListener("click", function (event) {
    var childNodes = descriptionEl.childNodes;
    
    for (var i = childNodes.length - 1; i >= 0; i--) {
      var childNode = childNodes[i];
      descriptionEl.removeChild(childNode);
    }
    
    var element = event.target;

    if (element.matches("a") === true) {
        var inputId = element.getAttribute("data-id");
        console.log(inputId);
    }
    fetch(`https://api.spoonacular.com/recipes/${inputId}/information?apiKey=96dedef6d4244eee817b8f5cc4b3179f`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.extendedIngredients.length);

            for (var i = 0; i < data.extendedIngredients.length; i++) {
                var ingreLine = document.createElement('p');
                ingreLine.textContent = data.extendedIngredients[i].original;
                descriptionEl.appendChild(ingreLine);
            }
        });
    fetch(`https://api.spoonacular.com/recipes/${inputId}/analyzedInstructions?apiKey=96dedef6d4244eee817b8f5cc4b3179f`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data[0].steps.length);
            for (var i = 0; i < data[0].steps.length; i++) {
                var descLine = document.createElement('span');
                descLine.textContent = data[0].steps[i].step;
                descriptionEl.appendChild(descLine);
            }
        });

});



searchBtnEl.addEventListener('click', activateSearchBtn);