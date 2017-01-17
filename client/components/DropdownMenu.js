import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { hashHistory } from 'react-router'; //Endres til browserHistory når siden deployes se https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating

class RenderArray extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recipeName: []
		}
	}
	render() {
		const listButtons = this.props.list.map((number) =>
			<div key={number.name}><Link to={number.link} key={number.name}>
			{number.name}
			</Link></div>
		);	
		return(
			<div>
			{listButtons}
			</div>
		);
	}
}

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
					<RenderArray list={this.props.list} />
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
		var list = [];
		for (var i = 0; i < this.props.subNames.length; i++){
			list[i] = {
				name: this.props.subNames[i],
				link: this.props.subLinks[i]
			}
		};
		return (
			<div onMouseEnter={this.handleClick} onMouseLeave={this.handleClick} id="kake">
				<a  href="#">{this.props.name}</a>
				<HeaderMenuDropdown isVisible={this.state.isVisible} list={list}/>
			</div>
		);
	}
}

module.exports = HeaderMenuButton;