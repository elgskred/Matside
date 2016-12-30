var React = require('react');
var ReactDOM = require('react-dom');
var Index = require('./Index');


module.exports = function (data, containerId) {
  var container = document.getElementById(containerId || 'content');
  ReactDOM.render(
    <Index {...data} />,
    container
  );
};