import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import HeaderMenu from '../components/HeaderMenu';
import Slideshow from '../components/Slideshow';
import NewRecipes from '../components/NewRecipes';

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
					<br/>
					<br/>
					<div id="title">
						<h1>Nye oppskrifter:</h1>
					</div>
					<br/>
					<br/>
					<div className="newRecipes">
						<NewRecipes />
					</div>
				</div>
			</div>
		);

	}


}
module.exports = Home;