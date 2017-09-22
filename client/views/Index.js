import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Dropzone from 'react-dropzone';
import DropzoneComponent from '../components/DropzoneComponent';
import Keyword from '../components/KeywordTags';

class AddIngredient extends React.Component {
  constructor(){
    super();
    this.onChange = this.onChange.bind(this);

    this.state = {
      ingredient: "",
      amount: ""
    }
  };

  onChange (e) {
    var t = {};
    var id = e.target.name
    t[id] = e.target.value
    this.setState(t);
  };

  render() {
    return (
      <div id="i">
        <input type="text" placeholder="Mendge" id={ `amount${this.props.index}` } onChange={this.onChange} name="amount" value={this.state.amount} className="inputFieldDefault"/>
        <input type="text" placeholder="Ingrediens" id={ `ingredient${this.props.index}` } name="ingredient" onChange={this.onChange} value={this.state.ingredient} className="inputFieldDefault"/>
      </div>
      );
  }
};

class Submit extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.addIngredientField = this.addIngredientField.bind(this);
    //Inital data
    this.state = {
      RecipeName: "",
      ShortDescription: "",
      RecipeDescription: "",
      ingredient: "",
      amount: "",
      recipeListe: [],
      ingredientList: [],
      RecipeServings: 2,
      keywords: []
    };
  };
  onChange (e) {
    var t = {};
    var id = e.target.id
    t[id] = e.target.value
    this.setState(t);
  };
  addIngredientField (e) {
    e.preventDefault();
    const ingredientList = this.state.ingredientList.concat(AddIngredient);
    this.setState({ingredientList});
  }

  //Preventing default submit behaviour so we can add our own
  submitForm (e) {
    e.preventDefault();
    console.log("submit");
    var len = this.state.ingredientList.length;
    var tempArrayI = []; //Ingredient
    var tempArrayA = []; //Amount
    var tempArrayK = []; //Keywords
    var tempArrayD = []; //Data

    //Getting ingredients and ingredient amounts and placing the values in two arrays
    for (var i = 0; i < len; i++) {
      tempArrayI[i] = document.getElementById("ingredient" + i).value;
      tempArrayA[i] = document.getElementById("amount" + i).value;
    }
    console.log("tempIA");
    //Getting keyword tags
    var keywordTags = this.refs.keywords.state.tags;
    console.log(keywordTags.length);
    for (var l = 0; l < keywordTags.length; l++) {
      tempArrayK[l] = keywordTags[l]['text'];
    }
    console.log(tempArrayK);
    //Getting successfull image uploads and placing the imageID in a array
    var successArray = this.refs.upload.state.success;
    console.log(successArray.length);
    for (var j = 0; j < successArray.length; j++) {
      tempArrayD[j] = successArray[j].xhr.response;
    }
    var postData = {
      name: this.state.RecipeName,
      desc: this.state.ShortDescription,
      recipe: this.state.RecipeDescription,
      ingredients: tempArrayI,
      amount: tempArrayA,
      tags: tempArrayK,
      files: tempArrayD,
      author: "",
      servings: this.state.RecipeServings
    };
    console.log(postData);
    $.ajax ({
      method: 'POST',
      url: "http://awesomesauce-gaming.net:3333/recipe",
      data: postData,
      success: (data) => {
        console.log(data);
        this.setState({
          recipeListe: data
        });
      }
    });

  };

  render() {
    const ingredientList = this.state.ingredientList.map((Element, index) => {
      return <Element key={ index } index={ index } />
    });

    return (

      <div id="uploadContainer">
        <form onSubmit={this.submitForm}>
          <br />
          <input type="text" placeholder="RecipeName" onChange={this.onChange} value={this.state.RecipeName} className="inputFieldDefault" id="RecipeName"/>
          <br />
          <br />
          <input type="text" placeholder="Short description" onChange={this.onChange} value={this.state.ShortDescription} className="inputFieldLong" id="ShortDescription"/>
          <br />
          <br />
          <div id="RecipeIngredients">
            <div className="textField1"><b>Mendge:</b></div><div className="textField1"><b>Ingrediens</b></div>
            <br />
            { ingredientList }
            <button onClick = {this.addIngredientField}> Add Ingredient</button>
          </div>
          <br />
          <br />
          <br />
          Servings:
          <input type="number" placeholder="2" id="RecipeServings" onChange={this.onChange} value={this.state.RecipeServings} />
          <br />
          <br />
          <textarea rows="25" cols="150" id="RecipeDescription" placeholder="Slik gjør du" onChange={this.onChange} value={this.state.RecipeDescription}/>
          <br />
          <br />
          <Keyword ref="keywords"/>
          <br />
          <br />
          <input type="submit" />
          <br />
          <br />
          <DropzoneComponent ref="upload"/>
        </form>
      </div>
    );
  }
}
module.exports = Submit;