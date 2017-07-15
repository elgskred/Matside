import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import HeaderMenu from '../components/HeaderMenu';
import PG from '../components/PG';
import Slideshow from '../components/Slideshow';

class Home extends React.Component {
	render() {
		return(
			<div className="page">
				<div id="headerbar">
					<HeaderMenu />
					<Slideshow />
				</div>
				<div className="suggestionGallery">
					<h2> Skille </h2>
				</div>
			</div>
		);

	}


}
module.exports = Home;