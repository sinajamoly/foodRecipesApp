export default class Search{
    constructor(query){
        this.query= query;
    }


    async getResults(query){
        try{
            const key = 'cbddad34f36fad23632da76adb29d37a';
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const res =await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);
            const recipes = res.data.recipes;
            console.log(recipes);
        }catch(error) {
            alert(error);
        }
    }
}