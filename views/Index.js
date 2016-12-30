var React = require('react');



class TodoApp extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    //Inital data
    this.state = {
      navn: "",
      beskrivelse: "",
      oppskrift: ""
    };
  }
  onChange (e) {
    console.log(e.target.id);
    var t = {};
    var id = e.target.id
    t[id] = e.target.value
    this.setState(t);
  };
  //Preventing default submit behaviour so we can add our own
  submitForm (e) {
    e.preventDefault();
    console.log(this.state);
    $.ajax ({
      method: 'POST',
      url: "http://localhost:3333/oppskrift",
      data: this.state,
      success: (data) => {
        console.log(data);
      }
    });

  };
  render() {
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <br />
          <input type="text" placeholder="Oppskrift" id="navn" onChange={this.onChange} value={this.state.navn}/>
          <br />

          <br />
          <input type="text" placeholder="Beskrivelse" id="beskrivelse" onChange={this.onChange} value={this.state.beskrivelse}/>
          <br />
          <br />
          Slik gjør du:
          <br />
          <textarea rows="5" cols="50" id="oppskrift" onChange={this.onChange} value={this.state.oppskrift}/>
          <br />
          <br />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

module.exports = TodoApp;