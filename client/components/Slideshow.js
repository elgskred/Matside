import React, { Component } from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router';

export default class AdaptiveHeight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UID: [],
      img: [],
      temp: false
    }

  }
  componentDidMount () {
    this.getData();
  }

  getData() {
    $.ajax ({
        method: 'GET',
        url: "http://localhost:3333/popularRecipes" ,
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
  }

  loadImg () {
    var postData = {
      UID: this.state.UID
    };
    $.ajax ({
        method: 'POST',
        url: "http://localhost:3333/searchImg",
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


  render() {
    var settings = {
      className: '',
      dots: true,
      lazyLoad: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: true
    };
    {console.log(this.state.img)}
    const elements = this.state.img.map((element, index) => {
      return (
        <div key={index}>
          <Link key={index} to={/recipe/ + this.state.UID[index]}>
            <img id="popImg" src={element} />
            <h2> Oppskrift </h2>
          </Link>
        </div>
      )
    });

    if (this.state.temp) {
      return (
      <div>
        <h2>Adaptive height</h2>
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
