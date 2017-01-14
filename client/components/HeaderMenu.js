import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import HMD from './DropdownMenu';
import { hashHistory } from 'react-router'; //Endres til browserHistory når siden deployes se https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating


class HeaderMenu extends React.Component{
	constructor(props) {
		super (props);
		this.onChange = this.onChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.searchGo = this.searchGo.bind(this);
		this.state = {
			searchBar: "",
			DropdownName: "Menu",
			subNames: ["Recipes", "Categories"],
			subLinks: ["/list", "/index"]
		};
	}
	onKeyPress (e) {
		if ( e.key == "Enter") {
			console.log("Enter is pressed");
			this.searchGo();

		}
	};
	searchGo (e) {
		console.log(this.state.searchBar);

		var pathname = '/list/';
		var query = {
			q: this.state.searchBar
		};
		hashHistory.push({pathname, query}); //Endres til browserHistory når siden deployes
	}


	onChange (e) {
	    var t = {};
	    var id = e.target.id
	    t[id] = e.target.value
	    this.setState(t);
	};

	render(){
		return(
			<div onClick={this.handleBodyClick}>
				<ul className="headerBar">
					<li className="liHeaderBar"><Link to="/">Home</Link></li>
					<li className="liHeaderBar"><Link to="/index">Last opp</Link></li>
					<li className="liHeaderBar"><Link to="/">Log in</Link></li>
					<li className="liHeaderBar"><HMD name={this.state.DropdownName} subNames={this.state.subNames} subLinks={this.state.subLinks}/></li>
					<li className="liSearchBar"><button  id="searchButton" onClick={this.searchGo}>Go!</button></li>
					<li className="liSearchBar"><input type="text" className="searchBar" id="searchBar" placeholder="Search" onChange={this.onChange} onKeyPress={this.onKeyPress}/></li>

				</ul>

			</div>
		);
	}

}
module.exports = HeaderMenu;