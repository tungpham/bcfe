import React from 'react';
import axios from 'axios';
import '../../assets/css/conflictRemove.css';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

export default class AutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.items = [""];
        this.state = {
            searchArray: [],
            suggestion: [],
            setError: '',
            term : '',
        };
        this.getitem = this.getitem.bind(this);
       
    }

    getitem(e) {
        let value = e.target.textContent;
        var inputText = document.getElementById('input');
        inputText.value = value;
        var sug = document.getElementById('sug');
        localStorage.setItem('specialitie', value);
        if (inputText.value) {
            sug.style.display = "none";
        }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_PROJECT_API + '/specialties/').then((content) => {
            this.setState({ searchArray: content.data.content })
        })
    }

    onTextChanges = (e) => {
        const text = e.target.value;
        this.setState({term : text});
        localStorage.setItem('specialitie', this.state.term);
        var suggestionss = [];
        this.state.searchArray.forEach(element => {
            suggestionss.push(element.name)
            this.setState({ items: suggestionss });
            let suggestion = [];
            if (text.length > 0) {
                const regex = new RegExp(`^${text}`, 'i');
                suggestion = suggestionss.sort().filter(v => regex.test(v));
            }
            this.setState(() => ({ suggestion }));
        });
    }

    renderSuggestions() {
        const { suggestion } = this.state;
        if (suggestion.length === 0) {
            return null;
        }
        else {
            return (
                <ul className="myList" id='test'>
                    {suggestion.map((item) => <li key={item} onClick={this.getitem} className="sug-li" style={{ cursor: 'pointer' }} value={item}>{item}</li>)}
                </ul>
            )
        }
    }

    
    render() {
        console.log(this.state.term);
        return (
            <div className="suggestion-search">
                <div className={this.state.suggestion === [] ? alert("hi") : 'search-bar'}>
                    <IconButton aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        id="input"
                        value={this.state.term}
                        className="search"
                        placeholder="Search reviews"
                        onChange={this.onTextChanges}
                        autoComplete="off" />
                </div>
                <div className="suggestions" id='sug'>
                    {this.renderSuggestions()}
                </div>
            </div>
        )
    }
}