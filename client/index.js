
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import Index from './views/Index';
import List from './views/List';
import Header from './components/Header';
import Home from './views/home';
import Recipe from './views/Recipe';

//import app from './views/app'


render((
	<Router history={hashHistory}>
		<Route path="/" component={Home}/>
		<Route path="/index" component={Index}/>
		<Route path="/list(/:query)" component={List}/>
		<Route path="/recipe(/:UID)" component={Recipe} />
	</Router>
), document.getElementById('app'))
