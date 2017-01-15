import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

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

class ShowRecipeList extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			params: "",
			searchResults: [],
			recipeName: [],
			UID: [],
			recipe: []
		}
	}

	componentDidMount () {
		$.ajax ({
	      method: 'GET',
	      url: "http://localhost:3333/search/" + this.props.location.query.q,
	      success: (data) => {
	        console.log(data);
	        this.setState({searchResults: data[0]});
	        for (var i = 0; i < data[0].length; i++) {
	        	this.setState({recipeName: this.state.recipeName.concat(data[0][i]['recipeName'])});
	        	this.setState({UID: this.state.UID.concat(data[0][i]['UID'])});
	        	this.setState({recipe: this.state.recipe.concat(data[0][i]['recipe'])});
	        }
	        
	      }
	    });
	}


	render(){
		return(
			<div> 
			Her skal oppskriftene vises 
			<RenderArray results={this.state.searchResults}/>
			</div>
			);
	}
}
module.exports = ShowRecipeList;