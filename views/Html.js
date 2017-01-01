var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Index = require('./Index');
var List = require('./List');

class Html extends React.Component {

  render() {
    var data = this.props.data;
    var rend = this.props.render;
    if (rend == 'Index') {
      console.log("Index");
      var contentHtml = ReactDOMServer.renderToString(<Index {...data}/>);
      var initScript = 'main(' + JSON.stringify(data).replace(/script/g, 'scr"+"ipt') + ')';
    } else if (rend == 'List') {
      var contentHtml = ReactDOMServer.renderToString(<List {...data}/>);
      var initScript = 'ListScript(' + JSON.stringify(data).replace(/script/g, 'scr"+"ipt') + ')';
      console.log("List");
    };
    
    

    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"/>
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{__html: contentHtml}}/>

          <script src="/main.js"></script>
          <script src="http://code.jquery.com/jquery-1.10.0.min.js"></script>
          <script dangerouslySetInnerHTML={{__html: initScript}} />

        </body>
      </html>
    );
  }

}

module.exports = Html;
