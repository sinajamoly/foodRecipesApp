// Global app controller
//cbddad34f36fad23632da76adb29d37a
import Search from './models/Search';
import {elements} from './views/base';
import {renderLoader, clearLoader} from "./views/base";
import Recipe from './models/Recipe';
import Likes from './models/Likes';
import * as SearchView from './views/searchView';
import * as recipeView from "./views/recipeView";
import List from "./models/List";
import * as listView from './views/listView';
import * as likesView from './views/likesView';


const state={};

const controlList = () =>{
    if(!state.list) state.list =new List();

    //add each ingredient to the list
    state.recipe.ingredient.forEach(el=>{
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
        console.log(item);
    });
}


const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const currentID =state.recipe.id;

    if(!state.likes.isLiked(currentID)){
        const newLike =state.likes.addLike(currentID,state.recipe.title,state.recipe.author, state.recipe.img);
        //toggle the button
        likesView.toggleLikebtn(true);
        //add likes to the UI list
        likesView.renderLike(newLike);
    }else{
        //remove like
        state.likes.deleteLike(currentID);
        //toggle the button
        likesView.toggleLikebtn(false);
        //remove  likes to the UI list

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

elements.shopping.addEventListener('click' , e=>{
   const id =e.target.closest('.shopping__item').dataset.itemid;

   //handle delete
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);
        //Delete From UI
        listView.deleteItem(id);
        console.log(id);
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id,val);
    }
});






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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //heighlight selected search item
        if(state.search){
            SearchView.highLightSelected(id);
        }
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
            clearLoader();
            //console.log(state.recipe);
            recipeView.renderRecipe(state.recipe,false);
        }catch(error){
            alert(error);
        }


    }
}
window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load' , controlRecipe);

// recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredient(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //increase clicked
        state.recipe.updateServings('inc');
        //decrease clicked
        recipeView.updateServingIngredient(state.recipe);
    }else if(e.target.matches('.recipe__btn--add , .recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love , .recipe__love *')){
        // Like controller
        controlLike();
    }
    //console.log(state.recipe);
})

