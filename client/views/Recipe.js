import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import HeaderMenu from '../components/HeaderMenu';

class RenderArray extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recipeName: []
		}

	}
	render() {
		const listRecipes = this.props.results.map((dict) =>
			<li key={dict.UID}><Link to={'/recipe/' + dict.UID}>
			{dict.recipeName} - {dict.recipe}
			</Link></li>
		);
		return(
			<ul>
			{listRecipes}
			</ul>
		);
	}


}

class RenderRecipe extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div>
			{this.props.recipe.split('\n').map(function(item, index) {
		  		return (
		    		<span key={index}>
		      		{item}
		      		<br/>
		    		</span>
		  		)
			})}
			</div>
			);
	}
}

class RenderIngredients extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const listIngredients = this.props.ingredients.map((item, index) =>
			<span key={index}>
				{this.props.amountsParsed[index]}{this.props.amounts[index]}    {item} <br />
			</span>
		);

		return(
			<div>
				{listIngredients}
			</div>
		);
	}

}

class LargeImage extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.state = {
			isVisible: false
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({isVisible: true});
	}
	onClick () {
		console.log("disableDiv");
	}


	render(){
		var imgStyle = {
			position: "static",
			height: "75%",
			verticalAlign: "middle",
			opacity: "1",
		}
		if (this.state.isVisible) {
			return(
				<img src={'../public/uploads/' + this.props.img[this.props.index]} name="largeImage" id="largeImage"/>
			)
		}
		return null;
		
	}
}

class RenderImg extends React.Component {
	constructor(props) {
		super(props);
		this.zoomImage = this.zoomImage.bind(this);
	}

	zoomImage (index){
		this.props.imageClick(index);
		this.props.enable();

	}

	render() {
		const listImg = this.props.img.map((item, index) =>
			<img src={'../public/uploads/' + item} alt="404.png" key={index} id="recipeImg" onClick={this.zoomImage.bind(this, index)}/>
		);
		return(
			<div className="recipeImg" id="imgContainer">
				{listImg}
			</div>
		);
	}
}



class ShowRecipeList extends React.Component {
	constructor(props){
		super(props);
		this.onChange = this.onChange.bind(this);
		this.showZoomedImage = this.showZoomedImage.bind(this);
		this.disableDiv = this.disableDiv.bind(this);
    	this.enableDiv = this.enableDiv.bind(this);
		this.state = {
			ingredients: [],
			amount: [],
			amountParsed: [],
			recipe: "",
			recipeName: "",
			servings: "",
			imgPath: [],
			servingsValue: "",
			servingsCalculated: []
		}
	}

	componentDidMount () {
		console.log(this.props.params.UID);
		$.ajax ({
	      method: 'GET',
	      url: "http://awesomesauce-gaming.net:3333/recipes/" + this.props.params.UID,
	      success: (data) => {
	      	var tempIngredients = [];
	      	var tempAmounts = [];
	      	var tempAmountsParsed = [];
	      	var tempImgpath = [];
	      	var tempRegex = "";
	        for (var i = 0; i < data[1].length; i++) {
	        	tempIngredients = tempIngredients.concat(data[1][i]['ingredient_name']);
        		tempAmounts = tempAmounts.concat(data[1][i]['ingredient_amount'].replace(/[0-9,]/g, ''));
        		tempRegex = data[1][i]['ingredient_amount'].replace(/([^0-9,])/g,'');
        		tempAmountsParsed = tempAmountsParsed.concat(tempRegex.replace(/[,]/g,'.'));
		    }
		    for (var i = 0; i < data[2].length; i++) {
		    	tempImgpath = tempImgpath.concat(data[2][i]['imagePath'])
		    }
		    this.setState({
		    	recipeName: data[0][0]['recipeName'],
	        	recipe: data[0][0]['recipeDescription'],
	        	servings: data[0][0]['servings'],
	        	servingsValue: data[0][0]['servings'],
		    	ingredients: tempIngredients,
		    	amount: tempAmounts,
		    	amountParsed: tempAmountsParsed,
		    	servingsCalculated: tempAmountsParsed,
		    	imgPath: tempImgpath,
		    	index: null,
		    	disableDiv: true

		    });
	      }
	    });
	}

	onChange (e) {
		var int = this.state.servingsValue;
		var newAmountParsed = [];
		var checkValue;
		if (e.target.value == 0){
			checkValue = int;
		} else {
			checkValue = e.target.value;
		}
		this.setState({servingsValue: checkValue});
		for (var i = 0; i < this.state.amountParsed.length; i++) {
			newAmountParsed[i] = ((checkValue / this.state.servings) * this.state.amountParsed[i]).toFixed(2);
		};
		this.setState({servingsCalculated: newAmountParsed});

	}

	showZoomedImage (mouseState) {
		console.log(mouseState);
		this.setState({index: mouseState});

	}

	disableDiv(e) {
		console.log(e);
		console.log(e.target);
		console.log(e.target.name)
		if (e.target.name != "largeImage") {
			this.setState({
		       	disableDiv:true
		    });
		}
	    
	}

	enableDiv() {
	    this.setState({
	       	disableDiv:false
	    });
	}


	render(){
		var divStyle = {
			display:this.state.disableDiv?'none':'block',
			zIndex:this.state.disableDiv?'-1':'3',
			position: "absolute",
        	padding:0,
        	margin:0,
        	top:0,
        	left:0,
        	width: "100%",
        	height: "100%",
        	
		};

		var divOpacity = {
			display:this.state.disableDiv?'none':'block',
			zIndex:this.state.disableDiv?'-1':'2',
			backgroundColor: "grey",
			position: "absolute",
        	padding:0,
        	margin:0,
        	top:0,
        	left:0,
        	width: "100%",
        	height: "100%",
        	opacity: "0.9"
			
		};
		
		return(
			<div id="recipeContent"> 
				<HeaderMenu ref="searchBar"/>
				<div id="recipeName">
					<h1>
						{this.state.recipeName}
					</h1>
				</div>

				<div id="sidebar">
					<div id="ingredients">
						<h2>Ingredienser: </h2>
						<input type="number" onChange={this.onChange} value={this.state.servingsValue} id="inputServings"/>
						<RenderIngredients ingredients={this.state.ingredients} amounts={this.state.amount} amountsParsed={this.state.servingsCalculated}/>
					</div>

					<div id="imageContainer">
						<br />
						<br />
						<RenderImg img={this.state.imgPath} imageClick={this.showZoomedImage} enable={this.enableDiv}/>
					</div>
				</div>

				<div id="recipeContainer">
					<div id="recipe">
						<h2>
							Slik gjør du: <br/>
						</h2>
						<RenderRecipe recipe={this.state.recipe} />
						<br />
						<br />
						<br />
						
					</div>
				</div>

				<div name="backgroundOpacity" style={divOpacity}>
				</div>
				<div name="zoomedImage" style={divStyle} onClick={this.disableDiv}>
					<div name="largeImageContainer" id="largeImageContainer">
						<LargeImage img={this.state.imgPath} index={this.state.index} name="largeImage" onClick={this.disableDiv}/>
					</div>
				</div>
				
			
			
			</div>
			);
	}
}
module.exports = ShowRecipeList;