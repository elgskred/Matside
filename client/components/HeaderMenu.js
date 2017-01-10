import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { hashHistory } from 'react-router'; //Endres til browserHistory når siden deployes se https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating


class HeaderMenuDropdown extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isVisible: false,
			aVar: "Search for something"
		};
	}

	render(){
		if (this.props.isVisible) {
			return(
				<div className="dropdown-content-menu">
						<Link to="/index">Loff</Link>
						<br />
						<Link to={"/list/" + this.state.aVar} >Papir</Link>
				</div>
				);
		}
		return null;
	}
}

class HeaderMenuButton extends React.Component {
	constructor(props) {
		super (props)
		this.handleClick = this.handleClick.bind(this);
		this.handleBodyClick = this.handleBodyClick.bind(this);
		this.state = {
			isVisible: false
		}
	}

	handleClick (e) {
		e.stopPropagation();
		//e.preventDefault();
		console.log("Button is clicked");
		this.setState({isVisible: !this.state.isVisible});
	}

	handleBodyClick (e) {
		console.log("Something was clicked");
		this.setState({isVisible: false});
	}
	render () {
		return (
			<div onMouseEnter={this.handleClick} onMouseLeave={this.handleClick} id="kake">
				<a  href="#">Menu</a>
				<HeaderMenuDropdown isVisible={this.state.isVisible}/>
			</div>
		);
	}
}

class HeaderMenu extends React.Component{
	constructor(props) {
		super (props);
		this.onChange = this.onChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.searchGo = this.searchGo.bind(this);
		this.state = {
			searchBar: ""
		};
	}
	onKeyPress (e) {
		if ( e.key == "Enter") {
			console.log("Enter is pressed");
			hashHistory.push("/list/" + this.state.searchBar);

		}
	};
	searchGo (e) {
		console.log(this.state.searchBar);
		hashHistory.push('/list/' + this.state.searchBar); //Endres til browserHistory når siden deployes
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
					<li className="liHeaderBar"><HeaderMenuButton /></li>
					<li className="liSearchBar"><button  id="searchButton" onClick={this.searchGo}>Go!</button></li>
					<li className="liSearchBar"><input type="text" className="searchBar" id="searchBar" placeholder="Search" onChange={this.onChange} onKeyPress={this.onKeyPress}/></li>

				</ul>

			</div>
		);
	}

}
module.exports = HeaderMenu;