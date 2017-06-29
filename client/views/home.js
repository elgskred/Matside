import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import HeaderMenu from '../components/HeaderMenu';
import PhotoGallery from '../components/PhotoGallery';
import PG from '../components/PG';

class Home extends React.Component {
	render() {
		return(
			<div className="page">
				<div id="headerbar">
					<HeaderMenu />
					
				</div>
				<div className="suggestionGallery">
					<PhotoGallery />
					<h2> Skille </h2>
				</div>
			</div>
		);

	}


}
module.exports = Home;