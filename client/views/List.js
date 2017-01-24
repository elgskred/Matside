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
		const listRecipes = this.props.results.map((dict, index) =>
			<Link key={dict.UID} to={/recipe/ + dict.UID}>
				<div key={dict.UID} className="recipeListing">
					<div className="recipeListing-img">
						<img className="recipe-img" src={'../public/uploads/' + this.props.img[index]} alt="404"/>
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
		this.loadImg = this.loadImg.bind(this);
		this.state = {
			params: "",
			searchResults: [],
			recipeName: [],
			desc: [],
			UID: [],
			img: []
		}
	}

	componentDidMount () {
		$.ajax ({
	      method: 'GET',
	      url: "http://awesomesauce-gaming.net:3333/search/" + this.props.location.query.q,
	      success: (data) => {
	        this.setState({searchResults: data[0]});
	        var temp = [];
	        for (var i = 0; i < data[0].length; i++) {
	        	temp[i] = data[0][i]['UID'];
	        }
	        this.setState({UID: temp}, function () {
	        		this.loadImg();
	        });
	        
	      }
	    });
	}

	loadImg () {
		var postData = {
			UID: this.state.UID
		};
		$.ajax ({
	      method: 'POST',
	      url: "http://awesomesauce-gaming.net:3333/searchImg",
	      data: postData,
	      success: (data) => {
	        var temp = [];
        	for (var i = 0; i < data.length; i++){
	        	if (data[i][0] != undefined){
	        		temp[i] = data[i][0]['imgPath'];
	        	} else {
	        		temp[i] = '404.png';
	        	}
        	}
        	//console.log(temp);
        	this.setState({img: temp});
	        	

	        
	      }
	    });
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.location.query.q != this.props.location.query.q) {
			$.ajax ({
		      method: 'GET',
		      url: "http://awesomesauce-gaming.net:3333/search/" + nextProps.location.query.q,
		      success: (data) => {
		        this.setState({searchResults: data[0]});
				var temp = [];
				for (var i = 0; i < data[0].length; i++) {
					temp[i] = data[0][i]['UID'];
	        	}
	        	this.setState({UID: temp}, function () {
	        		this.loadImg();
	        	});
	        	
		      }
		    });
		}
		
		
	}
	render() {
		return(
			<div id="testDIV">
				<HeaderMenu ref="searchBar"/>
				<RenderArray results={this.state.searchResults} img={this.state.img}/>
			</div>
			);
	}

}
module.exports = List;
