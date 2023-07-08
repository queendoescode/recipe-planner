

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
    var finalUrl = `${baseUrl}?query=${encodeURIComponent(userInput)}&apiKey=8229129838cf4de5b38ad3b9facd00f8`;
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
    fetch(`https://api.spoonacular.com/recipes/${inputId}/information?apiKey=8229129838cf4de5b38ad3b9facd00f8`, {
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

            computeCalories(data);
        });
    fetch(`https://api.spoonacular.com/recipes/${inputId}/analyzedInstructions?apiKey=8229129838cf4de5b38ad3b9facd00f8`, {
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

// ----- Queen Start

// CalorieNinjas API
var calorieNinjasKey = "t1JgrLUNfPPtvjjAKrN40A==YNBpxRyU6VgWySYh";
var calorieNinjasUrl = "https://api.calorieninjas.com/v1/nutrition";

var totalCalories = 0;

function getNutritionPromise(item, caloriesHeading) {
    // Some recipes use fractions e.g. "1/4", so make sure 
    // this will be computed in calorie count.
    var queryText = item.original;
    var fraction = 1.0;
    if (item.amount < 1) {
        fraction = item.amount;
        queryText = `1 ${item.unit} ${item.originalName}`;
    }
    // Some recipes use cup for solid ingredients which produces a wrong calorie figure
    // but we can convert to ounces (oz). Also handles fractional cups (e.g. "1/4").
    if (item.unit == "cup" || item.unit == "cups") {
        fraction = 8 * item.amount;
        queryText = `1 oz ${item.originalName}`;
    }

    queryText = queryText.replace(" ml", "ml").replace(" gr.", "g"); 

    return fetch(`${calorieNinjasUrl}?query=${queryText}`, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'follow', 
        headers: {
            "X-Api-Key": calorieNinjasKey
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var calories = 0;
        if (data.items.length > 0) {
            // Some ingredients are "to taste" or do not have a quantity; skip these in our total.
            // (e.g. "salt and pepper to taste")
            if (item.unit !== "servings" && item.unit !== "serving") {
                calories = data.items[0].calories * fraction;
                totalCalories = totalCalories + calories;
            }

            caloriesHeading.textContent = `${Math.round(totalCalories)} Calories total`;
        }
        console.log(`${item.original}  Calories: ${calories}  (${item.unit})`)
        return calories;
    });
}

function computeCalories(data) {
    totalCalories = 0;

    // Add up calories for each ingredient
    // and display on page in a heading
    var caloriesHeading = document.createElement('h3');
    descriptionEl.appendChild(caloriesHeading);

    for (var i = 0; i < data.extendedIngredients.length; i++) {
        var ingreLine = document.createElement('p');
        ingreLine.textContent = data.extendedIngredients[i].original;
        descriptionEl.appendChild(ingreLine);

        getNutritionPromise(data.extendedIngredients[i], caloriesHeading)
            .then(calories => {
                ;
            });
    }
}
