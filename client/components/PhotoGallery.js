import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Motion, spring} from 'react-motion';

const springSettings = {stiffness: 170, damping: 26};
const NEXT = 'show-next';

const Demo = React.createClass({
  getInitialState() {
    return {
      photos: [[350, 350], [350, 350], [350, 350]],
      currPhoto: 0,
      UID: [],
      img: []
    };
  },

  handleChange({target: {value}}) {
  	console.log("handleCh");
    this.setState({currPhoto: value});
  },

  getData() {
    $.ajax ({
        method: 'GET',
        url: "http://awesomesauce-gaming.net:3333/popularRecipes" ,
        success: (data) => {
          var temp = []
          if (data.length > 0) {
            for(var i = 0; i < data.length; i++) {
              temp[i] = data[i]['UID'];
            };
          };
          this.setState({UID:temp}, function () {
            this.loadImg();
          });  
        }
    });
  },

  loadImg () {
    var postData = {
      UID: this.state.UID
    };
    $.ajax ({
        method: 'POST',
        url: "http://awesomesauce-gaming.net:3333/searchImg",
        data: postData,
        success: (data) => {
          console.log(data);
          var temp = [];
          for (var i = 0; i < data.length; i++){
            if (data[i][0] != undefined){
              temp[i] = "../public/uploads/" +data[i][0]['imagePath'];
            } else {
              temp[i] = '../public/uploads/404.png';
            }
          }
          this.setState({img: temp});
        }
      });
  },


  componentDidMount () {
  	var intervalId = setInterval(this.timer, 4000);
  	this.setState({
  		intervalId: intervalId
  	});
    this.getData();
  },
  componentWillUnmount () {
  	clearInterval(this.state.intervalId);
  },


  timer () {
  	var i = this.state.currPhoto + 1;
  	var len = this.state.photos.length - 1;
  	if (i > len){
  		i = 0
  	};
  	this.setState({
  		currPhoto: i
  	});

  },

  test(e){
    console.log("Test");
  },

  clickHandler(btn){
  	console.log("clickHandler");
    var photoIndex = btn === NEXT ? this.state.currPhoto+1 : this.state.currPhoto-1;

    photoIndex = photoIndex >= 0 ? photoIndex : this.state.photos.length - 1;
    photoIndex = photoIndex >= this.state.photos.length ? 0 : photoIndex;

    this.setState({
      currPhoto: photoIndex
    })
  },

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

    const photoText = this.state.UID.map((item, index) => {
      return <div> {item} </div> 
    })

    return (
      <div>
        <div className="demo4" >
          <Motion style={{height: spring(currHeight), width: spring(currWidth)}}>
            {container =>
              <div className="demo4-inner" style={container}>
                {configs.map((style, i) =>
                  <div>
                    <Link key={i} to={/recipe/ + this.state.UID[i]}>
                      <Motion key={i} style={style}>
                        {style =>
                          <img className="demo4-photo" src={this.state.img[i]} style={style}/> 
                        }
                      </Motion>
                    </Link>
                  </div>
                )}
              </div>
            }
          </Motion>
        </div>
      </div>
    );
  },
});

export default Demo;

