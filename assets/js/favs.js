var showSavedBtn = document.querySelector("#show-btn");
var favListEl = document.querySelector("#fav-list");
var spoonacularKey = "c483c6abaa8c4cd59559ac1eb0ff2720";



//when user click on show button, it shows all favorite foods on screen
showSavedBtn.addEventListener('click', function () {

    //------------------------------------------------

var childNodes = favListEl.childNodes;
for (var i=childNodes.length - 1; i >= 0; i--){
    var childNode = childNodes[i]; 
    favListEl.removeChild(childNode);

}

//------------------------------------------------

    var likedFood = localStorage.getItem('isLiked');
    if (likedFood) {
        var arrayLikedFood = likedFood.split(',');
        console.log(typeof arrayLikedFood);

        for (var i = 0; i < arrayLikedFood.length; i++) {
            var userInput = arrayLikedFood[i];
            console.log(userInput);
            fetch(`https://api.spoonacular.com/recipes/${arrayLikedFood[i]}/information?apiKey=${spoonacularKey}`, {
                method: 'GET',
                credentials: 'same-origin',
                redirect: 'follow',
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    console.log(data.title);
                   
                    var recipeDiv = document.createElement("div");
                    recipeDiv.setAttribute("class", "recipe-card image-container");
                    recipeDiv.setAttribute("id", "custom-container");
                    var img = document.createElement('img');
                    var source = data.image;
                    img.setAttribute("src", source);
                    recipeDiv.appendChild(img);
                    var tag = document.createElement('a');
                    tag.setAttribute("href", "#");
                    tag.textContent = data.title;
                    recipeDiv.appendChild(tag);
                    favListEl.appendChild(recipeDiv);
                });
        }
    } else {
        return;
    }


});  