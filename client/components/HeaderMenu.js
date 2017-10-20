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
        this.decreaseSearch = this.decreaseSearch.bind(this);
        this.enlargeSearch = this.enlargeSearch.bind(this);
		this.state = {
			searchBar: "",
			DropdownName: "Kategori ",
			subNames: ["Recipes", "Categories"],
			subLinks: [],
            decreaseSearch: true
		};
		this.recipe = {
            subDropTag: "Oppskrifter",
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
    
      decreaseSearch(e) {
        this.setState({
            decreaseSearch:true
        });  
    }
 
    enlargeSearch() {
        this.setState({
            decreaseSearch:false
        });
    }

	render(){
        
         var divStyle = {
           /* width: this.state.decreaseSearch?50:200 */
        
        };
		return(
			<div onClick={this.handleBodyClick} id="HeaderMenu-HeaderMenu">
				<ul className="HeaderMenu-headerBar">
					<li className="HeaderMenu-liHeaderBar"><Link to="/">Home</Link></li>
					<li className="HeaderMenu-liHeaderBar"><DropdownMenu name={this.state.DropdownName} subNames={this.state.subNames} subLinks={this.state.subLinks}/></li>
					<li className="HeaderMenu-liHeaderBar"><DropdownMenuTest name={this.recipe.subDropTag} subNames={this.recipe.subDrop} subLinks={this.recipe.subDropLink}/></li>
					
                        <div className="HeaderMenu-searchBox">
                            <li className="HeaderMenu-liSearchBar">
                                <input type="text" className="HeaderMenu-searchBar" id="searchBar" placeholder="Søk" onChange={this.onChange} onKeyPress={this.onKeyPress} onFocus={this.enlargeSearch} onBlur={this.decreaseSearch} style={divStyle}/>
                                <button className="HeaderMenu-searchMagnifying">
                                    <i className = "fa fa-search" />
                                </button>
					        </li>
                        </div>
				</ul>

			</div>
		);
	}

}
module.exports = HeaderMenu;