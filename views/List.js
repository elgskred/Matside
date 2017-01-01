var React = require('react');

class List extends React.Component {

	printConsole (e) {
		e.preventDefault();
		console.log("Hello World");
	};

	render() {
		return(
			<div id="testDIV">
				Dette er en testside
				{this.props.data}
				<button type="button" onClick={this.printConsole}>Push me</button>
			</div>
			);
	}

}

module.exports = List;