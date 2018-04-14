import {elements} from "./base";

export const getInput = ()=>elements.searchInput.value;

export const clearInput=() => {
    elements.searchResList.value = '';
};

export const clearResults = ()=>{
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML='';
}

const limitRecipesTitle = (title, limit = 17)=>{
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, current)=>{
            if(acc + current.length<=limit){
                newTitle.push(current);
            }
            return acc + current.length;
        },0);
        return `${newTitle.join(' ')} ...`
    }
    return title;
}

export const highLightSelected = id =>{
    const resultsArr =Array.from(document.querySelectorAll(".results__link"));
    resultsArr.forEach(el => {
        el.classList.remove("results__link--active");
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

const renderRecipe =recipe=>{
    const markup = `
        <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipesTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
       </li>  
    `;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
}

const createButton = (page, type) =>{
    return ` <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1: page + 1 }>
                    <span>${type === 'prev' ? page - 1: page + 1 }</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right' }"></use>
                    </svg>
             </button>
                `;
}

const renderButtons = (page , numResults, resPerPage) => {
    let button;
    const pages = Math.ceil(numResults / resPerPage);
    if(page === 1){
        button=createButton(page , 'next');
    }else if(page === pages){
        button=`${createButton(page , 'prev')}${createButton(page , 'next')}`;
    }else if(page < pages){
        button=createButton(page , 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}

export const renderResult = (recipes, page = 1, resPerPage = 10 ) =>{
    //render results of the current page
    const start = (page - 1) * resPerPage;
    const end = (page) * resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
}