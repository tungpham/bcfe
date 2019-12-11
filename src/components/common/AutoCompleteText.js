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
        this.getitem = this.getitem.bind(this);
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_PROJECT_API + '/specialties/').then((content) => {
            this.setState({ searchArray: content.data.content })
        })
    }

    getitem(e) {
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
        if (text.length === 0 || text.length === '') {
            sug.style.display = "none";
        }else{
            sug.style.display = 'block';
        }
    }

    renderSuggestions() {
        const { suggestion } = this.state;
        return (<ul className="myList" id='test'>
            {suggestion.map((item) => <li key={item} onClick={this.getitem} className="sug-li" style={{ cursor: 'pointer' }} value={item}>{item}</li>)}
        </ul>
        )
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
                        autoComplete="off" />
                </div>
                <div className="suggestions" id='sug'>
                    {this.renderSuggestions()}
                </div>
            </div>
        )
    }
}