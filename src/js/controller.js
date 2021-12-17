/*Import Field*/
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { loadRecipe } from './model.js';
import { Fraction } from 'fractional';
import * as model from './model.js';     //MODEL
import recipeView from './view/recipeView.js'; //VIEW---recipe
import resultView from './view/resultView.js'; //VIEW---result
import searchView from './view/searchView.js'; //ViEW ---search; 
import View from './view/View.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import previewView from './view/previewView.js';


/*End Import Field*/


const recipeContainer = document.querySelector('.recipe');

const searchField = document.querySelector('search__field');


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipes = async function () {

  const id = window.location.hash.slice(1);

  if (!id) return;
  try {

    // 0. Update results view to mark selected search result; 
    resultView.update(model.getSearchResultPage());


    // 1.Render Spinner; 
    recipeView.renderSpinner();

    // 2. Get "Recipe" Data; 
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 3. Render recipe 
    recipeView.render(recipe);

    //4. Update bookmarks
    bookmarksView.update(model.state.bookmarks);

  }
  catch (error) {
    recipeView.renderError(error.message);
  }
}

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();



    // 1.Get query search from view; 
    const query = searchView.getQuery();
    if (!query) return;

    // 2.Get data from model; 
    await model.loadSearchResult(query);
    const { results } = model.state.search;
    console.log(results.length);

    // 3.Render result; 
    // resultView.render(results);
    resultView.render(model.getSearchResultPage());

    // 4.Render initial pagination buttons;
    paginationView.render(model.state.search);
  }
  catch (e) {
    console.log(e);
  }
}

const controlPagination = function (page) {
  // 1.Render result based on page
  resultView.render(model.getSearchResultPage(page));

  // 2.Render pagination buttons 
  paginationView.render(model.state.search);
}



const controlServings = function (newServings) {
  // Update the recipe servings (in state.recipe);
  model.updateServings(newServings);

  // Update UI 
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}


const controlAddBookmark = function () {
  //1.push recipe to Bookmark[]; 
  model.toggleBookmark(model.state.recipe);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

const controlBookmark = function () {
  if (localStorage?.getItem('booksmark')) {
    model.state.bookmarks = JSON.parse(localStorage.getItem('booksmark'));
    bookmarksView.render(model.state.bookmarks);
  }
}

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    addRecipeView.renderSpinner();

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render message; 
    setTimeout(function () {
      addRecipeView.renderMessage();
    }, 2000);

    // Close form window;
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 3000);

    // Render bookmark View; 
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL; 
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // 
  }
  catch (err) {
    console.log("😪", err);
    addRecipeView.renderError(err.message);
  }
}



const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);


  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);

  bookmarksView.addHandlerRender(controlBookmark);

  addRecipeView._addHandlerUpload(controlAddRecipe);

}



init();


