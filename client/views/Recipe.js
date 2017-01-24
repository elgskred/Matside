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
			<img src={'../public/uploads/' + item} alt="404" key={index} />
		);
		return(
			<div className="recipeImg">
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
			servings: 2,
			imgPath: []
		}
	}

	componentDidMount () {
		console.log(this.props.params.UID);
		$.ajax ({
	      method: 'GET',
	      url: "http://awesomesauce-gaming.net:3333/recipes/" + this.props.params.UID,
	      success: (data) => {
	        for (var i = 0; i < data[0].length; i++) {
	        	this.setState({recipeName: this.state.recipeName.concat(data[0][i]['recipeName'])});
	        	this.setState({recipe: this.state.recipe.concat(data[0][i]['recipe'])});
		    }
	        for (var i = 0; i < data[1].length; i++) {
	        	this.setState({ingredients: this.state.ingredients.concat(data[1][i]['ingredient'])});
	        	this.setState({amount: this.state.amount.concat(data[1][i]['amount'].replace(/[0-9]/g, ''))});
	        	this.setState({amountParsed: this.state.amountParsed.concat(data[1][i]['amount'].replace(/[^0-9]/g,''))})
		    }
		    for (var i = 0; i < data[2].length; i++) {
		    	this.setState({imgPath: this.state.imgPath.concat(data[2][i]['imgPath'])});
		    }
	      }
	    });
	}

	onChange (e) {
		var int = this.state.servings;
		var newAmountParsed = [];
		var checkValue;
		if (e.target.value == 0){
			checkValue = int;
		} else {
			checkValue = e.target.value;
		}
		this.setState({servings: checkValue});
		for (var i = 0; i < this.state.amountParsed.length; i++) {
			newAmountParsed[i] = (this.state.amountParsed[i] / int) * checkValue;
			
		};
		this.setState({amountParsed: newAmountParsed});

	}


	render(){
		return(
			<div> 
			<HeaderMenu ref="searchBar"/>
			<h2>
				{this.state.recipeName}
			</h2>
			<div className="ingredients" >
				<h3>
					Ingredienser: <br/>
				</h3>
					<input type="number" onChange={this.onChange} value={this.state.servings}/>
					<RenderIngredients ingredients={this.state.ingredients} amounts={this.state.amount} amountsParsed={this.state.amountParsed}/>
			</div>
			<div className="recipe">
				<h3>
					Oppskrift: <br/>
				</h3>
					<RenderRecipe recipe={this.state.recipe} />
			</div>
				<RenderImg img={this.state.imgPath} />
			</div>
			);
	}
}
module.exports = ShowRecipeList;