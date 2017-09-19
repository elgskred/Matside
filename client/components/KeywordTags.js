import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

class Keywords extends React.Component {
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.state = {
			tags: [],
			suggestions: []
		};
	}

	handleDelete (i) {
		let tags = this.state.tags;
		tags.splice(i, 1);
		this.setState({tags: tags});
	}

	handleAddition (tag) {
		let tags = this.state.tags;
		tags.push({
			id: tags.length + 1,
			text: tag
		});
		this.setState({tags: tags});
		console.log(this.state.tags);
	}

	handleDrag (tag, currPos, newPos) {
		let tags = this.state.tags;
		tags.splice(currPos, 1);
		tags.splice(newPos, 0, tag);

		this.setState({tags: tags});
	}

	render() {
		let tags = this.state.tags;
		let suggestions = this.state.suggestions;
		return (
			<div>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} />
            </div>
		);
	}
}

module.exports = Keywords;
