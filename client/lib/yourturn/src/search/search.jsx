import React from 'react';
import Icon from 'react-fa';
import _ from 'lodash';
import {Services} from 'common/src/data/services';
import 'common/asset/less/yourturn/search.less';

class SearchResult extends React.Component {
    constructor() {
        super();
    }

    render() {
        let body = <quote dangerouslySetInnerHTML={{__html: this.props.description}} />;
        if (!this.props.link) {
            return <li className='search-result'>
                        <header>{this.props.name}</header>
                        {body}
                    </li>;
        }
        return <li className='search-result'>
                    <header>
                        <a href={this.props.link}>{this.props.name}</a>
                    </header>
                    {body}
                </li>;
    }
}
SearchResult.displayName = 'SearchResult';
SearchResult.propTypes = {
    name: React.PropTypes.string,
    description: React.PropTypes.string,
    link: React.PropTypes.string
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
                                app => <SearchResult name={app.name}
                                               description={app.matched_description}
                                               link={app._url} />)}
                        </ol>
                        :
                        <span>No applications found for {term}</span>}

                    <h4>APIs</h4>

                    {results.twintip && results.twintip.length ?
                        <ol>
                            {results.twintip.map(
                                app => <SearchResult name={app.name}
                                               description={app.matched_description}
                                               link={app._url} />)}
                        </ol>
                        :
                        <span>No APIs found for {term}</span>}

                    <h4>Docker images</h4>

                    {results.pierone && results.pierone.length ?
                        <ol>
                            {results.pierone.map(
                                app => <SearchResult name={app.name}
                                               description={app.matched_description}
                                               link={app._url} />)}
                        </ol>
                        :
                        <span>No Docker images found for {term}</span>}

                </div>;
    }
}
Search.displayName = 'Search';

// TODO specify in more detail
Search.propTypes = {
    searchActions: React.PropTypes.object,
    searchStore: React.PropTypes.object
}

export default Search;