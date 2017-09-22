import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
//import DropzoneComponent from '../components/DropzoneComponent';
import DropzoneComponent from 'react-dropzone-component';
import Keyword from '../components/KeywordTags';


class RenderImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredient: "",
      amount: ""
    }
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  onImgLoad({target:img}) {
    console.log("Height:" + img.offsetHeight);
    console.log("Width:" + img.offsetWidth);
  }

  render() {
    const listImg = this.props.img.map((item, index) =>
      <img src={'../public/uploads/' + item} alt="404.png" key={index} onLoad={this.onImgLoad} style={{width:300}}/>
    );
    return(
      <div className="recipeImg">
        {listImg}
      </div>
    );
  }
}
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            success: []
        }

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "image/jpeg,image/png,image/gif",
            maxFilesize: 3
        };

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: 'http://mathjørnet.net:3333/uploadHandler'
        };

        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

        // Simple callbacks work too, of course
        this.callback = () => console.log('Hello!');

        //this.success = file => this.setState({ success: file});
        this.success = file => {
            const success = this.state.success.concat(file)
            this.setState({success});
            this.props.onSuccess(success);
        }
        

        //this.success = file => console.log('uploaded', file);

        this.removedfile = file => console.log('removing...', file);

        this.dropzone = null;
    }

    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;

        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            drop: this.callbackArray,
            addedfile: this.callback,
            success: this.success,
            removedfile: this.removedfile
        }

        return <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
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
      testing: [],
      keywordTags: [],
      keywordsSend: []
    }
    this.addIngredientField = this.addIngredientField.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  };

  onChange (e) {
    var t = {};
    var id = e.target.id
    t[id] = e.target.value
    this.setState(t);
  };  

  onSuccess (imgpath) {
    var tempArray = [];
    for (var i = 0; i < imgpath.length; i++) {
      tempArray = tempArray.concat(imgpath[i].xhr.response);
    }
    this.setState({
      imgPath: tempArray 
    });
  } 

  addIngredientField (e) {
    e.preventDefault();
    const ingredients = this.state.ingredients.concat("");
    const amounts = this.state.amounts.concat("");
    const id = this.state.ingredient_id.concat(null);
    this.setState({ingredients, amounts, id});
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
    url: "http://awesomesauce-gaming.net:3333/recipes/" + this.props.params.UID,
    success: (data) => {
      console.log(data);
      var tempUID = [];
      var tempRecipeName = [];
      var tempRecipe = [];
      var tempShortDesc = [];
      var tempIngredients = [];
      var tempAmount = [];
      var tempIngredientID = [];
      var tempImgPath = [];
      var tempServings = "";
      var tempKeywords = [];
      var t = {};
      for (var i = 0; i < data[0].length; i++) {
        tempUID = data[0][i]['UID'];
        tempRecipeName = data[0][i]['recipeName'];
        tempRecipe = data[0][i]['recipeDescription'];
        tempShortDesc = data[0][i]['shortDescription'];
        tempServings = data[0][i]['servings'];
      }
      for (var i = 0; i < data[1].length; i++) {
        tempIngredients = tempIngredients.concat(data[1][i]['ingredient_name']);
        tempAmount = tempAmount.concat(data[1][i]['ingredient_amount']);
        tempIngredientID = tempIngredientID.concat(data[1][i]['ingredient_id']);
      }
      for (var i = 0; i < data[2].length; i++) {
        tempImgPath = tempImgPath.concat(data[2][i]['imagePath']);
      }
      for (var i = 0; i < data[3][0].length; i++) {
        t = {id: i, text: data[3][0][i]['keyword']};
        tempKeywords = tempKeywords.concat(t);
      }
      console.log(tempKeywords);
      this.setState({
        UID: tempUID,
        recipeName: tempRecipeName,
        recipe: tempRecipe,
        shortDesc: tempShortDesc,
        ingredients: tempIngredients,
        amounts: tempAmount,
        ingredient_id: tempIngredientID,
        keywordTags: tempKeywords,
        imgPath: tempImgPath,
        servings: tempServings
      });
    }
  });
}

submitForm (e) {
  e.preventDefault();
  console.log(this.state);
  $.ajax ({
      method: 'POST',
      url: "http://awesomesauce-gaming.net:3333/updateRecipe",
      data: this.state,
      success: (data) => {
        console.log("Update Success");
      }
    });
}

render() {
  const ingredientsList = this.state.ingredients.map((item, index) =>{
    return(
      <div>
        <TextField placeholder={this.state.ingredients[index]} id="ingredients" index={index} updateState={this.updateState} className="inputFieldDefault"/>
      </div>
      )
  });
  const amountsList = this.state.amounts.map((item, index) =>{
    return(
      <div>
        <TextField placeholder={this.state.amounts[index]} id="amounts" index={index} updateState={this.updateState} className="inputFieldDefault"/>
      </div>
    )
  });  
  console.log(ingredientsList);

    return (
      <div id="editForm">
        <form onSubmit={this.submitForm}>
          <br />
          <input type="text" placeholder={this.state.recipeName} updateState={this.updateState} className="inputFieldDefault"/>
          <br />
          <br />
          <input type="text" placeholder={this.state.shortDesc} updateState={this.updateState} className="inputFieldLong"/>
          <br />
          <br />
          <div id="amountsList">
            <p>Mendge:</p>
            {amountsList}
          </div> 
          <div id="ingredientsList">
            <p>Ingredienser:</p>
            {ingredientsList}
          </div>
          <br />
          <button onClick = {this.addIngredientField}> Add Ingredient</button>
          <br />
          <br />
          <textarea rows="25" cols="150" id="recipe" placeholder="Slik gjør du" onChange={this.onChange} value={this.state.recipe}/>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Keyword id="keywordTags" propTags={this.state.keywordTags} ref="keywordTagComponent"/>
          <br />
          <br />
          <input type="submit" />
          <br />
          <br />
          <Example onSuccess={this.onSuccess} ref="aTest"/>
          <RenderImg img={this.state.imgPath} />
        </form>
      </div>
    );
  }
}





module.exports = EditRecipe;