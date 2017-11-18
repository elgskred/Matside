import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import DropdownMenuTest from './DropdownMenuTest';
import DropdownMenu from './DropdownMenu';
import { hashHistory } from 'react-router'; //Endres til browserHistory når siden deployes se https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating
import { Popover, OverlayTrigger, Button, ButtonToolbar } from 'react-bootstrap';


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
			subNames: ["Placeholder1", "Placeholder2"],
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
		//hashHistory.push('/');
		if (this.state.searchBar == "") {

		} else {
			hashHistory.push({pathname, query}); //Endres til browserHistory når siden deployes
		}
		
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
        const popoverBottom = (
        	<Popover id="HeaderMenu-popover" {...this.props}>
					   Bruk + som prefix for å spesifisere ingredienser som skal inkluderes i søket. <br/>
            		   Bruk - som prefix for å spesifisere ingredienser som skal ekskluderes i søket. <br/>
            		   Eks: "is +sukker -sjokolade" <br/> "+svin"

            </Popover>
        );
		return(
			<div onClick={this.handleBodyClick} id="HeaderMenu-HeaderMenu">
				<ul className="HeaderMenu-headerBar">
					<li className="HeaderMenu-liHeaderBar"><Link to="/">Home</Link></li>
                    <li className="HeaderMenu-liSearchBar">
                    	<div className="HeaderMenu-searchBox">
                            <input type="text" className="HeaderMenu-searchBar" id="searchBar" placeholder="Søk" onChange={this.onChange} onKeyPress={this.onKeyPress} onFocus={this.enlargeSearch} onBlur={this.decreaseSearch} style={divStyle}/>
                            <span className = "fa fa-search searchButton" onClick={this.searchGo}></span>
                        	<OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom} rootClose>
                        		<i className="fa fa-question-circle-o questionMark" aria-hidden="true"></i>
                        	</OverlayTrigger>
                        </div>
			        </li>
                        
				</ul>

			</div>
		);
	}

}
module.exports = HeaderMenu;