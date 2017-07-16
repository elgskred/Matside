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
				</div>
				<div className="suggestionGallery">
					{window.innerHeight};
					<br />
    				{window.innerWidth};
					<Slideshow />
				</div>
			</div>
		);

	}


}
module.exports = Home;