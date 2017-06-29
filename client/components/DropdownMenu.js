import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { hashHistory } from 'react-router'; //Endres til browserHistory når siden deployes se https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating

class RenderArray extends React.Component {
	constructor(props) {
		super(props);
		//this.handleEnterDropdown = this.handleEnterDropdown.bind(this);
		this.handleLeaveDropdown = this.handleLeaveDropdown.bind(this);
		this.state = {
			recipeName: []
		}
	}



	// handleEnterDropdown (e) {
	// 	e.stopPropagation();
	// 	//e.preventDefault();
	// 	//this.setState({isVisible: true});
	// 	this.props.onHandleMouseChange(true)
	// 	console.log("Entered dropdown");
	// 	console.log(this.props);
	// }

	handleLeaveDropdown (e) {
		e.stopPropagation();
		this.props.onHandleMouseChange(false)
		//e.preventDefault();
		//this.setState({isVisible: false});
		console.log("Exited dropdown");
	}

	render() {
		const listButtons = this.props.list.map((number) =>
			<div key={number.name}><Link to={number.link} key={number.name}>
				{number.name}
			</Link></div>
		);	
		return(
			<div className="dropdown-content-menu" onMouseEnter={this.handleEnterDropdown} onMouseLeave={this.handleLeaveDropdown}>
			{listButtons}
			</div>
		);
	}
}

class HeaderMenuDropdown extends React.Component {
	constructor(props){
		super(props);
		this.handleMouseChange = this.handleMouseChange.bind(this);
		this.state = {
			lowerIsVisible: false,
			aVar: "Search for something"
		};
	}

	handleMouseChange(mouseState) {
		let mState = !this.state.lowerIsVisible;
		this.setState({
			lowerIsVisible: mouseState
		});		
		console.log(this.state);
	}

	componentWillReceiveProps(nextProps){
		this.setState({lowerIsVisible: nextProps.isVisible});
	}

	render(){
		if (this.state.lowerIsVisible) {
			return(
					<RenderArray list={this.props.list} onHandleMouseChange={this.handleMouseChange}/>
				);
		}
		return null;
	}
}

class HeaderMenuButton extends React.Component {
	constructor(props) {
		super (props)
		this.handleEnter = this.handleEnter.bind(this);
		this.handleLeave = this.handleLeave.bind(this);
		this.state = {
			isVisible: false
		}
	}
	handleEnter (e) {
		e.stopPropagation();
		//e.preventDefault();
		this.setState({isVisible: true});
		console.log("Enter");
	}
	handleLeave (e) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({isVisible: false});
		console.log("Exit");
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
			<div onMouseEnter={this.handleEnter} onMouseLeave={this.handleLeave} >
				<a  href="#">{this.props.name}</a>
				<HeaderMenuDropdown isVisible={this.state.isVisible} list={list}/>
			</div>
		);
	}
}

module.exports = HeaderMenuButton;
