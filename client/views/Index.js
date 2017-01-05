import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import DropzoneComponent from '../components/DropzoneComponent';

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

// var DropzoneDemo = React.createClass({
//     getInitialState: function () {
//         return {
//           files: []
//         };
//     },
 
//     onDrop: function (acceptedFiles) {
//       this.setState({
//         files: acceptedFiles
//       });
//       var req = request.post('http://localhost:3333/uploadHandler');
//         acceptedFiles.forEach((file)=> {
//             req.attach(file.name, file);
//         });
//       req.end("callback");
//     },
    
//     onOpenClick: function () {
//       this.dropzone.open();
//     },
 
//     render: function () {
//         return (
//             <div>
//                 <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop} multiple={true}>
//                     <div>Try dropping some files here, or click to select files to upload.</div>
//                 </Dropzone>
//                 {this.state.files.length > 0 ? <div>
//                 <h2>Uploading {this.state.files.length} files...</h2>
//                 <div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
//                 </div> : null}
//             </div>
//         );
//     }
// });

class Submit extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.addIngredientField = this.addIngredientField.bind(this);
    //Inital data
    this.state = {
      navn: "",
      oppskrift: "",
      ingredient: "",
      amount: "",
      oppskriftListe: [],
      testing: [],
      keywords: ""
    };
  };
  onChange (e) {
    var t = {};
    var id = e.target.id
    t[id] = e.target.value
    this.setState(t);
  };
  //If the ingredients field is filled and tab is pressed while in the "amount" field, add a new one
  addIngredientField (e) {
    e.preventDefault();
    const testing = this.state.testing.concat(AddIngredient);
    this.setState({testing});
  }

  //Preventing default submit behaviour so we can add our own
  submitForm (e) {
    e.preventDefault();
    var len = this.state.testing.length;
    var tempArrayI = [];
    var tempArrayA = [];
    var tempArrayD = [];
    for (var i = 0; i < len; i++) {
      tempArrayI[i] = document.getElementById("ingredient" + i).value;
      tempArrayA[i] = document.getElementById("amount" + i).value;
    }
    var successArray = this.refs.aTest.state.success;
    console.log(successArray.length);
    for (var j = 0; j < successArray.length; j++) {
      tempArrayD[j] = successArray[j].xhr.response;
      console.log(successArray[j].xhr.response);
    }
    console.log(tempArrayD);
    var postData = {
      navn: this.state.navn,
      Oppskrift: this.state.oppskrift,
      Ingredients: tempArrayI,
      Amount: tempArrayA,
      Files: tempArrayD
      
    }

    $.ajax ({
      method: 'POST',
      url: "http://localhost:3333/oppskrift",
      data: postData,
      success: (data) => {
        console.log(data);
        this.setState({
          oppskriftListe: data
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
          <input type="text" placeholder="Oppskrift" id="navn" onChange={this.onChange} value={this.state.navn}/>
          <br />
          <br />
          <div id="ingredients">
            { testing }
            <button onClick = {this.addIngredientField}> Add Ingredient</button>
          </div>
          <div id="newingredient">

          </div>
          <br />
          <br />
          <textarea rows="5" cols="50" id="oppskrift" placeholder="Slik gjør du" onChange={this.onChange} value={this.state.oppskrift}/>
          <br />
          <br />
          <input type="text" id="keywords" placeholder="Nøkkelord" onChange={this.onChange} value={this.state.keywords}/>
          <br />
          <br />
          <input type="submit" />
          <br />
          <br />
          <DropzoneComponent ref="aTest"/>
        </form>
        <Link to="/list">Se oppskrifter</Link>
      </div>
    );
  }
}
module.exports = Submit;