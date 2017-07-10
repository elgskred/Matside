import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import DropzoneComponent from '../components/DropzoneComponent';
import Keyword from '../components/KeywordTags';

class RenderImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredient: "",
      amount: ""
    }
  }

  render() {
    const listImg = this.props.img.map((item, index) =>
      <img src={'../public/uploads/' + item} alt="404.png" key={index} />
    );
    return(
      <div className="recipeImg">
        {listImg}
      </div>
    );
  }
}

class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    }
    this.onChange = this.onChange.bind(this);
  }
  onChange (e) {
    this.props.updateState(e.target.value, this.props.id, this.props.index);
    this.setState({
      value: e.target.value
    });
  }
  render(){
    return(
      <input type="text" placeholder={this.props.placeholder} name={this.props.id} onChange={this.onChange} value={this.state.value}/>
    );
  }
}

class EditRecipe extends React.Component {

constructor(props){
    super(props);
    this.state = {
      UID: "",
      ingredients: [],
      amounts: [],
      amountParsed: [],
      recipe: "",
      recipeName: "",
      servings: 2,
      imgPath: [],
      shortDesc: "",
      testing: []
    }
    this.addIngredientField = this.addIngredientField.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.submitForm = this.submitForm.bind(this);
  };

  onChange (e) {
    var t = {};
    var id = e.target.id
    t[id] = e.target.value
    this.setState(t);
  };  

  addIngredientField (e) {
    e.preventDefault();
    const ingredients = this.state.ingredients.concat("");
    const amounts = this.state.amounts.concat("");
    this.setState({ingredients, amounts});
  }

  updateState(value, id, index) {
    var temp = {};
    var temp2 = [];
    if (index == undefined){
      temp[id] = value;
      this.setState(temp);
    }
    if (index != undefined){
      if (id == "ingredients") {
        temp2 = this.state.ingredients;
        temp2[index] = value;
        temp[id] = temp2;
        this.setState(temp);
      } else if(id == "amounts") {
        temp2 = this.state.amounts;
        temp2[index] = value;
        temp[id] = temp2;
        this.setState(temp);
      }
    }
  }

componentDidMount () {
  $.ajax ({
    method: 'GET',
    url: "http://localhost:3333/recipes/" + this.props.params.UID,
    success: (data) => {
      console.log(data);
      var tempUID = [];
      var tempRecipeName = [];
      var tempRecipe = [];
      var tempShortDesc = [];
      var tempIngredients = [];
      var tempAmount = [];
      var tempImgPath = [];
      for (var i = 0; i < data[0].length; i++) {
        tempUID = data[0][i]['UID'];
        tempRecipeName = data[0][i]['recipeName'];
        tempRecipe = data[0][i]['recipeDescription'];
        tempShortDesc = data[0][i]['shortDescription'];
      }
      for (var i = 0; i < data[1].length; i++) {
        tempIngredients = tempIngredients.concat(data[1][i]['ingredient_name']);
        tempAmount = tempAmount.concat(data[1][i]['ingredient_amount']);
      }
      for (var i = 0; i < data[2].length; i++) {
        tempImgPath = tempImgPath.concat(data[2][i]['imagePath']);
      }
      this.setState({
        UID: tempUID,
        recipeName: tempRecipeName,
        recipe: tempRecipe,
        shortDesc: tempShortDesc,
        ingredients: tempIngredients,
        amounts: tempAmount,
        imgPath: tempImgPath
      });
    }
  });
}

submitForm (e) {
  e.preventDefault();
  console.log(this.state);
  $.ajax ({
      method: 'POST',
      url: "http://localhost:3333/updateRecipe",
      data: this.state,
      success: (data) => {
        console.log(data);
        this.setState({
          recipeListe: data
        });
      }
    });
}

render() {
  const ingredientsList = this.state.ingredients.map((item, index) =>{
    return(
      <div>
        <TextField placeholder={this.state.ingredients[index]} id="ingredients" index={index} updateState={this.updateState} />
      </div>
      )
  });
  const amountsList = this.state.amounts.map((item, index) =>{
    return(
      <div>
        <TextField placeholder={this.state.amounts[index]} id="amounts" index={index} updateState={this.updateState} />
      </div>
    )
  });  
  console.log(ingredientsList);

    return (
      <div id="recipe">
        <form onSubmit={this.submitForm}>
          <br />
          <TextField placeholder={this.state.recipeName} id="recipeName" updateState={this.updateState}/>
          <br />
          <br />
            <TextField placeholder={this.state.shortDesc} id="shortDesc" updateState={this.updateState}/>
          <br />
          <br />
          <div id="ingredientsList">
            {ingredientsList}
          </div>
          <div id="amountsList">
            {amountsList}
          </div>  
          <br />
          <button onClick = {this.addIngredientField}> Add Ingredient</button>
          <br />
          <br />
          <textarea rows="5" cols="50" id="recipe" placeholder="Slik gjør du" onChange={this.onChange} value={this.state.recipe}/>
          <br />
          <br />
          <br />
          <br />
          <input type="submit" />
          <br />
          <br />
          <DropzoneComponent ref="aTest"/>
          <RenderImg img={this.state.imgPath} />
        </form>
      </div>
    );
  }
}





module.exports = EditRecipe;