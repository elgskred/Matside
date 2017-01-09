import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

class HeaderMenuDropdown extends React.Component {
	render(){
		if (this.props.isVisible) {
			return(
				<div className="dropdown-content-menu">
					<ul>
						<li><Link to="/index">Loff</Link></li>
						<li><Link to="/list">Papir</Link></li>
					</ul>
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
			<div onClick={this.handleBodyClick}>
				<a onClick={this.handleClick} href="#">Menu</a>
				<HeaderMenuDropdown isVisible={this.state.isVisible}/>
			</div>
		);
	}
}

class HeaderMenu extends React.Component{


	render(){
		return(
			<div>
				<ul className="headerBar">
					<li className="liHeaderBar"><Link to="/" onClick={this.handleBodyClick}>Home</Link></li>
					<li className="liHeaderBar"><Link to="/index">Last opp</Link></li>
					<li className="liHeaderBar"><Link to="/">Log in</Link></li>
					<li className="liHeaderBar"><HeaderMenuButton /></li>
					<li className="liSearchBar"><input type="text" className="searchBar" id="searchBar" placeholder="Search"/></li>
				</ul>

			</div>
		);
	}

}
module.exports = HeaderMenu;