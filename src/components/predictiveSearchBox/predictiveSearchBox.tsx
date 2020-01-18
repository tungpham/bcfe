import React, { Component } from 'react';
import {  withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import styles from './PredictiveSearchBox.styles';
export class PredictiveSearchBox extends Component<any,any> {
  static propTypes = {
    options: PropTypes.instanceOf(Array).isRequired
  };
  state = {
    activeOption: 0,
    filteredOptions: [],
    showOptions: false,
    userInput: '',
    addBtnShow: false,
  };
  onChange = (e) => {
    const { options } = this.props;
    const userInput = e.currentTarget.value;

    const filteredOptions = options.filter(
      (option) =>
        option.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    this.setState({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value
    }, () => {
      this.setText();
    });
  };
  setText = () => {
    if(this.state.userInput !== "" && this.state.userInput !== null)
    localStorage.setItem('specialitie', this.state.userInput.charAt(0).toUpperCase() + this.state.userInput.slice(1));
  }
  onClick = (e) => {
    this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText
    }, ()=>{
      this.setText();
    });
  };
  autoScrollView = () => {
    var activeElement = document.getElementById(`item${this.state.activeOption}`);
    var optionListView = document.getElementById("option-list");
    optionListView.scrollTop = activeElement.offsetTop;
  }
  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;
    
    if (e.keyCode === 13) {
      if(filteredOptions[activeOption] === undefined || filteredOptions[activeOption] === null) return;
      if(this.state.addBtnShow === true)
      {
        return;
      }
      this.setState({
        // activeOption: 0,
        showOptions: false,
        userInput: filteredOptions[activeOption].name
      },()=>{
        this.setText();
      });
    } else if (e.keyCode === 38) {
      e.preventDefault();
      if (activeOption === 0) {
        return;
      }
      this.setState({ activeOption: activeOption - 1 },()=>{
        this.autoScrollView();
      });
    } else if (e.keyCode === 40) {
      e.preventDefault();
      if (activeOption === filteredOptions.length - 1) {
        return;
      }
      this.setState({ activeOption: activeOption + 1 },()=>{
        this.autoScrollView();
      });
    }
  };
  
  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: { activeOption, filteredOptions, showOptions, userInput }
    } = this;
    const {classes} = this.props;
    let optionList;
    if (showOptions && userInput) {
      if (filteredOptions.length) {
        optionList = (
          <ul className={classes.options} id = "option-list">
            {filteredOptions.map((option, index) => {
              let className;
              if (index === activeOption) {
                className = classes.optionActive;
              }
              return (
                <li className={className} key={option.name} onClick={onClick} id = {`item${index}`}>
                  {option.name}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
           null
        );
      }
    }
    return (
      <div style = {{display:"flex", alignContent:"center"}}>
        <div className = {classes.predictiveSearchArea}>
            <div className={classes.search}>
            <input
                type="text"
                className={classes.searchBox}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                placeholder = "search reviews"
            />
            <input type="submit" value="" className={classes.searchBtn} />
            </div>
            {optionList}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PredictiveSearchBox);
