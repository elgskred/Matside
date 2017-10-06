import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import DropdownMenuTest from './DropdownMenuTest';
import DropdownMenu from './DropdownMenu';
import { hashHistory } from 'react-router'; //Endres til browserHistory når siden deployes se https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating


class HeaderMenu extends React.Component{
	constructor(props) {
		super (props);
		this.onChange = this.onChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.searchGo = this.searchGo.bind(this);
		this.state = {
			searchBar: "",
			DropdownName: "Placeholder",
			subNames: ["Recipes", "Categories"],
			subLinks: []
		};
		this.recipe = {
            subDropTag: "Placeholder",
            subDrop: ["Sunn", "Rask", "Familien", "Kos", "Gjester", "Tradisjon", "Vis alle oppskrifter"],
            subDropLink: []
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
		hashHistory.push('/');
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
			<div onClick={this.handleBodyClick} id="HeaderMenu">
				<ul className="headerBar">
					<li className="liHeaderBar"><Link to="/">Home</Link></li>
					<li className="liHeaderBar"><DropdownMenu name={this.state.DropdownName} subNames={this.state.subNames} subLinks={this.state.subLinks}/></li>
					<li className="liHeaderBar"><DropdownMenuTest name={this.recipe.subDropTag} subNames={this.recipe.subDrop} subLinks={this.recipe.subDropLink}/></li>
					
                        <div className="searchBox">
                            <li className="liSearchBar">
                                <input type="text" className="searchBar" id="searchBar" placeholder="Søk" onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                                <img src="../public/img/mag.png" id="imgMagnifyingButton" onClick={this.searchGo}/>
					        </li>
                        </div>
				</ul>

			</div>
		);
	}

}
module.exports = HeaderMenu;