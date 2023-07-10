var showSavedBtn = document.querySelector("#show-btn");
var favListEl = document.querySelector("#fav-list");


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
                    var newTag = document.createElement("li");
                    newTag.textContent = data.title;
                    favListEl.appendChild(newTag);
                });
        }
    } else {
        return;
    }


});  