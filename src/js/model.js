
import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helper.js';

export const state = {
    recipe: {},

    search: {
        results: [],
        query: "",
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE,
    },

    bookmarks: [],
}


const createRecipeObject = function (data) {
    let { recipe } = data.data;
    //Trả về Object recipe có { id,title,pulisher,sourceUrl,image,servings,cookingTime,ingredints}
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    };
}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);

        state.recipe = createRecipeObject(data);

        const bookmarked = state.bookmarks.some(bookmark => {
            return state.recipe.id === bookmark.id;
        })

        state.recipe.bookmarked = bookmarked;


    }
    catch (err) {
        throw new Error(err);
    }
}


export const loadSearchResult = async function (query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key }),
            }
        })

        state.search.page = 1;


    }
    catch (err) {
        throw new Error(err.message);
    }
}

export const getSearchResultPage = function (page = state.search.page) {
    const resultsPerPage = state.search.resultsPerPage;

    state.search.page = page;
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;


    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        if (!ing.quantity) return;
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    // update state
    state.recipe.servings = newServings;
}

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    // if (recipe.id === state.recipe.id) {
    // }

    state.recipe.bookmarked = true;
}

const persistBookmarks = function () {
    localStorage.setItem('booksmark', JSON.stringify(state.bookmarks));
}


export const toggleBookmark = function (recipe) {
    // TH1: have bookmaked; 
    console.log('recipe.bookmarked', recipe.bookmarked);
    if (recipe.bookmarked) {

        const index = state.bookmarks.findIndex(bookmark => bookmark.id === recipe.id);

        // Update 
        state.bookmarks.splice(index, 1);
        state.recipe.bookmarked = false;
    }

    // Th2: have not bookmarked; 
    else {

        // Update
        state.recipe.bookmarked = true;
        state.bookmarks.push(recipe);
    }
    //Store to localStorage; 
    persistBookmarks();
}

export const uploadRecipe = async function (newRecipe) {
    // Upload 
    try {

        // Create ingredient from "newRecipe input"
        const ingredients = Object
            .entries(newRecipe)
            .filter(entry => {
                if (entry[0].includes('ingredient') && entry[1] !== '') return entry;
            })
            .map(ing => {
                const ingArr = ing[1].replaceAll(' ', '').split(',');
                //If split not enought or getter than 3 => throw error; 
                if (ingArr.length !== 3) throw new Error('Wrong ingredient format, Please use the correct format');

                [quantity, unit, description] = ingArr;

                return { quantity: quantity ? Number(quantity) : null, unit, description };
            })
        // End Create ingredient from "newRecipe input"

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);

        addBookmark(state.recipe);
        persistBookmarks();
    }
    catch (err) {
        throw new Error(err);
    }
}





