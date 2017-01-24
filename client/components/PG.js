import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Motion, spring} from 'react-motion';

const springSettings = {stiffness: 170, damping: 26};

class PhotoGallery extends React.Component {
	constructor(props) {
		super(props)
		this.timer = this.timer.bind(this);
		this.state = {
			photos: [[350, 350], [350, 350], [350, 350]],
			currPhoto: 0,
			intervalId: 0,
			recipeName: ["Biff1", "Lompe", "Biff2"]
		};
	}

	componentDidMount () {
  	var intervalId = setInterval(this.timer, 4000);
  	this.setState({
  		intervalId: intervalId
  	});
  	}

  	componentWillUnmount () {
  		clearInterval(this.state.intervalId);
  	}

  	timer () {
  	var i = this.state.currPhoto + 1;
  	var len = this.state.photos.length - 1;
  	if (i > len){
  		i = 0
  	};
  	this.setState({
  		currPhoto: i
  	});
  	}

	render() {
    const {photos, currPhoto} = this.state;
    const [currWidth, currHeight] = photos[currPhoto];

    const widths = photos.map(([origW, origH]) => currHeight / origH * origW);

    const leftStartCoords = widths
      .slice(0, currPhoto)
      .reduce((sum, width) => sum - width, 0);

    let configs = [];
    photos.reduce((prevLeft, [origW, origH], i) => {
      configs.push({
        left: spring(prevLeft, springSettings),
        height: spring(currHeight, springSettings),
        width: spring(widths[i], springSettings),
      });
      return prevLeft + widths[i];
    }, leftStartCoords);

    return (
      <div>
        <div className="demo4">
			<Motion style={{height: spring(currHeight), width: spring(currWidth)}}>
			{container =>
				<div className="demo4-inner" style={container}>
					{configs.map((style, i) =>
						<Motion key={i} style={style}>
						{style =>
							<div className="demo4-photo" style={style}>
								<img className="recipeListing-img" src={`../public/uploads/${i}.jpg`} />
								<p>
									{this.state.recipeName[i]}
								</p>
							</div>
						}
					</Motion>
					)}
				</div>
			}
			</Motion>
        </div>
      </div>
    );
  }
}
module.exports = PhotoGallery;