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
            term: '',
        };
        this.getItem = this.getItem.bind(this);
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_PROJECT_API + '/specialties/').then((content) => {
            this.setState({ searchArray: content.data.content })
        })
    }

    // For get user selected Item/value from dropdown.
    getItem(e) {
        let value = e.target.textContent;
        localStorage.setItem('specialitie', value);
        var inputText = document.getElementById('input');
        inputText.value = value;
        var sug = document.getElementById('sug');
        if (inputText.value) {
            sug.style.display = "none";
        }
    }

    onTextChanges = (e) => {
        const text = e.target.value;
        this.setState({ term: text });
        localStorage.setItem('specialitie', text.charAt(0).toUpperCase() + text.slice(1));
        var suggestionss = [];

        // Implement Suggestion Items from existing list
        this.state.searchArray.forEach(element => {
            suggestionss.push(element.name)
            this.setState({ items: suggestionss });
            let suggestion = [];
            if (text.length >= 0) {
                const regex = new RegExp(`^${text}`, 'i');
                suggestion = suggestionss.sort().filter(v => regex.test(v));
            }
            this.setState(() => ({ suggestion }));
        });
        var sug = document.getElementById('sug');
        if (text.length === 0) {
            sug.style.display = "none";
        }else{
            sug.style.display = 'block';
        }
    }

    // Implement for disable the space keyword at begining of the textbox.
    onKeyPress = (e) =>{
        if (e.which === 32 && !e.target.value.length)
        e.preventDefault();
    }

    renderSuggestions() {
        const { suggestion } = this.state;
        if(suggestion.length){
            return(<ul className="myList" id='test'>
            {suggestion.map((item) => <li key={item} onClick={this.getItem} className="sug-li" style={{ cursor: 'pointer' }} value={item}>{item}</li>)}
        </ul>)
        }
    }

    
    render() {
        return (
            <div className="suggestion-search">
                <div className='search-bar'>
                    <IconButton aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        id="input"
                        className="search"
                        placeholder="Search reviews"
                        onChange={this.onTextChanges}
                        onKeyPress={this.onKeyPress}
                        autoComplete="off" />
                </div>
                <div className="suggestions" id='sug'>
                    {this.renderSuggestions()}
                </div>
            </div>
        )
    }
}