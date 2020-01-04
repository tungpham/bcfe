import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/CustomButtons/Button';
import './predictiveSearchBox.scss';
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
  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;

    if (e.keyCode === 13) {
      if(filteredOptions[activeOption] === undefined || filteredOptions[activeOption] === null) return;
      if(this.state.addBtnShow == true)
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
      if (activeOption === 0) {
        return;
      }
      this.setState({ activeOption: activeOption - 1 });
    } else if (e.keyCode === 40) {
      if (activeOption === filteredOptions.length - 1) {
        return;
      }
      this.setState({ activeOption: activeOption + 1 });
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
    if (showOptions && userInput) {
      if (filteredOptions.length) {
        optionList = (
          <ul className="options">
            {filteredOptions.map((option, index) => {
              let className;
              if (index === activeOption) {
                className = 'option-active';
              }
              return (
                <li className={className} key={option.name} onClick={onClick}>
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
      <div style = {{display:"flex", justifyContent:"center", alignContent:"center"}}>
        <div className = "predictive-search-area">
            <div className="search">
            <input
                type="text"
                className="search-box"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                placeholder = "Select your specialties"
            />
            <input type="submit" value="" className="search-btn" />
            </div>
            {optionList}
        </div>
        {
            this.state.addBtnShow === true ? (
                <Button color = "primary" variant = "contained"
                    onClick = {this.addSpe}
                >Add</Button>
            ) : (null)
        }
      </div>
    );
  }
}

export default PredictiveSearchBox;
