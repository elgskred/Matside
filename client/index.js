
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import Index from './views/Index'
import List from './views/List'
//import app from './views/app'

render((
	<Router history={hashHistory}>
		<Route path="/" component={Index}/>
		<Route path="/list" component={List}/>
	</Router>
), document.getElementById('app'))
