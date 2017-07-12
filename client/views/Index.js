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
        <input type="text" placeholder="Mendge" id={ `amount${this.props.index}` } onChange={this.onChange} name="amount" value={this.state.amount} />
        <input type="text" placeholder="Ingrediens" id={ `ingredient${this.props.index}` } name="ingredient" onChange={this.onChange} value={this.state.ingredient} />
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
      name: "",
      desc: "",
      recipe: "",
      ingredient: "",
      amount: "",
      recipeListe: [],
      testing: [],
      keywords: "",
      servings: 2
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
    const testing = this.state.testing.concat(AddIngredient);
    this.setState({testing});
  }

  //Preventing default submit behaviour so we can add our own
  submitForm (e) {
    e.preventDefault();
    console.log("submit");
    var len = this.state.testing.length;
    var tempArrayI = [];
    var tempArrayA = [];
    var tempArrayD = [];

    //Getting ingredients and ingredient amounts and placing the values in two arrays
    for (var i = 0; i < len; i++) {
      tempArrayI[i] = document.getElementById("ingredient" + i).value;
      tempArrayA[i] = document.getElementById("amount" + i).value;
    }
    console.log("tempIA");
    //Getting successfull image uploads and placing the imageID in a array
    var successArray = this.refs.aTest.state.success;
    console.log(successArray.length);
    for (var j = 0; j < successArray.length; j++) {
      tempArrayD[j] = successArray[j].xhr.response;
    }
    console.log("tempBilde")
    //Getting the keywords from the component and puts them in a array

    var postData = {
      name: this.state.name,
      desc: this.state.desc,
      recipe: this.state.recipe,
      ingredients: tempArrayI,
      amount: tempArrayA,
      files: tempArrayD,
      author: "",
      servings: this.state.servings
    };
    console.log(postData);
    $.ajax ({
      method: 'POST',
      url: "http://localhost:3333/recipe",
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
    const testing = this.state.testing.map((Element, index) => {
      return <Element key={ index } index={ index } />
    });

    return (
      <div id="recipe">
        <form onSubmit={this.submitForm}>
          <br />
          <input type="text" placeholder="recipe" id="name" onChange={this.onChange} value={this.state.name}/>
          <br />
          <br />
          <input type="text" placeholder="short description" onChange={this.onChange} value={this.state.desc} id="desc" />
          <br />
          <br />
          <div id="ingredients">
            { testing }
            <button onClick = {this.addIngredientField}> Add Ingredient</button>
          </div>
          <br />
          Servings:
          <input type="number" placeholder="2" id="servings" onChange={this.onChange} value={this.state.servings} />
          <br />
          <br />
          <textarea rows="5" cols="50" id="recipe" placeholder="Slik gjør du" onChange={this.onChange} value={this.state.recipe}/>
          <br />
          <br />
          <br />
          <input type="submit" />
          <br />
          <br />
          <DropzoneComponent ref="aTest"/>
        </form>
        <Link to="/list">Se recipeer</Link>
      </div>
    );
  }
}
module.exports = Submit;