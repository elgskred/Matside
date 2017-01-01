var React = require('react');
var ReactDOM = require('react-dom');
var List = require('./List');


module.exports = function (data, containerId) {
  var container = document.getElementById(containerId || 'content');
  ReactDOM.render(
    <List {...data} />,
    container
  );
};