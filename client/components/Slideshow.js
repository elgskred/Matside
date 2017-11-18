import React, { Component } from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router';

export default class AdaptiveHeight extends Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      UID: [],
      name: [],
      img: [],
      temp: false,
      slides: 1,
    }

  }

  getData() {
    $.ajax ({
        method: 'GET',
        url: "http://awesomesauce-gaming.net:3333/popularRecipes" ,
        success: (data) => {
          var tempUID = [];
          var tempName = [];
          console.log(data);
          if (data.length > 0) {
            for(var i = 0; i < data.length; i++) {
              tempUID[i] = data[i]['UID'];
              tempName[i] = data[i]['recipeName'];

            };
          };
          this.setState({UID:tempUID, name:tempName}, function () {
            this.loadImg();
          });  
        }
    });
  }

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
              temp[i] = '../public/uploads/' +data[i][0]['imagePath'];
            } else {
              temp[i] = '../public/uploads/404.png';
            }
          }
          this.setState({img: temp});
          this.setState({temp: true});
        }
      });
  }
  updateDimensions() {
    if (window.innerWidth >= 1920) {
      this.setState({slides:3});
    } else if (window.innerWidth > 1280) {
      this.setState({slides:2});
    } else if (window.innerWidth <= 1280) {
      this.setState({slides:1});
    }
  }
  componentDidMount() {
    this.getData();
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    var settings = {
      className: '',
      dots: true,
      lazyLoad: true,
      infinite: true,
      slidesToShow: this.state.slides,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: true
    };
    const elements = this.state.img.map((element, index) => {
      return (
        <div key={index} id="Slideshow-popImgDiv">
          <Link key={index} to={/recipe/ + this.state.UID[index]}>
            <img id="Slideshow-popImg" src={element} />
            <h1> {this.state.name[index]} </h1>
          </Link>
        </div>
      )
    });

    if (this.state.temp) {
      return (
      <div>
        <Slider {...settings}>
          {elements}
        </Slider>
      </div>
      );
    } else {
      return (
        <div> </div>
      )
    }
    
  }
}
