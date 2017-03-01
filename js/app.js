
var state = {
	
	currentSearch: '',
	previousSearch: []
	
}

var term = {};

/*		Search Functions		*/


function Search(term, recipes, imgUrl) {
	this.searchTerm = term,
	this.recipes = recipes,
	this.imgUrl = imgUrl,
	this.moveToPrevious = function(){
		var str = JSON.stringify(state.currentSearch);
		state.previousSearch.push(JSON.parse(str));
	}
}
/*
Search.prototype.moveToPrevious = function(){
	state.previousSearch.push(JSON.stringify(this));
}
*/

function updateParameters(){	
	term = {};
	var dish = $('.dish-name').val();
	term.q = dish;


	if($('.max-calories').val()){
		var calories = parseInt($('.max-calories').val());
		term.calories = `lte ${calories}`
	}


	var diet = $('.diet-requirements').val();
	if(diet){
		term.dietLabels = diet;
	}



	var health = $('.health-requirements').val();
	if(health){
		term.healthLabels = health;
	}	
	sendRequest();
	
}

function sendRequest(){	

	var parameters =  {
			app_id: 'c0974266',
	        app_key: 'b92e082d024a831f4498e4eaab7d7b7b',
	        q: '',
	        to: 100              	        
		}


	var request = Object.assign(parameters, term)	

 	$.ajax({
    	url: 'https://api.edamam.com/search',
    	data: request,
    	dataType: 'JSONP',
    	jsonpCallback: 'callBack'    	
    })

    
}


function callBack(data){
	
	if(data.hits.length !== 0){
		$('.no-results').hide();
		recipes = data.hits;				
		state.currentSearch = new Search(term, recipes, recipes[0].recipe.image);	
		renderResults(state);					
	} else {
		$('.no-results').show();		
	}
}

function loadNutrition(state){

}

/*		Render Functions		*/


// Show View by Class Name
function renderView(view){
	
	$('.view.' + view).show();
}

function renderResults(state){
	state.currentSearch.recipes.forEach(function(val, index){
		var imgSrc = val.recipe.image;		
		var resultName = val.recipe.label;
		renderResultArticle(imgSrc, resultName, index);
		
	})
}

function renderResultArticle(imgSrc, resultName, index) {	 
	 $('.results-wrapper').append(`<article id="item-${index}" class="result-item"> <span id="result-name">${resultName}</span><a href="#"><img src=${imgSrc} /></a> </article>`);
	 renderView('results');

}

function renderClearResults(){
	$('.results-wrapper').empty();	
}

function renderShowItemInfo(index){	

	// size and position item result overlay backdrop
	var height = $(document).height();
	$('.item-background-overlay').css('height', height);
	$('.item-background-overlay').show();


	var dish = state.currentSearch.recipes[index].recipe;
	$('.item-info').empty();
	$('.item-result').show();
	$('.label').text(dish.label);

	var nutSnapShot = {
		calories : { val: Math.ceil(dish.calories / dish.yield), unit: '' },
		fat : { val: Math.ceil(dish.digest[0].total), unit: dish.digest[0].unit },
		carbs : { val: Math.ceil(dish.digest[1].total), unit: dish.digest[1].unit },
		protein : { val: Math.ceil(dish.digest[2].total), unit: dish.digest[2].unit },
		cholesterol : { val: Math.ceil(dish.digest[3].total), unit: dish.digest[3].unit },
	}

	var nutRest = {
		sodium : { val: Math.ceil(dish.digest[4].total), unit: dish.digest[4].unit },
		calcium : { val:  Math.ceil(dish.digest[5].total), unit: dish.digest[5].unit },
		mag : { val: Math.ceil(dish.digest[6].total), unit: dish.digest[6].unit },
		potass : { val:  Math.ceil(dish.digest[7].total), unit: dish.digest[7].unit },
		iron :  { val: Math.ceil(dish.digest[8].total), unit: dish.digest[8].unit },
		zinc : { val: Math.ceil(dish.digest[9].total), unit: dish.digest[9].unit },
		phosphorus : { val: Math.ceil(dish.digest[10].total), unit: dish.digest[10].unit },
	}

	var nutVitamins = {
		A : { val: Math.ceil(dish.digest[11].total), unit: dish.digest[11].unit },
		C : { val: Math.ceil(dish.digest[12].total), unit: dish.digest[12].unit },
		B1: { val: Math.ceil(dish.digest[13].total), unit: dish.digest[13].unit },
		B2: { val: Math.ceil(dish.digest[14].total), unit: dish.digest[14].unit },
		B3: { val: Math.ceil(dish.digest[15].total), unit: dish.digest[15].unit },
		B6: { val: Math.ceil(dish.digest[16].total), unit: dish.digest[16].unit },
		Folate: { val: Math.ceil(dish.digest[17].total), unit: dish.digest[17].unit },
		B12: { val: Math.ceil(dish.digest[18].total), unit: dish.digest[18].unit },
		D: { val: Math.ceil(dish.digest[19].total), unit: dish.digest[19].unit },
		E: { val: Math.ceil(dish.digest[20].total), unit: dish.digest[20].unit },
		K: { val: Math.ceil(dish.digest[21].total), unit: dish.digest[21].unit },
	}
		

	for(var key in nutSnapShot){
		$(`<tr> <td> ${key} </td> <td>${nutSnapShot[key].val}</td> <td>${nutSnapShot[key].unit}</td></tr>`).appendTo('.nutrition-snapshot')
	}
	$('.nutrition-snapshot').prepend('<tr><th>Snapshot</th></tr>')
	
	for(var key in nutRest){
		$(`<tr> <td> ${key} </td> <td>${nutRest[key].val}</td> <td>${nutRest[key].unit}</td></tr>`).appendTo('.nutrition-rest')
	}
	$('.nutrition-rest').prepend('<tr><th>Minerals</th></tr>')

	for(var key in nutVitamins){
		$(`<tr> <td> ${key} </td> <td>${nutVitamins[key].val}</td> <td>${nutVitamins[key].unit}</td></tr>`).appendTo('.nutrition-vitamins')
	}
	$('.nutrition-vitamins').prepend('<tr><th>Vitamins</th></tr>')

	dish.ingredientLines.forEach(function(val, ind){
		$('ol').append(`<li>${val}</li`)//.appendTo('.ingredients ul');
		
	})

	$('.item-image').attr('src', dish.image);

	$('.link').attr('href', dish.url);
}






/*		Event Listeners		*/
$(function(){	
	// Submit User's Search
	$('.search-form').submit(function(e){
		e.preventDefault();
		updateParameters();
		renderClearResults();
		$('.dish-name').val('');
	})

	// Render Result for Individual Dish
	$('.results-wrapper').on('click', 'article', function(e){
		var elem = $(e.target).closest('article');
		var elemPos = elem.position();
		$('.dish-snapshot').css('margin-top', elemPos.top);
		console.log(elemPos.top)
		var elemIndex = elem.attr('id').slice(5);	
		renderShowItemInfo(elemIndex);		


		setTimeout(function(){
			$(window).scrollTop(elemPos.top + 350);
		}, 50); 
		

		
	})


	//close individual item result window
	$('.close-results').click(function(){		
		$('.item-result').hide();
		$('.item-background-overlay').hide();
	})

})














