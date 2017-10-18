import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import UploadHandler from '../components/UploadHandler';
import Keyword from '../components/KeywordTags';
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import RichEditorInstantiateWithText from '../components/RichEditorInstantiateWithText';

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
    this.export = this.export.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    
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
      keywordTags: [],
      imgPath: [],
      raw: {}
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
  export(content) {
    this.setState({
      raw: JSON.stringify(content)
    });
  }
  onSuccess (uploadPath) {
    console.log(uploadPath);
    var tempArray = this.state.imgPath;
    for (var i = 0; i < uploadPath.length; i++){
      console.log(uploadPath[i]['name'])
      console.log(this.state.imgPath.indexOf(uploadPath[i]['name']))
      if (this.state.imgPath.indexOf(uploadPath[i]['name']) == -1){
        tempArray = this.state.imgPath.concat(uploadPath[i]['name'])
      }
    }
    this.setState({
      imgPath: tempArray 
    });
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
    for (var l = 0; l < this.state.keywordTags.length; l++) {
      tempArrayK[l] = this.state.keywordTags[l]['text'];
    }
    console.log(tempArrayK);
    //Getting successfull image uploads and placing the imageID in a array
    var postData = {
      name: this.state.RecipeName,
      desc: this.state.ShortDescription,
      recipe: this.state.raw,
      ingredients: tempArrayI,
      amount: tempArrayA,
      tags: tempArrayK,
      files: this.state.imgPath,
      author: "",
      servings: this.state.RecipeServings
    };
    console.log(postData);
    $.ajax ({
      method: 'POST',
      url: "http://mathjørnet.net:3333/recipe",
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
        <form >
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
          <br />
          <div className="editor" >
            <RichEditorInstantiateWithText exportContent={this.export} imgPaths={this.state.imgPath}/>
          </div>
          <br />
          <br />
          <Keyword ref="keywords" id="keywordTags" propTags={this.state.keywordTags}/>
          <br />
          <br />
          <input type="submit" onClick={this.submitForm}/>
          <br />
          <br />
          <UploadHandler successProp={this.onSuccess} ref="aTest"/>
          <br />
          <br />
        </form>
      </div>
    );
  }
}
module.exports = Submit;