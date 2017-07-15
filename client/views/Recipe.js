import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import HeaderMenu from '../components/HeaderMenu';

class RenderArray extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recipeName: []
		}

	}
	render() {
		const listRecipes = this.props.results.map((dict) =>
			<li key={dict.UID}><Link to={'/recipe/' + dict.UID}>
			{dict.recipeName} - {dict.recipe}
			</Link></li>
		);
		return(
			<ul>
			{listRecipes}
			</ul>
		);
	}


}

class RenderRecipe extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div>
			{this.props.recipe.split('\n').map(function(item, index) {
		  		return (
		    		<span key={index}>
		      		{item}
		      		<br/>
		    		</span>
		  		)
			})}
			</div>
			);
	}
}

class RenderIngredients extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const listIngredients = this.props.ingredients.map((item, index) =>
			<span key={index}>
				{this.props.amountsParsed[index]}{this.props.amounts[index]}    {item} <br />
			</span>
		);

		return(
			<div>
				{listIngredients}
			</div>
		);
	}

}

class RenderImg extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const listImg = this.props.img.map((item, index) =>
			<img src={'../public/uploads/' + item} alt="404.png" key={index} id="recipeImg"/>
		);
		return(
			<div className="recipeImg" id="imgContainer">
				{listImg}
			</div>
		);
	}
}



class ShowRecipeList extends React.Component {
	constructor(props){
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = {
			ingredients: [],
			amount: [],
			amountParsed: [],
			recipe: "",
			recipeName: "",
			servings: "",
			imgPath: [],
			servingsValue: "",
			servingsCalculated: []
		}
	}

	componentDidMount () {
		console.log(this.props.params.UID);
		$.ajax ({
	      method: 'GET',
	      url: "http://localhost:3333/recipes/" + this.props.params.UID,
	      success: (data) => {
	      	var tempIngredients = [];
	      	var tempAmounts = [];
	      	var tempAmountsParsed = [];
	      	var tempImgpath = [];
	      	var tempRegex = "";
	        for (var i = 0; i < data[1].length; i++) {
	        	tempIngredients = tempIngredients.concat(data[1][i]['ingredient_name']);
        		tempAmounts = tempAmounts.concat(data[1][i]['ingredient_amount'].replace(/[0-9,]/g, ''));
        		tempRegex = data[1][i]['ingredient_amount'].replace(/([^0-9,])/g,'');
        		tempAmountsParsed = tempAmountsParsed.concat(tempRegex.replace(/[,]/g,'.'));
		    }
		    for (var i = 0; i < data[2].length; i++) {
		    	tempImgpath = tempImgpath.concat(data[2][i]['imagePath'])
		    }
		    this.setState({
		    	recipeName: data[0][0]['recipeName'],
	        	recipe: data[0][0]['recipeDescription'],
	        	servings: data[0][0]['servings'],
	        	servingsValue: data[0][0]['servings'],
		    	ingredients: tempIngredients,
		    	amount: tempAmounts,
		    	amountParsed: tempAmountsParsed,
		    	servingsCalculated: tempAmountsParsed,
		    	imgPath: tempImgpath
		    });
	      }
	    });
	}

	onChange (e) {
		var int = this.state.servingsValue;
		var newAmountParsed = [];
		var checkValue;
		if (e.target.value == 0){
			checkValue = int;
		} else {
			checkValue = e.target.value;
		}
		this.setState({servingsValue: checkValue});
		for (var i = 0; i < this.state.amountParsed.length; i++) {
			//newAmountParsed[i] = ((this.state.amountParsed[i] / int) * checkValue).toFixed(2);
			newAmountParsed[i] = ((checkValue / this.state.servings) * this.state.amountParsed[i]).toFixed(2);
			
		};
		this.setState({servingsCalculated: newAmountParsed});

	}


	render(){
		return(
			<div id="recipeContent"> 
			<HeaderMenu ref="searchBar"/>
			<div id="recipeName">
				<h2>
					{this.state.recipeName}
				</h2>
			</div>
			<div id="recipe">
				<h3>
					Slik gjør du: <br/>
				</h3>
				<RenderRecipe recipe={this.state.recipe} />
				<br />
				<br />
				<br />
				<RenderImg img={this.state.imgPath} />
				<RenderImg img={this.state.imgPath} />
				<RenderImg img={this.state.imgPath} />
			</div>


			<div id="ingredients">
				<h3>
				Ingredienser: 
				<br/>
				</h3>
				<input type="number" onChange={this.onChange} value={this.state.servingsValue} id="inputServings"/>
				<RenderIngredients ingredients={this.state.ingredients} amounts={this.state.amount} amountsParsed={this.state.servingsCalculated}/>
			</div>
			
			
			
			</div>
			);
	}
}
module.exports = ShowRecipeList;