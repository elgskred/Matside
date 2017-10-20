import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import { CSSTransitionGroup } from 'react-transition-group'


class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      menuActive: false
    };
  }

  toggleMenu() {
    let menuState = !this.state.menuActive;
    this.setState({
      menuActive: menuState
    });
  }

  render() {
    let menu;
    if(this.state.menuActive) {
      menu = <div name="DropDown-dropdown">
                <ul className="DropDown-list">
                  <li>First Item </li>
                  <li>Second Item </li>
                  <li>Third Item </li>
                  <li>First Item </li>
                </ul>
              </div>
    } else {
      menu = "";
    }
   return (
      <div id = "DropDown-menu" onClick = { this.toggleMenu }>
        <button className = "DropDown-dropDownBtn"> {this.props.name}</button><i className = "fa fa-angle-down" />
        <CSSTransitionGroup transitionName = "menu" transitionEnterTimeout={1000} transitionLeaveTimeout={1} name="DropDown-dropdown">
          {menu}
        </CSSTransitionGroup>
      </div>
    )
  }
}


module.exports = DropDown;