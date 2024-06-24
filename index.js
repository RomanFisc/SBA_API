document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('recipe');
    const formError = document.getElementById("form-error");
    const clear = document.getElementById('clear');
    const recipeList = document.getElementById('recipe-list');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    clear.style.display = 'none';

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const diet = document.querySelector('select').value;
        if (diet === 'none') {
            formError.textContent = 'Please select a diet type.';
        } else {
            if (window.confirm(`Are you sure you want to get a recipe with a ${diet} preference?`)){
                currentPage = 1; 
                try {
                    await getRecipes(diet);
                } catch (error) {
                    console.error('Error fetching recipes:', error);
                    formError.textContent = 'An error occurred while fetching the recipes. Please try again later.';
                }
            } else {
                window.alert("Please select a different diet preference.")
                formError.textContent = 'Select a diet type.';
            }
        }
    });

    let currentPage = 1;
    const perPage = 7; 
    let totalRecipes = 0;

    async function getRecipes(dietPreference) {
        const applicationId = '968509fe'; // Replace with your Edamam app ID
        const applicationKey = 'd6ce1fe3e7091aa8c5fd6f6dee111055'; // Replace with your Edamam app key
        const baseUrl = 'https://api.edamam.com/search';
        const from = (currentPage - 1) * perPage + 1;
        const to = currentPage * perPage;

        const url = `${baseUrl}?q=&app_id=${applicationId}&app_key=${applicationKey}&health=${dietPreference}&from=${from}&to=${to}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
            totalRecipes = data.count; 
            displayRecipes(data.hits);
            updatePagination();
        } else {
            throw new Error('No recipes found for the selected dietary restriction.');
        }
    }

    function displayRecipes(recipes) {
        recipeList.innerHTML = '';
        clear.style.display = 'block';
        recipes.forEach(hit => {
            const recipe = hit.recipe;
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <h3>${recipe.label}</h3>
                <img src="${recipe.image}" alt="${recipe.label}" />
                <p>${recipe.source}</p>
                <a href="${recipe.url}" target="_blank">View Recipe</a>
            `;
            recipeList.appendChild(recipeCard);
        });
        document.getElementById('recipe-output').style.display = 'block';
    }

    function updatePagination() {
        if (currentPage === 1) {
            prevPageBtn.disabled = true;
        } else {
            prevPageBtn.disabled = false;
        }

        const totalPages = Math.ceil(totalRecipes / perPage);
        if (currentPage >= totalPages) {
            nextPageBtn.disabled = true;
        } else {
            nextPageBtn.disabled = false;
        }
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            getRecipes(document.querySelector('select').value);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(totalRecipes / perPage);
        if (currentPage < totalPages) {
            currentPage++;
            getRecipes(document.querySelector('select').value);
        }
    });

    clear.addEventListener('click', () => {
        document.getElementById('recipe-output').style.display = 'none';
        clear.style.display = 'none';
    });
});