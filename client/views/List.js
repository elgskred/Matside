import React from 'react';

class List extends React.Component {
	constructor(props){
		super(props);
		this.printConsole = this.printConsole.bind(this);
		this.state = {
			params: ""
		}
	}

	componentDidMount () {
		console.log("Koden kjører");
	}

	printConsole (e) {
		e.preventDefault();
		console.log(this.props);
		console.log("Hello World");
	};

	render() {
		return(
			<div id="testDIV">
				Dette er en testside som jeg vil at skal fungere
				{this.props.params.var}
				<button type="button" onClick={this.printConsole}>Push me</button>
			</div>
			);
	}

}
module.exports = List;
