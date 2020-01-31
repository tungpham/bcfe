import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import {  withStyles, StyledComponentProps } from '@material-ui/core/styles';
import styles from './ProjectTemplateSearchBox.styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProjApi from 'services/project';
import * as GenActions from 'store/actions/gen-actions';
import { ProjectInfo } from 'types/project';
interface PredictiveSearchBoxProps extends StyledComponentProps{
  roomId : string;
  options:any[];
  project: ProjectInfo;
  getLevels: (id: string) => Promise<void>;
}
export class PredictiveSearchBox extends Component<PredictiveSearchBoxProps & withSnackbarProps ,any> {
  static propTypes = {
    options: PropTypes.instanceOf(Array).isRequired
  };
  state = {
    activeOption: 0,
    filteredOptions: [],
    showOptions: false,
    userInput: '',
    addBtnShow: false,
    isBusy: false
  };
  checkAddButton = () => {
     if(this.props.options.filter(opt=>opt.name === this.state.userInput).length === 1 && this.state.userInput !== ''){
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
      if(filteredOptions[activeOption] === undefined || filteredOptions[activeOption] === null || this.state.userInput === '') return;
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
  addSpe = async () => {
     var currentRoot = this.props.options.filter(_option => _option.name === this.state.userInput);
     if(currentRoot.length === 0 ) return;
     if(currentRoot[0].children.length === 0) return;
     var nodeId      = currentRoot[0].children[0].id;
     try{
        this.setState({
          userInput: '',
          isBusy: true
        }, ()=>{
          this.checkAddButton();
        })
        await ProjApi.createSelection(this.props.roomId, nodeId, nodeId, {}, []);
        this.props.getLevels(this.props.project.id);
        this.setState({
          isBusy: false
        })
     } catch(error){

     }
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
      <div style = {{position:"relative"}}>
        <div style = {{display:"flex", alignItems:"center", width:"450px"}}>
          <div className = {classes.predictiveSearchArea}>
              <div className={classes.search}>
              <input
                  type="text"
                  className={classes.searchBox}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  value={userInput}
                  placeholder = "Search"
              />
              <input type="submit" value="" className={classes.searchBtn} />
              </div>
              {optionList}
          </div>
          {
              this.state.addBtnShow === true ? (
                <Fab 
                  aria-label="add"
                  size="small"
                  onClick = {this.addSpe}
                  style = {{marginLeft:"10px", backgroundColor:"#1752a8", color:"white"}}
                >
                  <AddIcon />
                </Fab>
              ) : (null)
          }
        </div>
          {
            this.state.isBusy === true ? (
              <div style = {{position:"absolute", left:"50%"}}>
                <CircularProgress/>
              </div>
            ) : (null)
          }
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
	getLevels: id => dispatch(GenActions.getLevels(id)),
});
export default connect(null, mapDispatchToProps)(withStyles(styles)( withSnackbar<PredictiveSearchBoxProps>(PredictiveSearchBox) ));
