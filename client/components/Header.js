import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';


class Header extends React.Component {
	

	render(){
		var _style = {
			width: "100%"
		};
		return(
			<div id="header">
				<a href="/">
					<img src="../public/img/header.png" alt="Header image" style={_style}/>
				</a>
			</div>
			);
	}

}
module.exports = Header;