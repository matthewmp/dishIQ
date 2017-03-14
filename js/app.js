
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

function updateParameters(){	
	term = {};  // Clear previous values
	var dish = $('.dish-name').val();
	term.q = dish;

	if($('.max-calories').val()){
		var calories = parseInt($('.max-calories').val());
		term.calories = `lte ${calories}`  // Less than or equal to in terms of calories
	}

	var diet = $('.diet-requirements').val();
	if(diet){
		if(diet === 'vegan' || diet === 'vegetarian'){
			term.health = diet;
		} else {
			term.diet = diet;
		}		
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
		state.currentSearch.moveToPrevious();				
	} else {
		$('.no-results').fadeIn(2000);		
	}
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
		var cal = Math.ceil(val.recipe.calories / val.recipe.yield);	
		renderResultArticle(imgSrc, resultName, index, cal);
	})
}

function renderResultArticle(imgSrc, resultName, index, cal) {	 	 
	 $('.results-wrapper').append(`<article id='item-${index}' class='result-item'> 
	 			<span id='result-name'>${resultName}</span><a href='#'><img src=${imgSrc} /></a>
	 			<p class="results-cal">Calories: ${cal}</p> 
	 		</article>`);
	 renderView('results');

}

function renderClearResults(){
	$('.results-wrapper').empty();	
}

function renderPrevSearch(){	
	state.previousSearch.forEach(function(val, ind){
		var prev = val.searchTerm.q;		
		$(`<td id='prev-${ind}'>${prev}</td>`).appendTo('.prev-list');
	})
}

function renderPrevResults(state, ind){
	renderClearResults();
	state.previousSearch[ind].recipes.forEach(function(val, index){
	var imgSrc = val.recipe.image;		
	var resultName = val.recipe.label;
	var cal = Math.ceil(val.recipe.calories / val.recipe.yield);
	renderResultArticle(imgSrc, resultName, index, cal);
	$('.view-search').fadeOut();
	$('.item-background-overlay').hide()	
	$('.results-wrapper').fadeIn();		
	})
}

function renderShowItemInfo(index){	
	// Size and position item result overlay backdrop
	var height = $(document).height() + 1500;
	$('.item-background-overlay').css('height', height);
	$('.item-background-overlay').show();

	var dish = state.currentSearch.recipes[index].recipe;
	$('.item-info').empty();
	$('.item-result').show();
	$('.label').text(dish.label);

	// Format nutrition info from search results
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
		
	// Place formatted nutrition info into tables
	for(var key in nutSnapShot){
		$(`<tr> <td> ${key} </td> <td>${nutSnapShot[key].val}</td> <td>${nutSnapShot[key].unit}</td></tr>`).appendTo('.nutrition-snapshot');
	}
	$('.nutrition-snapshot').prepend('<tr><th>Snapshot</th></tr>')
	
	for(var key in nutRest){
		$(`<tr> <td> ${key} </td> <td>${nutRest[key].val}</td> <td>${nutRest[key].unit}</td></tr>`).appendTo('.nutrition-rest');
	}
	$('.nutrition-rest').prepend('<tr><th>Minerals</th></tr>');

	for(var key in nutVitamins){
		$(`<tr> <td> ${key} </td> <td>${nutVitamins[key].val}</td> <td>${nutVitamins[key].unit}</td></tr>`).appendTo('.nutrition-vitamins');
	}
	$('.nutrition-vitamins').prepend('<tr><th>Vitamins</th></tr>')

	dish.ingredientLines.forEach(function(val, ind){
		$('ol').append(`<li>${val}</li`);
		
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
		$('.view-search').fadeOut(500);
		$('.results-wrapper').show();
	})

	// Render Result for Individual Dish
	$('.results-wrapper').on('click', 'article', function(e){
		var elem = $(e.target).closest('article');
		var elemPos = elem.position();
		$('.dish-snapshot').css('margin-top', elemPos.top);		
		var elemIndex = elem.attr('id').slice(5);	
		renderShowItemInfo(elemIndex);		
		setTimeout(function(){
			$(window).scrollTop(elemPos.top - 100);
		}, 50); 		
	})


	// Close individual item result window
	$('.close-results').click(function(){		
		$('.item-result').hide();
		$('.item-background-overlay').hide();
	})


	// Toggle Previous Search Icon in Header
	$('.prevI').hover(function(){
	  if($('#prevI').attr('class') === 'fa fa-chevron-down'){
	   $('#prevI').removeClass('fa fa-chevron-down');
	   $('#prevI').addClass('fa fa-chevron-up')
	   renderPrevSearch();
	  }
	  else {
	    $('#prevI').removeClass('fa fa-chevron-up');
	    $('#prevI').addClass('fa fa-chevron-down'); 
	    $('prev-list').hide();
	    $('.prev-list').empty()
	  }   
	})

	$('.prevI').click(function(){
	  if($('#prevI').attr('class') === 'fa fa-chevron-down'){
	   $('#prevI').removeClass('fa fa-chevron-down');
	   $('#prevI').addClass('fa fa-chevron-up')
	   renderPrevSearch();

	  }
	  else if($('#prevI').attr('class') === 'fa fa-chevron-up'){
	    $('#prevI').removeClass('fa fa-chevron-up');
	    $('#prevI').addClass('fa fa-chevron-down'); 
	    $('prev-list').hide();
	    $('.prev-list').empty()
	  }   
	})

	// Toggle search view with magnify glass
	$('.mag').click(function(){
		$('.view-search').fadeIn();
		$('.results-wrapper').fadeOut();
		$('.no-results').hide();
		$('.item-result').hide();
		$('.item-background-overlay').hide();
		$('.no-results').hide();
	})

	// Search Previous Item
	$('.prev-list').on('click', 'td', function(e){		
		var target = e.target.closest('td');
		var index = target.getAttribute('id').slice(5);		
		renderPrevResults(state, index);
		state.currentSearch = state.previousSearch[index];
		$('.no-results').hide();
	})

	// Return Screen to Original View
	$('.banner').click(function(){
		$('.results-wrapper').hide();
		$('.view.results').hide();
		$('.view-search').show();
	})

	// Featured Dishes Event Listeners
	$("#one").click(function(){
		$(".dish-name").val('vegetarian pizza');
		$('.max-calories').val('500');
		$('.diet-requirements').val('vegetarian');
		$("#search-button").click();
	});

	$("#two").click(function(){
		$(".dish-name").val('Salad');
		$('.max-calories').val('100');
		$("#search-button").click();
	})

	$("#three").click(function(){
		$(".dish-name").val('pasta');
		$('.max-calories').val('400');
		$("#search-button").click();
	})

})
