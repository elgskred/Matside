var React = require('react');
var DefaultLayout = require('./layouts/default');

class HelloMessage extends React.Component {
  render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Hello {this.props.name} <br />
        	Occupation {this.props.occupation} <br />
        	Age of {this.props.name} is {this.props.age} <br />
        </div>
      </DefaultLayout>
    );
  }
}

module.exports = HelloMessage;