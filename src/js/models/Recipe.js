import axios from 'axios';
import {proxy,key} from "../config";

export default class Recipe{
    constructor(id){
        this.id=id;
    }

    async getReciepe(){
        try{
            const res =await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredient=res.data.recipe.ingredients;
            // console.log(res);
        }catch (error){
            alert("Something went wrong :(");
        }
    }

    calcTime(){
        const numIng = this.ingredient.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15
    }

    calcServing(){
        this.servings = 4;
    }

    parseIngredients(){
       const unitsLong = ['tablespoon','tablespoons', 'ounces' , 'ounce' ,'teaspoon','teaspoons','cups','pounds'];
       const unitsShort = ['tbsp','tbsp','os','os','tsp','tsp', 'cup','pound'];

       const newIngredients = this.ingredient.map(el=>{
           //1)uniform units
                let ingredient=el.toLowerCase();
                unitsLong.forEach((unit,i)=>{
                    ingredient = ingredient.replace(unit , unitsShort[i]);
                })
           //2)remove prenteses
                ingredient=ingredient.replace(/ *\([^)]*\)*/g,' ');
           //3)
                const arrIng = ingredient.split(' ');
                const unitIndex = arrIng.findIndex(el2 =>{
                   return unitsShort.includes(el2);
                });
                let objIng;
                if(unitIndex > -1){
                    //there is a unit
                    const arrCount= arrIng.slice(0,unitIndex);
                    let count;
                    if(arrCount.length === 1){
                        count = eval(arrIng[0].replace('-','+'));
                    }else{
                        count=eval(arrIng.slice(0,unitIndex).join('+'));
                    }
                    objIng ={
                        count,
                        unit: arrIng[unitIndex],
                        ingredient: arrIng.slice(unitIndex + 1).join(' ')
                    }
                }else if(parseInt(arrIng[0],10)){
                    //there is no unit but 1st element is number
                    objIng={
                        count: parseInt(arrIng[0],10),
                        unit: '',
                        ingredient: arrIng.slice(1).join(' ')
                    }
                }else if(unitIndex === -1){
                    //there is no unit and no number
                    objIng = {
                        count: 1,
                        unit: '',
                        ingredient
                    }
                }
                return objIng;
           //4)
           //5)
       });
       this.ingredient=newIngredients;
    }

    updateServings(type){
        const newServing = type == 'dec' ? this.servings - 1 : this.servings +1;

        //ingredient
        this.ingredient.forEach(ing =>{
            ing.count = ing.count * (newServing / this.servings );
        });

        this.servings = newServing;
    }
}