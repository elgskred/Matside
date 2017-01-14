import React from 'react';
import { Link } from 'react-router';

class RenderArray extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recipeName: []
		}

	}
// console.log(this.props);
// 		const recipes = this.props.recipeName
// 		const listRecipes = this.props.recipeName.map((number) =>
// 			<div> {number} </div>
// 		);
	render() {
		const listRecipes = this.props.results.map((number) =>
			<li key={number.UID}><Link to={'/recipe/' + number.UID}>
			{number.recipeName} 
			</Link></li>
		);
		return(
			<ul>
			{listRecipes}
			</ul>
		);
	}


}



class List extends React.Component {
	constructor(props){
		super(props);
		this.printConsole = this.printConsole.bind(this);
		this.state = {
			params: "",
			searchResults: [],
			recipeName: [],
			UID: []
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
	        }
	        
	      }
	    });
	}

	printConsole (e) {
		e.preventDefault();
		console.log(this.state);
		console.log("Hello World");
		console.log(this.state.recipeName);
	};

	render() {
		return(
			<div id="testDIV">
				Dette er en testside som jeg vil at skal fungere {this.props.params.var} 
				<br />
				<button type="button" onClick={this.printConsole}>Push me</button>
				<RenderArray results={this.state.searchResults}/>
			</div>
			);
	}

}
module.exports = List;
