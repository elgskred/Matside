import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

class BigContainer extends React.Component {
	constructor(props) {
		super(props);
	}
	render(){
		return(
			<div id="NewRecipes-bigContainer">
				<Link to={/recipe/ + this.props.UID[0]}>
					<img id="NewRecipes-bigImg" src={this.props.img[0]} />
					<h4 id="NewRecipes-bigName"> {this.props.name[0]} </h4>
				</Link>
			</div>
		)
	}
}

class NewRecipes extends React.Component {
	constructor(props) {
		super(props);
		this.getData = this.getData.bind(this);
		this.loadImg = this.loadImg.bind(this);

	    this.state = {
	        UID: [],
	      	name: [],
	      	img: [],
	      	nameContainers: [],
	      	imgContainers: [],
	    }
	}
	

    getData() {
	    $.ajax ({
	        method: 'GET',
	        url: "http://awesomesauce-gaming.net:3333/newRecipes" ,
	        success: (data) => {
	          var tempUID = [];
	          var tempName = [];
	          var nameContainers = [];
	          console.log(data);
	          if (data.length > 0) {
	            for(var i = 0; i < data.length; i++) {
	              tempUID[i] = data[i]['UID'];
	              tempName[i] = data[i]['recipeName'];
	              if (i > 0) {
	              	console.log("tick");
	              	nameContainers[i - 1] = data[i]['recipeName'];
	              }

	            };
	          };
	          this.setState({UID:tempUID, name:tempName, nameContainers:nameContainers}, function () {
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
	          var imgContainers = [];
	          for (var i = 0; i < data.length; i++){
	            if (data[i][0] != undefined){
	              temp[i] = '../public/uploads/' +data[i][0]['imagePath'];
	            } else {
	              temp[i] = '../public/uploads/404.png';
	            }
	            if (i > 0) {
	              	imgContainers[i - 1] = '../public/uploads/' +data[i][0]['imagePath'];
	            }
	          }
	          this.setState({img: temp, imgContainers:imgContainers});
	        }
	      });
  	}

  	populateView() {

  	}
  	componentDidMount() {
    	this.getData();
  	}



    render(){
    	const smallContainer = this.state.imgContainers.map((item, index) =>{
		    return(
		      	<div id="NewRecipes-smallContainer" key={index}>
		      		<Link key={index} to={/recipe/ + this.state.UID[index+1]}>
						<img id="NewRecipes-smallImg" src={item} />
						<h4 id="NewRecipes-smallName"> {this.state.nameContainers[index]} </h4>
					</Link>
				</div>
		      )
		});
    	return(
    		<div className="NewRecipes-mainContainer">
    			<BigContainer name={this.state.name} img={this.state.img} UID={this.state.UID}/>
    			{smallContainer}
    		</div>
    	)

    }
}
module.exports = NewRecipes;