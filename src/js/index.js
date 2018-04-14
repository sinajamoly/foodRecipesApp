// Global app controller
//cbddad34f36fad23632da76adb29d37a
import Search from './models/Search';
import {elements} from './views/base';
import {renderLoader, clearLoader} from "./views/base";
import Recipe from './models/Recipe';
import * as SearchView from './views/searchView';
const state={};

const controlSearch=async ()=>{
    //1) get the query from the view
        const query = SearchView.getInput();
        if(query){
   //2)new search object and add to the stage
            state.search = new Search(query);
   //3)prepare ui for results
            SearchView.clearInput();
            SearchView.clearResults();
            renderLoader(elements.searchRes);
   //4)Search for recipes
            try{
                await state.search.getResults();
                //5)render result to the ui
                clearLoader();
                SearchView.renderResult(state.search.result);
                console.log(state.search.result);
            }catch (error){
                clearLoader();
                alert('something wrong with the search...');
            }

        }
}

elements.searchForm.addEventListener('submit',event=>{
    event.preventDefault();
    controlSearch();
});

// window.addEventListener('load',event=>{
//     event.preventDefault();
//     controlSearch();
// });

const search =new Search('pizza');
search.getResults();


elements.searchResPages.addEventListener('click' , e=>{
    const btn = e.target.closest('.btn-inline')
    console.log(btn);
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        SearchView.clearResults();
        SearchView.renderResult(state.search.result , goToPage , 10)
        console.log(goToPage);
    }
});

const controlRecipe=async ()=>{
    const id =window.location.hash.replace('#' , '');
    console.log(id);
    if(id){
        //1)prepare UI for change
        //2)Create new recipe object
        state.recipe =new Recipe(id);
        //Test
        // window.r=state.recipe;
        //3)get recipe data
        try{
            await state.recipe.getReciepe();
            state.recipe.parseIngredients();
            //4)calculate serving and time
            state.recipe.calcServing();
            state.recipe.calcTime();
            //5)render recipe
        }catch(error){
            alert('Error processing recipe!');
        }

        // console.log(state.recipe);
    }
}
window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load' , controlRecipe);

