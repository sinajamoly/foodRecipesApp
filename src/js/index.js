// Global app controller
//cbddad34f36fad23632da76adb29d37a
import Search from './models/Search';
import {elements} from './views/base';
import {renderLoader, clearLoader} from "./views/base";
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
            await state.search.getResults();
   //5)render result to the ui
            clearLoader();
            SearchView.renderResult(state.search.result);
            console.log(state.search.result);
        }
}

elements.searchForm.addEventListener('submit',event=>{
    event.preventDefault();
    controlSearch();
});

const search =new Search('pizza');
search.getResults();
