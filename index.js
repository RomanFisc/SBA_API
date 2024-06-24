document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('recipe')
  const formError = document.getElementById("form-error");
  const clear = document.querySelector(".clear")

  clear.style.display = 'none'

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const diet = document.querySelector('select').value;
    if (diet === 'none') {
        formError.textContent = 'Please select a diet type.';
    } else {
      if (window.confirm(`Are you sure you want to get a recipe with a ${diet} preference?`)){
        getRecipe(diet);
      } else {
        window.alert("Please select a different diet preference")
        formError.textContent = 'Select a diet type.';
      }
    }
  });

  function getRecipe(dietPreference) {
      const applicationId = '968509fe';
      const applicationKey = 'd6ce1fe3e7091aa8c5fd6f6dee111055';
      const baseUrl = 'https://api.edamam.com/search';
      const url = `${baseUrl}?q=&app_id=${applicationId}&app_key=${applicationKey}&health=${dietPreference}`;

      fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.hits && data.hits.length > 0) {
                const randomRecipe = data.hits[Math.floor(Math.random() * data.hits.length)].recipe;
                displayRecipe(randomRecipe);
            } else {
                throw new Error('No recipes found for the selected dietary restriction.');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe:', error);
            formError.textContent = 'An error occurred while fetching the recipe. Please try again later.';
        });
      }

  function displayRecipe(recipe) {
      clear.style.display = 'block'

      formError.textContent = '';
  
      let recipeBox = document.getElementById('recipe-output')
      recipeBox.innerHTML = ''; 


      let title = document.createElement('h2')
      title.textContent = recipe.label
      recipeBox.appendChild(title)

      let ingredients = document.createElement('ul')
      recipe.ingredientLines.forEach(element => {
        let ingredientItem = document.createElement('li')
        ingredientItem.textContent = element
        ingredients.appendChild(ingredientItem)
      });
      recipeBox.appendChild(ingredients)

      let link = document.createElement('a')
      link.href = recipe.url
      link.textContent = "Recipe Link"
      recipeBox.appendChild(link)
      recipeBox.style.display = "block"

      clear.addEventListener('click', (function() {
        recipeBox.style.display = 'none'
        clear.style.display = 'none'
      }))
    
  }

});

