import React from 'react';
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
			<Link key={dict.UID} to={/recipe/ + dict.UID}>
				<div key={dict.UID} className="recipeListing">
					<div className="recipeListing-img">
						<img className="recipe-img" src="../public/img/404.png" alt="404"/>
					</div>
					<div className="recipeListing-text">
						<div className="recipeListing-name">
							{dict.recipeName}
						</div>
						<div className="recipeListing-desc">
							{dict.shortDesc}
						</div>
					</div>
				
				</div>
			</Link>
		);
		return(
			<div>
			{listRecipes}
			</div>
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
			desc: [],
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
	        	this.setState({desc: this.state.desc.concat(data[0][i]['shortDesc'])});
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
