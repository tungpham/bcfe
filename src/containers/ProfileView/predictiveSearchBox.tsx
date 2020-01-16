import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  withStyles, StyledComponentProps } from '@material-ui/core/styles';
import styles from './predictiveSearchBox.styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
interface PredictiveSearchBoxProps extends StyledComponentProps{
  parentIns: any;
  options:any[];
}
export class PredictiveSearchBox extends Component<PredictiveSearchBoxProps,any> {
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
  checkAddButton = () => {
     if(this.props.options.filter(opt=>opt.name === this.state.userInput).length === 1){
        this.setState({
            addBtnShow: true
        })
     } else {
        this.setState({
            addBtnShow: false
        })
     }
  }
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
        this.checkAddButton()
    });
  };

  onClick = (e) => {
    this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText
    }, ()=>{
       this.checkAddButton()
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
        this.addSpe();         
        return;
      }
      this.setState({
        activeOption: 0,
        showOptions: false,
        userInput: filteredOptions[activeOption].name
      },()=>{
         this.checkAddButton()
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
      this.setState({ activeOption: activeOption + 1 }, ()=>{
         this.autoScrollView();
      });
     
    }
  };
  addSpe = () => {
      this.setState({
          userInput: ''
      })
      var _specs = [...this.props.parentIns.state.specs];
      _specs.push(this.state.userInput);
      this.props.parentIns.setState({
        specs: _specs
      }, ()=>{
          this.props.parentIns.saveSpecialty();
      })
  }
  render() {
    const {
      onChange,
      onClick,
      onKeyDown,

      state: { activeOption, filteredOptions, showOptions, userInput }
    } = this;
    let optionList;
    const {classes} = this.props;
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
      <div style = {{display:"flex", alignItems:"center"}}>
        <div className = {classes.predictiveSearchArea}>
            <div className={classes.search}>
            <input
                type="text"
                className={classes.searchBox}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                placeholder = "Select your specialties"
            />
            <input type="submit" value="" className={classes.searchBtn} />
            </div>
            {optionList}
        </div>
        {
            this.state.addBtnShow === true ? (
              <Fab 
                color="primary" 
                aria-label="add"
                size="small"
                onClick = {this.addSpe}
                style = {{marginLeft:"10px"}}
              >
                <AddIcon />
              </Fab>
            ) : (null)
        }
      </div>
    );
  }
}

export default withStyles(styles)( PredictiveSearchBox );
