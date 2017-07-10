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
	      	var data0Len;
	      	if (data[0] == null){
	      		data0Len = 0;
	      	} else {
	      		data0Len = data[0].length;
	      	}
	        //Data[0] returns the recipes containing the full search string IE "lemon cake"
	        //If the user searched for more than one element IE "lemon cake", results for "lemon" and "cake" will be returned here.
	        //Returned as object. data[1][number of search elements][number of results for specific element][item 'UID', 'recipe', 'recipeName' and 'shortDesc']
	        if (data[1] != null){
	        	//Finds the number of search elements returned
	        	var dataLen = data[1].length;
	        	var termLen = [];
	        	var temp2 = [];
	        	//Finds the number of results for each element
	        	for (var i = 0; i < dataLen; i++) {
	        		termLen[i] = data[1][i].length;
	        	}
	        	//Checks to see if 'UID' has been returned in the data[0]'search string array', if not add it to the a temporary array
	        	for (var i = 0; i < dataLen; i++) {
	        		for (var k = 0; k < termLen[i]; k++) {
	        			for (var j = 0; j < data[0].length; j++) {
		        			if (data[1][i][k]['UID'] != data[0][j]['UID']){
		        				temp2.push(data[1][i][k]);
		        			};
		        		};
	        		};
	        	};
	        	//Removes any duplicates from the temporary array before adding it to the data[0] array
	        	var uniq = [ ...new Set(temp2) ];
		        console.log(uniq);
		        for (i = 0; i < uniq.length; i++){
		        	data[0].push(uniq[i]);
		        }
	        };
	        console.log("data1 ok");
	        //If the user searched for any "includes" IE "+water", results will be returned in data[2]
	        //Returned as object. data[2][number of includes][number of results for specific include][item 'UID' and 'ingredient']
	        if (data[2] != null) {
	        	//Finds the number of include elements returned
	        	var dataLen = data[2].length;
	        	var includeLen = [];
	        	var tempInclude = [];
	        	//Finds the number of results for each include
	        	for (var i = 0; i < dataLen; i++) {
	        		includeLen[i] = data[2][i].length;
	        	};
	        	//Checks to see if 'UID' has been returned in the data[0]'search string array', if it has, push it to the temp array
	        	if (data0Len > 0){
	        		for (var i = 0; i < dataLen; i++){
		        		for (var k = 0; k < includeLen[i]; k++){
		        			for (var j = 0; j < data0Len; j++) {
		        				if (data[2][i][k]['UID'] == data[0][j]['UID']) {
		        					tempInclude.push(data[0][j]);
		        				};
		        			};
		        		};
	        		}
	        	} else if (data0Len == 0) {
	        		for (var i = 0; i < dataLen; i++) {
	        			for (var k = 0; k < includeLen[i]; k++){
	        				tempInclude.push(data[2][i][k]);
	        			}
	        		}
	        	}
	        	
	        	console.log(tempInclude);
	        	//Overwrites the original returned data with results showing only recipes including specific ingredients
	        	data[0] = tempInclude;
	        };
	        console.log("data2 ok");
	        //If the user searched for any "excludes", IE "-flour", results will be returned in data[3] 
	        //Returned as object. data[3][number of excludes][number of results for specific exclude][item 'UID' and 'ingredient']
	        if (data[3] != null) {
	        	//Finds the number of exclude elements returned
	        	var dataLen = data[3].length;
	        	var excludeLen = [];
	        	var tempExclude = [];
	        	//Finds the number of results for each exclude
	        	for (var i = 0; i < dataLen; i++) {
	        		excludeLen[i] = data[3][i].length;
	        	};
	        	//Checks to see if 'UID' has been returned in the data[0]'search string array', if not add it to the a temporary array
	        	for (var i = 0; i < dataLen; i++){
	        		for (var k = 0; k < excludeLen[i]; k++){
	        			for (var j = 0; j < data0Len; j++) {
	        				if (data[3][i][k]['UID'] == data[0][j]['UID']) {
	        					tempExclude.push(j);
	        				};
	        			};
	        		};
	        	};
	        	//Removes all exclude elements in tempExclude array from data[0] array.
	        	console.log(data[0]);
	        	for (var i = 0; i < tempExclude.length; i++) {
	        		data[0].splice(tempExclude[i], 1);
	        	}
	        	console.log(data[0]);
	        };
	        console.log("data3 ok");

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
	      	console.log(data)
	        var temp = [];
        	for (var i = 0; i < data.length; i++){
	        	if (data[i][0] != undefined){
	        		temp[i] = data[i][0]['imagePath'];
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
