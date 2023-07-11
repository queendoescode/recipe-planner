var showSavedBtn = document.querySelector("#show-btn");
var favListEl = document.querySelector("#fav-list");



//when user click on show button, it shows all favorite foods on screen
showSavedBtn.addEventListener('click', function () {

    var likedFood = localStorage.getItem('isLiked');
    if (likedFood) {
        var arrayLikedFood = likedFood.split(',');
        console.log(arrayLikedFood);

        for (var i = 0; i < arrayLikedFood.length; i++) {
            var userInput = arrayLikedFood[i];
            console.log(userInput);
            fetch(`https://api.spoonacular.com/recipes/${arrayLikedFood[i]}/information?apiKey=4b9fe343ff764f7494d88321c248a6ee`, {
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