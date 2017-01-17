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
				{this.props.amounts[index]}    {item} <br />
			</span>
		);

		return(
			<div>
				{listIngredients}
			</div>
		);
	}

}



class ShowRecipeList extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			ingredients: [],
			amount: [],
			recipe: "",
			recipeName: ""
		}
	}

	componentDidMount () {
		console.log(this.props.params.UID);
		$.ajax ({
	      method: 'GET',
	      url: "http://localhost:3333/recipes/" + this.props.params.UID,
	      success: (data) => {
	        for (var i = 0; i < data[0].length; i++) {
		        	this.setState({recipeName: this.state.recipeName.concat(data[0][i]['recipeName'])});
		        	this.setState({recipe: this.state.recipe.concat(data[0][i]['recipe'])});
		    }
	        for (var i = 0; i < data[1].length; i++) {
		        	this.setState({ingredients: this.state.ingredients.concat(data[1][i]['ingredient'])});
		        	this.setState({amount: this.state.amount.concat(data[1][i]['amount'])});
		    }
		    console.log(this.state);
	      }
	    });
	}


	render(){
		return(
			<div> 
			<HeaderMenu ref="searchBar"/>
			<h2>
				{this.state.recipeName}
			</h2>
			<h3>
				Ingredienser: <br/>
			</h3>
				<RenderIngredients ingredients={this.state.ingredients} amounts={this.state.amount}/>
			<h3>
				Oppskrift: <br/>
			</h3>
				<RenderRecipe recipe={this.state.recipe} />
			</div>
			);
	}
}
module.exports = ShowRecipeList;