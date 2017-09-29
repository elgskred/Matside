import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import HeaderMenu from '../components/HeaderMenu';
import PG from '../components/PG';
import Slideshow from '../components/Slideshow';

class Home extends React.Component {
	render() {
		return(
			<div>
				<div className="header">
					<HeaderMenu />
				</div>

				<div className="page">
					<div className="suggestionGallery">
						<Slideshow />
					</div>
				</div>
			</div>
		);

	}


}
module.exports = Home;