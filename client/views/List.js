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
		this.state = {
			params: "",
			searchResults: [],
			recipeName: [],
			desc: [],
			UID: []
		}
	}

	componentDidMount () {
		console.log("getting");
		$.ajax ({
	      method: 'GET',
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

	componentWillReceiveProps (nextProps) {
		if (nextProps.location.query.q != this.props.location.query.q) {
			$.ajax ({
		      method: 'GET',
		      url: "http://awesomesauce-gaming.net:3333/search/" + nextProps.location.query.q,
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
		
	}
	render() {
		return(
			<div id="testDIV">
				<HeaderMenu ref="searchBar"/>
				<RenderArray results={this.state.searchResults}/>
			</div>
			);
	}

}
module.exports = List;
