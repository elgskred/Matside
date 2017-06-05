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
		this.getData();
	};

	getData (query) {
		if (query == undefined) {
			query = this.props.location.query.q
		};
		
		$.ajax ({
	      method: 'GET',
	      url: "http://localhost:3333/search/" + query,
	      success: (data) => {
	      	console.log(data);	        
	        var temp2 = [];
	        if (data[1] != null){
	        	var dataLen = data[1].length;
	        	var termLen = [];
	        	for (var i = 0; i < dataLen; i++) {
	        		termLen[i] = data[1][i].length;
	        	}
	        	for (var i = 0; i < termLen.length; i++) {
	        		for (var k = 0; k < termLen[i]; k++) {
	        			for (var j = 0; j < data[0].length; j++) {
		        			if (data[1][i][k]['UID'] != data[0][j]['UID']){
		        				temp2.push(data[1][i][k]);
		        			};
		        		};
	        		};
	        	};
	        	var uniq = [ ...new Set(temp2) ];
		        console.log(uniq);
		        for (i = 0; i < uniq.length; i++){
		        	data[0].push(uniq[i]);
		        }
	        };
	        

	        if (data[2] != null) {
	        	var dataLen = data[2].length;
	        	var includeLen = [];
	        	var tempInclude = [];
	        	for (var i = 0; i < dataLen; i++) {
	        		includeLen[i] = data[2][i].length;
	        	};

	        	for (var i = 0; i < includeLen.length; i++){
	        		for (var k = 0; k < includeLen[i]; k++){
	        			for (var j = 0; j < data[0].length; j++) {
	        				if (data[2][i][k]['UID'] == data[0][j]['UID']) {
	        					tempInclude.push(data[0][j]);
	        				};
	        			};
	        		};
	        	};
	        	console.log(tempInclude);
	        	data[0] = tempInclude;
	        };

	        if (data[3] != null) {
	        	var dataLen = data[3].length;
	        	var excludeLen = [];
	        	var tempExclude = [];
	        	for (var i = 0; i < dataLen; i++) {
	        		excludeLen[i] = data[3][i].length;
	        	};
	        	console.log("2");
	        	for (var i = 0; i < excludeLen.length; i++){
	        		for (var k = 0; k < excludeLen[i]; k++){
	        			for (var j = 0; j < data[0].length; j++) {
	        				if (data[3][i][k]['UID'] == data[0][j]['UID']) {
	        					tempExclude.push(j);
	        				};
	        			};
	        		};
	        	};
	        	console.log(data[0]);
	        	for (var i = 0; i < tempExclude.length; i++) {
	        		data[0].splice(tempExclude[i], 1);
	        	}
	        	console.log(data[0]);
	        };
	        
	        this.setState({searchResults: data[0]});
	        var temp = [];
	        for (var i = 0; i < data[0].length; i++) {
	        	temp[i] = data[0][i]['UID'];
	        };
	        this.setState({UID: temp}, function () {
	        		this.loadImg();
	        });
	        
	      }
	    });
	};

	loadImg () {
		var postData = {
			UID: this.state.UID
		};
		$.ajax ({
	      method: 'POST',
	      url: "http://localhost:3333/searchImg",
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
			this.getData(nextProps.location.query.q);
			// $.ajax ({
		 //      method: 'GET',
		 //      url: "http://localhost:3333/search/" + nextProps.location.query.q,
		 //      success: (data) => {
		 //      	console.log(data);
		 //        this.setState({searchResults: data[0]});
			// 	var temp = [];
			// 	for (var i = 0; i < data[0].length; i++) {
			// 		temp[i] = data[0][i]['UID'];
	  //       	}
	  //       	this.setState({UID: temp}, function () {
	  //       		this.loadImg();
	  //       	});
	        	
		 //      }
		 //    });
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
