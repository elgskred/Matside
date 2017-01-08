import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import HeaderMenu from '../components/HeaderMenu';

class Home extends React.Component {
	render() {
		return(
			<div id="headerbar">
				<HeaderMenu />
			</div>

		);

	}


}
module.exports = Home;