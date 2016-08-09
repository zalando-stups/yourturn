import React from 'react';
import Icon from 'react-fa';
import _ from 'lodash';
import {Services} from 'common/src/data/services';
import 'common/asset/less/yourturn/search.less';

const  SearchResult = (props) => {
    /*eslint-disable react/no-danger */
    let body = <quote dangerouslySetInnerHTML={{__html: this.props.description}} />;
    /*eslint-disable react/no-danger */

    if (!props.link) {
        return <li className='search-result'>
                    <header>{props.name}</header>
                    {body}
                </li>;
    }
    return <li className='search-result'>
                <header>
                    <a href={props.link}>{props.name}</a>
                </header>
                {body}
            </li>
};

SearchResult.displayName = 'SearchResult';

SearchResult.propTypes = {
    description: React.PropTypes.string,
    link: React.PropTypes.string,
    name: React.PropTypes.string
};

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            term: ''
        };
    }

    updateTerm(evt) {
        this.setState({
            term: evt.target.value
        });
    }

    search() {
        let {term} = this.state;
        if (!term.length) {
            this.props.searchActions.clearSearchResults(term);
        } else {
            if (this.props.searchStore.hasResults(term)) {
                this.props.searchActions.clearSearchResults(term);
            }
            Object
                .keys(Services)
                .filter(key => !!Services[key].searchQuery)
                .forEach(key => this.props.searchActions.fetchSearchResultsFrom(key, term));
        }
    }

    componentWillMount() {
        this._debouncedSearch = _.debounce(this.search, 150);
    }

    render() {
        let {term} = this.state,
            results = this.props.searchStore.getSearchResults(term),
            header = <div>
                        <h2>Search</h2>

                        <div className='form'>
                            <div className='input-group'>
                                <div className='input-addon'>
                                    <Icon fixedWidth name='search' />
                                </div>
                                <input
                                    autoFocus='autofocus'
                                    value={term}
                                    onChange={this.updateTerm.bind(this)}
                                    onKeyUp={this._debouncedSearch.bind(this)}
                                    type='search'
                                    aria-label='Enter your search'
                                    placeholder='yourturn' />
                            </div>
                        </div>
                    </div>;
        if (!this.state.term) {
            return <div className='search'>{header}</div>;
        }
        return <div className='search'>
                    {header}

                    <h4>Applications</h4>

                    {results.kio && results.kio.length ?
                        <ol>
                            {results.kio.map(
                                (app, index) => <SearchResult
                                                    key = {index}
                                                    name = {app.name}
                                                    description = {app.matched_description}
                                                    link = {app._url} />)}
                        </ol>
                        :
                        <span>No applications found for {term}</span>}

                    <h4>APIs</h4>

                    {results.twintip && results.twintip.length ?
                        <ol>
                            {results.twintip.map(
                                (app, index) => <SearchResult
                                                    key = {index}
                                                    name = {app.name}
                                                    description = {app.matched_description}
                                                    link = {app._url} />)}
                        </ol>
                        :
                        <span>No APIs found for {term}</span>}

                    <h4>Docker images</h4>

                    {results.pierone && results.pierone.length ?
                        <ol>
                            {results.pierone.map(
                                (app, index) => <SearchResult
                                                    key = {index}
                                                    name = {app.name}
                                                    description = {app.matched_description}
                                                    link = {app._url} />)}
                        </ol>
                        :
                        <span>No Docker images found for {term}</span>}

                </div>;
    }
}
Search.displayName = 'Search';

// TODO specify in more detail
Search.propTypes = {
    searchActions: React.PropTypes.shape({
        clearSearchResults: React.PropTypes.func,
        fetchSearchResultsFrom: React.PropTypes.func
    }).isRequired,
    searchStore: React.PropTypes.shape({
        hasResults: React.PropTypes.func,
        getSearchResults: React.PropTypes.func
    }).isRequired
};

export default Search;