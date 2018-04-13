// Global app controller
//cbddad34f36fad23632da76adb29d37a
import axios from 'axios';

async function getResults(){
    try{
        const key = 'cbddad34f36fad23632da76adb29d37a';
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const res =await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
    }catch(error) {
        alert(error);
    }
}